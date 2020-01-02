const express         = require(`express`);
const router          = express.Router();
const usersController = require(`../../../controllers/users.js`);


// index
router.get(`/`, usersController.index);


// create
router.post(`/`, usersController.create);


// show
router.get(`/:id`, usersController.show);


// update
router.put(`/:id`, usersController.update);


// destroy
router.delete(`/:id`, usersController.destroy);


module.exports = router;