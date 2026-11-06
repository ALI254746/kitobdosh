import mongoose from "mongoose";
import { createHash } from "node:crypto";

export async function registrationRateLimit(req, email) {
  const counters = mongoose.connection.collection("registration_rate_limits");
  // TTL only removes old counters; the window in the key enforces expiry.
  await counters.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  const windowMs = 15 * 60 * 1000;
  const window = Math.floor(Date.now() / windowMs);
  const ip = req.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    req.ip || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  for (const [kind, value, limit] of [["email", email, 3], ["ip", ip, 10]]) {
    const hash = createHash("sha256").update(value).digest("hex");
    const _id = kind + ":" + hash + ":" + window;
    const counter = await counters.findOneAndUpdate(
      { _id },
      { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((window + 2) * windowMs) } },
      { upsert: true, returnDocument: "after", includeResultMetadata: false }
    );
    if (counter.count > limit) return false;
  }
  return true;
}
