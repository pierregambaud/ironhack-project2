const mongoose  = require(`mongoose`);
const Schema    = mongoose.Schema;

const ReviewSchema = Schema ({
  book_id: { type : Schema.Types.ObjectId, ref: 'Book' },
  user_id: { type : Schema.Types.ObjectId, ref: 'User' },
  rating: String,
  review: String,
  url: String
}, {
  timestamps: true
});

const Review = mongoose.model(`Review`, ReviewSchema);

module.exports = Review;