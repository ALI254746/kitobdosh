"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import SafeImage from "@/app/components/SafeImage";

import { useCart } from "@/app/CartContext";
import { useFavorites } from "@/app/FavoritesContext";
import { FaHeart, FaRegHeart, FaStar, FaCartPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
function BookSkeleton() {
  return (
    <div className="min-w-[160px] bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
        <div className="flex gap-2 mt-3">
          <div className="flex-1 h-8 bg-gray-200 rounded-xl" />
          <div className="flex-1 h-8 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function PopularBooks({ data }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [books, setBooks] = useState(data || []);
  const [loading, setLoading] = useState(!data);

  useEffect(() => {
    if (data) return; // Skip fetch if data provided via props
    async function fetchBooks() {
      try {
        const res = await fetch("/api/books/best");
        const data = await res.json();
        
        if (data.success && data.data.length > 0) {
            setBooks(data.data);
        } else {
            // Fallback if no books found
             console.log("Kitoblar topilmadi, API bo'sh qaytdi");
        }
      } catch (err) {
        console.error("Kitoblarni yuklashda xatolik:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  return (
    <div className="mb-6">
      <div className="px-5 mb-3">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
          Eng ko‘p o‘qilayotgan kitoblar
        </h2>
      </div>

      <div className="flex gap-4 overflow-x-auto hide-scrollbar px-5 pb-2">
        {loading &&
          Array.from({ length: 4 }).map((_, i) => <BookSkeleton key={i} />)}

        {!loading && Array.isArray(books) &&
          books.map((book) => (
            <div
              key={book._id}
              onClick={() => router.push(`/mobile/book/${book._id}`)}
              className="min-w-[160px] bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden flex-shrink-0 
              transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
            >
              {/* Image + Like */}
              <div className="relative w-full h-48">
                <SafeImage
                  src={book.images?.[0] || book.image}
                  fallbackSrc="https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=240&fit=crop"
                  alt={book.title}
                  fill
                  className="object-cover"
                  priority={books.indexOf(book) < 2}
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(book._id);
                  }}
                  className="absolute top-2 right-2 bg-white/90 dark:bg-slate-800/90 rounded-full p-1.5 
                  hover:scale-110 transition z-10"
                >
                  {isFavorite(book._id) ? (
                    <FaHeart className="w-4 h-4 text-red-500" />
                  ) : (
                    <FaRegHeart className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>

              <div className="p-3">
                <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-1 line-clamp-1">
                  {book.title}
                </h3>

                <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">{book.author}</p>

                {/* ⭐ Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <FaStar className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs font-medium text-gray-700 dark:text-slate-300">
                    {book.rating || "5.0"}
                  </span>
                </div>

                {/* Actions: Rent Only */}
                <div className="flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(book, 'rent');
                        router.push('/mobile/components/checkout');
                      }}
                      className="flex-1 bg-[#52C6DA] text-white py-2 rounded-xl text-xs font-black uppercase tracking-tighter hover:bg-[#52C6DA]/90 shadow-md shadow-[#52C6DA]/20 transition active:scale-95"
                    >
                      Ijara
                    </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // This will add to cart as rent by default
                      addToCart(book, 'rent');
                    }}
                    className="w-10 h-9 bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-300 rounded-xl flex items-center justify-center hover:bg-[#52C6DA]/10 hover:text-[#52C6DA] transition"
                  >
                    <FaCartPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
