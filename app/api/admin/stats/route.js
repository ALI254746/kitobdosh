import { requireRole } from "@/lib/require-role";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db.Connect";
import Book from "@/model/Book";
import User from "@/model/user";
import Order from "@/model/Order";
import Rent from "@/model/Rent";

export async function GET() {
  const denied = await requireRole();
  if (denied) return denied;
  try {
    await dbConnect();

    // 1. Asosiy ko'rsatkichlar (Total stats)
    const totalBooks = await Book.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    
    // Daromad - Order va Rent dan
    const orders = await Order.find({ status: { $ne: 'cancelled' } });
    const rents = await Rent.find({ status: { $ne: 'rejected' } });
    
    const totalIncome = [...orders, ...rents].reduce((sum, item) => sum + (item.totalPrice || 0), 0);

    // 2. Ijara holati
    const activeRentals = await Rent.countDocuments({ 
      status: { $in: ['approved', 'active', 'courier_assigned', 'courier_picked_up'] } 
    });
    
    const pendingRentRequests = await Rent.countDocuments({ status: 'pending' });
    
    // Muddati o'tganlar (Overdue) - returnDate < hozirgi vaqt va hali qaytarilmagan
    const now = new Date();
    const overdueRentals = await Rent.countDocuments({
      status: 'active',
      returnDate: { $lt: now }
    });

    // 3. Tahliliy ko'rsatkichlar (Categories)
    const categoryStats = await Book.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const topCategory = categoryStats[0]?._id || "Noma'lum";

    // 4. Kuryer statistikasi (Agar kuryerlar ro'li bo'lsa)
    const activeCouriers = await User.countDocuments({ role: { $in: ['kurier', 'kurer', 'courier'] } });

    // 5. Grafik ma'lumotlari (Oxirgi 6 oy)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthlyStats = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          total: { $sum: "$totalPrice" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // 6. Faol Kitobxonlar (Top Readers)
    // Eng ko'p buyurtma yoki ijara qilganlar
    const topReaders = await Order.aggregate([
        { $group: { _id: "$user", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 4 },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "userDetails"
            }
        },
        { $unwind: "$userDetails" }
    ]);

    const yearAgo = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11, 1));
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const [totalOrders, inDelivery, recentOrders, orderActivity, rentalActivity, paidOrders, paidRents] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: "processing" }),
      Order.find().sort({ createdAt: -1 }).limit(6).select("customer items totalPrice status createdAt").lean(),
      Order.aggregate([
        { $match: { createdAt: { $gte: yearAgo }, status: { $ne: "cancelled" } } },
        { $group: { _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } }, count: { $sum: 1 }, sales: { $sum: { $cond: [{ $in: ["buy", "$items.type"] }, 1, 0] } } } },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]),
      Rent.aggregate([
        { $match: { createdAt: { $gte: yearAgo }, status: { $ne: "rejected" } } },
        { $group: { _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } }, count: { $sum: 1 } } }
      ]),
      Order.aggregate([{ $match: { paymentStatus: "paid", status: { $ne: "cancelled" }, createdAt: { $gte: monthStart } } }, { $group: { _id: null, total: { $sum: "$totalPrice" } } }]),
      Rent.aggregate([{ $match: { paymentStatus: "paid", status: { $ne: "rejected" }, order: { $exists: false }, createdAt: { $gte: monthStart } } }, { $group: { _id: null, total: { $sum: "$totalPrice" } } }])
    ]);
    const dashboard = {
      totalOrders, inDelivery, recentOrders, orderActivity, rentalActivity,
      monthlyIncome: (paidOrders[0]?.total || 0) + (paidRents[0]?.total || 0)
    };

    return NextResponse.json({
      success: true,
      stats: {
        dashboard,
        totalBooks,
        totalUsers,
        totalIncome,
        pendingRentRequests,
        activeRentals,
        overdueRentals,
        topCategory,
        activeCouriers,
        monthlySales: monthlyStats,
        topReaders: topReaders.map(r => ({
            name: r.userDetails.fullName || r.userDetails.email,
            email: r.userDetails.email,
            avatar: r.userDetails.avatar || `https://ui-avatars.com/api/?name=${r.userDetails.fullName || r.userDetails.email}`,
            count: r.count
        }))
      }
    });

  } catch (error) {
    console.error("Dashboard Stats API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
