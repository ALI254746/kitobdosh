import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

// Vercel build timeout xatoligini oldini olish uchun
// Bu route faqat runtime'da ishlaydi, build vaqtida emas
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    // 1. Check connection with ping
    const pong = await redis.ping();
    
    // 2. Write a test value
    await redis.set('test_key', 'Hello Redis from Next.js');
    
    // 3. Read the value back
    const value = await redis.get('test_key');
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Redis is working!', 
      ping: pong, 
      valueFromRedis: value 
    });
  } catch (error) {
    console.error('Redis Test Error:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Redis connection failed', 
      error: error.message 
    }, { status: 500 });
  }
}
