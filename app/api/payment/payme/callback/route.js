import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import mongoose from 'mongoose';
import { dbConnect } from '@/lib/db.Connect';
import Order from '@/model/Order';
import Rent from '@/model/Rent';
import Transaction from '@/model/PaymentTransaction';
import { isObjectId } from '@/lib/catalog-input.mjs';
class RpcError extends Error { constructor(code, message) { super(message); this.code = code; } }
const fail = (code, message) => { throw new RpcError(code, message); };
const result = tx => ({ transaction: String(tx._id), create_time: tx.createTime, perform_time: tx.performTime, cancel_time: tx.cancelTime, state: tx.state, reason: tx.reason });
const validId = id => typeof id === 'string' && /^[a-zA-Z0-9_-]{1,64}$/.test(id);
async function target(id, session) {
  if (!isObjectId(id)) fail(-31050, 'Buyurtma topilmadi');
  const order = await Order.findById(id).session(session);
  if (order) return { doc: order, model: 'Order' };
  const rent = await Rent.findById(id).session(session);
  if (!rent) fail(-31050, 'Buyurtma topilmadi');
  return { doc: rent, model: 'Rent' };
}
export async function POST(req) {
  const key = process.env.PAYME_SECRET_KEY;
  const expected = Buffer.from(`Basic ${Buffer.from(`${process.env.PAYME_LOGIN || 'Paycom'}:${key || ''}`).toString('base64')}`);
  const supplied = Buffer.from(req.headers.get('authorization') || '');
  if (!key || expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) return NextResponse.json({ error: { code: -32504, message: 'Avtorizatsiya xatosi' } }, { status: 401 });
  // Live payments remain closed until provider sandbox certification is completed.
  if (process.env.PAYME_MODE !== 'sandbox') return NextResponse.json({ error: { code: -32400, message: 'To‘lov xizmati hozircha yopiq' } }, { status: 503 });
  let id = null;
  try {
    const body = await req.json(); id = body.id ?? null;
    const { method, params: p } = body;
    if (!p || typeof p !== 'object') fail(-32600, 'So‘rov noto‘g‘ri');
    await dbConnect();
    await Transaction.init();
    const session = await mongoose.startSession();
    let answer;
    try { await session.withTransaction(async () => {
      if (['CheckPerformTransaction', 'CreateTransaction'].includes(method)) {
        const { doc, model } = await target(p.account?.order_id, session);
        if (!Number.isSafeInteger(p.amount) || p.amount <= 0 || p.amount !== Math.round(doc.totalPrice * 100)) fail(-31001, 'Summa noto‘g‘ri');
        if (doc.paymentMethod !== 'payme' || ['cancelled', 'rejected', 'completed', 'returned'].includes(doc.status)) fail(-31008, 'To‘lov mumkin emas');
        if (method === 'CheckPerformTransaction') {
          if (doc.paymentStatus === 'paid') fail(-31008, 'Buyurtma to‘langan');
          answer = { allow: true }; return;
        }
        if (!validId(p.id) || !Number.isSafeInteger(p.time) || p.time <= 0 || p.time > Date.now() + 60000) fail(-32600, 'Tranzaksiya noto‘g‘ri');
        if (Date.now() - p.time > 43200000) fail(-31008, 'Tranzaksiya muddati tugagan');
        let tx = await Transaction.findOne({ providerId: p.id }).session(session);
        if (tx) {
          if (String(tx.target) !== String(doc._id) || tx.targetModel !== model || tx.amount !== p.amount || tx.providerTime !== p.time || tx.state !== 1) fail(-31008, 'Tranzaksiya mos emas');
          answer = result(tx); return;
        }
        if (doc.paymentStatus === 'paid' || await Transaction.exists({ target: doc._id, targetModel: model, state: { $gte: 1 } }).session(session)) fail(-31008, 'Faol tranzaksiya mavjud');
        [tx] = await Transaction.create([{ providerId: p.id, target: doc._id, targetModel: model, amount: p.amount, providerTime: p.time, createTime: Date.now(), state: 1 }], { session });
        answer = result(tx); return;
      }
      if (!['PerformTransaction', 'CancelTransaction', 'CheckTransaction'].includes(method)) fail(-32601, 'Metod topilmadi');
      if (!validId(p.id)) fail(-32600, 'Tranzaksiya ID noto‘g‘ri');
      const tx = await Transaction.findOne({ providerId: p.id }).session(session);
      if (!tx) fail(-31003, 'Tranzaksiya topilmadi');
      const Model = tx.targetModel === 'Order' ? Order : Rent;
      const doc = await Model.findById(tx.target).session(session);
      if (!doc) fail(-31050, 'Buyurtma topilmadi');
      if (method === 'CheckTransaction') { answer = result(tx); return; }
      if (method === 'PerformTransaction') {
        if (tx.state === 2) { answer = result(tx); return; }
        if (tx.state !== 1) fail(-31008, 'Tranzaksiya bekor qilingan');
        if (Date.now() - tx.providerTime > 43200000) {
          fail(-31008, 'Tranzaksiya muddati tugagan');
        }
        if (tx.amount !== Math.round(doc.totalPrice * 100) || doc.paymentStatus === 'paid' || ['cancelled', 'rejected', 'completed', 'returned'].includes(doc.status)) fail(-31008, 'Buyurtma holati mos emas');
        tx.state = 2; tx.performTime = Date.now(); doc.paymentStatus = 'paid';
        // Payment does not imply administrative approval, especially for rental records.
        await doc.save({ session }); await tx.save({ session }); answer = result(tx); return;
      }
      if (![1, 2, 3, 4, 5, 10].includes(p.reason)) fail(-32600, 'Bekor qilish sababi noto‘g‘ri');
      if (tx.state < 0) { answer = result(tx); return; }
      if (['completed', 'active', 'returned'].includes(doc.status)) fail(-31007, 'Xizmat bajarilgan');
      const wasPaid = tx.state === 2; tx.state = wasPaid ? -2 : -1; tx.cancelTime = Date.now(); tx.reason = p.reason;
      doc.paymentStatus = wasPaid ? 'refunded' : 'failed';
      await doc.save({ session }); await tx.save({ session }); answer = result(tx);
    }); } finally { await session.endSession(); }
    return NextResponse.json({ id, result: answer });
  } catch (error) {
    const code = error instanceof RpcError ? error.code : error.code === 11000 ? -31008 : -32400;
    return NextResponse.json({ id, error: { code, message: error instanceof RpcError ? error.message : 'Tranzaksiyani bajarib bo‘lmadi' } });
  }
}
