"use client";

import Image from "next/image";
import { Star, Heart } from "lucide-react";
import { useState, useEffect } from "react";
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

export default function PopularBooks() {
  const [liked, setLiked] = useState({});
  const [loading, setLoading] = useState(true);
  const books = [
    {
      id: 1,
      title: "Biologiya asoslari",
      author: "A. Karimov",
      image:
        "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=240&fit=crop",
      rating: 4.5,
    },
    {
      id: 2,
      title: "Fizika qonunlari",
      author: "B. Rahimov",
      image:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=240&fit=crop",
      rating: 4.9,
    },
    {
      id: 3,
      title: "Kimyo tarixi",
      author: "D. Aliyev",
      image:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=240&fit=crop",
      rating: 5.0,
    },
    {
      id: 4,
      title: "O'zbek adabiyoti",
      author: "N. Yusupov",
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=240&fit=crop",
      rating: 4.4,
    },
    {
      id: 5,
      title: "Matematika",
      author: "S. Toshmatov",
      image:
        "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=240&fit=crop",
      rating: 4.7,
    },
  ];
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
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

        {!loading &&
          books.map((book) => (
            <div
              key={book.id}
              className="min-w-[160px] bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden flex-shrink-0 
              transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Image + Like */}
              <div className="relative w-full h-48">
                <Image
                  src={book.image}
                  alt={book.title}
                  fill
                  className="object-cover"
                />

                <button
                  onClick={() =>
                    setLiked((prev) => ({
                      ...prev,
                      [book.id]: !prev[book.id],
                    }))
                  }
                  className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 
                  hover:scale-110 transition"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      liked[book.id]
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400"
                    }`}
                  />
                </button>
              </div>

              <div className="p-3">
                <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-1 line-clamp-1">
                  {book.title}
                </h3>

                <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">{book.author}</p>

                {/* ⭐ Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium text-gray-700">
                    {book.rating}
                  </span>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 py-2 rounded-xl text-xs font-semibold hover:bg-blue-200 dark:hover:bg-blue-900/50 transition">
                    Ijara
                  </button>
                  <button className="flex-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 py-2 rounded-xl text-xs font-semibold hover:bg-purple-200 dark:hover:bg-purple-900/50 transition">
                    Sotib
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
