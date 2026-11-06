import { deliveryFee, coordinates } from './checkout-pricing.mjs';
export class OrderInputError extends Error {}
export function prepareOrder(payload, books) {
  if (!Array.isArray(payload.items) || !payload.items.length || payload.items.length > 50) throw new OrderInputError('Savatcha bo‘sh yoki juda katta');
  if (!payload.customer || typeof payload.customer.name !== 'string' || !payload.customer.name.trim() || typeof payload.customer.phone !== 'string' || !/^[+\d\s()-]{7,25}$/.test(payload.customer.phone)) throw new OrderInputError('Ism va telefonni to‘g‘ri kiriting');
  if (!['pickup', 'standard', 'courier'].includes(payload.deliveryMethod)) throw new OrderInputError('Yetkazish usulini tanlang');
  if (payload.deliveryMethod !== 'pickup' && !payload.customer.address?.trim()) throw new OrderInputError('Yetkazish manzilini kiriting');
  let location;
  try { location = coordinates(payload.customer.lat, payload.customer.lng); } catch { throw new OrderInputError('Koordinatalar noto‘g‘ri'); }
  const paymentMethod = payload.paymentMethod || 'cash';
  if (!['cash', 'payme'].includes(paymentMethod)) throw new OrderInputError('Bu to‘lov usuli hozircha mavjud emas');
  const reserved = new Map();
  const items = payload.items.map(item => {
    const book = books.find(b => String(b._id) === item.book);
    if (!book) throw new OrderInputError('Kitob topilmadi. Savatchani yangilang');
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 100) throw new OrderInputError('Kitob soni noto‘g‘ri');
    if (!['buy', 'rent'].includes(item.type)) throw new OrderInputError('Kitob olish turi noto‘g‘ri');
    reserved.set(String(book._id), (reserved.get(String(book._id)) || 0) + item.quantity);
    if (book.stock < reserved.get(String(book._id))) throw new OrderInputError('Yetarli kitob mavjud emas');
    const rentDays = item.type === 'rent' ? item.rentDays : 0;
    if (item.type === 'rent' && (!book.isRentable || !Number.isInteger(rentDays) || rentDays < 1 || rentDays > 365)) throw new OrderInputError('Ijara muddati yoki kitob noto‘g‘ri');
    const price = item.type === 'rent' ? book.rentalPricePerDay * rentDays : book.price;
    if (!Number.isFinite(price) || price < 0) throw new OrderInputError('Kitob narxi noto‘g‘ri');
    return { book: book._id, title: book.title, author: book.author, image: book.images?.[0] || '', quantity: item.quantity, type: item.type, rentDays, price };
  });
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0) + deliveryFee(payload.deliveryMethod);
  return { customer: { name: payload.customer.name.trim(), phone: payload.customer.phone.trim(), address: payload.customer.address || '', ...location }, items, deliveryMethod: payload.deliveryMethod, paymentMethod, totalPrice };
}
export function cartItemTotal(item) {
  const unit = item.type === 'rent' ? Number(item.rentalPricePerDay ?? item.rentalPrice ?? 0) * Number(item.rentDays || 1) : Number(item.price || 0);
  return unit * Number(item.quantity || 1);
}
