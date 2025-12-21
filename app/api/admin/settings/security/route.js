import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db.Connect";
import User from "@/model/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import bcrypt from "bcryptjs";

export async function PUT(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ success: false, message: "Ruxsat berilmagan" }, { status: 401 });
        }

        const { currentPassword, newPassword } = await req.json();
        
        await dbConnect();
        const admin = await User.findById(session.user.id);
        
        if (!admin) {
            return NextResponse.json({ success: false, message: "Admin topilmadi" }, { status: 404 });
        }

        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) {
            return NextResponse.json({ success: false, message: "Hozirgi parol noto'g'ri" }, { status: 400 });
        }

        admin.password = await bcrypt.hash(newPassword, 10);
        await admin.save();

        return NextResponse.json({ success: true, message: "Parol muvaffaqiyatli o'zgartirildi" });

    } catch (error) {
        console.error("Security Update Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
