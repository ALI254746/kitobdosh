export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db.Connect";
import Book from "@/model/Book";
import User from "@/model/user";
import Order from "@/model/Order";
import Rent from "@/model/Rent";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json({ success: true, results: { books: [], users: [], couriers: [], orders: [] } });
    }

    await dbConnect();

    const regex = new RegExp(query, "i");

    // 1. Kitoblarni qidirish
    const books = await Book.find({
      $or: [
        { title: regex },
        { author: regex },
        { category: regex }
      ]
    }).limit(5).select("title author images category price");

    // 2. Foydalanuvchilarni qidirish (User role)
    const users = await User.find({
      role: 'user',
      $or: [
        { fullName: regex },
        { email: regex }
      ]
    }).limit(5).select("fullName email avatar");

    // 3. Kuryerlarni qidirish
    const couriers = await User.find({
      role: { $in: ['kurier', 'kurer', 'courier'] },
      $or: [
        { fullName: regex },
        { email: regex }
      ]
    }).limit(5).select("fullName email avatar role");

    // 4. Buyurtmalarni qidirish (Order va Rent)
    // ID bo'yicha qidirish uchun so'nggi 6 raqamni tekshirish murakkab, shuning uchun regex bilan mijoz ismini tekshiramiz
    const orders = await Order.find({
      $or: [
        { "customer.name": regex },
        { "customer.phone": regex },
        { "_id": query.length === 24 ? query : { $exists: true } } // Agar to'liq ID bo'lsa
      ]
    }).limit(5).select("customer.name totalPrice status createdAt");

    const rents = await Rent.find({
      $or: [
        { fullName: regex },
        { phone: regex },
        { bookTitle: regex }
      ]
    }).limit(5).select("fullName bookTitle status totalPrice createdAt");

    // Buyurtmalarni birlashtiramiz
    const allOrders = [
        ...orders.map(o => ({ ...o._doc, type: 'order' })),
        ...rents.map(r => ({ ...r._doc, type: 'rent' }))
    ].slice(0, 5);

    return NextResponse.json({
      success: true,
      results: {
        books,
        users,
        couriers,
        orders: allOrders
      }
    });

  } catch (error) {
    console.error("Global Search API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
