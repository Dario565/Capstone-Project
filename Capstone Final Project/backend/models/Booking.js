const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tourName: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  numPeople: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
