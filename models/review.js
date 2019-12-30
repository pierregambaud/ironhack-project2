const mongoose  = require(`mongoose`);
const Schema    = mongoose.Schema;

const ReviewSchema = Schema ({
  book_id: { type : Schema.Types.ObjectId, ref: 'Book' },
  user_id: { type : Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  review: { type: String, min: 10, max: 140 },
  url: { type: String, match: /@^(https?|http)://[^\s/$.?#].[^\s]*$@iS/ }
}, {
  timestamps: true
});

const Review = mongoose.model(`Review`, ReviewSchema);

module.exports = Review;