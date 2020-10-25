const express = require('express');
const Record = require('../../models/Record');
const router = express.Router();




router.get(
    '/',
    async (req, res) => {
        try {
            const records = await Record.find().sort({ date: -1 });
            console.log(records);
            res.json(records);
            
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error...');
        };
    }
);




router.post(
    '/',
    async (req, res) => {
        try {
            console.log('----------------------------------------------', req.body);
            const newRecords = new Record(req.body);
            const result = await newRecords.save();
            res.json(result);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error...');
        };
    }
);



module.exports = router;

