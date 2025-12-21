import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db.Connect";
import Book from "@/model/Book";
import User from "@/model/user";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const sort = searchParams.get("sort") || "createdAt";
    const type = searchParams.get("type"); // 'rent' or 'sale'

    await dbConnect();

    // --- CASE 1: SEARCH BY ID (For Book Detail Page) ---
    if (id) {
        const book = await Book.findById(id);
        if (!book) {
            return NextResponse.json({ success: false, message: "Kitob topilmadi" }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            books: [{
                _id: book._id,
                title: book.title,
                author: book.author,
                image: book.images?.[0] || book.image || "",
                category: book.category,
                price: book.price,
                rentalPrice: book.rentalPricePerDay,
                rating: book.averageRating || 5.0,
                description: book.description,
                isRentable: book.isRentable
            }],
            pagination: { total: 1, page: 1, pages: 1 }
        });
    }

    // --- 1. CONSTRUCT FILTER ---
    const bookRegex = new RegExp(query, "i");
    let bookFilter = {
      $and: [
          {
            $or: [
                { title: bookRegex },
                { author: bookRegex },
                { category: bookRegex },
                { publisher: bookRegex }
            ]
          }
      ]
    };

    if (category && category !== "Asosiy") {
        bookFilter.$and.push({ category: new RegExp(category, "i") });
    }

    // Filter by type: 'rent' maps to isRentable: true, 'sale' maps to isRentable: false
    // Note: Some books might be both, but here we prioritize the main intention
    if (type === 'rent') {
        bookFilter.$and.push({ isRentable: true });
    } else if (type === 'sale') {
        // Books that are for sale (usually all, but let's be explicitly excluding if needed)
        // For now, assume if it's not rent focus, it's sale focus
        bookFilter.$and.push({ price: { $gt: 0 } }); 
    }

    const skip = (page - 1) * limit;

    // Parallel Fetching
    const [books, totalBooks] = await Promise.all([
        Book.find(bookFilter)
            .sort({ [sort]: -1 })
            .skip(skip)
            .limit(limit)
            .select("title author images category price rentalPricePerDay averageRating isRentable"),
        Book.countDocuments(bookFilter)
    ]);

    // OPTIONAL: Mualliflar va Foydalanuvchilarni ham topish (Global Search uchun)
    let people = [];
    if (query && page === 1) {
        // MUALLIFLARNI QIDIRISH (Kitoblar orasidan)
        const matchingAuthors = await Book.distinct("author", { author: bookRegex });
        const authorObjects = matchingAuthors.slice(0, 3).map(name => ({
            _id: name,
            name: name,
            type: 'author'
        }));

        // FOYDALANUVCHILARNI QIDIRISH (User modelidan)
        const userRegex = new RegExp(query, "i");
        const foundUsers = await User.find({
            $or: [
                { fullName: userRegex },
                { email: userRegex }
            ]
        })
        .select("fullName avatar email")
        .limit(5)
        .lean();

        const userObjects = foundUsers.map(user => ({
            _id: user._id,
            name: user.fullName || user.email.split('@')[0],
            avatar: user.avatar,
            email: user.email,
            type: 'user'
        }));

        people = [...authorObjects, ...userObjects];
    }

    return NextResponse.json({
      success: true,
      books: books.map(book => ({
          _id: book._id,
          title: book.title,
          author: book.author,
          image: book.images?.[0] || "",
          category: book.category,
          price: book.price,
          rentalPrice: book.rentalPricePerDay,
          rating: book.averageRating || 5.0,
          isRentable: book.isRentable
      })),
      people: people,
      pagination: {
          total: totalBooks,
          page,
          pages: Math.ceil(totalBooks / limit)
      }
    });

  } catch (error) {
    console.error("User Search API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
