import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db.Connect";
import ContactMessage from "@/model/ContactMessage";
import Notification from "@/model/Notification"; // Import Notification model
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// Helper to get User ID
async function getUserId() {
    // 1. Check Custom Token
    const cookieStore = await cookies();
    const token = cookieStore.get("kitobdosh_token")?.value;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return decoded.userId;
        } catch (e) {}
    }

    // 2. Check NextAuth Session
    const session = await getServerSession(authOptions);
    if (session?.user?.id) return session.user.id;

    return null;
}

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    
    // Check if it's a REPLY action (Admin replying to user)
    // We can distinguish by a specific flag or separate endpoint, but keeping it simple here:
    // If 'replyToMessageId' and 'replyText' are present, handle as reply.
    if (data.action === 'reply') {
        const { messageId, replyText, userId } = data;
        
        if (!userId) {
             // If guest user, we can't send notification to profile. 
             // Ideally we send email, but user requested "user bildirish nomasiga".
             return NextResponse.json({ success: false, message: "Foydalanuvchi tizimda ro'yxatdan o'tmagan, unga bildirishnoma yuborib bo'lmaydi." }, { status: 400 });
        }

        // Create Notification
        await Notification.create({
            user: userId,
            title: "Murojaatingizga javob",
            message: replyText,
            type: "info",
            isRead: false
        });

        // Update Message Status
        await ContactMessage.findByIdAndUpdate(messageId, { status: "replied" });

        return NextResponse.json({ success: true, message: "Javob yuborildi" });
    }

    // --- NORMAL CONTACT MESSAGE CREATION ---
    // Basic validation
    if (!data.name || !data.phone || !data.message) {
        return NextResponse.json({ success: false, message: "Majburiy maydonlarni to'ldiring" }, { status: 400 });
    }

    const userId = await getUserId(); // Try to attach current logged in user

    const newMessage = new ContactMessage({
        ...data,
        user: userId || null // Save user ID if available
    });
    await newMessage.save();

    return NextResponse.json({ success: true, message: "Xabar yuborildi", data: newMessage });

  } catch (error) {
    console.error("Contact API POST Error:", error);
    return NextResponse.json({ success: false, message: "Serverda xatolik" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await dbConnect();
    // Populate user if needed, or just fetch basic data
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    console.error("Contact API GET Error:", error);
    return NextResponse.json({ success: false, message: "Serverda xatolik" }, { status: 500 });
  }
}

export async function PUT(req) {
    try {
        await dbConnect();
        const { id, updates } = await req.json();
        
        if (!id) return NextResponse.json({ success: false, message: "ID topilmadi" }, { status: 400 });

        const updatedMessage = await ContactMessage.findByIdAndUpdate(id, updates, { new: true });
        
        return NextResponse.json({ success: true, data: updatedMessage });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        await dbConnect();
        const { id } = await req.json();
        await ContactMessage.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: "O'chirildi" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
