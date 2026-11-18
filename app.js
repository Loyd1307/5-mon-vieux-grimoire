const express = require("express");

require('dotenv').config();
const mongoose = require('mongoose');

const bookRoutes = require('./routes/Book');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(error => console.error(
    'Connexion à MongoDB échouée :',
    error.message
  ));

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/api/books', bookRoutes);

module.exports = app;