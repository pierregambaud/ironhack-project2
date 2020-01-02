const Review = require(`../models/review.js`);


// index
exports.index = (req, res, next) => {
  Review.find()
    .then(reviews => {
      res.status(200).json(reviews);
    })
    .catch(next);
}


// create
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
      res.status(201).json(review);
    })
    .catch(next);
}


// show
exports.show = (req, res, next) => {
  if(!req.params.id) {
    return next(new Error(`This ID does not match any review`));
  }

  const id = req.params.id;

  Review.findById(id)
    .then(review => {
      res.status(200).json(review);
    })
    .catch(next);
}


// update
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
    .then(review => {
      res.status(200).json(review);
    })
    .catch(next);
}


// destroy
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