const express = require(`express`);
const router  = express.Router();

const booksRoutes = require(`./books`);
const reviewsRoutes = require(`./reviews`);
const usersRoutes = require(`./users`);

router.use('/books', booksRoutes);
router.use('/reviews', reviewsRoutes);
router.use('/users', usersRoutes);

module.exports = router;