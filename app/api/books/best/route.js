import { dbConnect } from "@/lib/db.Connect";
import Book from "@/model/Book";
import { NextResponse } from "next/server";
import { getOrSetCache } from "@/lib/utils/cache";

export const dynamic = 'force-dynamic'; // Cache bo'lsa ham Next.js ni dynamic qilib qo'yish kerak

export async function GET() {
  try {
    await dbConnect();

    const CACHE_KEY = "best_books_home";
    
    const books = await getOrSetCache(CACHE_KEY, async () => {
        // Hozircha "Bestseller" logikasi yo'q bo'lgani uchun,
        // shunchaki random yoki oxirgi qo'shilgan 5 ta kitobni olamiz.
        // Kelajakda: .sort({ viewCount: -1 }) bo'lishi mumkin.
        return await Book.find({}).sort({ createdAt: -1 }).limit(10);
    }, 3600); // 1 soat cache

    return NextResponse.json({ success: true, data: books });
  } catch (error) {
    console.error("Best Books Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
