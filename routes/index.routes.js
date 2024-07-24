const { Router } = require('express');
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');
const fileRoutes = require('./file.routes');

const router = Router();

router.get('/welcome', (req, res) => {
  res.json({ message: 'Welcome to the Files Manager App' }).status(200);
});

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/files', fileRoutes);

module.exports = router;
