const Book = require(`../models/book.js`);


// index
exports.index = (req, res, next) => {
  Book.find()
    .then(books => {
      res.status(200).json(books);
    })
    .catch(next);
}


// create
exports.create = (req, res, next) => {
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
    .then(book => { 
      res.status(201).json(book);
    })
    .catch(next);
}


// show
exports.show = (req, res, next) => {
  if(!req.params.id) {
    return next(new Error(`This ID does not match any book`));
  }

  const id = req.params.id;

  Book.findById(id)
    .then(book => {
      res.status(200).json(book);
    })
    .catch(next);
}


// update
exports.update = (req, res, next) => {
  if(!req.params.id) {
    return next(new Error(`This ID does not match any book`));
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
  },{ 
    new: true
  })
    .then(book => {
      res.status(200).json(book);
    })
    .catch(next);
}


// destroy
exports.destroy = (req, res, next) => {
  if(!req.params.id) {
    return next(new Error(`This ID does not match any book`));
  }

  const id = req.params.id;
  
  Book.findByIdAndDelete(id)
    .then(() => {
      res.status(204).json({});
    })
    .catch(next);
}