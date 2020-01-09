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
  const { email, password } = req.body;

  // check email and password are not empty
  if (email === `` || password === ``) {
    let err = new Error(`Email and password are mandatory`);
    err.status = 412;
    
    return next(err);
  }

  const generateUsername = (email) => {
    return email.split(`@`)[0];
  }

  const generateSlug = (email) => {
    return email.split(`@`)[0];
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

      // encrypt the password
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      // save the user in DB
      const newUser = new User({
        email,
        password: hashPass,
        username: generateUsername(email),
        slug: generateSlug(email)
      });

      newUser.save()
        .then(user => {

          req.uest({
            method: 'POST',
            url: '/api/0.1/sessions',
            body: {email, password}
          }, (er, resp, body) => {
            if (er) {
              return next(er); // for any other error
            }

            res.status(201).json(user);
          })
        })
        .catch(next);
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
    let err = new Error(`This user ID does not match any entry`);
    err.status = 404;

    return next(err);
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
    let err = new Error(`ID is mandatory`);
    err.status = 404;
    
    return next(err);
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
    let err = new Error(`ID is mandatory`);
    err.status = 404;
    
    return next(err);
  }

  const id = req.params.id;
  
  User.findByIdAndDelete(id)
    .then(() => {
      res.status(204).json({});
    })
    .catch(next);
}