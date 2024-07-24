const { Router } = require('express');
const { validJWTNeeded } = require('../utils/jsonwebtoken');
const { getAllUsers, createUser } = require('../controllers/userController');
const { validateRegistration } = require('../utils/validators');

const router = Router();

router
  .route('/')
  .get(validJWTNeeded, getAllUsers)
  .post(validateRegistration, createUser);

module.exports = router;
