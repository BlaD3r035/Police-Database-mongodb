const mongoose = require('mongoose');

const multaSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    tipo: { type: String, required: true },
    articulos: { type: String, required: true },
    placa: { type: String, default: "N/A" },
    valor: { type: Number, required: true },
    agente: { type: String, required: true },
});

const Multas = mongoose.model('multas', multaSchema);

module.exports = Multas;
