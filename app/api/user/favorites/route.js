import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db.Connect";
import User from "@/model/user";
import Book from "@/model/Book";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// Helper to get User ID
async function getUserId() {
    // 1. Try extracting from custom cookie (Legacy/Register flow)
    const cookieStore = await cookies();
    const token = cookieStore.get("kitobdosh_token")?.value;
    
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return decoded.userId;
        } catch (e) {
            // Token invalid, proceed to check Session
        }
    }

    // 2. Try getting NextAuth session
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
        return session.user.id;
    }

    return null;
}

export async function POST(req) {
    try {
        await dbConnect();
        const userId = await getUserId();
        if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        const { bookId } = await req.json();
        if (!bookId) return NextResponse.json({ success: false, message: "Book ID required" }, { status: 400 });

        const user = await User.findById(userId);
        if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

        const isFavorite = user.favorites.includes(bookId);
        
        if (isFavorite) {
            // Remove
            user.favorites = user.favorites.filter(id => id.toString() !== bookId);
        } else {
            // Add
            user.favorites.push(bookId);
        }

        await user.save();

        return NextResponse.json({ success: true, isFavorite: !isFavorite, favorites: user.favorites });

    } catch (error) {
        console.error("Favorites API Error:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        await dbConnect();
        const userId = await getUserId();
        if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        const user = await User.findById(userId).populate('favorites');
        
        return NextResponse.json({ success: true, favorites: user.favorites });

    } catch (error) {
        console.error("Favorites GET Error:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
