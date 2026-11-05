import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { authorize } from '@/lib/server-auth';
import { dbConnect } from '@/lib/db.Connect';
import { isObjectId } from '@/lib/catalog-input.mjs';

export const dynamic = 'force-dynamic';
const fail = (message, status = 400) => NextResponse.json({ success: false, message }, { status });
const clean = (v, max) => typeof v === 'string' ? v.trim().slice(0, max) : '';
const oid = v => isObjectId(v) ? new mongoose.Types.ObjectId(v) : null;
const same = (a, b) => String(a) === String(b);
class Conflict extends Error {}

export async function GET() {
  const access = await authorize(); if (access.response) return access.response;
  try {
    await dbConnect(); const db = mongoose.connection.db; const user = access.user.id;
    const books = db.collection('exchange_books'), offers = db.collection('exchange_offers');
    const ownOffers = await offers.find({ $or: [{ targetOwner: user }, { proposer: user }] }).sort({ createdAt: -1 }).limit(100).toArray();
    const related = ownOffers.flatMap(o => [o.targetId, o.offeredId]);
    const visible = await books.find({ $or: [{ status: 'available' }, { owner: user }, { _id: { $in: related } }] }).sort({ createdAt: -1 }).limit(200).toArray();
    const byId = new Map(visible.map(b => [String(b._id), b]));
    const safe = b => ({ id: String(b._id), title: b.title, author: b.author, condition: b.condition, description: b.description, status: b.status, mine: b.owner === user, exchangeCount: b.exchangeCount || 0, participantsCount: (b.participants || []).length, reviews: (b.reviews || []).map(r => ({ text: r.text, rating: r.rating })) });
    return NextResponse.json({ success: true, data: {
      books: visible.filter(b => b.status === 'available' || b.owner === user).map(safe),
      offers: ownOffers.map(o => {
        const target = byId.get(String(o.targetId)), offered = byId.get(String(o.offeredId));
        const isTargetOwner = o.targetOwner === user;
        return { id: String(o._id), status: o.status, incoming: isTargetOwner,
          target: target ? safe(target) : null, offered: offered ? safe(offered) : null,
          confirmed: isTargetOwner ? o.targetConfirmed : o.proposerConfirmed,
          otherConfirmed: isTargetOwner ? o.proposerConfirmed : o.targetConfirmed,
          contact: ['accepted', 'completed'].includes(o.status) ? (isTargetOwner ? o.proposerContact : o.targetContact) : undefined,
          reviewed: !!(isTargetOwner ? offered : target)?.reviews?.some(r => same(r.offerId, o._id) && r.user === user)
        };
      })
    } });
  } catch { return fail('Ma’lumotlarni yuklab bo‘lmadi', 503); }
}

export async function POST(req) {
  const access = await authorize(); if (access.response) return access.response;
  try {
    const body = await req.json(); await dbConnect();
    const db = mongoose.connection.db, books = db.collection('exchange_books'), offers = db.collection('exchange_offers'), user = access.user.id;
    if (body.action === 'create') {
      const title = clean(body.title, 120), author = clean(body.author, 120), condition = clean(body.condition, 80), description = clean(body.description, 500), contact = clean(body.contact, 150);
      if (!title || !author || !condition || contact.length < 3) return fail('Nom, muallif, holat va aloqa ma’lumotini kiriting');
      if (await books.countDocuments({ owner: user, status: { $in: ['available', 'reserved'] } }) >= 20) return fail('Ko‘pi bilan 20 ta faol kitob qo‘shish mumkin');
      await books.insertOne({ title, author, condition, description, contact, owner: user, status: 'available', exchangeCount: 0, participants: [], reviews: [], createdAt: new Date() });
    } else if (body.action === 'offer') {
      const targetId = oid(body.targetId), offeredId = oid(body.offeredId);
      if (!targetId || !offeredId || same(targetId, offeredId)) return fail('Kitoblarni tanlang');
      const offered = await books.findOne({ _id: offeredId, owner: user, status: 'available' });
      const target = await books.findOne({ _id: targetId, status: 'available', owner: { $ne: user } });
      if (!offered || !target) return fail('Kitoblardan biri mavjud emas', 409);
      // The guarded transaction prevents proposals against books reserved concurrently.
      const session = await mongoose.startSession();
      try { await session.withTransaction(async () => {
        for (const item of [{ id: targetId, owner: target.owner }, { id: offeredId, owner: user }].sort((a,b) => String(a.id).localeCompare(String(b.id)))) {
          if (!(await books.updateOne({ _id: item.id, owner: item.owner, status: 'available' }, { $inc: { version: 1 } }, { session })).matchedCount) throw new Conflict();
        }
        if (await offers.findOne({ targetId, offeredId, proposer: user, status: 'pending' }, { session })) throw new Conflict();
        await offers.insertOne({ targetId, offeredId, targetOwner: target.owner, proposer: user, status: 'pending', targetConfirmed: false, proposerConfirmed: false, createdAt: new Date() }, { session });
      }); } finally { await session.endSession(); }
    } else if (body.action === 'review') {
      const offerId = oid(body.offerId), text = clean(body.text, 500), rating = Number(body.rating);
      if (!offerId || text.length < 3 || !Number.isInteger(rating) || rating < 1 || rating > 5) return fail('Sharh va 1–5 bahoni kiriting');
      const offer = await offers.findOne({ _id: offerId, status: 'completed', $or: [{ targetOwner: user }, { proposer: user }] });
      if (!offer) return fail('Faqat yakunlangan almashuvdan keyin sharh yozish mumkin', 403);
      const received = offer.targetOwner === user ? offer.offeredId : offer.targetId;
      const result = await books.updateOne({ _id: received, reviews: { $not: { $elemMatch: { offerId, user } } } }, { $push: { reviews: { offerId, user, text, rating, createdAt: new Date() } } });
      if (!result.modifiedCount) return fail('Sharh allaqachon yozilgan', 409);
    } else return fail('Noma’lum amal');
    return NextResponse.json({ success: true });
  } catch (error) { return error instanceof Conflict ? fail('Holat o‘zgardi yoki taklif allaqachon yuborilgan. Sahifani yangilang.', 409) : fail('Amalni bajarib bo‘lmadi', 503); }
}

