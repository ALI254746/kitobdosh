import mongoose from "mongoose";

export function courierQueries(user) {
  const identities = [user.id, new mongoose.Types.ObjectId(user.id)];
  const owner = user.role === "admin" ? {} : { courierId: { $in: identities } };
  const visible = user.role === "admin" ? {} : { $or: [
    owner, { courierId: { $exists: false } }, { courierId: null }
  ] };
  return {
    rents: { $and: [visible, { $or: [
      { status: "approved", courierStatus: { $ne: "delivered" } },
      { ...owner, status: { $in: ["active", "returned", "late", "return_requested"] }, courierStatus: "delivered" }
    ] }] },
    orders: { $and: [visible, { $or: [
      { status: "processing", courierStatus: { $ne: "delivered" } },
      { ...owner, status: "completed", courierStatus: "delivered" }
    ] }] }
  };
}

export function courierPublicJob(job, user) {
  if (user.role === "admin" || String(job.courierId) === String(user.id)) return job;
  const { phone, address, lat, lng, ...publicFields } = job;
  return publicFields;
}
