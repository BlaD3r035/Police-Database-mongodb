const express = require('express');
const router = express.Router();
const Ids = require('../schemas/ids'); 
const Vehicles = require('../schemas/vehicles'); 

// Get user data by document ID
router.get('/user', async (req, res) => {
    const { documentId } = req.query;

console.log(documentId)
    if (documentId) {
        try {
            const user = await Ids.findOne({ documentId:documentId });
            if (!user) {
                return res.status(404).json('No user found');
            }
            return res.json(user);
        } catch (err) {
            console.error(err);
            return res.status(500).json('Server error');
        }
    } else {
        return res.status(400).send('No user documentId provided');
    }
});

// Get user data by vehicle plate
router.get('/plate', async (req, res) => {
    const { plate } = req.query;
    if (plate) {
        try {
            const vehicle = await Vehicles.findOne({ plate: plate }).select('owner');
            if (!vehicle) {
                return res.status(404).json('No plate found');
            }
            return res.status(200).json(vehicle);
        } catch (err) {
            console.error(err);
            return res.status(500).json('Server error');
        }
    } else {
        console.log('No plate number provided');
        return res.status(400).json('No plate number provided');
    }
});

module.exports = router;