const mongoose = require('mongoose');

const vehiculoSchema = new mongoose.Schema({
    owner: { type: String, required: true },
    placa: { type: String, required: true },
    color: { type: String, required: true },
    nombredelvehiculo: { type: String, required: true },
    tipoCombustible: { type: String, required: true },
    tipoServicio: { type: String, required: true },
    engineid: { type: Number, required: true },
    foto: { type: String, required: true },
});

const Vehiculos = mongoose.model('vehiculos', vehiculoSchema);

module.exports = Vehiculos;

//add more schemas if you need it!