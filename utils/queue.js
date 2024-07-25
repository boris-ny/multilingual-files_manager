const Queue = require('bull');

const fileQueue = new Queue('fileQueue', {
  redis: {
    host: '127.0.0.1', // Change this if your Redis server is hosted elsewhere
    port: 6379,
  },
});

module.exports = fileQueue;
