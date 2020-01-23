const express         = require(`express`);
const router          = express.Router();
const uest            = require('uest');


// signup form
router.post('/inscription', (req, res, next) => {
  const {email, password} = req.body;

  if (email === `` || password === ``) {
    res.render(`/inscription`, {
      layout: `/layouts/homepage`,
      error: `Email, password and username are mandatory`
    })
    return;
  }

  req.uest({
    method: 'POST',
    url: '/api/0.1/users',
    body: {email, password}
  }, (err, resp, body) => {
    if (err) {
      // deal with specific "Forbidden" error
      if (err.status === 409) {
        return res.render('signup', {error: "Email already taken"})
      }

      return next(err); // for any other error
    }
      
    res.redirect('/')
  })
});


// signup homepage
router.get(`/inscription`, (req, res, next) => {
  res.render(`signup`, {
    layout: `/layouts/homepage`
  });
});


// login form
router.post('/connexion', (req, res, next) => {
  const {email, password} = req.body;

  if (email === `` || password === ``) {
    return res.render(`index/visitor`, { error: `Email, password and username are mandatory`});
  }

  req.uest({
    method: 'POST',
    url: '/api/0.1/sessions',
    body: {email, password}
  }, (err, resp, body) => {
    if (err) {
      // deal with specific "Forbidden" error
      if (err.status === 401) {
        return res.render('index/visitor', {error: `Username and password does not match`});
      }

      return next(err); // for any other error
    }
      
    res.redirect('/');
  })
});


// facebook connect
router.get('/connexion-facebook', (req, res, next) => {
  res.redirect('/api/0.1/sessions/facebook');
});


// twitter connect
router.get('/connexion-twitter', (req, res, next) => {
  res.redirect('/api/0.1/sessions/twitter');
});


// disconnect
router.get(`/deconnexion`, (req, res, next) => {
  const id = req.user.id;

  req.uest({
    method: 'DELETE',
    url: '/api/0.1/session'
  }, (err, resp, body) => {
    if (err) {
      return next(err);
    }
      
    res.redirect('/');
  })
});


module.exports = router;