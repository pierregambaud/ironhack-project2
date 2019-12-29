const mongoose  = require(`mongoose`);
const Schema    = mongoose.Schema;

const ReviewSchema = Schema ({
  book_id: String,
  user_id: String,
  rating: String,
  review: String,
  url: String
}, {
  timestamps: true
});

const Review = mongoose.model(`Review`, ReviewSchema);

module.exports = Review;