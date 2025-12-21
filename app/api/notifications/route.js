import { NextResponse } from "next/server";
import { dbConnect } from "../../../lib/db.Connect";
import Notification from "../../../model/Notification";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { pusherServer } from "@/lib/pusher";

export async function GET(req) {
  try {
    await dbConnect();
    
    // 1. Auth Check: Try NextAuth Session First
    const session = await getServerSession(authOptions);
    let userId = session?.user?.id;

    // 2. Fallback: Check Custom Token (if no session)
    if (!userId) {
        const cookieStore = await cookies();
        const token = cookieStore.get("kitobdosh_token")?.value;
        
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.userId;
            } catch (e) {
                console.error("Invalid Custom Token:", e.message);
            }
        }
    }

    if (!userId) {
         return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    
    // Count unread
    const unreadCount = notifications.filter(n => !n.isRead).length;

    return NextResponse.json({ success: true, data: notifications, unread: unreadCount });

  } catch (error) {
    console.error("Notif API Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

export async function PUT(req) {
    try {
        await dbConnect();
        // Mark all as read for the user (simple approach) or specific ID
        const { id } = await req.json(); // If ID provided, mark one. If not, mark all.
        
        // 1. Auth Check: Session
        const session = await getServerSession(authOptions);
        let userId = session?.user?.id;

        // 2. Fallback: Token
        if (!userId) {
            const cookieStore = await cookies();
            const token = cookieStore.get("kitobdosh_token")?.value;
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.userId;
            }
        }

        if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        if (id) {
            await Notification.findByIdAndUpdate(id, { isRead: true });
        } else {
            await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
export async function POST(req) {
    try {
        await dbConnect();
        const { userId, title, message, type } = await req.json();

        if (!userId || !title || !message) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const newNotif = await Notification.create({
            user: userId,
            title,
            message,
            type: type || 'info'
        });

        // Trigger Real-time Event via Pusher
        try {
            await pusherServer.trigger(`user-${userId}`, "notification-new", {
                id: newNotif._id,
                title: title,
                message: message,
                type: type || 'info',
                createdAt: newNotif.createdAt
            });
            console.log(`Pusher notification triggered for user-${userId}`);
        } catch (pusherError) {
            console.error("Pusher Notification Trigger Error:", pusherError);
        }

        return NextResponse.json({ success: true, data: newNotif });
    } catch (error) {
        console.error("Notif Create Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
