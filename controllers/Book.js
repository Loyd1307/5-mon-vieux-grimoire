const Book = require("../models/Books");
const fs = require("fs");

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    book.save()
    .then(() => { res.status(201).json({message: 'Livre enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
};

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
       ...JSON.parse(req.body.book),
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   } : { ...req.body };

   delete bookObject._userId;
   Book.findOne({_id: req.params.id})
       .then((book) => {
           if (book.userId != req.auth.userId) {
               res.status(401).json({ message : 'Not authorized'});
           } else {
               Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
               .then(() => res.status(200).json({message : 'Objet modifié!'}))
               .catch(error => res.status(401).json({ error }));
           }
       })
       .catch((error) => {
           res.status(400).json({ error });
       });
};

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
       .then(book => {
           if (book.userId != req.auth.userId) {
               res.status(401).json({message: 'Not authorized'});
           } else {
               const filename = book.imageUrl.split('/images/')[1];
               fs.unlink(`images/${filename}`, () => {
                   Book.deleteOne({_id: req.params.id})
                       .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                       .catch(error => res.status(401).json({ error }));
               });
           }
       })
       .catch( error => {
           res.status(500).json({ error });
       });
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }))
};

exports.allBooks = (req, res, next) => {
    Book.find()
        .then(books => {
            res.status(200).json(books);
        })
        .catch(error => {
            res.status(400).json({ error });
        });
};

/* test controller rating */

exports.rateBook = async (req, res, next) => {
    try {
        const userId = req.auth.userId;
        const { rating } = req.body;

        // Vérifier la validité de la note
        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "La note doit être comprise entre 1 et 5"
            });
        }

        // Récupérer le livre
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: "Livre introuvable"
            });
        }

        // Vérifier si l'utilisateur a déjà noté ce livre
        const alreadyRated = book.ratings.some(
            (r) => r.userId.toString() === userId
        );

        if (alreadyRated) {
            return res.status(400).json({
                message: "Vous avez déjà noté ce livre"
            });
        }

        // Ajouter la note
        book.ratings.push({
            userId,
            grade: rating
        });

        // Calculer la moyenne
        const total = book.ratings.reduce(
            (sum, r) => sum + r.grade,
            0
        );

        book.averageRating = total / book.ratings.length;

        await book.save();

        return res.status(200).json(book);

    } catch (error) {
        next(error);
    }
};

/* test best rating */

exports.getBestRatedBooks = async (req, res, next) => {
    try {
        const bestRatedBooks = await Book.find({
            "ratings.0": { $exists: true }
        })
            .sort({ averageRating: -1 })
            .limit(3);

        return res.status(200).json(bestRatedBooks);

    } catch (error) {
        next(error);
    }
};