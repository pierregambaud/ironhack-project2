const mongoose  = require(`mongoose`);
const Schema    = mongoose.Schema;

const UserSchema = Schema ({
  email: String,
  password: String,
  username: String,
  rank: String,
  favoritesBooks: [ { type : Schema.Types.ObjectId, ref: 'Book' } ],
  reviews: [ { type : Schema.Types.ObjectId, ref: 'Review' } ]
}, {
  timestamps: true
});

const User = mongoose.model(`User`, UserSchema);

module.exports = User;