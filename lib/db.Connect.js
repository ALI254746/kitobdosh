// 📁 lib/db.Connect.js
import mongoose from "mongoose";

let isConnected = false; // Ulanish bir marta bo‘lishi uchun

export const dbConnect = async () => {
  const MONGODB_URI = process.env.MONGO_URI;

  if (!MONGODB_URI) {
    throw new Error("❌ MONGO_URI environment o‘zgaruvchisi topilmadi");
  }

  if (isConnected) return;

  try {
    const { connection } = await mongoose.connect(MONGODB_URI, {
      dbName: "feruza_book",

      connectTimeoutMS: 10000, // 10 soniya ichida javob bo‘lmasa xato beradi
    });

    isConnected = connection.readyState === 1;
    console.log("✅ MongoDB ulandi:", connection.host);
  } catch (err) {
    console.error("❌ MongoDB ulanishda xato:", err);
    throw new Error("MongoDB bilan bog‘lanib bo‘lmadi");
  }
};
