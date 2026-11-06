import { uploadImage, UploadInputError } from "@/lib/uploads";
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
    
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id;
    if (!currentUserId) return NextResponse.json({ success: false, message: 'Avval tizimga kiring' }, { status: 401 });
    const queryUserId = new URL(req.url).searchParams.get('userId');
    if (queryUserId && queryUserId !== currentUserId) return NextResponse.json({ success: false, message: 'Bu profil uchun ruxsat yo‘q' }, { status: 403 });
    const targetUserId = currentUserId;
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
                Order.find({ user: targetUserId }).sort({ createdAt: -1 }).select('-passportUrl -passportCloudinaryId -passportAssetId -passportFormat').populate('items.book').lean(),
                Rent.find({ user: targetUserId }).select('-passportUrl -passportCloudinaryId -passportAssetId -passportFormat').sort({ createdAt: -1 }).lean(),
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

        if (file && typeof file.arrayBuffer === 'function' && file.size) {
            const result = await uploadImage(file, userId, 'kitobdosh');
            updateData.avatar = result.url;
            updateData.avatarCloudinaryId = result.publicId;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");

        // Cache Invalidation
        await clearCache(`profile_full:${userId}`);

        return NextResponse.json({ success: true, message: "Profil yangilandi", data: updatedUser });

    } catch (error) {
        console.error("Profile Update Error:", error);
        return NextResponse.json({ success: false, message: "Profilni saqlab bo‘lmadi" }, { status: error instanceof UploadInputError ? 400 : 503 });
    }
}
