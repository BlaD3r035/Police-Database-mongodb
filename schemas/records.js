const mongoose = require('mongoose');

const recordsSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    articles: { type: String, required: true },
    time: { type: Number, required: true },
    officer: { type: String, required: true },
});

const Records = mongoose.model('records', recordsSchema);

module.exports = Records;
