import Redis from 'ioredis';

// Missing optional cache configuration must fail quickly, never queue forever.
const unavailable = async () => { throw new Error('Redis sozlanmagan yoki mavjud emas'); };
const disabled = { get: unavailable, set: unavailable, setex: unavailable, del: unavailable, keys: unavailable, hgetall: unavailable, hset: unavailable, hdel: unavailable, expire: unavailable, ping: unavailable };
let redis = disabled;
if (process.env.REDIS_HOST) {
  if (!globalThis.__kitobdoshRedis) {
    const client = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT || 6379),
      password: process.env.REDIS_PASSWORD || undefined,
      lazyConnect: true,
      enableOfflineQueue: false,
      maxRetriesPerRequest: 1,
      connectTimeout: 1500,
      commandTimeout: 2000,
      retryStrategy: () => null,
    });
    client.on('error', () => {});
    globalThis.__kitobdoshRedis = client;
    client.connect().catch(() => {});
  }
  redis = globalThis.__kitobdoshRedis;
}
export default redis;
