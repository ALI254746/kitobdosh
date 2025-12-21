import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db.Connect";
import User from "@/model/user";
import Order from "@/model/Order";
import Rent from "@/model/Rent";
import bcrypt from "bcryptjs";

export const dynamic = 'force-dynamic';

// ... GET function (unchanged) ...

export async function POST(req) {
  try {
    await dbConnect();
    const { fullName, email, password, phone } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email va parol kiritilishi shart" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Bu email bilan foydalanuvchi mavjud" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new courier
    // Using 'kurer' as requested in prompt, or consistent with 'courier' 
    // The previous step query checks for both, so 'kurer' is fine.
    const newCourier = await User.create({
        fullName: fullName || "Kuryer",
        email,
        password: hashedPassword,
        phone: phone || "",
        role: 'kurer', // Set role explicitly
        occupation: 'courier' // Additional info
    });

    return NextResponse.json({ success: true, data: newCourier }, { status: 201 });

  } catch (error) {
    console.error("Create Courier Error:", error);
    return NextResponse.json({ success: false, message: "Server xatolik: " + error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    
    // Fetch all couriers
    const couriers = await User.find({ role: { $in: ['courier', 'kurer'] } }).select("-password");

    // Date Range for Today
    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);
    const endOfDay = new Date();
    endOfDay.setHours(23,59,59,999);

    const data = await Promise.all(couriers.map(async (c) => {
        // 1. Today's Deliveries (Orders assigned to courier today)
        const deliveriesCount = await Order.countDocuments({ 
            courierId: c._id, 
            createdAt: { $gte: startOfDay, $lte: endOfDay } 
        });

        // 2. Today's Returns (Rents handled by courier today)
        // Note: Assuming Rent has courierId. If not, this might need schema update.
        // We check 'updatedAt' for today's activity on returns.
        const returnsCount = await Rent.countDocuments({
            courierId: c._id,
            updatedAt: { $gte: startOfDay, $lte: endOfDay },
            status: { $in: ['returned', 'courier_picked_up'] }
        });

        // 3. Current Active Load (Orders actively working on)
        const activeOrders = await Order.countDocuments({
            courierId: c._id,
            courierStatus: { $in: ['accepted', 'picked_up', 'on_way'] }
        });
        
        // 4. Determine status
        let status = 'active'; // free ("Faol" in frontend translations)
        if (activeOrders > 0) status = 'busy'; // ("Band")

        return {
            id: c._id,
            name: c.fullName || c.email?.split('@')[0] || "Kuryer",
            phone: c.phone || "Tel yo'q",
            online: true, // Placeholder for presence
            todayDeliveries: deliveriesCount,
            todayReturns: returnsCount,
            status: status,
            location: "Toshkent" // Placeholder
        };
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Couriers API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
