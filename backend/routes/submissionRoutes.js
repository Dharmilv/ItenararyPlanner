const express = require('express');
const router = express.Router();
const { createSubmission } = require('../controllers/submissionController');

router.post('/submit', createSubmission);

module.exports = router;
