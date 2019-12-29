const mongoose  = require(`mongoose`);
const Schema    = mongoose.Schema;

const UserSchema = Schema ({
  email: STRING,
  password: STRING,
  username: STRING,
  rank: STRING,
  favoritesBooks: Array,
  reviews: Array
});

const User = mongoose.model(`User`, UserSchema);

module.exports = User;