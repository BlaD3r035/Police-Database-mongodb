const express = require('express');
const router = express.Router();
const Ids = require('../schemas/ids'); 
const Vehicles = require('../schemas/vehicles'); 
const Records = require('../schemas/records'); 
const Tickets = require('../schemas/tickets');

// Routes

// Get all user db data
router.get('/getUserData', async (req, res) => {
   //add more parameters  if you need it!
    const userId = req.query.userId;
    const vehicles = req.query.vehicles === 'true';
    const arrestRecord = req.query.arrestRecord === 'true';
    const tickets = req.query.tickets === 'true';

    // Verify userId
    if (!userId) {
        return res.status(404).json('The userId is not provided');
    }

    const responseData = {};

    try {
        // Fetch user data from Cedulas collection
        const userCheck = await Ids.findOne({ userId });
        if (!userCheck) {
            return res.status(404).json('No user info found');
        } else {
            responseData.documentData = userCheck;
        }

        // Fetch additional data if requested
       

        if (vehicles) {
            const vehiclesResult = await Vehicles.find({ owner: userId });
            if (vehiclesResult.length > 0) {
                responseData.vehicles = vehiclesResult;
            }
        }

        if (arrestRecord) {
            const arrestRecordResult = await Records.find({ userId });
            if (arrestRecordResult.length > 0) {
                responseData.arrestRecord = arrestRecordResult;
            }
        }

        if (tickets) {
            const ticketsResult = await Tickets.find({ userId });
            if (ticketsResult.length > 0) {
                responseData.tickets = ticketsResult;
            }
        }

        // Respond with the data
        res.status(200).json(responseData);
    } catch (e) {
        console.error(e);
        res.status(500).json('Error trying to get the info');
    }
});

module.exports = router;