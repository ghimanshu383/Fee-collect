const redis = require('redis');
const {createClient} = redis;

const redisClient = createClient({
  host: '127.0.0.1',
  port: '6379',
});

redisClient.connect();
redisClient.on('error', (error)=>{
  console.log('Redis error', error);
  process.exit(1);
});
module.exports = redisClient;
