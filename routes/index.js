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
      method: `GET`,
      url: `/api/0.1/reviews`,
      body: {} 
    }, (err, resp, body) => {
      if (err) return next(err);
      
      const reviews = body;

      req.uest({
        method: `GET`,
        url: `/api/0.1/books`,
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
    layout: `/layouts/homepage`
  });
});


// book page
router.get(`/livre/:slugOrId`, (req, res, next) => {
  req.uest({
    method: `GET`,
    url: `/api/0.1/books/${req.params.slugOrId}`
  }, (err, resp, body) => {
    if (err) return next(err);
    
    const book = body;

    console.log(body);

    return res.render(`books/show`, {
      user: req.user,
      book
    });
  });  
});

// add review on book page
router.post(`/livre/:slugOrId`, (req, res, next) => {
  const { book_id, user_id, rating, review, url } = req.body;

  console.log(`book_id: `, book_id, `user_id: `, user_id);

  req.uest({
    method: `POST`,
    url: `/api/0.1/reviews/`,
    body: { book_id, user_id, rating, review, url }
  }, (err, resp, body) => {
    if (err) return next(err);
    
    const review = body;

    console.log(`foo: `, review);

    return res.redirect(`/livre/${req.params.slugOrId}`);
  });  
})


// user page
router.get(`/membre/:slugOrId`, (req, res, next) => {
  req.uest({
    method: `GET`,
    url: `/api/0.1/users/${req.params.slugOrId}`
  }, (err, resp, body) => {
    if (err) return next(err);
    
    const user = body;

    console.log(`foo:`, user)

    return res.render(`users/show`, {
      user: user
    });
  });  
});


module.exports = router;