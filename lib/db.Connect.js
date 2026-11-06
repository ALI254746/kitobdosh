import mongoose from "mongoose";

// Resolve configuration at request time so builds do not require database access.
const state = globalThis.__kitobdoshMongo || (globalThis.__kitobdoshMongo = { promise: null });
export async function dbConnect() {
  if (mongoose.connection.readyState === 1) return mongoose;
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI sozlanmagan");
  if (!state.promise) {
    state.promise = mongoose.connect(uri, {
      dbName: process.env.MONGO_DB_NAME || "feruza_book",
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      bufferCommands: false,
    }).catch(() => {
      state.promise = null;
      throw new Error("Ma’lumotlar bazasiga ulanib bo‘lmadi");
    });
  }
  return state.promise;
}
