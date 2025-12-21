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
    // 1. Redisdan tekshirish
    const cachedData = await redis.get(key);
    
    if (cachedData) {
      // console.log(`🚀 FROM CACHE: ${key}`);
      return JSON.parse(cachedData);
    }

    // 2. Keshda yo'q, bazadan olish
    // console.log(`🐌 FROM DB: ${key}`);
    const data = await fetcher();

    // 3. Redisga yozish (agar data bo'lsa)
    if (data) {
      await redis.set(key, JSON.stringify(data), 'EX', expireTime);
    }

    return data;

  } catch (error) {
    console.error(`Redis Cache Error (${key}):`, error);
    // Agar Redis ishlamasa, shunchaki bazadan olib beradi, dastur to'xtab qolmaydi
    return await fetcher();
  }
}

export async function clearCache(key) {
  try {
    await redis.del(key);
  } catch (error) {
    console.error(`Redis Delete Error (${key}):`, error);
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
    console.error(`Redis Pattern Delete Error (${pattern}):`, error);
  }
}
