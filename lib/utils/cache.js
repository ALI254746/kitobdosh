import redis from '@/lib/redis';

/**
 * Ma'lumotni keshdan olish yoki bazadan o'qib keshga yozish funksiyasi
 * @param {string} key - Redis kaliti (masalan: 'all_books')
 * @param {Function} fetcher - Agar keshda yo'q bo'lsa, ma'lumotni olib keluvchi funksiya (async)
 * @param {number} expireTime - Keshda turish vaqti (sekund), default: 3600 (1 soat)
 * @returns {Promise<any>} - Ma'lumot
 */
export async function getOrSetCache(key, fetcher, expireTime = 3600) {
  try {
    const cached = await redis.get(key);
    if (cached) return JSON.parse(cached);
  } catch { /* Cache is optional; database failures still propagate. */ }
  const data = await fetcher();
  if (data != null) {
    try { await redis.set(key, JSON.stringify(data), 'EX', expireTime); } catch {}
  }
  return data;
}

export async function clearCache(key) {
  try {
    await redis.del(key);
  } catch (error) {
    // Cache invalidation is best effort when Redis is unavailable.
  }
}

/**
 * Keshni pattern bo'yicha tozalash
 * @param {string} pattern - Masalan: 'books_*'
 */
export async function clearCachePattern(pattern) {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    // Cache invalidation is best effort when Redis is unavailable.
  }
}
