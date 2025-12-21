import { dbConnect } from "@/lib/db.Connect";
import Book from "@/model/Book";
import { NextResponse } from "next/server";

// 1. ANIQ BITTA KITOBNI OLISH (GET), O'CHIRISH (DELETE) va TAHRIRLASH (PUT)
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const book = await Book.findById(id);

    if (!book) {
      return NextResponse.json({ success: false, message: "Kitob topilmadi!" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: book }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server xatosi: " + error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
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

    return NextResponse.json({ success: true, message: "Kitob yangilandi!", data: updatedBook }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Xatolik: " + error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    await dbConnect();

    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return NextResponse.json({ success: false, message: "Kitob topilmadi!" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Kitob o'chirildi!" }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Xatolik: " + error.message }, { status: 500 });
  }
}
