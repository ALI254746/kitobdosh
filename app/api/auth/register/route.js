import { dbConnect } from "@/lib/db.Connect";
import User from "@/model/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Bu email allaqachon mavjud" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword });

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // 🍪 Cookie o‘rnatish
    const cookieStore = await cookies();
    cookieStore.set("unihub_token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    // 🔁 Foydalanuvchini login sahifasiga yo‘naltirish
    return NextResponse.json(
      { message: "Ro‘yxatdan o‘tish muvaffaqiyatli!" },
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ Server xatolik:", err);
    return NextResponse.json(
      { message: "Server xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
