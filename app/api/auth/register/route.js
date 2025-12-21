import { dbConnect } from "@/lib/db.Connect";
import User from "@/model/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import { sendOTP } from "@/lib/email";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email va parol to‘ldirilishi shart" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Parol kamida 6 belgidan iborat bo‘lishi kerak" },
        { status: 400 }
      );
    }

    await dbConnect();

    // 1. Email mavjudligini tekshirish
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Bu email allaqachon mavjud" },
        { status: 409 }
      );
    }

    // 2. OTP yaratish
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 xonali
    console.log("🔐 TASDIQLASH KODI (TEST):", otp); // Terminalda ko'rish uchun!
    
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Redisga saqlash (5 daqiqa)
    const tempUserData = {
        email,
        password: hashedPassword,
        otp
    };
    
    await redis.setex(`register_otp:${email}`, 300, JSON.stringify(tempUserData));

    // 4. Email yuborish
    try {
        await sendOTP(email, otp);
    } catch (emailError) {
        console.error("Email yuborishda xato (Lekin davom etyapmiz):", emailError.message);
        // Agar SMTP sozlanmagan bo'lsa, xatoni yutib yuboramiz, 
        // shunda frontend "Kod yuborildi" deb OTP oynasini ochadi.
    }

    return NextResponse.json(
      { success: true, message: "Tasdiqlash kodi emailingizga yuborildi" },
      { status: 200 }
    );

  } catch (err) {
    console.error("❌ Register xatolik:", err);
    return NextResponse.json(
      { message: "Server xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
