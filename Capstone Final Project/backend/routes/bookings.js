const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');


router.post('/', async (req, res) => {
  const { tourName, startDate, endDate, numPeople, totalPrice } = req.body;

  const newBooking = new Booking({
    tourName,
    startDate,
    endDate,
    numPeople,
    totalPrice
  });

  try {
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Prenotazione non trovata' });
    }

    booking.numPeople = req.body.numPeople;
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


module.exports = router;
