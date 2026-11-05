import { requireRole } from "@/lib/require-role";
import { isObjectId } from "@/lib/catalog-input.mjs";
import { clearCachePattern, clearCache } from "@/lib/utils/cache";
async function invalidateBooks() {
 await clearCachePattern("books_*");
 await Promise.all(["best_books_home", "recommended_home_p2", "popular_authors_aggr"].map(clearCache));
}
import { dbConnect } from "@/lib/db.Connect";
import Book from "@/model/Book";
import { NextResponse } from "next/server";

// 1. ANIQ BITTA KITOBNI OLISH (GET), O'CHIRISH (DELETE) va TAHRIRLASH (PUT)
export async function GET(req, { params }) {
  if (!isObjectId(params.id)) return NextResponse.json({ success: false, message: "Kitob manzili noto‘g‘ri" }, { status: 400 });
  try {
    await dbConnect();
    const { id } = params;
    const book = await Book.findById(id);

    if (!book) {
      return NextResponse.json({ success: false, message: "Kitob topilmadi!" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: book }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server xatosi: " + error.message }, { status: error.name === "ValidationError" ? 400 : 500 });
  }
}

export async function PUT(req, { params }) {
  const denied = await requireRole();
  if (denied) return denied;
  if (!isObjectId(params.id)) return NextResponse.json({ success: false, message: "Kitob manzili noto‘g‘ri" }, { status: 400 });
  try {
    const { id } = params;
    const body = await req.json();
    await dbConnect();

    const updatedBook = await Book.findByIdAndUpdate(id, body, {
      new: true, // Yangilangan ma'lumotni qaytarish
      runValidators: true, // Model validationni ishlatish
    });

    if (!updatedBook) {
      return NextResponse.json({ success: false, message: "Kitob topilmadi!" }, { status: 404 });
    }

    await invalidateBooks();
    return NextResponse.json({ success: true, message: "Kitob yangilandi!", data: updatedBook }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Xatolik: " + error.message }, { status: error.name === "ValidationError" ? 400 : 500 });
  }
}

export async function DELETE(req, { params }) {
  const denied = await requireRole();
  if (denied) return denied;
  if (!isObjectId(params.id)) return NextResponse.json({ success: false, message: "Kitob manzili noto‘g‘ri" }, { status: 400 });
  try {
    const { id } = params;
    await dbConnect();

    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return NextResponse.json({ success: false, message: "Kitob topilmadi!" }, { status: 404 });
    }

    await invalidateBooks();
    return NextResponse.json({ success: true, message: "Kitob o'chirildi!" }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Xatolik: " + error.message }, { status: error.name === "ValidationError" ? 400 : 500 });
  }
}
