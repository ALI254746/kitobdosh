import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db.Connect";
import User from "@/model/user";
import bcrypt from "bcryptjs";

export async function PUT(req, { params }) {
    try {
        await dbConnect();
        const { id } = params;
        const body = await req.json();
        const { fullName, email, phone, password } = body;

        const updateData = { fullName, email, phone };
        
        // Agar parol berilgan bo'lsa, uni ham yangilaymiz
        if (password && password.trim() !== "") {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedUser) {
             return NextResponse.json({ success: false, message: "Kuryer topilmadi" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Kuryer yangilandi" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await dbConnect();
        const { id } = params;
        
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
             return NextResponse.json({ success: false, message: "Kuryer topilmadi" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Kuryer o'chirildi" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
