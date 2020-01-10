const express         = require(`express`);
const router          = express.Router();
const uest            = require('uest');


// visitor homepage
router.get(`/`, (req, res, next) => {
  if(req.user) {
    return res.render(`index/member`, {
      layout: 'member-layout'
    });
  }
  res.render(`index/visitor`);
});


// signup form
router.post('/inscription', (req, res, next) => {
  const {email, password} = req.body;

  if (email === `` || password === ``) {
    res.render(`/inscription`, { error: `Email, password and username are mandatory`})
    return;
  }

  req.uest({
    method: 'POST',
    url: '/api/0.1/users',
    body: {email, password}
  }, (er, resp, body) => {
    if (er) {
      // deal with specific "Forbidden" error
      if (er.status === 409) {
        return res.render('signup', {error: "Email already taken"})
      }

      return next(er); // for any other error
    }
      
    res.redirect('/')
  })
});


// signup homepage
router.get(`/inscription`, (req, res, next) => {
  res.render(`signup`);
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
  }, (er, resp, body) => {
    if (er) {
      // deal with specific "Forbidden" error
      if (er.status === 401) {
        return res.render('index/visitor', {error: `Username and password does not match`});
      }

      return next(er); // for any other error
    }
      
    res.redirect('/');
  })
});


// facebook connect
router.get('/connexion-facebook', (req, res, next) => {
  req.uest({
    method: 'GET',
    url: '/api/0.1/sessions/facebook'
  }, (er, resp, body) => {
    if (er) {
      return next(er); // for any other error
    }
      
    res.redirect('/');
  })
});


// twitter connect
router.get('/connexion-twitter', (req, res, next) => {
  req.uest({
    method: 'GET',
    url: '/api/0.1/sessions/twitter'
  }, (er, resp, body) => {
    if (er) {
      return next(er); // for any other error
    }
      
    res.redirect('/');
  })
});


// disconnect
router.get(`/deconnexion`, (req, res, next) => {
  const id = req.user.id;

  req.uest({
    method: 'DELETE',
    url: '/api/0.1/session'
  }, (er, resp, body) => {
    if (er) {
      return next(er);
    }
      
    res.redirect('/');
  })
})


module.exports = router;