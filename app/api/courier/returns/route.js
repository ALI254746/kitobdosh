import mongoose from "mongoose";
import { publicRecord } from "@/lib/server-auth";
import { isObjectId } from "@/lib/catalog-input.mjs";
import { authorize, courierRoles } from "@/lib/server-auth";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db.Connect";
import Rent from "@/model/Rent";
import User from "@/model/user";
import Book from "@/model/Book";

export const dynamic = 'force-dynamic';

import Notification from "@/model/Notification";
import { pusherServer } from "@/lib/pusher";

// GET: Get all return requests (including in-progress pickups)
export async function GET() {
    const access = await authorize(['admin', ...courierRoles]);
    if (access.response) return access.response;
    try {
        await dbConnect();

        // Include all return-related statuses
        const returns = await Rent.find({ ...(access.user.role === 'admin' ? {} : { $or: [{ returnCourierId: { $in: [access.user.id, new mongoose.Types.ObjectId(access.user.id)] } }, { returnCourierId: null }] }),
            status: { $in: ['return_requested', 'courier_assigned', 'courier_picked_up'] }
        })
            .populate('user', 'fullName phone address location email')
            .populate('book', 'title images price author')
            .sort({ updatedAt: -1 });


        // Map to include fallback fields from Rent schema
        const mappedReturns = returns.map(rent => ({
            _id: rent._id,
            status: rent.status,
            bookTitle: rent.bookTitle || rent.book?.title,
            bookImage: rent.bookImage || rent.book?.images?.[0],
            bookAuthor: rent.book?.author || 'Noma\'lum',
            userName: rent.fullName || rent.user?.fullName,
            userPhone: access.user.role === 'admin' || String(rent.returnCourierId) === access.user.id ? rent.phone || rent.user?.phone : undefined,
            userAddress: access.user.role === 'admin' || String(rent.returnCourierId) === access.user.id ? rent.address : undefined,

            days: rent.days,
            totalPrice: rent.totalPrice,
            returnDate: rent.returnDate,
            createdAt: rent.createdAt,
            updatedAt: rent.updatedAt,
            returnCondition: rent.returnCondition,
            returnComment: rent.returnComment
        }));

        return NextResponse.json({ success: true, data: mappedReturns });
    } catch (e) {
        return NextResponse.json({ success: false, message: e.message }, { status: 500 });
    }
}

// PUT: Update status (Accept, Pickup, Complete)
export async function PUT(req) {
    const access = await authorize(['admin', ...courierRoles]);
    if (access.response) return access.response;
    try {
        await dbConnect();
        const { rentId, action, condition, comment, returnPhoto, returnPhotoCloudinaryId } = await req.json();

        if (!isObjectId(rentId) || !['accept', 'pickup', 'complete'].includes(action)) return NextResponse.json({ success: false }, { status: 400 });
        const current = await Rent.findById(rentId);
        if (!current) return NextResponse.json({ success: false }, { status: 404 });
        if (current.returnCourierId && String(current.returnCourierId) !== access.user.id && access.user.role !== 'admin') return NextResponse.json({ success: false }, { status: 403 });
        if (current.status !== { accept: 'return_requested', pickup: 'courier_assigned', complete: 'courier_picked_up' }[action]) return NextResponse.json({ success: false }, { status: 409 });
        if (action !== 'accept' && !current.returnCourierId) return NextResponse.json({ success: false }, { status: 409 });
        let updateData = {};
        let notifTitle = "";
        let notifMessage = "";

        if (action === 'accept') {
            updateData = { status: 'courier_assigned', returnCourierId: access.user.id }; // Kuryer topshiriqni qabul qildi
            notifTitle = "Kuryer tayinlandi";
            notifMessage = "Kuryer kitobni qaytarib olish uchun tayinlandi. Tez orada bog'lanadi.";
        } else if (action === 'pickup') {
            updateData = { status: 'courier_picked_up' }; // Kuryer oldi (yo'lda)
            notifTitle = "Kuryer kitobni qabul qildi";
            notifMessage = "Kuryer sizdan kitobni qabul qilib oldi. Tekshiruvdan so'ng to'liq yopiladi.";
        } else if (action === 'complete') {
            updateData = {
                status: 'returned',
                returnCondition: condition,
                returnComment: comment,
                returnPhoto: returnPhoto,
                returnPhotoCloudinaryId: returnPhotoCloudinaryId,
                actualReturnDate: new Date()
            };
            notifTitle = "Ijara yakunlandi";
            notifMessage = condition === 'perfect'
                ? "Kitob muvaffaqiyatli qaytarildi. Xizmatimizdan foydalanganingiz uchun rahmat!"
                : `Kitob qaytarildi. Holati: ${condition}. ${comment ? 'Izoh: ' + comment : ''}`;
        }

        const updated = await Rent.findOneAndUpdate({ _id: rentId, status: current.status, returnCourierId: current.returnCourierId || null }, updateData, { new: true, runValidators: true });

        if (!updated) return NextResponse.json({ success: false }, { status: 409 });
        // Notification & Real-time update
        if (updated && updated.user) {
             // 1. Save Notif
             await Notification.create({
                 user: updated.user,
                 title: notifTitle,
                 message: notifMessage,
                 type: 'success'
             });

             // 2. Pusher Trigger
             try {
                 await pusherServer.trigger(`user-${updated.user}`, "status-update", {
                     message: notifTitle,
                     fullMessage: notifMessage,
                     status: updated.status,
                     orderId: updated._id
                 });
             } catch (pErr) {
                 console.error("Pusher Error:", pErr);
             }
        }

        return NextResponse.json({ success: true, data: publicRecord(updated) });

    } catch (e) {
        return NextResponse.json({ success: false, message: e.message }, { status: 500 });
    }
}
