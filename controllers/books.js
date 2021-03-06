const Book    = require(`../models/book.js`);


//    _           _           
//   (_)         | |          
//    _ _ __   __| | _____  __
//   | | '_ \ / _` |/ _ \ \/ /
//   | | | | | (_| |  __/>  < 
//   |_|_| |_|\__,_|\___/_/\_\
//                 

exports.index = (req, res, next) => {
  Book.find()
    .populate({
      path : `reviews`,
      populate : {
        path : `user_id`
      }
    })
    .then(books => {
      res.status(200).json(books);
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
  const { isbn, isbn13, asin, title, authors, coverPath, publisher, publicationDate } = req.body;

  Book.create({
    isbn,
    isbn13,
    asin,
    title,
    authors,
    coverPath,
    publisher,
    publicationDate
  })
    .then(book => { 
      res.status(201).json(book);
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

  Book.findOne(query)
    .populate({
      path : `reviews`,
      populate : {
        path : `user_id`
      }
    })
    .then(book => {
      if (!book) {
        let err = new Error(`This entry does not match any book`);
        err.status = 404;

        return next(err);
      }

      res.status(200).json(book);
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
    return next(new Error(`This ID does not match any book`));
  }

  const id = req.params.id;
  const { isbn, isbn13, asin, title, authors, coverPath, publisher, publicationDate } = req.body;
  
  Book.findByIdAndUpdate(id, {
    isbn,
    isbn13,
    asin,
    title,
    authors,
    coverPath,
    publisher,
    publicationDate
  },{ 
    new: true
  })
    .then(book => {
      res.status(200).json(book);
    })
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
    return next(new Error(`This ID does not match any book`));
  }

  const id = req.params.id;
  
  Book.findByIdAndDelete(id)
    .then(() => {
      res.status(204).json({});
    })
    .catch(next);
}