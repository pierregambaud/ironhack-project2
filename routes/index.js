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
          layout: 'member-layout',
          user: req.user,
          reviews,
          books
        });
      });
    })

    return;
  }

  res.render(`index/visitor`);
});


module.exports = router;