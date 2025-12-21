import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db.Connect";
import Book from "@/model/Book";
import PromoBanner from "@/model/PromoBanner";
import { getOrSetCache } from "@/lib/utils/cache";

export const revalidate = 0; // Disable all Next.js caching for this route

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();

    // 1. BEST BOOKS
    const bestBooks = await getOrSetCache("best_books_home", async () => {
        return await Book.find({}).sort({ createdAt: -1 }).limit(10);
    }, 3600);

    // 2. POPULAR AUTHORS
    const authors = await getOrSetCache("popular_authors_aggr", async () => {
        const result = await Book.aggregate([
            {
                $group: {
                    _id: "$author",
                    bookCount: { $sum: 1 },
                    firstBookImage: { $first: { $arrayElemAt: ["$images", 0] } } 
                }
            },
            { $sort: { bookCount: -1 } },
            { $limit: 10 }
        ]);
        return result.map(item => ({
            name: item._id,
            books: item.bookCount,
            image: item.firstBookImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
        }));
    }, 86400);

    // 3. COLLECTIONS
    const collections = [
      {
        title: "Talabalar uchun",
        count: "24 ta kitob",
        desc: "Universitet talabalari uchun eng zarur kitoblar",
        color: "from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40",
        btn: "bg-blue-500",
        icon: "🎓",
        filter: "O'quv qo'llanma"
      },
      {
        title: "Bestsellerlar",
        count: "15 ta kitob",
        desc: "Hozirda eng ko'p o'qilayotgan durdonalar",
        color: "from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-800/40",
        btn: "bg-purple-500",
        icon: "🔥",
        filter: "Bestseller"
      },
      {
        title: "Adabiyot klasikalari",
        count: "32 ta kitob",
        desc: "Jahon va o'zbek adabiyotining eng yaxshi asarlari",
        color: "from-pink-50 to-pink-100 dark:from-pink-900/40 dark:to-pink-800/40",
        btn: "bg-pink-500",
        icon: "📖",
        filter: "Klassika"
      }
    ];

    // 4. RECOMMENDED BOOKS (Page 2 conceptually)
    const recommended = await getOrSetCache("recommended_home_p2", async () => {
        return await Book.find({}).sort({ createdAt: -1 }).skip(10).limit(6);
    }, 3600);

    // 5. PROMO BANNERS (Live from DB)
    const activeBanners = await PromoBanner.find({ isActive: true }).sort({ createdAt: -1 }).lean();
    console.log("HOME API - ACTIVE PROMOS:", activeBanners.map(b => ({ id: b._id, text: b.text, hasImage: !!b.image })));

    return NextResponse.json({
      success: true,
      data: {
        best: bestBooks,
        authors: authors,
        collections: collections,
        recommended: recommended,
        promos: activeBanners
      }
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });

  } catch (error) {
    console.error("Home Batch API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
