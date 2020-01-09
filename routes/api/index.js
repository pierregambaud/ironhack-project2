const express = require(`express`);
const router  = express.Router();

const booksRoutes = require(`./books`);
const reviewsRoutes = require(`./reviews`);
const usersRoutes = require(`./users`);
const sessionsRoutes = require(`./sessions`);

router.use('/books', booksRoutes);
router.use('/reviews', reviewsRoutes);
router.use('/users', usersRoutes);
router.use('/sessions', sessionsRoutes);

module.exports = router;