export async function PATCH(req) {
  const access = await authorize(); if (access.response) return access.response;
  let session;
  try {
    const body = await req.json(), id = oid(body.id), user = access.user.id;
    if (!id || !['accept', 'reject', 'cancel', 'confirm', 'withdraw', 'relist'].includes(body.action)) return fail('Amal noto‘g‘ri');
    await dbConnect(); const db = mongoose.connection.db, books = db.collection('exchange_books'), offers = db.collection('exchange_offers');
    session = await mongoose.startSession();
    await session.withTransaction(async () => {
      if (['withdraw','relist'].includes(body.action)) {
        const from = body.action === 'withdraw' ? ['available'] : ['exchanged', 'withdrawn'];
        const contact = clean(body.contact, 150);
        if (body.action === 'relist' && contact.length < 3) throw new Conflict();
        const changes = body.action === 'withdraw' ? { status: 'withdrawn' } : { status: 'available', contact };
        if (!(await books.updateOne({ _id: id, owner: user, status: { $in: from } }, { $set: changes }, { session })).modifiedCount) throw new Conflict();
        if (body.action === 'withdraw') await offers.updateMany({ status: 'pending', $or: [{ targetId: id }, { offeredId: id }] }, { $set: { status: 'rejected' } }, { session });
        return;
      }
      const offer = await offers.findOne({ _id: id }, { session });
      if (!offer || ![offer.targetOwner, offer.proposer].includes(user)) throw new Conflict();
      if (body.action === 'reject') {
        if (offer.targetOwner !== user || offer.status !== 'pending') throw new Conflict();
        if (!(await offers.updateOne({ _id: id, status: 'pending' }, { $set: { status: 'rejected' } }, { session })).modifiedCount) throw new Conflict();
      } else if (body.action === 'cancel') {
        if (offer.status !== 'accepted') throw new Conflict();
        for (const item of [{ id: offer.targetId, owner: offer.targetOwner }, { id: offer.offeredId, owner: offer.proposer }].sort((a,b) => String(a.id).localeCompare(String(b.id)))) {
          if (!(await books.updateOne({ _id: item.id, owner: item.owner, status: 'reserved' }, { $set: { status: 'available' } }, { session })).modifiedCount) throw new Conflict();
        }
        if (!(await offers.updateOne({ _id: id, status: 'accepted' }, { $set: { status: 'cancelled' } }, { session })).modifiedCount) throw new Conflict();
      } else if (body.action === 'accept') {
        if (offer.targetOwner !== user || offer.status !== 'pending') throw new Conflict();
        const items = [{ id: offer.targetId, owner: offer.targetOwner }, { id: offer.offeredId, owner: offer.proposer }].sort((a,b) => String(a.id).localeCompare(String(b.id)));
        const targetBook = await books.findOne({ _id: offer.targetId }, { session });
        const offeredBook = await books.findOne({ _id: offer.offeredId }, { session });
        if (!targetBook || !offeredBook) throw new Conflict();
        for (const item of items) if (!(await books.updateOne({ _id: item.id, owner: item.owner, status: 'available' }, { $set: { status: 'reserved' } }, { session })).modifiedCount) throw new Conflict();
        if (!(await offers.updateOne({ _id: id, status: 'pending' }, { $set: { status: 'accepted', targetContact: targetBook.contact, proposerContact: offeredBook.contact } }, { session })).modifiedCount) throw new Conflict();
        await offers.updateMany({ _id: { $ne: id }, status: 'pending', $or: [{ targetId: { $in: [offer.targetId, offer.offeredId] } }, { offeredId: { $in: [offer.targetId, offer.offeredId] } }] }, { $set: { status: 'rejected' } }, { session });
      } else {
        if (offer.status !== 'accepted') throw new Conflict();
        const field = offer.targetOwner === user ? 'targetConfirmed' : 'proposerConfirmed';
        const result = await offers.findOneAndUpdate({ _id: id, status: 'accepted', [field]: false }, { $set: { [field]: true } }, { returnDocument: 'after', session });
        if (!result) throw new Conflict();
        if (result.targetConfirmed && result.proposerConfirmed) {
          for (const item of [{ id: offer.targetId, from: offer.targetOwner, to: offer.proposer }, { id: offer.offeredId, from: offer.proposer, to: offer.targetOwner }].sort((a,b) => String(a.id).localeCompare(String(b.id)))) {
            if (!(await books.updateOne({ _id: item.id, owner: item.from, status: 'reserved' }, { $set: { owner: item.to, status: 'exchanged', contact: '' }, $inc: { exchangeCount: 1 }, $addToSet: { participants: { $each: [item.from, item.to] } } }, { session })).modifiedCount) throw new Conflict();
          }
          await offers.updateOne({ _id: id, status: 'accepted' }, { $set: { status: 'completed', completedAt: new Date() } }, { session });
        }
      }
    });
    return NextResponse.json({ success: true });
  } catch (error) { return error instanceof Conflict ? fail('Amalga ruxsat yo‘q yoki holat o‘zgargan. Sahifani yangilang.', 409) : fail('Amalni bajarib bo‘lmadi', 503); }
  finally { if (session) await session.endSession(); }
}
