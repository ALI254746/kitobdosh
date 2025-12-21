import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db.Connect";
import Rent from "@/model/Rent";
import Notification from "@/model/Notification";
import { pusherServer } from "@/lib/pusher";

export const dynamic = 'force-dynamic'; // Prevent caching

export async function GET(req) {
    try {
        await dbConnect();

        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const filter = { 
            status: 'active',
            returnDate: { $lte: tomorrow }
        };

        const expiringRentals = await Rent.find(filter).populate('user', 'fullName').populate('book', 'title');

        let notifiedCount = 0;

        for (const rent of expiringRentals) {
            // Safety check: ensure populated fields exist
            if (!rent.user || !rent.book) {
                console.warn(`Skipping malformed rent ${rent._id}: Missing user or book`);
                continue;
            }

            // Check if we already notified recently to avoid spam (Simple check: if notification exists for this rent today)
            // But for simplicity now, let's just create one.

            // 1. Create Notification (Action Required)
            const daysLeft = Math.ceil((new Date(rent.returnDate) - now) / (1000 * 60 * 60 * 24));
            let message = "";
            let title = "";

            if (daysLeft < 0) {
                title = "Ijara muddati tugadi!";
                message = `"${rent.book.title}" kitobining ijara muddati tugagan. Iltimos, qaytaring yoki uzaytiring.`;
            } else if (daysLeft === 0) {
                 title = "Ijara bugun tugaydi!";
                 message = `"${rent.book.title}" kitobining ijara muddati bugun tugaydi.`;
            } else {
                 title = "Ijara muddati oz qoldi";
                 message = `"${rent.book.title}" kitobini qaytarishga 1 kun qoldi.`;
            }

            // Avoid duplicate notification for same day?? 
            // Better logic: store 'lastNotifiedAt' on Rent model.
            // For now, let's just send it.

            const notif = await Notification.create({
                user: rent.user._id,
                title: title,
                message: message,
                type: "rental_expiry", // Desktop va Mobile uchun bir xil
                data: {
                    rentId: rent._id,
                    bookTitle: rent.book.title
                }
            });

            // 2. Pusher Trigger
            try {
                await pusherServer.trigger(`user-${rent.user._id}`, "status-update", {
                    message: title,
                    fullMessage: message,
                    type: "rental_expiry",
                    data: {
                        rentId: rent._id,
                        bookTitle: rent.book.title
                    }
                });
            } catch (pErr) {
                console.error("Pusher Error:", pErr);
            }

            notifiedCount++;
        }

        return NextResponse.json({ 
            success: true, 
            processed: expiringRentals.length, 
            notified: notifiedCount,
            message: "Rentals checked successfully" 
        });

    } catch (error) {
        console.error("Cron Job Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
