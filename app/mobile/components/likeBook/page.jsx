"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaStar, FaHeart } from "react-icons/fa";
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

const books = [
  {
    id: 1,
    title: "Ingliz tili",
    author: "M. Azimova",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=240&fit=crop",
  },
  {
    id: 2,
    title: "Geografiya",
    author: "R. Qodirov",
    rating: 4.2,
    image:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=240&fit=crop",
  },
  {
    id: 3,
    title: "Informatika",
    author: "O. Sharipov",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=240&fit=crop",
  },
];

export default function RecommendedBooks() {
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState({});

  useEffect(() => {
    setTimeout(() => setLoading(false), 1200);
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
          : books.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ scale: 1.03 }}
                className="min-w-[160px] bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden flex-shrink-0"
              >
                {/* Image */}
                <div className="relative w-full h-48">
                  <Image
                    src={book.image}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />

                  {/* Like */}
                  <button
                    onClick={() =>
                      setLiked({ ...liked, [book.id]: !liked[book.id] })
                    }
                    className="absolute top-3 right-3 bg-white/80 p-2 rounded-full"
                  >
                    <FaHeart
                      className={`text-sm transition ${
                        liked[book.id] ? "text-red-500" : "text-gray-400"
                      }`}
                    />
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
                    <span className="text-xs font-semibold text-gray-700">
                      {book.rating}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 py-2 rounded-xl text-xs font-semibold hover:bg-blue-200 dark:hover:bg-blue-900/50 transition">
                      Ijara
                    </button>
                    <button className="flex-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 py-2 rounded-xl text-xs font-semibold hover:bg-purple-200 dark:hover:bg-purple-900/50 transition">
                      Sotib
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
      </div>
    </section>
  );
}
