import { dbConnect } from "@/lib/db.Connect";
import User from "@/model/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { registrationRateLimit } from "@/lib/registration-rate-limit";

export async function POST(req) {
  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = body.password;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof password !== "string") {
      return NextResponse.json({ message: "Email va parol to‘ldirilishi shart" }, { status: 400 });
    }
    if (password.length < 6 || password.length > 72) {
      return NextResponse.json({ message: "Parol 6–72 belgidan iborat bo‘lishi kerak" }, { status: 400 });
    }
    await dbConnect();
    if (!await registrationRateLimit(req, email)) {
      return NextResponse.json({ message: "Ko‘p urinish. 15 daqiqadan keyin qayta urinib ko‘ring" }, { status: 429 });
    }
    if (await User.exists({ email })) {
      return NextResponse.json({ message: "Bu email allaqachon mavjud" }, { status: 409 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashedPassword, role: "user" });
    return NextResponse.json(
      { success: true, requiresVerification: false, message: "Hisob yaratildi" },
      { status: 201 }
    );
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ message: "Bu email allaqachon mavjud" }, { status: 409 });
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: "So‘rov formati noto‘g‘ri" }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Ro‘yxatdan o‘tish xizmatiga ulanib bo‘lmadi. Keyinroq qayta urinib ko‘ring." },
      { status: 503 }
    );
  }
}
