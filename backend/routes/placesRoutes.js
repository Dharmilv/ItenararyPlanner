// routes/placesRoutes.js
const express = require('express');
const router = express.Router();
const { getNearbyPlaces } = require('../controllers/placesController');

// Define a GET route to retrieve nearby places
// e.g., GET /api/places?lat=15.2993&lng=74.1240&radius=1500
router.get('/places', getNearbyPlaces);

module.exports = router;
