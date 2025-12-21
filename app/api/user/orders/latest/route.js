export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db.Connect";
import Order from "@/model/Order";
import Rent from "@/model/Rent";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Latest Buy Order
    const latestOrder = await Order.findOne({ user: session.user.id })
        .sort({ createdAt: -1 })
        .populate('items.book');

    // Latest Rent Order
    const latestRent = await Rent.findOne({ user: session.user.id })
        .sort({ createdAt: -1 })
        .populate('book');

    // Compare and get the absolute latest
    let latest = null;

    if (latestOrder && latestRent) {
        latest = latestOrder.createdAt > latestRent.createdAt ? 
            { ...latestOrder._doc, type: 'buy' } : 
            { ...latestRent._doc, type: 'rent' };
    } else if (latestOrder) {
        latest = { ...latestOrder._doc, type: 'buy' };
    } else if (latestRent) {
        latest = { ...latestRent._doc, type: 'rent' };
    }

    if (!latest) {
        return NextResponse.json({ success: true, order: null });
    }

    // Map to normalized tracking format
    const trackingData = {
        id: latest._id.toString().substring(18).toUpperCase(), // Short ID
        status: latest.status,
        type: latest.type,
        book: {
            title: latest.type === 'buy' ? latest.items[0]?.title : latest.bookTitle,
            author: latest.type === 'buy' ? latest.items[0]?.book?.author : latest.book?.author,
            cover: latest.type === 'buy' ? latest.items[0]?.book?.images?.[0] : latest.bookImage,
        },
        delivery: {
            method: latest.deliveryMethod || 'courier',
            address: latest.customer?.address || latest.address,
        },
        createdAt: latest.createdAt
    };

    return NextResponse.json({ success: true, order: trackingData });

  } catch (error) {
    console.error("Latest Order API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
