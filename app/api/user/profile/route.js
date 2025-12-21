import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db.Connect";
import Order from "@/model/Order";
import Rent from "@/model/Rent";
import User from "@/model/user";
import Review from "@/model/Review";
import Book from "@/model/Book";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/lib/authOptions";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";
import { getOrSetCache, clearCache } from "@/lib/utils/cache";

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await dbConnect();
    
    // 1. Get Session from NextAuth
    const session = await getServerSession(authOptions);
    let currentUserId = session?.user?.id;
    
    console.log("🔍 DEBUG PROFILE API:");
    console.log("- Session:", session ? "FOUND" : "NULL");
    if(session) console.log("- UserID form Session:", session.user.id);

    // 2. Fallback: Custom 'kitobdosh_token' (for Email/Password logins)
    if (!currentUserId) {
        try {
            const cookieStore = await cookies();
            const token = cookieStore.get("kitobdosh_token")?.value;
            console.log("- Kitobdosh Token Cookie:", token ? "FOUND" : "NULL");
            
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                currentUserId = decoded.userId;
                console.log("- UserID from Token:", currentUserId);
            }
        } catch (e) {
            console.error("- Custom token error:", e.message);
        }
    }

    // 3. Fallback: NextAuth Token (if session failed but token exists)
    if (!currentUserId) {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        console.log("- NextAuth Token (raw):", token ? "FOUND" : "NULL");
        currentUserId = token?.sub;
        if(currentUserId) console.log("- UserID from NextAuth Token:", currentUserId);
    }

    // 2. Determine Target User (defaults to current)
    const url = new URL(req.url);
    const queryUserId = url.searchParams.get("userId");
    let targetUserId = queryUserId || currentUserId;

    console.log("- Target User ID:", targetUserId);

    if (!targetUserId) {
         console.log("❌ AUTENTIFIKATSIYA XATOSI: Foydalanuvchi aniqlanmadi.");
         return NextResponse.json({ success: false, message: "Unauthorized: Please login again" }, { status: 401 });
    }

    // Fix: If ID is not a valid MongoDB ObjectId (e.g. Google Sub ID), try to resolve via Email
    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
        console.log(`⚠️ UserID "${targetUserId}" invalid ObjectId. Attempting email lookup...`);
        
        if (session?.user?.email) {
             const userByEmail = await User.findOne({ email: session.user.email }).select("_id");
             if (userByEmail) {
                 targetUserId = userByEmail._id.toString();
                 console.log("✅ Resolved real UserID:", targetUserId);
             } else {
                 console.log("❌ Could not resolve UserID via email.");
             }
        }
    }

    const isOwner = currentUserId === targetUserId;
    const CACHE_KEY = `profile_full:${targetUserId}`;

    // 3. Get Data with Redis Caching (60 seconds)
    try {
        const profileData = await getOrSetCache(CACHE_KEY, async () => {
            console.log("⏳ Fetching from DB (Cache Miss)...");
            const user = await User.findById(targetUserId).select("-password").lean();
            if (!user) return null;

            // Parallel Fetching for speed
            const [orders, rentals, userWithFavs, reviews] = await Promise.all([
                Order.find({ user: targetUserId }).sort({ createdAt: -1 }).populate('items.book').lean(),
                Rent.find({ user: targetUserId }).sort({ createdAt: -1 }).lean(),
                User.findById(targetUserId).populate('favorites').lean(),
                Review.find({ user: targetUserId }).sort({ createdAt: -1 }).populate('book').lean()
            ]);
            
            const friendsCount = user.friends?.length || 0;
            
            console.log("✅ DB Fetch Success");
            return { 
                user: { ...user, friendsCount, favorites: userWithFavs?.favorites || [] }, 
                orders, 
                rentals,
                reviews: reviews || [] 
            };
        }, 60);

        if (!profileData) return NextResponse.json({ success: false, message: "User not found in DB" }, { status: 404 });

        return NextResponse.json({ 
            success: true, 
            data: {
                ...profileData,
                isOwner
            }
        });
    } catch (dbError) {
        console.error("❌ DB/Redis Error:", dbError);
        return NextResponse.json({ success: false, message: "DB Error: " + dbError.message }, { status: 500 });
    }

  } catch (error) {
    console.error("❌ General API Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

export async function PUT(req) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;
        
        if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        const formData = await req.formData();
        const fullName = formData.get('fullName');
        const bio = formData.get('bio');
        const phone = formData.get('phone');
        const instagram = formData.get('instagram');
        const telegram = formData.get('telegram');
        const occupation = formData.get('occupation');
        const interests = JSON.parse(formData.get('interests') || '[]');
        const file = formData.get('avatar');
        const avatarUrl = formData.get('avatarUrl');
        const avatarCloudinaryId = formData.get('avatarCloudinaryId');

        const updateData = {
            fullName,
            bio,
            phone,
            instagram,
            telegram,
            occupation,
            interests
        };

        if (avatarUrl) updateData.avatar = avatarUrl;
        if (avatarCloudinaryId) updateData.avatarCloudinaryId = avatarCloudinaryId;

        // Handle Avatar Upload via Cloudinary
        if (file && file instanceof File) {
            const { v2: cloudinary } = await import('cloudinary');
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET
            });

            const buffer = Buffer.from(await file.arrayBuffer());
            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: 'kitobdosh/avatars', resource_type: 'auto' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });
            updateData.avatar = uploadResult.secure_url;
            updateData.avatarCloudinaryId = uploadResult.public_id;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");

        // Cache Invalidation
        await clearCache(`profile_full:${userId}`);

        return NextResponse.json({ success: true, message: "Profil yangilandi", data: updatedUser });

    } catch (error) {
        console.error("Profile Update Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
