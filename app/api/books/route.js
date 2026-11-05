import { requireRole } from "@/lib/require-role";
import { escapeSearch, positiveInt } from "@/lib/catalog-input.mjs";
import { dbConnect } from "@/lib/db.Connect";
import Book from "@/model/Book";
import { NextResponse } from "next/server";
import { getOrSetCache, clearCachePattern, clearCache } from "@/lib/utils/cache";

// 1. BARCHA KITOBLARNI OLISH (GET)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = positiveInt(searchParams.get("page"), 1, 10000);
    const limit = positiveInt(searchParams.get("limit"), 16, 100);
    const skip = (page - 1) * limit;
    
    // Filters
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const type = searchParams.get("type"); // 'rent' or 'sale'
    
    await dbConnect();

    // Build Query
    const query = {};
    if (category && category !== "Barchasi") query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: escapeSearch(search), $options: "i" } },
        { author: { $regex: escapeSearch(search), $options: "i" } }
      ];
    }
    if (type === 'rent') query.isRentable = true;
    if (type === 'sale') query.stock = { $gt: 0 };

    // Unique Cache Key based on filters
    const cacheKey = `books_${page}_${limit}_${category || 'all'}_${search || 'none'}_${type || 'all'}`;

    const result = await getOrSetCache(cacheKey, async () => {
        const totalItems = await Book.countDocuments(query);
        const books = await Book.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit);
        
        return {
          data: books,
          totalItems,
          totalPages: Math.ceil(totalItems / limit),
          currentPage: page
        };
    }, 300); // 5 minutes cache

    return NextResponse.json({ success: true, ...result }, { status: 200 });
  } catch (error) {
    console.error("GET Books error:", error);
    return NextResponse.json({ success: false, message: "Server xatosi: " + error.message }, { status: 500 });
  }
}

// 2. YANGI KITOB YARATISH (POST) - Faqat Admin uchun
export async function POST(req) {
  const denied = await requireRole();
  if (denied) return denied;
  try {
    const body = await req.json();
    await dbConnect();

    // Ma'lumotlarni tekshirish (Validation)
    if (!body.title || body.price == null || !body.author || !body.category) {
       return NextResponse.json(
         { success: false, message: "Iltimos, barcha majburiy maydonlarni to'ldiring!" },
         { status: 400 }
       );
    }

    // Kitobni bazaga saqlash
    const newBook = await Book.create({ ...body, averageRating: 0, numReviews: 0 });

    // Muvaffaqiyatli qo'shildimi? Unda barcha kitob keshlarini o'chiramiz!
    await clearCachePattern('books_*');
    await Promise.all(['best_books_home', 'recommended_home_p2', 'popular_authors_aggr'].map(clearCache));

    return NextResponse.json(
      { success: true, message: "Kitob muvaffaqiyatli qo'shildi!", data: newBook },
      { status: 201 }
    );

  } catch (error) {
    console.error("Kitob qo'shishda xatolik:", error);
    return NextResponse.json(
      { success: false, message: error.name === "ValidationError" ? "Kitob maydonlari noto‘g‘ri yoki to‘liq emas" : "Kitobni saqlab bo‘lmadi" },
      { status: error.name === "ValidationError" ? 400 : 500 }
    );
  }
}
