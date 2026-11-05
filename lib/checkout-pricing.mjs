export const deliveryFee = method => ({ pickup: 0, courier: 15000, standard: 20000 })[method];
export function coordinates(lat, lng) {
  const empty = value => value == null || (typeof value === 'string' && value.trim() === '');
  if (empty(lat) && empty(lng)) return {};
  if (empty(lat) || empty(lng) || !['string', 'number'].includes(typeof lat) || !['string', 'number'].includes(typeof lng)) throw new Error('Koordinatalar noto‘g‘ri');
  const a = Number(lat), b = Number(lng);
  if (!Number.isFinite(a) || !Number.isFinite(b) || Math.abs(a) > 90 || Math.abs(b) > 180) throw new Error('Koordinatalar noto‘g‘ri');
  return { lat: a, lng: b };
}
