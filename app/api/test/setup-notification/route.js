import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db.Connect";
import Rent from "@/model/Rent";
import Notification from "@/model/Notification";
import User from "@/model/user";
import Book from "@/model/Book";

export async function GET() {
    try {
        await dbConnect();
        
        let rent = await Rent.findOne({ status: 'active' });
        
        if (!rent) {
            // Create a fake rent for testing
            const user = await User.findOne(); // Any user
            const book = await Book.findOne(); // Any book
            
            if(!user || !book) return NextResponse.json({message: "User or Book not found for mock data"});

            rent = await Rent.create({
                userId: user._id,
                bookId: book._id,
                startDate: new Date(),
                returnDate: new Date(), // Will be updated below
                totalPrice: 5000,
                status: 'active',
                paymentStatus: 'paid'
            });
            console.log("Created mock rent:", rent._id);
        }

        // Set returnDate to TOMORROW (triggers '1 day left' notification)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        rent.returnDate = tomorrow;
        await rent.save();

        // Clear existing rental notifications for this user/rent to test fresh
        await Notification.deleteMany({
             user: rent.userId,
             type: 'rental_expiry',
             'data.rentId': rent._id
        });

        return NextResponse.json({ 
            success: true, 
            message: `Ijara (ID: ${rent._id}) muddati ertangi kunga o'zgartirildi. User: ${rent.userId}`,
            rent
        });

    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
