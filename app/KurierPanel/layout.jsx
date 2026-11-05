import CourierLayout from './CourierLayout';
import { requireRole } from '@/lib/require-role';
import { redirect } from 'next/navigation';
export default async function Layout({ children }) {
  if (await requireRole(['admin', 'kurier', 'kurer', 'courier'])) redirect('/');
  return <CourierLayout>{children}</CourierLayout>;
}
