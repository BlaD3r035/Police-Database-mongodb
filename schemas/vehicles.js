const mongoose = require('mongoose');

const vehiclesSchema = new mongoose.Schema({
    owner: { type: String, required: true },
    plate: { type: String, required: true },
    color: { type: String, required: true },
    model: { type: String, required: true },
    fueltype: { type: String, required: true },
    service: { type: String, required: true },
    engineid: { type: Number, required: true },
    photo: { type: String, required: true },
});

const Vehicles = mongoose.model('vehicles', vehiclesSchema);

module.exports = Vehicles;

//add more schemas if you need it!