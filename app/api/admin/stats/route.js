import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/db.Connect";
import Book from "@/model/Book";
import User from "@/model/user";
import Order from "@/model/Order";
import Rent from "@/model/Rent";

export const dynamic = "force-dynamic";

const MONTHS = ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"];
const ACTIVE_RENT = ["approved", "active", "courier_assigned", "courier_picked_up"];
const IN_TRANSIT = ["accepted", "picked_up", "on_way"];

function startOfMonth(offset = 0) {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  d.setMonth(d.getMonth() + offset);
  return d;
}

function monthKey(year, month) {
  return `${year}-${month}`;
}

function percentChange(current, previous) {
  const curr = Number(current) || 0;
  const prev = Number(previous) || 0;
  if (prev === 0) return curr > 0 ? null : 0;
  return Math.round(((curr - prev) / prev) * 100);
}

function buckets(count) {
  const start = startOfMonth(-(count - 1));
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(start);
    d.setMonth(start.getMonth() + i);
    return {
      key: monthKey(d.getFullYear(), d.getMonth() + 1),
      label: MONTHS[d.getMonth()],
    };
  });
}

function isSaleOrder(order) {
  const items = Array.isArray(order.items) ? order.items : [];
  if (items.length === 0) return true;
  return items.some((item) => item?.type !== "rent");
}

function orderStatus(order) {
  const courierStatus = order.courierStatus;
  if (order.status === "completed" || courierStatus === "delivered") {
    return { label: "Yetkazib berildi", tone: "green" };
  }
  if (order.status === "pending") return { label: "Yangi", tone: "blue" };
  if (order.status === "processing") {
    if (IN_TRANSIT.includes(courierStatus)) return { label: "Yetkazilmoqda", tone: "orange" };
    return { label: "Tasdiqlangan", tone: "teal" };
  }
  if (order.status === "cancelled") return { label: "Bekor qilingan", tone: "slate" };
  return { label: "Yangi", tone: "blue" };
}

function rentStatus(rent) {
  const returnDate = rent.returnDate ? new Date(rent.returnDate) : null;
  const daysLeft = returnDate ? (returnDate.getTime() - Date.now()) / 86400000 : null;
  const activeLike = rent.status === "active" || rent.status === "approved";
  if (rent.status === "late" || (activeLike && daysLeft !== null && daysLeft >= 0 && daysLeft <= 3)) {
    return { label: "Muddat tugash arafasida", tone: "amber" };
  }
  if (rent.status === "pending") return { label: "Yangi", tone: "blue" };
  if (rent.status === "approved") return { label: "Tasdiqlangan", tone: "teal" };
  if (rent.status === "active") return { label: "Faol", tone: "green" };
  if (["courier_assigned", "courier_picked_up"].includes(rent.status) || IN_TRANSIT.includes(rent.courierStatus)) {
    return { label: "Yetkazilmoqda", tone: "orange" };
  }
  if (rent.status === "returned" || rent.courierStatus === "delivered") {
    return { label: "Yetkazib berildi", tone: "green" };
  }
  return { label: "Yangi", tone: "blue" };
}

function refId(value) {
  if (!value) return null;
  if (typeof value === "object" && value._id) return String(value._id);
  const id = String(value);
  return mongoose.Types.ObjectId.isValid(id) ? id : null;
}

const saleExpr = {
  $cond: [
    { $isArray: "$items" },
    {
      $cond: [
        { $eq: [{ $size: "$items" }, 0] },
        1,
        {
          $cond: [
            {
              $gt: [
                {
                  $size: {
                    $filter: {
                      input: "$items",
                      as: "it",
                      cond: { $ne: ["$$it.type", "rent"] },
                    },
                  },
                },
                0,
              ],
            },
            1,
            0,
          ],
        },
      ],
    },
    1,
  ],
};

