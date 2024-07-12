const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');


router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  const newComment = new Comment({ name, email, message });

  try {
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
