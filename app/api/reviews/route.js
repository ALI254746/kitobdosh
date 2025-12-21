import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db.Connect";
import Review from "@/model/Review";
import Book from "@/model/Book";
import Order from "@/model/Order";
import Rent from "@/model/Rent";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// GET: Fetch reviews for a book
export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const bookId = searchParams.get("bookId");

        if (!bookId) {
            return NextResponse.json({ success: false, message: "Book ID is required" }, { status: 400 });
        }

        const reviews = await Review.find({ book: bookId })
            .populate("user", "fullName avatar")
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, reviews });
    } catch (e) {
        return NextResponse.json({ success: false, message: e.message }, { status: 500 });
    }
}

// POST: Create a review
export async function POST(req) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { bookId, rating, comment } = await req.json();

        if (!bookId || !rating || !comment) {
            return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
        }

        // Verify ownership: User must have purchased or rented the book
        const hasPurchased = await Order.exists({
            user: session.user.id,
            'items.book': bookId,
            status: { $in: ['completed', 'processing'] }
        });

        const hasRented = await Rent.exists({
            user: session.user.id,
            book: bookId,
            status: { $in: ['approved', 'active', 'returned'] }
        });

        if (!hasPurchased && !hasRented) {
            return NextResponse.json({ 
                success: false, 
                message: "Faqat sotib olgan yoki ijaraga olgan kitoblarga sharh yozishingiz mumkin 📚" 
            }, { status: 403 });
        }

        // 1. Create the review
        const review = await Review.create({
            user: session.user.id,
            book: bookId,
            rating: Number(rating),
            comment,
        });

        // 2. Update Book aggregate data
        const allReviews = await Review.find({ book: bookId });
        const numReviews = allReviews.length;
        const averageRating = allReviews.reduce((acc, rev) => acc + rev.rating, 0) / numReviews;

        await Book.findByIdAndUpdate(bookId, {
            averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
            numReviews,
        });

        return NextResponse.json({ success: true, review });
    } catch (e) {
        if (e.code === 11000) {
            return NextResponse.json({ success: false, message: "Siz allaqachon ushbu kitobga taqriz qoldirgansiz" }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: e.message }, { status: 500 });
    }
}
