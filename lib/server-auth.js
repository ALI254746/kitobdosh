import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { NextResponse } from 'next/server';
export const courierRoles = ['kurier', 'kurer', 'courier'];
export async function authorize(roles) {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user?.id) return { response: NextResponse.json({ success: false, message: 'Avval tizimga kiring' }, { status: 401 }) };
  if (roles && !roles.includes(user.role)) return { response: NextResponse.json({ success: false, message: 'Bu amal uchun ruxsat yo‘q' }, { status: 403 }) };
  return { user };
}
export const privateFields = '-passportUrl -passportCloudinaryId -passportAssetId';
export function publicRecord(record) {
  if (record == null) return record;
  return JSON.parse(JSON.stringify(record), (key, value) => ['password', 'passportUrl', 'passportCloudinaryId', 'passportFormat', 'passportAssetId'].includes(key) ? undefined : value);
}
