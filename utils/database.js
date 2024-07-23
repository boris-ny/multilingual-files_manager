const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const db = new Sequelize({
  dialect: 'mysql',
  database: 'files-manager_db',
  username: 'user',
  password: 'password',
  host: 'localhost',
  port: 3306,
  logging: false,
});

db.sync({
  alter: true,
});

module.exports = db;
