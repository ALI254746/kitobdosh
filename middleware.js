import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { requiredAccess, canAccess } from './lib/access-policy.mjs';

export async function middleware(req) {
  const access = requiredAccess(req.nextUrl.pathname, req.method);
  if (!access) return NextResponse.next();
  if (access === 'disabled') return NextResponse.json({ success: false, message: 'Topilmadi' }, { status: 404 });
  if (access === 'cron') {
    if (process.env.CRON_SECRET && req.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}`) return NextResponse.next();
    return NextResponse.json({ success: false, message: 'Ruxsat yo‘q' }, { status: 401 });
  }
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (canAccess(access, token)) {
    const response = NextResponse.next();
    response.cookies.set('kitobdosh_token', '', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 0 });
    return response;
  }
  if (!req.nextUrl.pathname.startsWith('/api/')) return NextResponse.redirect(new URL('/', req.url));
  return NextResponse.json({ success: false, message: token ? 'Bu amal uchun ruxsat yo‘q' : 'Avval tizimga kiring' }, { status: token ? 403 : 401 });
}
export const config = { matcher: ['/api/:path*', '/AdminPanel/:path*', '/KurierPanel/:path*'] };
