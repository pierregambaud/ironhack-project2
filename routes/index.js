const express         = require(`express`);
const router          = express.Router();
const uest            = require('uest');


// visitor homepage
router.get(`/`, (req, res, next) => {
  if(req.user) {
    req.uest({
      method: 'GET',
      url: '/api/0.1/reviews',
      body: {} 
    }, (err, resp, body) => {
      if (err) return next(err);
      
      const reviews = body;

      req.uest({
        method: 'GET',
        url: '/api/0.1/books',
        body: {} 
      }, (err, resp, body) => {
        if (err) return next(err);
        
        const books = body;

        console.log(books);

        return res.render(`index/member`, {
          layout: 'member-layout',
          reviews,
          books
        });
      });
    })

    return;
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