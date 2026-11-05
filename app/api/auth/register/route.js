import { rateLimit, newOtp, otpKey } from "@/lib/otp";
import { dbConnect } from "@/lib/db.Connect";
import User from "@/model/user";
import { randomInt } from "node:crypto";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import { sendOTP } from "@/lib/email";

export async function POST(req) {
  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = body.password;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof password !== "string") {
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

    if (!await rateLimit(req, email, 'send')) return NextResponse.json({ message: 'Ko‘p urinish. 15 daqiqadan keyin qayta urinib ko‘ring' }, { status: 429 });
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
    const { code: otp, hash: otpHash } = newOtp(); // 6 xonali

    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Redisga saqlash (5 daqiqa)
    const tempUserData = {
        email,
        password: hashedPassword,
        otpHash
    };

    await redis.setex(otpKey(email), 300, JSON.stringify(tempUserData));

    // 4. Email yuborish
    try {
        await sendOTP(email, otp);
    } catch (emailError) {
        await redis.del(otpKey(email));
        return NextResponse.json(
          { message: "Tasdiqlash xatini yuborib bo‘lmadi. Keyinroq qayta urinib ko‘ring." },
          { status: 500 }
        );
    }

    return NextResponse.json(
      { success: true, message: "Tasdiqlash kodi emailingizga yuborildi" },
      { status: 200 }
    );

  } catch (err) {

    return NextResponse.json(
      { message: "Server xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
