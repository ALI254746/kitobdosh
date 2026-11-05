import mongoose from "mongoose";
import { publicRecord } from "@/lib/server-auth";
import { isObjectId } from "@/lib/catalog-input.mjs";
import { authorize, courierRoles } from "@/lib/server-auth";
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
  const session = await getServerSession(authOptions);
  return session?.user?.id || null;
}

export async function GET() {
    const access = await authorize(['admin', ...courierRoles]);
    if (access.response) return access.response;
    try {
        await dbConnect();

        const combined = await (async () => {
            const visible = access.user.role === "admin" ? {} : { $or: [{ courierId: { $in: [access.user.id, new mongoose.Types.ObjectId(access.user.id)] } }, { courierId: { $exists: false } }, { courierId: null }] };
            // Fetch Approved Rents
            const rents = await Rent.find({ ...visible,
                status: 'approved',
                courierStatus: { $ne: 'delivered' }
            }).sort({ createdAt: -1 });

            // Fetch Processing Orders
            const orders = await Order.find({ ...visible,
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
                    image: o.items?.[0]?.image || "/icon-192x192.png",
                    status: o.courierStatus || 'new',
                    lat: o.customer.lat,
                    lng: o.customer.lng,
                    createdAt: o.createdAt
                }))
            ].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
        })();

        return NextResponse.json({ success: true, data: combined.map(job => {
          if (access.user.role !== 'admin' && job.courierId !== access.user.id) return { ...job, phone: undefined, address: undefined, lat: undefined, lng: undefined };
          return job;
        }) });

    } catch (error) {
        console.error("Courier API Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    const access = await authorize(['admin', ...courierRoles]);
    if (access.response) return access.response;
    try {
        await dbConnect();
        const { id, type, status } = await req.json();
        if (!isObjectId(id) || !['rent', 'buy'].includes(type) || !['accepted', 'picked_up', 'on_way', 'delivered'].includes(status)) return NextResponse.json({ success: false, message: 'Amal noto‘g‘ri' }, { status: 400 });
        const userId = access.user.id;
        const Model = type === 'rent' ? Rent : Order;
        const current = await Model.findById(id);
        if (!current) return NextResponse.json({ success: false }, { status: 404 });
        if (current.courierId && String(current.courierId) !== userId && access.user.role !== 'admin') return NextResponse.json({ success: false, message: 'Topshiriq sizga tegishli emas' }, { status: 403 });
        const previous = { accepted: 'new', picked_up: 'accepted', on_way: 'picked_up', delivered: 'on_way' }[status];
        if ((current.courierStatus || 'new') !== previous || (status !== 'accepted' && !current.courierId)) return NextResponse.json({ success: false }, { status: 409 });
        const filter = { _id: id, courierStatus: current.courierStatus || { $in: [null, 'new'] }, courierId: current.courierId || null };
        let updated;
        const updateData = { courierStatus: status };
        if (status === 'accepted') updateData.courierId = userId;
        if (type === 'rent' && status === 'delivered') {
            updateData.status = 'active';
            if (current.days > 0) {
                const returnDate = new Date();
                returnDate.setDate(returnDate.getDate() + current.days);
                updateData.returnDate = returnDate;
            }
        }

        if (status !== 'delivered') {
            updated = await Model.findOneAndUpdate(filter, updateData, { new: true, runValidators: true });
        } else {
            // Serialize sibling deliveries on the parent document and commit the
            // delivery and aggregate status together. createOrder already requires
            // a MongoDB replica set for its own transactions.
            const session = await mongoose.startSession();
            try {
                await session.withTransaction(async () => {
                    updated = null;
                    const parentId = type === 'buy' ? current._id : current.orderId;
                    let parent = null;
                    if (parentId) {
                        parent = await Order.findOneAndUpdate(
                            { _id: parentId, status: { $ne: 'cancelled' } }, { $inc: { deliverySyncVersion: 1 } },
                            { new: true, session }
                        );
                        // Missing legacy parents are allowed, but a cancelled parent
                        // must not be resurrected by a late courier update.
                        if (!parent && await Order.exists({ _id: parentId }).session(session)) return;
                    }
                    if (type === 'buy' && (!parent || parent.status !== 'processing')) return;
                    updated = await Model.findOneAndUpdate(filter, updateData, { new: true, runValidators: true, session });
                    if (!updated || !parent) return;

                    const rentalsExpected = parent.items.filter(item => item.type === 'rent').length;
                    const rentalsDelivered = rentalsExpected === 0 ||
                        (await Rent.countDocuments({ orderId: parent._id, courierStatus: 'delivered' }).session(session)) === rentalsExpected;
                    const hasPurchase = parent.items.some(item => item.type !== 'rent');
                    const purchaseDelivered = !hasPurchase || (type === 'buy' ? true : parent.courierStatus === 'delivered');
                    if (rentalsDelivered && purchaseDelivered && ['pending', 'processing'].includes(parent.status)) {
                        await Order.updateOne({ _id: parent._id, status: { $in: ['pending', 'processing'] } }, { $set: { status: 'completed' } }, { session });
                        if (type === 'buy') updated.status = 'completed';
                    }
                });
            } finally {
                await session.endSession();
            }
        }

        if (!updated) return NextResponse.json({ success: false }, { status: 409 });
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
            if (updated.user) await clearCache(`profile_full:${updated.user}`);
        }

        return NextResponse.json({ success: true, data: publicRecord(updated) });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
