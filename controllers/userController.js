const { celebrate, Segments } = require('celebrate');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');

const userSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  password2: Joi.any()
    .valid(Joi.ref('password'))
    .required()
    .messages({ 'any.only': 'must match password' }),
});

const UserValidation = celebrate({ [Segments.BODY]: userSchema });

const createUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({
      where: { email: req.body.email },
    });
    if (existingUser === req.body.email) {
      return res.status(400).json({ message: 'User already exists' });
    }
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
