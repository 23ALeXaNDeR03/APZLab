const express = require('express');
const router = express.Router();
const service = require('../services');

router.get('/', async (req, res) => {
    try {
        const data = await service.getData();
        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

module.exports = router;