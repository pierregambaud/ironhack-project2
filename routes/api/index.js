const express = require(`express`);
const router  = express.Router();

const booksRoutes     = require(`./books`);
const reviewsRoutes   = require(`./reviews`);
const usersRoutes     = require(`./users`);
const sessionsRoutes  = require(`./sessions`);
const searchRoutes    = require(`./search`);

router.use('/books', booksRoutes);
router.use('/reviews', reviewsRoutes);
router.use('/users', usersRoutes);
router.use('/sessions', sessionsRoutes);
router.use('/session', sessionsRoutes);
router.use('/search', searchRoutes);

module.exports = router;