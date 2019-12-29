const mongoose  = require(`mongoose`);
const Schema    = mongoose.Schema;

const UserSchema = Schema ({
  email: String,
  password: String,
  username: String,
  rank: String,
  favoritesBooks: Array,
  reviews: Array
});

const User = mongoose.model(`User`, UserSchema);

module.exports = User;