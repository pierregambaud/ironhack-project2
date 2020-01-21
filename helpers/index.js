//                                     _                                               _ 
//                                    | |                                             | |
//     ___ _ __   ___ _ __ _   _ _ __ | |_   _ __   __ _ ___ _____      _____  _ __ __| |
//    / _ \ '_ \ / __| '__| | | | '_ \| __| | '_ \ / _` / __/ __\ \ /\ / / _ \| '__/ _` |
//   |  __/ | | | (__| |  | |_| | |_) | |_  | |_) | (_| \__ \__ \\ V  V / (_) | | | (_| |
//    \___|_| |_|\___|_|   \__, | .__/ \__| | .__/ \__,_|___/___/ \_/\_/ \___/|_|  \__,_|
//                          __/ | |         | |                                          
//                         |___/|_|         |_|                                          

const bcrypt      = require(`bcrypt`);
const bcryptSalt  = 10;
const salt        = bcrypt.genSaltSync(bcryptSalt);

exports.encryptPassword = (plaintextPassword) => {
  return bcrypt.hashSync(plaintextPassword, salt);
};


//                                                                                     _             
//                                                                                    | |            
//    _   _ ___  ___ _ __ _ __   __ _ _ __ ___   ___    __ _  ___ _ __   ___ _ __ __ _| |_ ___  _ __ 
//   | | | / __|/ _ \ '__| '_ \ / _` | '_ ` _ \ / _ \  / _` |/ _ \ '_ \ / _ \ '__/ _` | __/ _ \| '__|
//   | |_| \__ \  __/ |  | | | | (_| | | | | | |  __/ | (_| |  __/ | | |  __/ | | (_| | || (_) | |   
//    \__,_|___/\___|_|  |_| |_|\__,_|_| |_| |_|\___|  \__, |\___|_| |_|\___|_|  \__,_|\__\___/|_|   
//                                                      __/ |                                        
//                                                     |___/                                         

const User = require(`../models/user.js`);

exports.generateUniqueUsername = (email) => {
  return new Promise((resolve, reject) => {
    let username = email.split(`@`)[0];

    User.findOne({ username })
      .then(user => {
        if(user) {
          username = username + "-" + Math.floor(Math.random() * 10000);
        }

        resolve(username);
      })
      .catch(err => {
        reject(err)
      })
  })
};


//        _                                               _             
//       | |                                             | |            
//    ___| |_   _  __ _    __ _  ___ _ __   ___ _ __ __ _| |_ ___  _ __ 
//   / __| | | | |/ _` |  / _` |/ _ \ '_ \ / _ \ '__/ _` | __/ _ \| '__|
//   \__ \ | |_| | (_| | | (_| |  __/ | | |  __/ | | (_| | || (_) | |   
//   |___/_|\__,_|\__, |  \__, |\___|_| |_|\___|_|  \__,_|\__\___/|_|   
//                 __/ |   __/ |                                        
//                |___/   |___/                                         

const slugify = require('slugify');
const Book    = require(`../models/book.js`); 

exports.generateUniqueSlug = (type, elementToSlugify) => {
  return new Promise((resolve, reject) => {  
    const checkLength = (slug) => {
      if(slug.length === 24) { slug + "-1" } // length dedicated for ObjectId, criteria slugOrId routes
  
      return slug;
    }

    let slug = checkLength(slugify(elementToSlugify, {
      replacement: '-',
      remove: /[*+~.()'"!:@]/g,
      lower: true,
    }));
    
    switch (type) {
      case `username`:
        User.findOne({ slug })
          .then(user => {               
            if(user) {
              // TODO: if slug already contains "-X", then remove and add "-(X+1)" => ^(.*?)(-).*[0-9]$
              // if (preg_match('.*(-).*[0-9]$', slug)) {}
              // TODO : check if new slug is unique
              slug = slug + "-" + Math.floor(Math.random() * 10000)
            }
  
            resolve(slug);
          })
          .catch(reject);
        break;

      case `bookTitle`:
        Book.findOne({ slug })
          .then(book => {
            if(book) {
              // TODO: if slug already contains "-X", then remove and add "-(X+1)"
              // if (preg_match('.*(-).*[0-9]$', slug)) {}
              // TODO : check if new slug is unique
              slug = slug + "-" + Math.floor(Math.random() * 10000)
            }

            resolve(slug);
          })
          .catch(reject);
        break;   
    }
  })
};

