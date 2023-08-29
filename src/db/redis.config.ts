require('dotenv').config();
import Redis from 'ioredis';

const redisClient = new Redis({
     host: process.env.REDIS_HOST,
     password: process.env.REDIS_PASSWORD,
     port: +(process.env.REDIS_PORT),
     username: process.env.REDIS_USERNAME,
}); 

redisClient.on('error', function (error) {
     console.error(error);
}); 

export default redisClient;