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

export async function GET() {
    try {
        await dbConnect();
        
        const combined = await getOrSetCache(COURIER_CACHE_KEY, async () => {
            // Fetch Approved Rents
            const rents = await Rent.find({ 
                status: 'approved',
                courierStatus: { $ne: 'delivered' } 
            }).sort({ createdAt: -1 });

            // Fetch Processing Orders
            const orders = await Order.find({ 
                status: 'processing',
                courierStatus: { $ne: 'delivered' }
            }).sort({ createdAt: -1 });

            // Map to common structure
            return [
                ...rents.map(r => ({
                    id: r._id,
                    userId: r.user?.toString(),
                    courierId: r.courierId?.toString(),
                    type: 'rent',
                    customer: r.fullName,
                    address: r.address,
                    phone: r.phone,
                    book: r.bookTitle,
                    author: "Noma'lum",
                    image: r.bookImage || "https://placehold.co/100x150.png",
                    status: r.courierStatus || 'new',
                    lat: r.lat,
                    lng: r.lng,
                    createdAt: r.createdAt
                })),
                ...orders.map(o => ({
                    id: o._id?.toString(),
                    userId: o.user?.toString(),
                    courierId: o.courierId?.toString(),
                    type: 'buy',
                    customer: o.customer.name,
                    address: o.customer.address,
                    phone: o.customer.phone,
                    book: o.items.map(i => i.title).join(", "),
                    author: "To'plam", 
                    image: "https://placehold.co/100x150.png?text=Order",
                    status: o.courierStatus || 'new',
                    lat: o.customer.lat,
                    lng: o.customer.lng,
                    createdAt: o.createdAt
                }))
            ].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
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
        }

        return NextResponse.json({ success: true, data: updated });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
