import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db.Connect";
import Rent from "@/model/Rent";
import Order from "@/model/Order";
import Notification from "@/model/Notification";
import { pusherServer } from "@/lib/pusher";

import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import jwt from "jsonwebtoken";
import { getOrSetCache, clearCache } from "@/lib/utils/cache";

export const dynamic = 'force-dynamic';

const COURIER_CACHE_KEY = 'courier_orders_all';
const COURIER_CACHE_KEY_DELIVERED = 'courier_orders_all_delivered';

function mapRent(r) {
    return {
        id: r._id?.toString(),
        userId: r.user?.toString?.() || (r.user ? String(r.user) : null),
        courierId: r.courierId?.toString?.() || (r.courierId ? String(r.courierId) : null),
        type: 'rent',
        customer: r.fullName || null,
        address: r.address || null,
        phone: r.phone || null,
        book: r.bookTitle || null,
        author: r.author || "Noma'lum",
        image: r.bookImage || "https://placehold.co/100x150.png",
        status: r.courierStatus || 'new',
        paymentStatus: r.paymentStatus || null,
        paymentMethod: r.paymentMethod || null,
        landmark: r.orientir || r.landmark || null,
        lat: typeof r.lat === 'number' ? r.lat : null,
        lng: typeof r.lng === 'number' ? r.lng : null,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt
    };
}

function mapOrder(o) {
    return {
        id: o._id?.toString(),
        userId: o.user?.toString?.() || (o.user ? String(o.user) : null),
        courierId: o.courierId?.toString?.() || (o.courierId ? String(o.courierId) : null),
        type: 'buy',
        customer: o.customer?.name || null,
        address: o.customer?.address || null,
        phone: o.customer?.phone || null,
        book: (o.items || []).map(i => i.title).filter(Boolean).join(", ") || null,
        author: "To'plam",
        image: "https://placehold.co/100x150.png?text=Order",
        status: o.courierStatus || 'new',
        paymentStatus: o.paymentStatus || null,
        paymentMethod: o.paymentMethod || null,
        landmark: o.customer?.orientir || o.customer?.landmark || o.orientir || o.landmark || null,
        lat: typeof o.customer?.lat === 'number' ? o.customer.lat : null,
        lng: typeof o.customer?.lng === 'number' ? o.customer.lng : null,
        createdAt: o.createdAt,
        updatedAt: o.updatedAt
    };
}

async function getUserId() {
    // 1. Check NextAuth Session (Primary)
    const session = await getServerSession(authOptions);
    if (session?.user?.id) return session.user.id;

    // 2. Fallback: Custom Cookie Token
    const cookieStore = await cookies();
    const token = cookieStore.get("kitobdosh_token")?.value;
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.userId;
    } catch (e) {
        return null;
    }
}

