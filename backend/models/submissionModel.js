const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    destination: { type: String, required: true },
    numPeople: { type: Number, required: true },
    budget: { type: Number, required: true },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Submission', submissionSchema);
