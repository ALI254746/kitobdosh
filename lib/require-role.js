import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/authOptions';

// Re-read the session on the server; jwt callback refreshes the current DB role.
export async function requireRole(roles = ['admin']) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ success: false, message: 'Avval tizimga kiring' }, { status: 401 });
    if (!roles.includes(session.user.role)) return NextResponse.json({ success: false, message: 'Bu amal uchun ruxsat yo‘q' }, { status: 403 });
    return null;
  } catch {
    return NextResponse.json({ success: false, message: 'Sessiyani tekshirib bo‘lmadi' }, { status: 503 });
  }
}
