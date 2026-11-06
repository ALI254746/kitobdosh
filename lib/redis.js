import Redis from 'ioredis';

// Missing optional cache configuration must fail quickly, never queue forever.
const unavailable = async () => { throw new Error('Redis sozlanmagan yoki mavjud emas'); };
const disabled = { eval: unavailable, get: unavailable, set: unavailable, setex: unavailable, del: unavailable, keys: unavailable, hgetall: unavailable, hset: unavailable, hdel: unavailable, expire: unavailable, ping: unavailable };
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
    globalThis.__kitobdoshRedisReady = client.connect();
    globalThis.__kitobdoshRedisReady.catch(() => {});
  }
  const commands = new Set(['eval', 'get', 'set', 'setex', 'del', 'keys', 'hgetall', 'hset', 'hdel', 'expire', 'ping']);
  redis = new Proxy(globalThis.__kitobdoshRedis, {
    get(client, method) {
      if (commands.has(method)) return async (...args) => {
        // Wait for the existing bounded connect attempt instead of failing the first request.
        if (client.status !== 'ready') await globalThis.__kitobdoshRedisReady;
        if (client.status !== 'ready') throw new Error('Redis mavjud emas');
        return client[method](...args);
      };
      const value = client[method];
      return typeof value === 'function' ? value.bind(client) : value;
    }
  });
}
export default redis;
