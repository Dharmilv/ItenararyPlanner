const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');

router.post('/plan', tripController.planTrip);

module.exports = router;
