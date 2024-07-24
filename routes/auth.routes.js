const { Router } = require('express');
const { loginUser } = require('../controllers/userController');
const router = Router();

router.route('/').post(loginUser);

module.exports = router;
