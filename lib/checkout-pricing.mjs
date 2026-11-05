export const deliveryFee = method => ({ pickup: 0, courier: 15000, standard: 20000 })[method];
export function coordinates(lat, lng) {
  if ((lat == null || lat === '') && (lng == null || lng === '')) return {};
  const a = Number(lat), b = Number(lng);
  if (lat == null || lng == null || !Number.isFinite(a) || !Number.isFinite(b) || Math.abs(a) > 90 || Math.abs(b) > 180) throw new Error('Koordinatalar noto‘g‘ri');
  return { lat: a, lng: b };
}
