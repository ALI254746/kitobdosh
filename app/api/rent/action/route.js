import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db.Connect";
import Rent from "@/model/Rent";
import Notification from "@/model/Notification";
import { pusherServer } from "@/lib/pusher";

export async function POST(req) {
    try {
        await dbConnect();
        const reqData = await req.json();
        const { rentId, action, notifId, days } = reqData;

        if (!rentId || !action) {
            return NextResponse.json({ success: false, message: "Ma'lumot kam" }, { status: 400 });
        }

        const rent = await Rent.findById(rentId).populate('user', 'fullName address location phone').populate('book', 'title');
        
        if (!rent) {
            return NextResponse.json({ success: false, message: "Ijara topilmadi" }, { status: 404 });
        }

        if (action === 'return') {
            // 1. Update Rent Status
            rent.status = 'return_requested';
            await rent.save();

            // 2. Notify Courier (Pusher) - trigger 'new-job' for couriers
             try {
                 await pusherServer.trigger("courier-channel", "new-job", {
                     message: "Yangi Qaytarish So'rovi!",
                     address: rent.user.address || rent.user.location || "Manzil yo'q",
                     rentId: rent._id,
                     bookTitle: rent.book?.title
                 });
                 
                 // Notify the user too
                 await pusherServer.trigger(`user-${rent.user._id}`, "status-update", {
                    message: "Qaytarish so'rovi yuborildi",
                    fullMessage: `"${rent.book?.title || rent.bookTitle}" kitobi uchun kuryerga xabar berildi.`,
                    type: "info"
                 });
             } catch (pErr) {
                 console.error("Pusher Courier Error:", pErr);
             }

        } else if (action === 'extend') {
            // 1. Extend Date by X Days
            const extendDays = days || 1; // Use 'days' from request body
            
            const baseDate = rent.returnDate && new Date(rent.returnDate) > new Date() 
                ? new Date(rent.returnDate) 
                : new Date();
            
            const newDate = new Date(baseDate);
            newDate.setDate(newDate.getDate() + extendDays);
            
            rent.returnDate = newDate;
            rent.days = (rent.days || 1) + extendDays; 
            
            await rent.save();

            // Notify user via Pusher
            try {
                await pusherServer.trigger(`user-${rent.user._id}`, "status-update", {
                    message: "Ijara uzaytirildi",
                    fullMessage: `"${rent.book?.title || rent.bookTitle}" kitobining ijarasi ${extendDays} kunga uzaytirildi. Yangi muddat: ${newDate.toLocaleDateString('uz-UZ')}`,
                    type: "success"
                });
            } catch (pErr) {
                console.error("Pusher Extend Error:", pErr);
            }
        }

        // 3. Mark Notification as Read AND Update Type to Success
        if (notifId) {
            const finalMessage = action === 'return' 
                ? "Topshirish so'rovi yuborildi. Kuryer tez orada bog'lanadi." 
                : `Ijara muddati ${days || 1} kunga uzaytirildi.`;

            await Notification.findByIdAndUpdate(notifId, { 
                isRead: true,
                type: 'success',
                message: finalMessage 
            });
        }

        return NextResponse.json({ 
            success: true, 
            message: action === 'return' ? "Kuryerga xabar berildi. Kutib turing!" : `Ijara muddati ${days || 1} kunga uzaytirildi.` 
        });

    } catch (error) {
        console.error("Rent Action API Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
