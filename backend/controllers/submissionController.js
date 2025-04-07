const Submission = require('../models/submissionModel');

exports.createSubmission = async (req, res) => {
  try {
    const submission = new Submission(req.body);
    await submission.save();
    res.status(201).json({
      message: 'Submission created successfully',
      submission
    });
  } catch (error) {
    console.error('Error creating submission:', error);
    res.status(500).json({
      message: 'Error creating submission',
      error: error.message
    });
  }
};
