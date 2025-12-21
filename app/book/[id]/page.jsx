import React from "react";
import Image from "next/image";
import SafeImage from "@/app/components/SafeImage";
import { dbConnect } from "@/lib/db.Connect";
import Book from "@/model/Book";
import { notFound } from "next/navigation";
import { FaStar, FaShoppingCart, FaBolt, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

// 1. Dinamik Metadata (Google va Telegram uchun)
export async function generateMetadata({ params }) {
    await dbConnect();
    const book = await Book.findById(params.id);
    
    if (!book) return { title: "Kitob topilmadi | KitobDosh" };

    const description = book.description?.substring(0, 160) || "KitobDosh - Talabalar uchun kitoblar olami.";
    const imageUrl = book.images?.[0] || "https://kitobdosh.uz/og-image.jpg";

    return {
        title: `${book.title} - ${book.author} | KitobDosh`,
        description,
        openGraph: {
            title: book.title,
            description,
            images: [{ url: imageUrl }],
            type: 'book',
        },
        twitter: {
            card: 'summary_large_image',
            title: book.title,
            description,
            images: [imageUrl],
        },
    };
}

export default async function BookPage({ params }) {
    const { id } = params;
    await dbConnect();
    const book = await Book.findById(id);

    if (!book) notFound();

    // JSON-LD Structured Data (Google Qidiruv uchun)
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Book",
        "name": book.title,
        "author": {
            "@type": "Person",
            "name": book.author
        },
        "description": book.description,
        "image": book.images?.[0],
        "offers": {
            "@type": "Offer",
            "price": book.price,
            "priceCurrency": "UZS",
            "availability": book.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": book.averageRating || 5,
            "reviewCount": book.numReviews || 1
        }
    };

    return (
        <main className="min-h-screen bg-white dark:bg-slate-900 transition-colors pt-24 pb-12">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            
            <div className="max-w-7xl mx-auto px-6">
                <Link href="/mainPage/sotibolish" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#96C7B9] transition-colors mb-8 font-bold">
                    <FaArrowLeft /> Ortga qaytish
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Chap taraf: Rasm */}
                    <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl border-2 border-gray-100 dark:border-slate-800">
                        <SafeImage 
                            src={book.images?.[0]} 
                            fallbackSrc="https://placehold.co/600x800"
                            alt={book.title} 
                            fill 
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* O'ng taraf: Ma'lumotlar */}
                    <div className="flex flex-col">
                        <div className="mb-6">
                            <span className="px-4 py-1.5 bg-[#D1F0E0] dark:bg-blue-900/30 text-[#96C7B9] dark:text-blue-400 rounded-full text-sm font-black uppercase tracking-widest">
                                {book.category}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black mb-4 text-slate-800 dark:text-white leading-tight">
                            {book.title}
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-gray-500 dark:text-slate-400 mb-8 font-medium">
                            Muallif: <span className="text-slate-800 dark:text-slate-200">{book.author}</span>
                        </p>

                        <div className="flex items-center gap-6 mb-10">
                            <div className="flex items-center gap-2">
                                <FaStar className="text-yellow-400 text-2xl" />
                                <span className="text-2xl font-black text-slate-800 dark:text-white">
                                    {book.averageRating || 0}
                                </span>
                                <span className="text-gray-400 font-bold">({book.numReviews || 0} ta sharh)</span>
                            </div>
                            <div className="w-px h-8 bg-gray-200 dark:bg-slate-700" />
                            <div className={`px-4 py-1 rounded-lg font-bold ${book.stock > 0 ? 'text-green-500 bg-green-50 dark:bg-green-900/20' : 'text-red-500 bg-red-50'}`}>
                                {book.stock > 0 ? `Omborda: ${book.stock} ta` : 'Tugagan'}
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-slate-800/50 rounded-[2rem] p-8 mb-10">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <p className="text-sm font-bold text-gray-400 uppercase mb-1">Sotuv narxi</p>
                                    <p className="text-4xl font-black text-[#96C7B9]">{book.price?.toLocaleString()} <span className="text-lg">so'm</span></p>
                                </div>
                                {book.isRentable && (
                                    <div className="md:text-right">
                                        <p className="text-sm font-bold text-gray-400 uppercase mb-1">Ijara narxi (kuniga)</p>
                                        <p className="text-3xl font-black text-blue-500">{book.rentalPricePerDay?.toLocaleString()} <span className="text-lg">so'm</span></p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 mb-12">
                            <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-wider">Kitob haqida</h3>
                            <p className="text-lg text-gray-600 dark:text-slate-400 leading-relaxed">
                                {book.description || "Ushbu kitob haqida ma'lumot kiritilmagan."}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                           <button className="flex-1 bg-[#1F2937] text-white py-5 rounded-2xl font-black text-lg hover:bg-[#96C7B9] transition-all flex items-center justify-center gap-3 active:scale-95">
                                <FaShoppingCart /> Savatchaga qo'shish
                           </button>
                           {book.isRentable && (
                               <button className="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-500 transition-all flex items-center justify-center gap-3 active:scale-95">
                                   <FaBolt /> Hoziroq ijara olish
                               </button>
                           )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
