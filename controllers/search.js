const Book   = require(`../models/book.js`);


//                            _     
//                           | |    
//    ___  ___  __ _ _ __ ___| |__  
//   / __|/ _ \/ _` | '__/ __| '_ \ 
//   \__ \  __/ (_| | | | (__| | | |
//   |___/\___|\__,_|_|  \___|_| |_|
//                                                           

exports.search = (req, res, next) => {
  const query = req.params.query;

  Book.find({ title: query }) // TODO: search other than exact match
    .then(books => {
      if (!books) {
        console.log(`foo`)
        let err = new Error(`This query does not match any book`);
        err.status = 404;

        return next(err);
      }

      res.status(200).json(books);
    })
    .catch(next);
}