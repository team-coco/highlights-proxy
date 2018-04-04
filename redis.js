const redis = require('redis');

const redisClient = redis.createClient();

redisClient.on('connect', () => {
  console.log('Connected to redis!');
});

module.exports = redisClient;