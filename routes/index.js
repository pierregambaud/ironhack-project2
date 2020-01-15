const express         = require(`express`);
const router          = express.Router();
const uest            = require('uest');


// auth routes
const authRoutes = require(`./authentication`);
router.use('/', authRoutes);


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
          user: req.user,
          reviews,
          books
        });
      });
    })

    return;
  }

  res.render(`index/visitor`, {
    layout: '/layouts/homepage'
  });
});


// book page
router.get(`/livre/:id`, (req, res, next) => {
  req.uest({
    method: 'GET',
    url: '/api/0.1/books/' + req.params.id
  }, (err, resp, body) => {
    if (err) return next(err);
    
    const book = body;

    return res.render(`books/show`, {
      book
    });
  });  
});


// user page
router.get(`/membre/:id`, (req, res, next) => {
  req.uest({
    method: 'GET',
    url: '/api/0.1/users/' + req.params.id
  }, (err, resp, body) => {
    if (err) return next(err);
    
    const user = body;

    console.log(user)

    return res.render(`users/show`, {
      user: user
    });
  });  
});


module.exports = router;