import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db.Connect";
import Rent from "@/model/Rent";
import Notification from "@/model/Notification";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req) {
  try {
    await dbConnect();
    
    // Auth: Extract User ID
    let userId = null;
    
    // 1. Check NextAuth Session
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
        userId = session.user.id;
    }

    // 2. Fallback: Check Custom Token
    if (!userId) {
        try {
            const cookieStore = await cookies();
            const token = cookieStore.get("kitobdosh_token")?.value;
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.userId;
            }
        } catch (e) {
            console.error("Rent API Auth Error:", e);
        }
    }

    if (!userId) {
        return NextResponse.json({ success: false, message: "Iltimos, avval tizimga kiring!" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("passport");
    
    // Validate File
    if (!file) {
      return NextResponse.json({ success: false, message: "Pasport rasmi yuklanmadi" }, { status: 400 });
    }

    // Upload to Cloudinary instead of local storage
    const { v2: cloudinary } = await import('cloudinary');
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'kitobdosh/passports',
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    const fileUrl = uploadResult.secure_url;

    // Extract other fields
    const newRent = new Rent({
      user: userId, // Link to user
      book: formData.get("bookId"),
      bookTitle: formData.get("bookTitle"),
      bookImage: formData.get("bookImage"),
      fullName: formData.get("name"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      passportUrl: fileUrl,
      passportCloudinaryId: uploadResult.public_id, // Store for deletion
      days: Number(formData.get("days")),
      totalPrice: Number(formData.get("totalPrice")),
      paymentMethod: formData.get("payment")
    });

    await newRent.save();

    return NextResponse.json({ success: true, message: "Ijara so'rovi yuborildi", data: newRent });
  } catch (error) {
    console.error("Rent API Error:", error);
    return NextResponse.json({ success: false, message: "Server xatosi: " + error.message }, { status: 500 });
  }
}

export async function PUT(req) {
    try {
        await dbConnect();
        const { id, status } = await req.json();

        if (!id || !status) {
            return NextResponse.json({ success: false, message: "Ma'lumotlar yetarli emas" }, { status: 400 });
        }

        const updateFull = { status };
        if (status === 'approved') {
            const rent = await Rent.findById(id);
            if (rent) {
                const returnDate = new Date();
                returnDate.setDate(returnDate.getDate() + (rent.days || 1));
                updateFull.returnDate = returnDate;
            }
            updateFull.courierStatus = 'new';
            console.log(`Rent API: Request Approved. Setting courierStatus to 'new' and returnDate to ${updateFull.returnDate}. ID: ${id}`);
        }
        console.log(`Rent API: Updating Rent ${id} status to ${status}`);
        const updatedRent = await Rent.findByIdAndUpdate(id, updateFull, { new: true });
        
        if (!updatedRent) {
             return NextResponse.json({ success: false, message: "Topilmadi" }, { status: 404 });
        }

        // Notification Logic
        if (updatedRent.user && (status === 'approved' || status === 'rejected' || status === 'returned')) {
             let title = "Ijara So'rovi Yangilandi";
             let message = "";
             let type = "info";

             if (status === 'approved') {
                 title = "Ijara So'rovi Tasdiqlandi! ✅";
                 message = `Sizning "${updatedRent.bookTitle}" kitobi uchun ijara so'rovingiz tasdiqlandi. Tez orada aloqaga chiqamiz.`;
                 type = "success";
             } else if (status === 'rejected') {
                 title = "Ijara So'rovi Rad Etildi ❌";
                 message = `Sizning "${updatedRent.bookTitle}" kitobi uchun ijara so'rovingiz rad etildi.`;
                 type = "error";
             } else if (status === 'returned') {
                 title = "Kitob Qaytarildi 📚";
                 message = `"${updatedRent.bookTitle}" kitobi muvaffaqiyatli qaytarildi. Xizmatimizdan foydalanganingiz uchun rahmat!`;
                 type = "success";
             }

             await Notification.create({
                 user: updatedRent.user,
                 title,
                 message,
                 type
             });
        }

        return NextResponse.json({ success: true, data: updatedRent });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function GET() {
  try {
     await dbConnect();
     const rentals = await Rent.find().sort({ createdAt: -1 });
     return NextResponse.json({ success: true, data: rentals });
  } catch (error) {
     return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
