import mongoose from "mongoose";
import { dbConnect } from "@/lib/db.Connect";
import redis from "@/lib/redis";
const lifetime = 30 * 24 * 60 * 60 * 1000;
async function collection() {
  await dbConnect();
  const carts = mongoose.connection.collection("carts");
  await carts.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  return carts;
}
export async function getCart(userId) {
  const carts = await collection();
  let cart = await carts.findOne({ _id: String(userId) });
  if (cart && cart.expiresAt > new Date()) return cart.items || [];
  let items = [];
  // Existing Redis carts are imported only before a MongoDB cart exists.
  if (!cart) {
    try { items = Object.values(await redis.hgetall("cart:" + userId)).map(item => JSON.parse(item)); } catch {}
  }
  const expiresAt = new Date(Date.now() + lifetime);
  if (cart) {
    await carts.updateOne({ _id: String(userId), expiresAt: { $lte: new Date() } }, { $set: { items: [], expiresAt } });
  } else {
    try { await carts.updateOne({ _id: String(userId) }, { $setOnInsert: { items, expiresAt } }, { upsert: true }); }
    catch (error) { if (error.code !== 11000) throw error; }
  }
  cart = await carts.findOne({ _id: String(userId) });
  return cart?.items || [];
}
export async function saveCartItem(userId, item) {
  const carts = await collection();
  await carts.updateOne({ _id: String(userId) }, [{
    $set: {
      items: { $concatArrays: [
        { $filter: { input: { $cond: [{ $gt: ["$expiresAt", new Date()] }, { $ifNull: ["$items", []] }, []] }, as: "entry", cond: { $ne: ["$$entry.cartId", { $literal: item.cartId }] } } },
        { $literal: [item] }
      ] },
      expiresAt: new Date(Date.now() + lifetime)
    }
  }], { upsert: true });
}
export async function removeCartItem(userId, cartId, clearAll) {
  const carts = await collection();
  if (clearAll) {
    await carts.updateOne({ _id: String(userId) }, { $set: { items: [], expiresAt: new Date(Date.now() + lifetime) } }, { upsert: true });
  } else {
    await carts.updateOne({ _id: String(userId) }, { $pull: { items: { cartId } }, $set: { expiresAt: new Date(Date.now() + lifetime) } });
  }
}
