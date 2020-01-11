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
      passport.authenticate(`local`, (err, theUser, failureDetails) => {
        if (err) return next(err);
    
        if (!theUser) {
          // unauthorized, `failureDetails` contains the error messages from our logic in "LocalStrategy" {message: '…'}.
          res.status(401).json({error: `Wrong email or password`}); 
          return;
        }
    
        // save user in session: req.user
        req.login(theUser, (err) => {
          if (err) return next(err);
    
          res.status(201).json(user);
        });
      })(req, res, next);
    })
    .catch(next);
};


//     __               _                 _    
//    / _|             | |               | |   
//   | |_ __ _  ___ ___| |__   ___   ___ | | __
//   |  _/ _` |/ __/ _ \ '_ \ / _ \ / _ \| |/ /
//   | || (_| | (_|  __/ |_) | (_) | (_) |   < 
//   |_| \__,_|\___\___|_.__/ \___/ \___/|_|\_\
//                                             
              
exports.facebook = passport.authenticate(`facebook`, { scope : ['email'] });

exports.facebookCallback = (req, res, next) => {
  passport.authenticate(`facebook`, (err, theUser, failureDetails) => {
    if (err) return next(err);

    // PROCESS
    // 1. check facebookId presence in DB
    //   ✔ true  => connect user
    //   ✘ false => go to 2.
    // 2. check facebookEmail presence in DB
    //   ✔ true
    //     => add facebookId to profile
    //     => connect user
    //   ✘ false
    //     => create user
    //     => connect user
        
    let id = theUser.id;
    let username = theUser.displayName;
    let email = theUser.emails[0].value || `${id}@facebook.com`; // default email set if not provided
    let profilePicture = theUser.photos[0].value;

    console.log(`id: `, id, `username: `, username, `email: `, email);

    // 1. check facebookId presence in DB
    User.findOne({ facebookId: id })
      .then(user => {
        if(!user) {
          console.log(`facebookId not found 🙅‍♂️`);

          // 2. check facebookEmail presence in DB
          User.findOne({ email: email })
            .then(user => {
              if(!user) {
                console.log(`facebookEmail not found 🙅‍♂️`);

                const generatePassword = () => {
                  return Math.random().toString(36).substr(2, 8);
                }

                const password   = generatePassword();

                // create user account
                req.uest({
                  method: 'POST',
                  url: '/api/0.1/users',
                  body: {email, password}
                }, (er, resp, body) => {
                  if (er) return next(er);

                  // connect user
                  User.findOneAndUpdate({ email }, { facebookId: id }, {new: true})
                    .then(user => {
                      console.log(`user profile created with facebookId 🎉`);

                      res.redirect(`/`);
                    })
                    .catch(next);
                })
                return;
              }

              // add facebookId to profile and save
              user.facebookId = id;
              user.save()
                .then(user => {
                  console.log(`user profile updated with facebookId 🎉`);

                  req.login(user, (err) => {
                    if (err) return next(err);
              
                    res.redirect(`/`);
                  });
                })
                .catch(next)
                
            })
            .catch(next)

          return;
        }

        console.log(`facebookId found 🎉`)
        req.login(user, (err) => {
          if (err) return next(err);
    
          res.redirect(`/`);
        });
      })
      .catch(next);

  })(req, res, next);
};


//    _            _ _   _            
//   | |          (_) | | |           
//   | |___      ___| |_| |_ ___ _ __ 
//   | __\ \ /\ / / | __| __/ _ \ '__|
//   | |_ \ V  V /| | |_| ||  __/ |   
//    \__| \_/\_/ |_|\__|\__\___|_|   
//                                    

exports.twitter = passport.authenticate(`twitter`);

exports.twitterCallback = (req, res, next) => {
  passport.authenticate(`twitter`, (err, theUser, failureDetails) => {
    if (err) return next(err);

    // save user in session: req.user
    req.login(theUser, (err) => {
      if (err) return next(err);

      res.status(302).json(user);
    });
  })(req, res, next);
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