const User        = require(`../models/user.js`);
const passport    = require(`passport`);


//                        _       
//                       | |      
//     ___ _ __ ___  __ _| |_ ___ 
//    / __| '__/ _ \/ _` | __/ _ \
//   | (__| | |  __/ (_| | ||  __/
//    \___|_|  \___|\__,_|\__\___|
//      

exports.create = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then(user => {
      passport.authenticate("local", (err, theUser, failureDetails) => {
        if (err) {
          // something went wrong authenticating user
          return next(err);
        }
    
        if (!theUser) {
          // unauthorized, `failureDetails` contains the error messages from our logic in "LocalStrategy" {message: '…'}.
          res.status(401).json({error: `Wrong email or password`}); 
          return;
        }
    
        // save user in session: req.user
        req.login(theUser, (err) => {
          if (err) {
            // Session save went bad
            return next(err);
          }
    
          // all good, we are now logged in and `req.user` is now set
          res.status(201).json(user); // `req.user` is now set
        });
      })(req, res, next);
    })
    .catch(next);
};


//        _           _                   
//       | |         | |                  
//     __| | ___  ___| |_ _ __ ___  _   _ 
//    / _` |/ _ \/ __| __| '__/ _ \| | | |
//   | (_| |  __/\__ \ |_| | | (_) | |_| |
//    \__,_|\___||___/\__|_|  \___/ \__, |
//                                   __/ |
//                                  |___/ 

exports.destroy = (req, res, next) => {
  req.logout();
  res.status(204).send();
};