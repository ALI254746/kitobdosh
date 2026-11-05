import { createHash, randomInt } from 'node:crypto';
import redis from '@/lib/redis';
export const digest = value => createHash('sha256').update(value).digest('hex');
export const otpKey = email => `register_otp:${digest(email)}`;
export async function rateLimit(req, email, purpose) {
  const ip = req.ip || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const limits = purpose === 'send' ? [3, 10] : [5, 30];
  for (const [index, value] of [email, ip].entries()) {
    const key = `otp_rate:${purpose}:${index}:${digest(value)}`;
    const count = await redis.eval("local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],900) end; return n", 1, key);
    if (count > limits[index]) return false;
  }
  return true;
}
export function newOtp() { const code = randomInt(100000,1000000).toString(); return { code, hash: digest(code) }; }
export async function consumeOtp(email, code) {
  return redis.eval(`local raw=redis.call('GET',KEYS[1]); if not raw then return nil end; local d=cjson.decode(raw); if d.otpHash~=ARGV[1] then return nil end; redis.call('DEL',KEYS[1]); return d.password`, 1, otpKey(email), digest(code));
}
