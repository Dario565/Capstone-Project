const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Tour = require('../models/Tour');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
      cb(null, true);
    } else {
      cb(new Error('Formato immagine non supportato'), false);
    }
  }
});


router.get('/', async (req, res) => {
  try {
    const tours = await Tour.find();
    res.json(tours);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/', upload.single('image'), async (req, res) => {
  const { name, description, price } = req.body;
  let image = '';
  if (req.file) {
    image = path.posix.join('/uploads', req.file.filename); 
  }

  const newTour = new Tour({
    name,
    description,
    price,
    image
  });

  try {
    const savedTour = await newTour.save();
    res.status(201).json(savedTour);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.put('/:id', upload.single('image'), async (req, res) => {
  const { name, description, price } = req.body;
  let image = req.body.image; 

  if (req.file) {
    image = path.posix.join('/uploads', req.file.filename); 
  }

  try {
    const updatedTour = await Tour.findByIdAndUpdate(
      req.params.id,
      { name, description, price, image },
      { new: true }
    );
    if (!updatedTour) {
      return res.status(404).json({ message: 'Tour non trovato' });
    }
    res.json(updatedTour);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const deletedTour = await Tour.findByIdAndDelete(req.params.id);
    if (!deletedTour) {
      return res.status(404).json({ message: 'Tour non trovato' });
    }
    res.json({ message: 'Tour cancellato con successo' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.delete('/name/:name', async (req, res) => {
  try {
    const deletedTour = await Tour.findOneAndDelete({ name: req.params.name });
    if (!deletedTour) {
      return res.status(404).json({ message: 'Tour non trovato' });
    }
    res.json({ message: 'Tour cancellato con successo' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
