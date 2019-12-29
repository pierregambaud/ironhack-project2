require('dotenv').config();

const mongoose = require(`mongoose`);
const Book = require(`../models/book.js`);

mongoose.connect(process.env.MONGODB_URL);

const books = [
  {
    isbn: `2010008995`,
    isbn13: `978-2010008993`,
    asin: `B007P4MJ0S`,
    title: `Les misérables`,
    slug: `miserables`,
    authors: `Victor Hugo`,
    coverPath: `https://images-na.ssl-images-amazon.com/images/I/51W2mjLTYCL._SX349_BO1,204,203,200_.jpg`,
    publisher: `Livre de Poche Jeunesse`,
    publicationDate: `2014-08-13`,
    rating: `5`
  },
  {
    isbn: `2070360024`,
    isbn13: `978-2070360024`,
    asin: `B007GI5SII`,
    title: `L'étranger`,
    slug: `etranger`,
    authors: `Albert Camus`,
    coverPath: `https://images-na.ssl-images-amazon.com/images/I/41PtKES1gvL._SX301_BO1,204,203,200_.jpg`,
    publisher: `Gallimard`,
    publicationDate: `1971-12-01`,
    rating: `4`
  },
  {
    isbn: `2234087368`,
    isbn13: `978-2234087361`,
    asin: `B082DL7XZK`,
    title: `Sympathie pour le Diable`,
    slug: `sympathie-pour-diable`,
    authors: `Paul Marchand`,
    coverPath: `https://images-na.ssl-images-amazon.com/images/I/511Y%2BcYTihL._SX312_BO1,204,203,200_.jpg`,
    publisher: `Stock`,
    publicationDate: `2019-11-20`,
    rating: `4`
  }
];

Book.create(books, (err) => {
  if (err) { throw(err) }
  console.log(`Created ${books.length} books`);
  
  mongoose.connection.close();
});