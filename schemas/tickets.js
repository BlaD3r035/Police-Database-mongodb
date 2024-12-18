const mongoose = require('mongoose');

const ticketsSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    type: { type: String, required: true },
    articles: { type: String, required: true },
    plate: { type: String, default: "N/A" },
    value: { type: Number, required: true },
    officer: { type: String, required: true },
});

const Tickets = mongoose.model('tickets', ticketsSchema);

module.exports = Tickets;
