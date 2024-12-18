const express = require('express');
const router = express.Router();
const Tickets = require('../schemas/tickets'); 
const axios = require('axios');
const { Client } = require('unb-api');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');

const client = new Client(process.env.UNB_API_TOKEN);

router.post('/sendticket', async (req, res) => {
  const { ticketData, agentName, pedData } = req.body;

  if (!ticketData || !agentName || !pedData || !pedData.userId) {
    return res.status(404).json('No data provided');
  }

  try {
    const multaDoc = new Tickets({
      userId: pedData.userId,
      type: ticketData.type,
      articles: ticketData.record,
      plate: ticketData.plate || 'N/A',
      value: ticketData.value,
      officer: agentName
    });
    await multaDoc.save();

    // PDF generation
    const pdfPath = path.join(__dirname, `../public/pdfs/multas/${multaDoc._id}.pdf`);

    if (!fs.existsSync(path.dirname(pdfPath))) {
      fs.mkdirSync(path.dirname(pdfPath), { recursive: true });
    }

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(pdfPath));

    doc.fontSize(20).text('TRAFFIC FINE/CITATION RECORD', { align: 'center' });
    doc.moveDown().fontSize(14).text(`Dear Mr./Ms. ${pedData.name} ${pedData.lastname}`);
    doc.moveDown().text(`The District Mobility Secretariat informs you that, in compliance with
the procedure established in Article 135 of Law 769 of 2002, as amended by Article 22 of Law 1383 of 2010, the following citation order has been issued for ${ticketData.record}.`);

    doc.moveDown().fontSize(14).text('Citizen Information:', { underline: true });
    doc.fontSize(12).text(`- ID Document: ${pedData.documentId}`);
    doc.text(`- Name: ${pedData.name} ${pedData.lastname}`);
    doc.text(`- Date of Birth: ${pedData.birthdate}`);
    doc.text(`- Vehicle Plate (if applicable): ${ticketData.plate || 'N/A'}`);

    doc.moveDown().fontSize(14).text('Officer Information:', { underline: true });
    doc.fontSize(12).text(`- Officer Name: ${agentName}`);

    doc.moveDown().fontSize(14).text('Process Information:', { underline: true });
    doc.text(`- Record Date: ${new Date().toLocaleDateString()}`);
    doc.text(`- Offense: ${ticketData.record}`);
    doc.text(`- Process Type: ${ticketData.type}`);
    doc.text(`- Total Fine: $${ticketData.value}`);

    doc.moveDown().fontSize(14).text('Payment Status:', { underline: true });
    doc.fontSize(12).text('- Status: Paid');

    doc.moveDown().fontSize(14).text('This document can be used as evidence of the validity of this process.', { align: 'center' });

    doc.end();

    const discordWebhookUrl = process.env.TICKET_WEBHOOK;
    const discordMessage = {
      content: `<@${pedData.userId}>`,
      embeds: [
        {
          title: ticketData.type === 'multa' ? 'TRAFFIC FINE RECORD' : 'CITATION',
          color: ticketData.type === 'multa' ? 0x00FF00 : 0xFFFF00,
          thumbnail: { url: pedData.avatarUrl },
          fields: [
            { name: 'Recipient', value: `<@${pedData.userId}>`, inline: false },
            { name: 'Articles', value: ticketData.record, inline: false },
            { name: 'Fine Amount', value: `$${ticketData.value}`, inline: false },
            { name: 'Vehicle Plate', value: ticketData.plate, inline: false },
            { name: 'Notification', value: `http://localhost:${process.env.PORT}/pdfs/multas/${multaDoc._id}.pdf`, inline: false }
          ],
          footer: {
            text: 'MCPD',
            icon_url: process.env.SERVER_LOGO
          }
        }
      ]
    };

    await axios.post(discordWebhookUrl, discordMessage);

    const guildID = process.env.GUILD_ID; 
    const userID = pedData.userId;

    try {
      await client.editUserBalance(guildID, userID, { cash: -ticketData.value });
      await client.editUserBalance(guildID, process.env.OFFICER_ACCOUNT_ID, { cash: +ticketData.value });
    } catch (error) {
      console.error('Error updating user balance', error);
      return res.status(500).json('Failed to deduct the users balance');
    }

    return res.status(200).json({ message: 'Ticket saved successfully', pdfUrl: `/pdfs/multas/${multaDoc._id}.pdf` });
  } catch (e) {
    console.error('Error saving data: ', e);
    return res.status(500).json('Problem saving data');
  }
});

module.exports = router;