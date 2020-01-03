const express = require(`express`);
const router  = express.Router();


// visitor homepage
router.get(`/`, (req, res, next) => {
  res.render(`index`);
});

// signup homepage
router.get(`/inscription`, (req, res, next) => {
  res.render(`signup`);
});


module.exports = router;