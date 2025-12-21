import { dbConnect } from "@/lib/db.Connect";
import PromoBanner from "@/model/PromoBanner";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// GET: Mashhur bannerlarni olish
export async function GET() {
    try {
        await dbConnect();
        const banners = await PromoBanner.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: banners });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST: Yangi banner qo'shish yoki mavjudini yangilash
export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();
        
        // Agar id bo'lsa yangilaymiz, bo'lmasa yangi yaratamiz
        let banner;
        if (body._id) {
            banner = await PromoBanner.findByIdAndUpdate(body._id, {
                ...body,
                updatedBy: session.user.id
            }, { new: true });
        } else {
            banner = await PromoBanner.create({
                ...body,
                updatedBy: session.user.id
            });
        }

        return NextResponse.json({ success: true, data: banner });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE: Bannerni o'chirish
export async function DELETE(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        await dbConnect();
        await PromoBanner.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: "Banner o'chirildi" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
