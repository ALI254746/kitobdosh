import { dbConnect } from "@/lib/db.Connect";
import Book from "@/model/Book";
import { NextResponse } from "next/server";
import { getOrSetCache } from "@/lib/utils/cache";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();

    const CACHE_KEY = "popular_authors_aggr";
    
    // Bu og'ir so'rov (Aggregation), shuning uchun buni uzoq vaqt (24 soat) keshlaymiz
    const authors = await getOrSetCache(CACHE_KEY, async () => {
        const result = await Book.aggregate([
            {
                $group: {
                    _id: "$author",
                    bookCount: { $sum: 1 },
                    // Rasmini olish qiyin chunki Author modeli yo'q. 
                    // Shunchaki birinchi topilgan kitobning rasmini olamiz yoki LoremPicsum
                    firstBookImage: { $first: { $arrayElemAt: ["$images", 0] } } 
                }
            },
            { $sort: { bookCount: -1 } },
            { $limit: 10 }
        ]);

        // Formatlash
        return result.map(item => ({
            name: item._id,
            books: item.bookCount,
            image: item.firstBookImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" // Fallback image
        }));

    }, 86400); // 24 soat (86400 sekund)

    return NextResponse.json({ success: true, data: authors });
  } catch (error) {
    console.error("Popular Authors Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
