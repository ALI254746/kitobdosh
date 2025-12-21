import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db.Connect";
import User from "@/model/user";
import Order from "@/model/Order";
import Rent from "@/model/Rent";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    
    const users = await User.find({}).sort({ createdAt: -1 }).select("-password");
    
    // Fetch stats for each user
    const usersWithStats = await Promise.all(users.map(async (u) => {
        const orderCount = await Order.countDocuments({ user: u._id });
        const rentCount = await Rent.countDocuments({ user: u._id });
        
        let nameToUse = u.fullName || u.email.split('@')[0];
        let initials = nameToUse.substring(0,2).toUpperCase();
        if(u.fullName && u.fullName.includes(' ')) {
            initials = u.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);
        }

        return {
            id: u._id,
            ...u.toObject(),
            name: nameToUse,
            initials,
            bought: orderCount,
            rented: rentCount,
            joined: new Date(u.createdAt).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' })
        };
    }));

    return NextResponse.json({ success: true, data: usersWithStats });
  } catch (error) {
    console.error("Users API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
