import Redis from 'ioredis';

const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;
const redisPassword = process.env.REDIS_PASSWORD;

let redis;

if (!redisHost || !redisPort || !redisPassword) {
  console.warn('Redis environment variables are missing');
}

const redisConfig = {
  host: redisHost,
  port: redisPort ? parseInt(redisPort) : 6379,
  password: redisPassword,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: null, // Allow it to retry indefinitely
  connectTimeout: 2000,
};

// Use a global variable to preserve the client across hot reloads in development
if (process.env.NODE_ENV === 'production') {
  redis = new Redis(redisConfig);
  redis.on('connect', () => {
    console.log('Redis connected successfully');
  });
  redis.on('error', (err) => {
    console.error('Redis connection error:', err);
  });
} else {
  if (!global.redis) {
    global.redis = new Redis(redisConfig);
    global.redis.on('connect', () => {
      console.log('Redis connected successfully');
    });
    global.redis.on('error', (err) => {
      console.error('Redis connection error:', err);
    });
  }
  redis = global.redis;
}

export default redis;
