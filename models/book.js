const mongoose  = require(`mongoose`);
const Schema    = mongoose.Schema;

const BookSchema = Schema ({
  isbn: String,
  isbn13: String,
  asin: String,
  title: String,
  slug: String,
  authors: String,
  coverPath: String,
  publisher: String,
  publicationDate: Date,
  rating: String,
  reviews: Array
}, {
  timestamps: true
});

const Book = mongoose.model(`Book`, BookSchema);

module.exports = Book;