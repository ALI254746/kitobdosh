import mongoose from 'mongoose';
import Book from '@/model/Book';
import Order from '@/model/Order';
import Rent from '@/model/Rent';
import { prepareOrder, OrderInputError } from '@/lib/order-input.mjs';
import { isObjectId } from '@/lib/catalog-input.mjs';
export async function createOrder(payload, userId, document) {
  if (!Array.isArray(payload.items) || !payload.items.length || payload.items.some(i => !isObjectId(i.book))) throw new OrderInputError('Savatchadagi kitoblar noto‘g‘ri');
  const session = await mongoose.startSession(); let order;
  try { await session.withTransaction(async () => {
    const books = await Book.find({ _id: { $in: payload.items.map(i => i.book) } }).session(session).lean();
    const data = prepareOrder(payload, books);
    const hasRent = data.items.some(i => i.type === 'rent');
    if (hasRent && (!document || !data.customer.address?.trim())) throw new OrderInputError('Ijara uchun hujjat rasmi va manzil zarur');
    order = new Order({ ...data, user: userId });
    const rentals = data.items.filter(i => i.type === 'rent').map(item => new Rent({
      user: userId, orderId: order._id, book: item.book, bookTitle: item.title, bookImage: item.image,
      fullName: data.customer.name, phone: data.customer.phone, address: data.customer.address,
      lat: data.customer.lat, lng: data.customer.lng, days: item.rentDays, quantity: item.quantity,
      totalPrice: item.price * item.quantity, paymentMethod: data.paymentMethod,
      passportCloudinaryId: document?.publicId, passportFormat: document?.format, status: 'pending'
    }));
    await order.validate(); await Promise.all(rentals.map(r => r.validate()));
    const quantities = new Map(); for (const item of data.items) quantities.set(String(item.book), (quantities.get(String(item.book)) || 0) + item.quantity);
    for (const [book, quantity] of quantities) {
      if (!await Book.findOneAndUpdate({ _id: book, stock: { $gte: quantity } }, { $inc: { stock: -quantity } }, { session })) throw new OrderInputError('Yetarli kitob mavjud emas');
    }
    await order.save({ session });
    for (const rent of rentals) await rent.save({ session });
  }); return order; } finally { await session.endSession(); }
}
