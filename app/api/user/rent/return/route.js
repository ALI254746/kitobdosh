import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db.Connect";
import Rent from "@/model/Rent";
import Notification from "@/model/Notification"; // Optional: Notify couriers?

export async function POST(req) {
    try {
        await dbConnect();
        const { rentId } = await req.json();

        if (!rentId) {
            return NextResponse.json({ success: false, message: "Rent ID required" }, { status: 400 });
        }

        // Update status to 'return_requested'
        // Bu status user kitobni qaytarmoqchi ekanligini bildiradi
        const updatedRent = await Rent.findByIdAndUpdate(
            rentId, 
            { status: 'return_requested' }, 
            { new: true }
        );

        if (!updatedRent) {
            return NextResponse.json({ success: false, message: "Ijara topilmadi" }, { status: 404 });
        }

        // Optional: Create a generic notification for couriers or admin?
        // For now, simple response is enough as Courier Panel will poll/fetch this list.

        return NextResponse.json({ success: true, message: "Qaytarish so'rovi yuborildi. Kuryer tez orada bog'lanadi." });

    } catch (error) {
        console.error("Return Request Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
