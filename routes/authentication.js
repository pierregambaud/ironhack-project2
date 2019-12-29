const express         = require('express');
const router          = express.Router();
const usersController = require('../controllers/users.js');
const passport        = require("passport");


// signup
router.get('/signup', (req, res) => {
  res.render('authentication/signup', { message: req.flash('error')});
});

router.post('/signup', usersController.create)


// login
router.get('/login', (req, res) => {
  res.render('authentication/login', { message: req.flash('error')});
});

router.post('/login', passport.authenticate('local', {
  successRedirect : '/',
  failureRedirect : '/login',
  failureFlash : true
}));


// logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});


module.exports = router;