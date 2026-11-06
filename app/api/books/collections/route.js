export const dynamic = "force-dynamic";
import { getCollections } from "@/lib/collections";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db.Connect";
import Book from "@/model/Book";

export async function GET() {
  try {
    await dbConnect();

    const collections = await getCollections();
    return NextResponse.json({ success: true, collections });

  } catch (error) {
    console.error("Collections API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