export async function GET() {
  try {
    await dbConnect();

    const rangeStart = startOfMonth(-11);
    const thisMonthStart = startOfMonth(0);
    const nextMonthStart = startOfMonth(1);
    const lastMonthStart = startOfMonth(-1);
    const now = new Date();

    const deliveringOrderFilter = {
      status: "processing",
      courierStatus: { $ne: "delivered" },
    };
    const deliveringRentFilter = {
      $or: [
        { status: { $in: ["courier_assigned", "courier_picked_up"] } },
        { courierStatus: { $in: IN_TRANSIT } },
      ],
    };

    const [
      totalBooks,
      totalUsers,
      activeCouriers,
      totalOrders,
      activeRentals,
      pendingRentRequests,
      overdueRentals,
      deliveringOrders,
      deliveringRents,
      categoryStats,
      orderIncomeAgg,
      rentIncomeAgg,
      orderMonthly,
      rentMonthly,
      monthlySales,
      topReaders,
      recentOrderDocs,
      recentRentDocs,
      ordersThisMonth,
      ordersLastMonth,
      activeRentsThisMonth,
      activeRentsLastMonth,
      deliveringThisMonthOrders,
      deliveringLastMonthOrders,
      deliveringThisMonthRents,
      deliveringLastMonthRents,
    ] = await Promise.all([
      Book.countDocuments(),
      User.countDocuments({ role: "user" }),
      User.countDocuments({ role: { $in: ["kurier", "kurer", "courier"] } }),
      Order.countDocuments({ status: { $ne: "cancelled" } }),
      Rent.countDocuments({ status: { $in: ACTIVE_RENT } }),
      Rent.countDocuments({ status: "pending" }),
      Rent.countDocuments({ status: "active", returnDate: { $lt: now } }),
      Order.countDocuments(deliveringOrderFilter),
      Rent.countDocuments(deliveringRentFilter),
      Book.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 },
      ]),
      Order.aggregate([
        { $match: { status: { $ne: "cancelled" } } },
        { $group: { _id: null, total: { $sum: { $ifNull: ["$totalPrice", 0] } } } },
      ]),
      Rent.aggregate([
        { $match: { status: { $ne: "rejected" } } },
        { $group: { _id: null, total: { $sum: { $ifNull: ["$totalPrice", 0] } } } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: rangeStart }, status: { $ne: "cancelled" } } },
        {
          $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            orders: { $sum: 1 },
            sales: { $sum: saleExpr },
            revenue: { $sum: { $ifNull: ["$totalPrice", 0] } },
          },
        },
      ]),
      Rent.aggregate([
        { $match: { createdAt: { $gte: rangeStart }, status: { $ne: "rejected" } } },
        {
          $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            rents: { $sum: 1 },
            revenue: { $sum: { $ifNull: ["$totalPrice", 0] } },
          },
        },
      ]),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfMonth(-5) },
            status: { $ne: "cancelled" },
          },
        },
        {
          $group: {
            _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
            total: { $sum: { $ifNull: ["$totalPrice", 0] } },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
      Order.aggregate([
        { $match: { user: { $ne: null } } },
        { $group: { _id: "$user", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 4 },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        { $unwind: "$userDetails" },
      ]),
      Order.find({ status: { $ne: "cancelled" } })
        .sort({ createdAt: -1 })
        .limit(12)
        .select("customer totalPrice status courierStatus courierId items createdAt")
        .lean(),
      Rent.find({ status: { $ne: "rejected" } })
        .sort({ createdAt: -1 })
        .limit(12)
        .select("fullName totalPrice status courierStatus courierId returnDate createdAt")
        .lean(),
      Order.countDocuments({ createdAt: { $gte: thisMonthStart, $lt: nextMonthStart }, status: { $ne: "cancelled" } }),
      Order.countDocuments({ createdAt: { $gte: lastMonthStart, $lt: thisMonthStart }, status: { $ne: "cancelled" } }),
      Rent.countDocuments({ createdAt: { $gte: thisMonthStart, $lt: nextMonthStart }, status: { $in: ACTIVE_RENT } }),
      Rent.countDocuments({ createdAt: { $gte: lastMonthStart, $lt: thisMonthStart }, status: { $in: ACTIVE_RENT } }),
      Order.countDocuments({
        createdAt: { $gte: thisMonthStart, $lt: nextMonthStart },
        $or: [{ status: { $in: ["processing", "completed"] } }, { courierStatus: { $in: ["new", ...IN_TRANSIT, "delivered"] } }],
      }),
      Order.countDocuments({
        createdAt: { $gte: lastMonthStart, $lt: thisMonthStart },
        $or: [{ status: { $in: ["processing", "completed"] } }, { courierStatus: { $in: ["new", ...IN_TRANSIT, "delivered"] } }],
      }),
      Rent.countDocuments({
        createdAt: { $gte: thisMonthStart, $lt: nextMonthStart },
        $or: [
          { status: { $in: ["courier_assigned", "courier_picked_up", "approved", "active", "returned"] } },
          { courierStatus: { $in: ["new", ...IN_TRANSIT, "delivered"] } },
        ],
      }),
      Rent.countDocuments({
        createdAt: { $gte: lastMonthStart, $lt: thisMonthStart },
        $or: [
          { status: { $in: ["courier_assigned", "courier_picked_up", "approved", "active", "returned"] } },
          { courierStatus: { $in: ["new", ...IN_TRANSIT, "delivered"] } },
        ],
      }),
    ]);

    const orderMap = new Map(
      orderMonthly.map((row) => [
        monthKey(row._id.year, row._id.month),
        { orders: row.orders || 0, sales: row.sales || 0, revenue: row.revenue || 0 },
      ])
    );
    const rentMap = new Map(
      rentMonthly.map((row) => [
        monthKey(row._id.year, row._id.month),
        { rents: row.rents || 0, revenue: row.revenue || 0 },
      ])
    );

    const series = buckets(12).map((bucket) => {
      const orders = orderMap.get(bucket.key) || { orders: 0, sales: 0, revenue: 0 };
      const rents = rentMap.get(bucket.key) || { rents: 0, revenue: 0 };
      return {
        label: bucket.label,
        orders: orders.orders,
        sales: orders.sales,
        rents: rents.rents,
        revenue: (orders.revenue || 0) + (rents.revenue || 0),
      };
    });

    const thisKey = monthKey(thisMonthStart.getFullYear(), thisMonthStart.getMonth() + 1);
    const lastKey = monthKey(lastMonthStart.getFullYear(), lastMonthStart.getMonth() + 1);
    const revenueThis = (orderMap.get(thisKey)?.revenue || 0) + (rentMap.get(thisKey)?.revenue || 0);
    const revenueLast = (orderMap.get(lastKey)?.revenue || 0) + (rentMap.get(lastKey)?.revenue || 0);

    const courierIds = [...recentOrderDocs, ...recentRentDocs].map((doc) => refId(doc.courierId)).filter(Boolean);
    const courierUsers = courierIds.length
      ? await User.find({ _id: { $in: courierIds } }).select("fullName email").lean()
      : [];
    const courierNames = new Map(
      courierUsers.map((user) => [String(user._id), user.fullName || user.email || null])
    );

    const recent = [
      ...recentOrderDocs.filter(isSaleOrder).map((order) => ({
        id: String(order._id),
        code: `#${String(order._id).slice(-5).toUpperCase()}`,
        customer: order.customer?.name || "Noma'lum",
        kind: "sale",
        amount: order.totalPrice || 0,
        status: orderStatus(order),
        courier: courierNames.get(refId(order.courierId)) || null,
        href: "/AdminPanel/sotuvdagiKitoblar",
        createdAt: order.createdAt,
      })),
      ...recentRentDocs.map((rent) => ({
        id: String(rent._id),
        code: `#${String(rent._id).slice(-5).toUpperCase()}`,
        customer: rent.fullName || "Noma'lum",
        kind: "rent",
        amount: rent.totalPrice || 0,
        status: rentStatus(rent),
        courier: courierNames.get(refId(rent.courierId)) || null,
        href: "/AdminPanel/rentRequest",
        createdAt: rent.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6)
      .map(({ createdAt, ...row }) => row);

    const totalIncome = (orderIncomeAgg[0]?.total || 0) + (rentIncomeAgg[0]?.total || 0);

    return NextResponse.json({
      success: true,
      stats: {
        totalBooks,
        totalUsers,
        totalIncome,
        pendingRentRequests,
        activeRentals,
        overdueRentals,
        topCategory: categoryStats[0]?._id || "Noma'lum",
        activeCouriers,
        monthlySales,
        topReaders: topReaders.map((reader) => ({
          name: reader.userDetails.fullName || reader.userDetails.email,
          email: reader.userDetails.email,
          avatar:
            reader.userDetails.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(reader.userDetails.fullName || reader.userDetails.email || "U")}`,
          count: reader.count,
        })),
      },
      dashboard: {
        kpis: {
          totalOrders: { value: totalOrders, trend: percentChange(ordersThisMonth, ordersLastMonth) },
          activeRents: { value: activeRentals, trend: percentChange(activeRentsThisMonth, activeRentsLastMonth) },
          delivering: {
            value: deliveringOrders + deliveringRents,
            trend: percentChange(
              deliveringThisMonthOrders + deliveringThisMonthRents,
              deliveringLastMonthOrders + deliveringLastMonthRents
            ),
          },
          monthlyRevenue: { value: revenueThis, trend: percentChange(revenueThis, revenueLast) },
        },
        series,
        recent,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500     });
  }
}
