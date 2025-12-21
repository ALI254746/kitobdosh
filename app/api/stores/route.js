import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db.Connect";
import Store from "@/model/Store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    const stores = await Store.find({ isActive: true }).sort({ order: 1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: stores,
    });
  } catch (error) {
    console.error("STORES GET ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Do'konlarni yuklashda xatolik" },
      { status: 500 }
    );
  }
}
