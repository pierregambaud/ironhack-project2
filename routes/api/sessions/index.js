const express            = require(`express`);
const router             = express.Router();
const sessionsController = require(`../../../controllers/sessions.js`);


// create
router.post(`/`, sessionsController.create);


// facebook
router.get(`/facebook`, sessionsController.facebook);
router.get(`/facebookCallback`, sessionsController.facebookCallback);


// twitter
router.get(`/twitter`, sessionsController.twitter);
router.get(`/twitterCallback`, sessionsController.twitterCallback);


// destroy
router.delete(`/`, sessionsController.destroy);


module.exports = router;