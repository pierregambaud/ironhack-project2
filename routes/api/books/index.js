const express         = require(`express`);
const router          = express.Router();
const booksController = require(`../../../controllers/books.js`);


// index
router.get(`/`, booksController.index);


// create
router.post(`/`, booksController.create);


// show
router.get(`/:slugOrId`, booksController.show);


// update
router.put(`/:id`, booksController.update);


// destroy
router.delete(`/:id`, booksController.destroy);


module.exports = router;