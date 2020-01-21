const User        = require(`../models/user.js`);
const helpers     = require(`../helpers/index.js`);


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
      res.status(200).json(users);
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
  const email      = req.body.email;
  const password   = req.body.password;

  // check email and password are not empty
  if (email === `` || password === ``) {
    let err = new Error(`Email and password are mandatory`);
    err.status = 412;
    
    return next(err);
  }

  User.findOne({ email })
    .then(user => {
      // TODO if email already exists?

      // check username does not already exist
      if (user) {
        let err = new Error(`This email already exists`);
        err.status = 409;
        
        return next(err);
      }

      helpers.generateUniqueUsername(email)
        .then(username => {
          helpers.generateUniqueSlug(`username`, username)
            .then(slug => {
              // save the user in DB
              const newUser = new User({
                email,
                password: helpers.encryptPassword(password),
                username,
                slug
              });
    
              // login user
              newUser.save()
                .then(user => {
                  req.login(user, (err) => {
                    if (err) return next(err);
              
                    res.redirect(`/`);
                  });
                })
                .catch(next);
            })
            .catch(next)
        })
        .catch(next)
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
  const slugOrId = req.params.slugOrId;

  let query;
  if (Object.keys(slugOrId).length === 24) { // slug is always 24 caracters length
    query = {_id: slugOrId};
  } else {
    query = {slug: slugOrId}; // TODO: make sure slug length can not be egale to 24!
  };

  User.findOne(query)
    .then(user => {
      if (!user) {
        let err = new Error(`This entry does not match any user`);
        err.status = 404;

        return next(err);
      }

      res.status(200).json(user);
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
    return next(new Error(`This ID does not match any user`));
  }

  const id = req.params.id;
  const { email, password, username, avatarPath } = req.body;
  
  // TODO: refactor with a better way!
  // TODO: check if email already used
  // TODO: deal with avatar
  let userElementsToUpdate = {};
  if(email) userElementsToUpdate.email = email;
  if(password) userElementsToUpdate.password = helpers.encryptPassword(password);
  if(avatarPath) userElementsToUpdate.avatarPath = avatarPath;
  if(username) {
    userElementsToUpdate.username = username;
    // TODO: check if username already taken (include lower/uppercase)

    helpers.generateUniqueSlug(`username`, username)
      .then(slug => {
        userElementsToUpdate.slug = slug;
        
        userElementsToUpdate = { $set: userElementsToUpdate };
  
        User.findByIdAndUpdate(id,
          userElementsToUpdate,
          { 
            new: true
          })
          .then(user => res.status(200).json(user))
          .catch(next);
      })
      .catch(next);
  } else {
    userElementsToUpdate = { $set: userElementsToUpdate };
  
    User.findByIdAndUpdate(id,
      userElementsToUpdate,
      { 
        new: true
      })
      .then(user => res.status(200).json(user))
      .catch(next);
  }
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
    return next(new Error(`This ID does not match any user`));
  }

  const id = req.params.id;
  
  User.findByIdAndDelete(id)
    .then(() => {
      res.status(204).json({});
    })
    .catch(next);
}