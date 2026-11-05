export const escapeSearch = value => String(value).slice(0, 120).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export function positiveInt(value, fallback, maximum) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, maximum) : fallback;
}
export const isObjectId = value => typeof value === 'string' && /^[a-f\d]{24}$/i.test(value);

export function adminOrderSearch(query) {
  const term = String(query).trim().slice(0, 120);
  const regex = new RegExp(escapeSearch(term), 'i');
  const conditions = [{ 'customer.name': regex }, { 'customer.phone': regex }];
  if (isObjectId(term)) conditions.push({ _id: term });
  return { regex, orderFilter: { $or: conditions } };
}
