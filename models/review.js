const mongoose  = require(`mongoose`);
const Schema    = mongoose.Schema;

const ReviewSchema = Schema ({
  book_id: { type : Schema.Types.ObjectId, ref: 'Book' },
  user_id: { type : Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  review: { type: String, min: 10, max: 140 },
  url: { type: String, match: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/ }
}, {
  timestamps: true
});

const Review = mongoose.model(`Review`, ReviewSchema);

module.exports = Review;