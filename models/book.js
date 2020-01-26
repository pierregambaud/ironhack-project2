const mongoose  = require(`mongoose`);
const Schema    = mongoose.Schema;

const BookSchema = Schema ({
  isbn: { type: String, minlength: 10, maxlength: 10, unique: true },
  isbn13: { type: String, minlength: 13, maxlength: 14, unique: true },
  asin: { type: String, minlength: 10, maxlength: 10, unique: true },
  title: { type: String, minlength: 3 },
  slug: { type: String, match: /^[a-za-z0-9]+(?:-[a-za-z0-9]+)*$/, minlenth: 3, maxlength: 50, unique: true },
  authors: { type: String },
  coverPath: { type: String, default: `images/default-cover.png` },
  publisher: { type: String },
  publicationDate: { type: Date },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  reviews: [ { type: Schema.Types.ObjectId, ref: 'Review' } ]
}, {
  timestamps: true
});

const Book = mongoose.model(`Book`, BookSchema);

module.exports = Book;