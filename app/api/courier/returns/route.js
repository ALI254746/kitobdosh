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
    try {
        await dbConnect();
        
        // Include all return-related statuses
        const returns = await Rent.find({ 
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
            userPhone: rent.phone || rent.user?.phone,
            userAddress: rent.address || rent.user?.address || rent.user?.location,
            userEmail: rent.user?.email,
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
    try {
        await dbConnect();
        const { rentId, action, condition, comment, returnPhoto, returnPhotoCloudinaryId } = await req.json();

        let updateData = {};
        let notifTitle = "";
        let notifMessage = "";
        
        if (action === 'accept') {
            updateData = { status: 'courier_assigned' }; // Kuryer topshiriqni qabul qildi
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

        const updated = await Rent.findByIdAndUpdate(rentId, updateData, { new: true });
        
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

        return NextResponse.json({ success: true, data: updated });

    } catch (e) {
        return NextResponse.json({ success: false, message: e.message }, { status: 500 });
    }
}
