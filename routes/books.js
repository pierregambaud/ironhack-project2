const express = require(`express`);
const router = express.Router();

const Book = require(`../models/book.js`);


// index
router.get(`/`, (req, res, next) => {
  Book.find()
    .then(books => {
      res.render(`books/index`, { books })
    })
    .catch(next);
});


// create
router.post(`/create`, (req, res, next) => {
  const { isbn, isbn13, asin, title, authors, coverPath, publisher, publicationDate } = req.body;

  Book.create({
    isbn,
    isbn13,
    asin,
    title,
    authors,
    coverPath,
    publisher,
    publicationDate
  })
    .then(book => res.redirect(`/`))
    .catch(next);
});


// show
router.get(`/:id`, (req, res, next) => {
  if(!req.params.id) {
    return next(new Error('This ID does not match any book'));
  }

  const id = req.params.id;

  Book.findById(id)
    .then(book => {
      res.render(`books/show`, book);
    })
    .catch(next);
});


// update
router.put(`/:id`, (req, res, next) => {
  if(!req.params.id) {
    return next(new Error('This ID does not match any book'));
  }

  const id = req.params.id;
  const { isbn, isbn13, asin, title, authors, coverPath, publisher, publicationDate } = req.body;
  
  Book.findByIdAndUpdate(id, {
    isbn,
    isbn13,
    asin,
    title,
    authors,
    coverPath,
    publisher,
    publicationDate
  })
    .then(book => res.redirect(`/`))
    .catch(next);
});


// destroy
router.delete(`/:id`, (req, res, next) => {
  if(!req.params.id) {
    return next(new Error('This ID does not match any book'));
  }

  const id = req.params.id;
  
  Book.findByIdAndDelete(id)
    .then(book => res.redirect(`/`))
    .catch(next);
});