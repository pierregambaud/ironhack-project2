const express         = require(`express`);
const router          = express.Router();
const uest            = require('uest');


// visitor homepage
router.get(`/`, (req, res, next) => {
  res.render(`index/visitor`);
});


// signup form
router.post('/', (req, res, next) => {
  const {email, password} = req.body;
  const username = `foo`;

  // subsequent request to `POST /api/0.1/users` route
  req.uest({
    method: 'POST',
    url: '/api/0.1/users',
    body: {email, password, username}
  }, (er, resp, body) => {
    if (er) {
      // deal with specific "Forbidden" error
      if (er.status === 403) {
        return res.render('login', {error: "Username already taken"})
      }

      return next(er); // for any other error
    }
    console.log(email, password, username)
    console.log('User-session created for', body.user);

    // `req.session` is up-to-date
    console.log(`Welcome back !`);
      
    res.redirect('/profile')
  })
});


// signup homepage
router.get(`/inscription`, (req, res, next) => {
  res.render(`signup`);
});


// member homepage => FIXME: need to merge with visitor when auth with API created
router.get(`/m`, (req, res, next) => {
  res.render(`index/member`, {
    layout: 'member-layout'
  });
});


module.exports = router;