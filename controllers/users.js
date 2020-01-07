const User        = require(`../models/user.js`);
const bcrypt      = require(`bcrypt`);
const bcryptSalt  = 10;


//    _           _           
//   (_)         | |          
//    _ _ __   __| | _____  __
//   | | '_ \ / _` |/ _ \ \/ /
//   | | | | | (_| |  __/>  < 
//   |_|_| |_|\__,_|\___/_/\_\
//                                                      

exports.index = (req, res, next) => {
  User.find()
    .then(users => {
      res.status(200).json({ users });
    })
    .catch(next);
}


//                        _       
//                       | |      
//     ___ _ __ ___  __ _| |_ ___ 
//    / __| '__/ _ \/ _` | __/ _ \
//   | (__| | |  __/ (_| | ||  __/
//    \___|_|  \___|\__,_|\__\___|
//                                

exports.create = (req, res, next) => {
  const { email, password, username } = req.body;

  // check username and password are not empty
  if (email === `` || password === `` || username === ``) {
    res.status(412).json({ "errorMessage": `Email, password and username are mandatory` });
    return;
  }

  User.findOne({ username })
    .then(user => {
      // TODO if email already exists?

      // check username does not already exist
      if (user) {
        res.status(409).json({ "errorMessage": `The username already exists` });
        return;
      }

      // encrypt the password
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      // save the user in DB
      const newUser = new User({
        email,
        password: hashPass,
        username
      });

      newUser.save()
        .then(user => {
          // save user in session: req.user
          // req.login(user, err => {
          //   if (err) return next(err); // session save went bad

          //   res.redirect(`/`); // `req.user` is now set
          // });
        })
        .catch(next)
      ;
        
    })
    .catch(next);
}


//        _                   
//       | |                  
//    ___| |__   _____      __
//   / __| '_ \ / _ \ \ /\ / /
//   \__ \ | | | (_) \ V  V / 
//   |___/_| |_|\___/ \_/\_/  
//                            

exports.show = (req, res, next) => {
  if(!req.params.id) {
    return next(new Error('user ID is mandatory'));
  }

  const id = req.params.id;

  User.findById(id)
    .then(user => {
      let err = new Error(`This user ID does not match any entry`);
      err.status = 404;

      if (!user) {
        return next(err);
      }

      res.status(200).json({ user });
    })
    .catch(next);
}


//                    _       _       
//                   | |     | |      
//    _   _ _ __   __| | __ _| |_ ___ 
//   | | | | '_ \ / _` |/ _` | __/ _ \
//   | |_| | |_) | (_| | (_| | ||  __/
//    \__,_| .__/ \__,_|\__,_|\__\___|
//         | |                        
//         |_|                        

exports.update = (req, res, next) => {
  if(!req.params.id) {
    return next(new Error(`ID is mandatory`));
  }

  const id = req.params.id;
  const { email, password, username } = req.body;
  
  User.findByIdAndUpdate(id, {
    email,
    password,
    username
  },{ 
    new: true
  })
    .then(user => res.status(200).json({ user }))
    .catch(next);
}


//        _           _                   
//       | |         | |                  
//     __| | ___  ___| |_ _ __ ___  _   _ 
//    / _` |/ _ \/ __| __| '__/ _ \| | | |
//   | (_| |  __/\__ \ |_| | | (_) | |_| |
//    \__,_|\___||___/\__|_|  \___/ \__, |
//                                   __/ |
//                                  |___/ 

exports.destroy = (req, res, next) => {
  if(!req.params.id) {
    return next(new Error(`ID is mandatory`));
  }

  const id = req.params.id;
  
  User.findByIdAndDelete(id)
    .then(() => {
      res.status(204).json({});
    })
    .catch(next);
}