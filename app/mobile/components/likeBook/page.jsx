"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import { motion } from "framer-motion";
import { FaStar, FaHeart, FaRegHeart, FaCartPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/CartContext";
import { useFavorites } from "@/app/FavoritesContext";

function BookSkeleton() {
  return (
    <div className="min-w-[160px] bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-200" />
      <div className="p-3 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="flex gap-2">
          <div className="flex-1 h-8 bg-gray-200 rounded-xl" />
          <div className="flex-1 h-8 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function RecommendedBooks({ data }) {
  const [loading, setLoading] = useState(!data);
  const [books, setBooks] = useState(data || []);
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    if (data) return; // Skip fetch if data provided via props
    async function fetchRecommended() {
        try {
            const res = await fetch("/api/books?limit=6&page=2"); // Fetch different books for variety
            const data = await res.json();
            if (data.success) {
                setBooks(data.data);
            }
        } catch (e) {
            console.error("Recommended fetch error:", e);
        } finally {
            setLoading(false);
        }
    }
    fetchRecommended();
  }, []);

  return (
    <section className="mb-6">
      <div className="px-5 mb-3">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
          Tavsiya etilgan kitoblar
        </h2>
      </div>

      <div className="flex gap-4 overflow-x-auto hide-scrollbar px-5">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <BookSkeleton key={i} />)
          : Array.isArray(books) && books.map((book, index) => (
              <motion.div
                key={book._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ scale: 1.03 }}
                className="min-w-[160px] bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden flex-shrink-0 cursor-pointer"
                onClick={() => router.push(`/mobile/book/${book._id}`)}
              >
                {/* Image */}
                <div className="relative w-full h-48">
                  <Image
                    src={book.images?.[0] || "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=240&fit=crop"}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />

                  {/* Like */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(book._id);
                    }}
                    className="absolute top-3 right-3 bg-white/80 dark:bg-slate-800/80 p-2 rounded-full z-10"
                  >
                    {isFavorite(book._id) ? (
                        <FaHeart className="text-sm text-red-500 transition" />
                    ) : (
                        <FaRegHeart className="text-sm text-gray-400 transition" />
                    )}
                  </button>
                </div>

                {/* Content */}
                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 dark:text-white text-sm line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">{book.author}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <FaStar className="text-yellow-400 text-sm" />
                    <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">
                      {book.rating || "5.0"}
                    </span>
                  </div>

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
                        addToCart(book, 'rent');
                      }}
                      className="w-10 h-9 bg-slate-50 dark:bg-slate-700/50 text-slate-400 dark:text-slate-300 rounded-xl flex items-center justify-center hover:bg-[#52C6DA]/10 hover:text-[#52C6DA] transition"
                    >
                      <FaCartPlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
      </div>
    </section>
  );
}
