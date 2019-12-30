const mongoose  = require(`mongoose`);
const Schema    = mongoose.Schema;

const UserSchema = Schema ({
  email: { type: String, match: /^\S+@\S+\.\S+$/, unique: true, required: true },
  password: { type: String, required: true },
  username: { type: String, match: /^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/, minlength: 3, maxlength: 20, unique: true, required: true },
  slug: { type: String, match: /^[a-za-z0-9]+(?:-[a-za-z0-9]+)*$/, min: 3, unique: true },
  rank: { type: Number, min: 0, max: 3, default: 0 },
  favoritesBooks: [ { type: Schema.Types.ObjectId, ref: 'Book' } ],
  reviews: [ { type: Schema.Types.ObjectId, ref: 'Review' } ]
}, {
  timestamps: true
});

const User = mongoose.model(`User`, UserSchema);

module.exports = User;