const { Router } = require('express');
const router = Router();
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');

router.get('/welcome', (req, res) => {
  res.json({ message: 'Welcome to the Files Manager App' }).status(200);
});

router.use('/users', userRoutes);
router.use('/auth', authRoutes);

module.exports = router;
