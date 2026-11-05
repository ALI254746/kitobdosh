export function requiredAccess(path, method) {
  if (path.startsWith('/uploads/renters/')) return 'disabled';
  if (path.startsWith('/api/test/') || path === '/api/redis-test') return 'disabled';
  if (path.startsWith('/api/cron/')) return 'cron';
  if (path.startsWith('/api/admin/') || path.startsWith('/AdminPanel')) return 'admin';
  if (path.startsWith('/api/courier') || path.startsWith('/KurierPanel')) return 'courier';
  if ((path === '/api/books' || /^\/api\/books\/[^/]+$/.test(path)) && method !== 'GET' && method !== 'HEAD') return 'admin';
  if (['/api/order', '/api/rent'].includes(path)) return ['GET', 'PUT', 'DELETE'].includes(method) ? 'admin' : 'user';
  if (path === '/api/notifications' && method === 'POST') return 'admin';
  if (path === '/api/contact' && ['GET', 'PUT', 'DELETE'].includes(method)) return 'admin';
  if (path === '/api/upload') return 'user';
  if (path.startsWith('/api/user/') && path !== '/api/user/search') return 'user';
  if (['/api/cart', '/api/notifications', '/api/rent/action', '/api/payment/payme'].includes(path)) return 'user';
  if (path === '/api/reviews' && method !== 'GET') return 'user';
  return null;
}
export function canAccess(access, token) {
  if (!access) return true;
  if (!token?.id) return false;
  if (access === 'admin') return token.role === 'admin';
  if (access === 'courier') return ['admin', 'kurier', 'kurer', 'courier'].includes(token.role);
  return access === 'user';
}
