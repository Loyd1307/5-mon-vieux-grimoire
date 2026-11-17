const express = require("express");

require('dotenv').config();
const mongoose = require('mongoose');

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

app.post("/api/books", (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
        message: "Livre ajouté!"
    });
});

app.get("/api/books", (req, res, next) => {
    const books = [
        {
            userId: String,
            title: String,
            author: String,
            imageUrl: String,
            year: Number,
            genre: String,
            rating: [
                {userId: String,
                grade: Number}
            ],
            averageRating: Number
        }
    ];

    res.status(200).json(books);
});

module.exports = app;