const express         = require(`express`);
const router          = express.Router();
const reviewsController = require(`../../controllers/reviews.js`);


// index
router.get(`/`, reviewsController.index);


// create
router.post(`/`, reviewsController.create);


// show
router.get(`/:id`, reviewsController.show);


// update
router.put(`/:id`, reviewsController.update);


// destroy
router.delete(`/:id`, reviewsController.destroy);


module.exports = router;