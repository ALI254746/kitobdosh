import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db.Connect";
import User from "@/model/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import bcrypt from "bcryptjs";

// Helper to check admin
async function getAdmin() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') return null;
    await dbConnect();
    return await User.findById(session.user.id);
}

export async function GET() {
    try {
        const admin = await getAdmin();
        if (!admin) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        
        return NextResponse.json({ success: true, data: admin });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const admin = await getAdmin();
        if (!admin) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        const data = await req.json();
        
        // Handle Profile Update
        if (data.type === 'profile') {
            admin.fullName = data.fullName || admin.fullName;
            admin.phone = data.phone || admin.phone;
            admin.avatar = data.avatar || admin.avatar;
            if (data.settings) {
                admin.settings = { ...admin.settings, ...data.settings };
            }
        }

        // Handle Password Update
        if (data.type === 'security') {
            const { currentPassword, newPassword } = data;
            const isMatch = await bcrypt.compare(currentPassword, admin.password);
            if (!isMatch) return NextResponse.json({ success: false, message: "Hozirgi parol noto'g'ri" }, { status: 400 });
            
            admin.password = await bcrypt.hash(newPassword, 10);
        }

        await admin.save();
        return NextResponse.json({ success: true, message: "Saqlandi" });

    } catch (error) {
        console.error("Admin Settings Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
