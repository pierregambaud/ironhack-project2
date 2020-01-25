const Review  = require(`../models/review.js`);
const Book    = require(`../models/book.js`);
const helpers = require(`../helpers/index.js`);


//    _           _           
//   (_)         | |          
//    _ _ __   __| | _____  __
//   | | '_ \ / _` |/ _ \ \/ /
//   | | | | | (_| |  __/>  < 
//   |_|_| |_|\__,_|\___/_/\_\
//                 

exports.index = (req, res, next) => {
  Review.find()
    .populate(`book_id`)
    .populate(`user_id`)
    .then(reviews => {
      res.status(200).json(reviews);
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
  const { book_id, user_id, rating, review, url } = req.body;

  Review.create({
    book_id,
    user_id,
    rating,
    review,
    url
  })
    .then(review => {
      Book.findById(book_id)
        .populate(`reviews`)
        .then(book => {
          const updatedRating = helpers.calculateBookRating(rating, book);
          
          Book.findByIdAndUpdate(book_id,
            {
              $set: {
                "rating": updatedRating
              },
              $push: {
                "reviews": review._id
              }
            })
            .then(() => {
              res.status(201).json(review);
            })
            .catch(next);
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
  const id = req.params.id;

  Review.findById(id)
    .then(review => {
      if (!review) {
        let err = new Error(`This ID does not match any review`);
        err.status = 404;

        return next(err);
      }

      res.status(200).json(review);
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
    return next(new Error(`This ID does not match any review`));
  }

  const id = req.params.id;
  const { book_id, user_id, rating, review, url } = req.body;
  
  Review.findByIdAndUpdate(id, {
    book_id,
    user_id,
    rating,
    review,
    url
  },{ 
    new: true
  })
    .populate(`book_id`)
    .populate(`user_id`)
    .then(review => {
      const updatedRating = helpers.calculateBookRating(null, book_id);

      Book.findByIdAndUpdate(book_id,
        {
          set: {
            rating: updatedRating
          }
        }
      )
      .then(() => 
        res.status(200).json(review)
      )
      .catch(next);
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
    return next(new Error(`This ID does not match any review`));
  }

  const id = req.params.id;
  
  Review.findByIdAndDelete(id)
    .then(() => {
      res.status(204).json({});
    })
    .catch(next);
}