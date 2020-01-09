const express            = require(`express`);
const router             = express.Router();
const sessionsController = require(`../../../controllers/sessions.js`);


// create
router.post(`/`, sessionsController.create);


// destroy
router.delete(`/`, sessionsController.destroy);


module.exports = router;