const mongoose  = require(`mongoose`);
const Schema    = mongoose.Schema;

const UserSchema = Schema ({
  email: { type: String, match: /^\S+@\S+\.\S+$/, unique: true, required: true },
  password: { type: String, minlength: 3, maxlength: 30, required: true },
  facebookId: { type: String },
  twitterId: { type: String },
  username: { type: String, minlength: 3, maxlength: 25, unique: true, required: true },
  slug: { type: String, match: /^[a-za-z0-9]+(?:-[a-za-z0-9]+)*$/, min: 3, unique: true },
  avatarPath: { type: String, default: `images/default-avatar.png` },
  rank: { type: Number, min: 0, max: 3, default: 0 },
  favoritesBooks: [ { type: Schema.Types.ObjectId, ref: 'Book' } ],
  reviews: [ { type: Schema.Types.ObjectId, ref: 'Review' } ]
}, {
  timestamps: true
});

const User = mongoose.model(`User`, UserSchema);

module.exports = User;