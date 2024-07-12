require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.DATABASE_URL);

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to database'));


const toursRouter = require('./routes/tours');
const usersRouter = require('./routes/users');
const commentsRouter = require('./routes/comments');
const bookingsRouter = require('./routes/bookings'); 

// Usa le rotte
app.use('/tours', toursRouter);
app.use('/users', usersRouter);
app.use('/comments', commentsRouter);
app.use('/bookings', bookingsRouter); 

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
