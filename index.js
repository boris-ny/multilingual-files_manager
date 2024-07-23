const express = require('express');
const dotenv = require('dotenv');
const db = require('./utils/database');
const redisClient = require('./utils/redis');

dotenv.config();
const app = express();
const port = 3000;

// Add middleware to parse incoming requests with JSON payloads
app.use(express.json());

// Test the connection to the database
db.authenticate()
  .then(() => {
    console.log(
      'Connection to mysql database has been established successfully.'
    );
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// Test the connection to Redis
redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

app.get('/hello', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

module.exports = app;
