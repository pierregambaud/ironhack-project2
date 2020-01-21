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


//        _                                               _             
//       | |                                             | |            
//    ___| |_   _  __ _    __ _  ___ _ __   ___ _ __ __ _| |_ ___  _ __ 
//   / __| | | | |/ _` |  / _` |/ _ \ '_ \ / _ \ '__/ _` | __/ _ \| '__|
//   \__ \ | |_| | (_| | | (_| |  __/ | | |  __/ | | (_| | || (_) | |   
//   |___/_|\__,_|\__, |  \__, |\___|_| |_|\___|_|  \__,_|\__\___/|_|   
//                 __/ |   __/ |                                        
//                |___/   |___/                                         

const slugify = require('slugify');
const User    = require(`../models/user.js`);
const Book    = require(`../models/book.js`); 

exports.generateUniqueSlug = (type, elementToSlugify, cb) => {
  let slug;

  const checkLength = (slug) => {
    if(slug.length === 24) { // length dedicated for ObjectId, criteria slugOrId routes
      return slug = slug + "-1";
    }

    return slug;
  }
  
  switch (type) {
    case `email`:
      slug = checkLength(slugify(elementToSlugify.split(`@`)[0], {
        replacement: '-',
        remove: null,
        lower: true,
      }));

      User.findOne({ "slug": slug })
        .then(user => {     
          console.log(user); 
          if(!user) {
            isSlugUnique = true;
          } else {
            // TODO: if slug already contains "-X", then remove and add "-(X+1)"
            // if (preg_match('.*(-).*[0-9]$', slug)) {}
            // TODO : check if new slug is unique
            slug = slug + "-" + Math.floor(Math.random() * 10000)
            console.log(slug);

            cb(null, slug);
          }
        })
        .catch(cb);

      break; 
    case `username`:
      slug = checkLength(slugify(elementToSlugify, {
        replacement: '-',
        remove: null,
        lower: true,
      }));

      User.findOne({ "slug": slug })
        .then(user => {     
          console.log(user); 
        
          if(user) {
            // TODO: if slug already contains "-X", then remove and add "-(X+1)" => ^(.*?)(-).*[0-9]$
            // if (preg_match('.*(-).*[0-9]$', slug)) {}
            // TODO : check if new slug is unique
            slug = slug + "-" + Math.floor(Math.random() * 10000)
          }

          console.log(slug);
          cb(null, slug);

        })
        .catch(cb);

      break;
    case `bookTitle`:
      slug = checkLength(slugify(elementToSlugify, {
        replacement: '-',
        remove: null,
        lower: true,
      }));

      Book.findOne({ "slug": slug })
        .then(book => {     
          console.log(book); 
          if(!book) {
            isSlugUnique = true;
          } else {
            // TODO: if slug already contains "-X", then remove and add "-(X+1)"
            // if (preg_match('.*(-).*[0-9]$', slug)) {}
            // TODO : check if new slug is unique
            slug = slug + "-" + Math.floor(Math.random() * 10000)
            console.log(slug);
          }
        })
        .catch(cb);
        
      break;
  }
};