export async function GET(req) {
    try {
        await dbConnect();

        // Default payload stays the open queue so the admin pickup tab is unchanged.
        // The courier panel asks for includeDelivered=1 to fill Yakunlangan / hamyon / statistika.
        const includeDelivered = new URL(req.url).searchParams.get('includeDelivered') === '1';
        const cacheKey = includeDelivered ? COURIER_CACHE_KEY_DELIVERED : COURIER_CACHE_KEY;

        const combined = await getOrSetCache(cacheKey, async () => {
            const rentQuery = includeDelivered
                ? {
                    $or: [
                        { status: 'approved', courierStatus: { $ne: 'delivered' } },
                        { courierStatus: 'delivered' }
                    ]
                }
                : { status: 'approved', courierStatus: { $ne: 'delivered' } };

            const orderQuery = includeDelivered
                ? {
                    $or: [
                        { status: 'processing', courierStatus: { $ne: 'delivered' } },
                        { courierStatus: 'delivered' }
                    ]
                }
                : { status: 'processing', courierStatus: { $ne: 'delivered' } };

            const rents = await Rent.find(rentQuery).sort({ createdAt: -1 }).lean();
            const orders = await Order.find(orderQuery).sort({ createdAt: -1 }).lean();

            return [
                ...rents.map(mapRent),
                ...orders.map(mapOrder)
            ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }, 300); // 5 mins cache

        return NextResponse.json({ success: true, data: combined });

    } catch (error) {
        console.error("Courier API Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await dbConnect();
        const { id, type, status, courierId: bodyCourierId } = await req.json();
        const userId = await getUserId();
        
        console.log(`Courier API: Updating ${type} ${id} -> Status: ${status} | CourierID(Body): ${bodyCourierId} | UserID(Token): ${userId}`);
        
        let updated;
        const updateData = { courierStatus: status };
        
        // If accepting, associate the courier
        if (status === 'accepted' && userId) {
            updateData.courierId = userId;
        } else if (bodyCourierId) {
            updateData.courierId = bodyCourierId;
        }

        if (type === 'rent') {
             if (status === 'delivered') {
                 // Fetch current rent to get 'days'
                 const currentRent = await Rent.findById(id);
                 if (currentRent && currentRent.days > 0) {
                     const now = new Date();
                     const returnDate = new Date(now);
                     returnDate.setDate(returnDate.getDate() + currentRent.days);
                     
                     updateData.status = 'active';
                     updateData.returnDate = returnDate;
                     
                     console.log(`Rent ${id} delivered. Setting returnDate to ${returnDate}`);
                 } else {
                     updateData.status = 'active'; // Fallback
                 }
             }
             updated = await Rent.findByIdAndUpdate(id, updateData, { new: true });
             console.log(`Courier API: Updated Rent ${id}. New CourierStatus: ${updated?.courierStatus}`);
        } else {
             // If delivered, mark main order as completed
             if (status === 'delivered') {
                 updateData.status = 'completed';
                 console.log(`Courier API: Marking Order ${id} as completed (delivered)`);
             }
             updated = await Order.findByIdAndUpdate(id, updateData, { new: true });
             console.log(`Courier API: Updated Order ${id}. New CourierStatus: ${updated?.courierStatus}`);
        }

        if (updated && updated.user) {
            const STATUS_MESSAGES = {
                accepted: {
                    title: "Buyurtma qabul qilindi",
                    message: "Kuryer buyurtmangizni yetkazishni qabul qildi.",
                    type: 'info'
                },
                picked_up: {
                    title: "Kuryer buyurtmani oldi",
                    message: "Kuryer buyurtmangizni olib, yo'lga chiqishga tayyorlanmoqda.",
                    type: 'info'
                },
                on_way: {
                    title: "Kuryer yo'lda",
                    message: "Kuryer sizga tomon yo'lga chiqdi. Tez orada yetib boradi!",
                    type: 'info'
                },
                delivered: {
                    title: "Buyurtma yetkazildi",
                    message: "Buyurtmangiz muvaffaqiyatli yetkazildi. Xaridingiz uchun rahmat!",
                    type: 'success'
                },
                returned: {
                    title: "Kitob qaytarildi",
                    message: "Ijara muddati tugagan kitob muvaffaqiyatli qaytarildi.",
                    type: 'success'
                }
            };

            const notifInfo = STATUS_MESSAGES[status];
            if (notifInfo) {
                try {
                    // Create Notification in DB
                    await Notification.create({
                        user: updated.user,
                        title: notifInfo.title,
                        message: notifInfo.message,
                        type: notifInfo.type,
                        data: {
                            orderId: id,
                            orderType: type
                        }
                    });
                    
                    // Trigger Real-time Event via Pusher
                    try {
                        await pusherServer.trigger(`user-${updated.user}`, "status-update", {
                             message: notifInfo.title,
                             fullMessage: notifInfo.message,
                             status: status,
                             orderId: id
                        });
                        console.log(`Pusher event triggered for user-${updated.user}`);
                    } catch (pusherError) {
                        console.error("Pusher Trigger Error:", pusherError);
                    }

                    console.log(`Notification created for user ${updated.user} - ${notifInfo.title}`);
                } catch (notifError) {
                    console.error("Notification creation failed:", notifError);
                }
            }
        }

        if (updated) {
            await clearCache(COURIER_CACHE_KEY);
            await clearCache(COURIER_CACHE_KEY_DELIVERED);
        }

        return NextResponse.json({ success: true, data: updated });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
