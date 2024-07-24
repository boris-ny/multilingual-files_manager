const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { env } = require('node:process');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.json({ data: users }).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Users error' });
  }
};

const createUser = async (req, res) => {
  try {
    if (!req.body || !req.body.email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const existingUser = await User.findOne({
      where: { email: req.body.email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword;
    }
    const user = await User.create(req.body);
    return res.json({ message: 'User created', data: user }).status(201);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Users error' });
  }
};

const loginUser = async (req, res) => {
  const secret = env.JWT_SECRET;
  try {
    const user = await User.findOne({
      where: { email: req.body.email },
    });
    if (!user) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }
    const passwordIsValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user.id }, secret, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user.id }, secret, {
      expiresIn: '30 days',
    });
    return res
      .json({
        accessToken: token,
        refreshToken: refreshToken,
        user: {
          id: user.id,
          firstname: user.firstname,
        },
      })
      .status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Users error' });
  }
};

module.exports = { createUser, getAllUsers, loginUser };
