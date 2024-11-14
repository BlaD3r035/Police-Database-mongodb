const mongoose = require('mongoose');

const antecedenteSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    articulos: { type: String, required: true },
    tiempo: { type: Number, required: true },
    agente: { type: String, required: true },
});

const Antecedentes = mongoose.model('antecedentes', antecedenteSchema);

module.exports = Antecedentes;
