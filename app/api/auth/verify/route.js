import { dbConnect } from "@/lib/db.Connect";
import User from "@/model/user";
import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
        return NextResponse.json({ message: "Ma'lumotlar yetishmayapti" }, { status: 400 });
    }

    // 1. Redisdan tekshirish
    const cachedData = await redis.get(`register_otp:${email}`);
    
    if (!cachedData) {
        return NextResponse.json({ message: "Kod muddati tugagan yoki noto'g'ri email" }, { status: 400 });
    }

    const { otp: savedOtp, password: hashedPassword } = JSON.parse(cachedData);

    // 2. Kodni solishtirish
    if (savedOtp !== otp) {
        return NextResponse.json({ message: "Kod noto'g'ri" }, { status: 400 });
    }

    await dbConnect();

    // 3. Userni yaratish
    // Ehtiyot chorasi: user oldin yaratilib qolmaganmi?
    const existing = await User.findOne({ email });
    if(existing) {
         return NextResponse.json({ message: "Foydalanuvchi allaqachon mavjud" }, { status: 409 });
    }

    const newUser = await User.create({
        email,
        password: hashedPassword,
        role: "user"
    });

    // 4. Redisni tozalash
    await redis.del(`register_otp:${email}`);

    // 5. Token berish (Avtomatik login)
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    const cookieStore = await cookies();
    cookieStore.set("kitobdosh_token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return NextResponse.json({ success: true, message: "Muvaffaqiyatli ro'yxatdan o'tdingiz!" }, { status: 201 });

  } catch (error) {
    console.error("Verify Error:", error);
    return NextResponse.json({ message: "Server xatolik" }, { status: 500 });
  }
}
