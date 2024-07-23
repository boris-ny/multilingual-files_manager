const redis = require('redis');

// Create a Redis client
const redisClient = redis.createClient({
  host: 'redis', // This is the name of the Redis service in docker-compose.yml
  port: 6379,
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

module.exports = redisClient;
