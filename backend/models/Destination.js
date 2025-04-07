const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: String,
  description: String,
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },
  image: String
});

destinationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Destination', destinationSchema);
