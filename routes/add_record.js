const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');
const multer = require('multer');
const Records = require('../schemas/records');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../public/fotos-antecedentes');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, 'temp-file.jpg');
  },
});


const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedTypes.includes(file.mimetype)) {
    cb(new Error('Unsupported file format. Only JPEG and PNG are allowed.'), false);
  } else {
    cb(null, true);
  }
};

const upload = multer({ storage, fileFilter });

router.post('/sendrecord', (req, res) => {
  upload.single('photo')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: 'Multer error: ' + err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const { ticketData, agentName, pedData } = JSON.parse(req.body.data);
      const photo = req.file;

      if (!ticketData || !agentName || !pedData || !pedData.userId || !photo) {
        return res.status(404).json({ error: 'Data or photo not provided' });
      }

      const endTime = new Date();
      endTime.setMinutes(endTime.getMinutes() + parseInt(ticketData.time, 10));
      const newRecord = new Records({
        userId: pedData.userId,
        articles: ticketData.record,
        time: ticketData.time,
        officer: agentName,
      });
      await newRecord.save();

      const multaId = newRecord._id;
      const photoPath = path.join(__dirname, `../public/fotos-antecedentes/${multaId}.jpg`);
      fs.renameSync(photo.path, photoPath);

      const pdfPath = path.join(__dirname, `../public/pdfs/antecedentes/${multaId}.pdf`);
      if (!fs.existsSync(path.dirname(pdfPath))) {
        fs.mkdirSync(path.dirname(pdfPath), { recursive: true });
      }


      const doc = new PDFDocument();
      doc.pipe(fs.createWriteStream(pdfPath));
      doc.fontSize(20).text('POLICE RECORD NOTIFICATION', { align: 'center' });
      doc.moveDown().fontSize(14).text(`Dear Mr./Ms. ${pedData.name} ${pedData.lastname}`);
      doc.moveDown().text(`This is to inform you that, as of ${new Date()}, a criminal report has been generated for the offense: ${ticketData.record}.`);
      doc.moveDown().fontSize(14).text('Citizen Information:', { underline: true });
      doc.fontSize(12).text(`- ID Document: ${pedData.documentId}`);
      doc.text(`- Name: ${pedData.name} ${pedData.lastname}`);
      doc.text(`- Date of Birth: ${pedData.birthdate}`);
      doc.moveDown().fontSize(14).text('Officer Information:', { underline: true });
      doc.fontSize(12).text(`- Officer Name: ${agentName}`);
      doc.moveDown().fontSize(14).text('Process Information:', { underline: true });
      doc.text(`- Record Date: ${new Date().toLocaleDateString()}`);
      doc.text(`- Offense: ${ticketData.record}`);
      doc.text(`- Process Type: Incarceration Record`);
      doc.text(`- Duration: ${ticketData.time} months from the date of this document.`);
      doc.moveDown().text('Record Photo:', { align: 'center' });
      doc.image(photoPath, { fit: [250, 300], align: 'center' });
      doc.end();


      const discordWebhookUrl = process.env.RECORD_WEBHOOK;
      const discordMessage = {
        content: `<@${pedData.userId}>`,
        embeds: [
          {
            title: 'ARREST RECORD',
            color: 0x00FF00,
            thumbnail: { url: pedData.avatarUrl },
            fields: [
              { name: 'Arrested', value: `<@${pedData.userId}>`, inline: false },
              { name: 'Offense', value: ticketData.record, inline: false },
              { name: 'Duration', value: `${ticketData.time}`, inline: false },
              { name: 'Notification', value: `http://localhost:${process.env.PORT}/pdfs/antecedentes/${multaId}.pdf`, inline: false }
            ],
            image: { url: `http://localhost:${process.env.PORT}/fotos-antecedentes/${multaId}.jpg` },
            footer: {
              text: 'MCPD',
              icon_url: process.env.SERVER_LOGO
            }
          }
        ]
      };

      await axios.post(discordWebhookUrl, discordMessage);

      return res.status(200).json({ message: 'Record saved successfully', pdfUrl: `/pdfs/antecedentes/${multaId}.pdf` });
    } catch (e) {
      console.error('Error saving data: ', e);
      return res.status(500).json({ error: 'Problem saving data' });
    }
  });
});

module.exports = router;
