import { rateLimit, consumeOtp } from "@/lib/otp";
import { dbConnect } from "@/lib/db.Connect";
import User from "@/model/user";
import { NextResponse } from "next/server";
import redis from "@/lib/redis";
export async function POST(req) {
  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const otp = body.otp;

    if (!email || !otp) {
        return NextResponse.json({ message: "Ma'lumotlar yetishmayapti" }, { status: 400 });
    }

    if (typeof otp !== 'string' || !/^\d{6}$/.test(otp)) return NextResponse.json({ message: 'Kod 6 raqam bo‘lsin' }, { status: 400 });
    if (!await rateLimit(req, email, 'verify')) return NextResponse.json({ message: 'Urinishlar limiti tugadi. 15 daqiqadan keyin qayta urinib ko‘ring' }, { status: 429 });
    const hashedPassword = await consumeOtp(email, otp);
    if (!hashedPassword) return NextResponse.json({ message: 'Kod noto‘g‘ri yoki muddati tugagan' }, { status: 400 });
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


    return NextResponse.json({ success: true, message: "Muvaffaqiyatli ro'yxatdan o'tdingiz!" }, { status: 201 });

  } catch (error) {

    return NextResponse.json({ message: "Hisobni yaratib bo‘lmadi. Qayta urinib ko‘ring" }, { status: error.code === 11000 ? 409 : 503 });
  }
}
