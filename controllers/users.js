const User        = require(`../models/user.js`);
const bcrypt      = require(`bcrypt`);
const bcryptSalt  = 10;


// index
exports.index = (req, res, next) => {
  User.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(next);
}


// create
exports.create = (req, res, next) => {
  const { email, password, username } = req.body;

  // check username and password are not empty
  if (email === `` || password === `` || username === ``) {
    res.render(`authentication/signup`, { errorMessage: `Indicate email, username and password` });
    return;
  }

  User.findOne({ username })
    .then(user => {
      // TODO if email already exists?

      // check username does not already exist
      if (user) {
        res.render(`authentication/signup`, { errorMessage: `The username already exists` });
        return;
      }

      // encrypt the password
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      // save the user in DB
      const newUser = new User({
        username,
        password: hashPass
      });

      newUser.save()
        .then(user => {
          // save user in session: req.user
          req.login(user, err => {
            if (err) return next(err); // session save went bad

            res.redirect(`/`); // `req.user` is now set
          });
        })
        .catch(next)
      ;
        
    })
    .catch(next);
}


// show
exports.show = (req, res, next) => {
  if(!req.params.id) {
    return next(new Error(`This ID does not match any user`));
  }

  const id = req.params.id;

  User.findById(id)
    .then(user => {
      res.render(`users/show`, user);
    })
    .catch(next);
}


// update
exports.update = (req, res, next) => {
  if(!req.params.id) {
    return next(new Error(`This ID does not match any user`));
  }

  const id = req.params.id;
  const { email, password, username, rank } = req.body;
  
  User.findByIdAndUpdate(id, {
    email,
    password,
    username,
    rank
  })
    .then(user => res.redirect(`/`))
    .catch(next);
}


// destroy
exports.destroy = (req, res, next) => {
  if(!req.params.id) {
    return next(new Error(`This ID does not match any user`));
  }

  const id = req.params.id;
  
  User.findByIdAndDelete(id)
    .then(() => {
      res.status(204).json({});
    })
    .catch(next);
}