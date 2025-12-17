import { dbConnect } from "@/lib/db.Connect";
import User from "@/model/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password)
      return Response.json(
        { message: "Email va parol talab qilinadi" },
        { status: 400 }
      );

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user)
      return Response.json(
        { message: "Foydalanuvchi topilmadi" },
        { status: 404 }
      );

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return Response.json({ message: "Parol noto‘g‘ri" }, { status: 401 });

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    const cookieStore = await cookies();
    cookieStore.set("unihub_token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return Response.json(
      { message: "Kirish muvaffaqiyatli", token, role: user.role },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Xatolik:", err);
    return Response.json(
      { message: "Server xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
