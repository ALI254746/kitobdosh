import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db.Connect";
import Book from "@/model/Book";

export async function GET() {
  try {
    await dbConnect();

    // Grouping logic: For now we can use categories or a specific field.
    // Let's get distinct categories or popular ones.
    const categories = await Book.distinct("category");
    
    // We could also have "featured collections"
    const staticCollections = [
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

    // For now returning static with real counts if possible, but keeping it simple
    return NextResponse.json({ success: true, collections: staticCollections });

  } catch (error) {
    console.error("Collections API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
