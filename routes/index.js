const express = require(`express`);
const router  = express.Router();


// visitor homepage
router.get(`/`, (req, res, next) => {
  res.render(`index/visitor`);
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