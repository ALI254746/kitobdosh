"use client";
import React from "react";
import { FaStar, FaHeart, FaCommentAlt, FaShoppingCart } from "react-icons/fa";
import { useState } from "react";
import Image from "next/image";
const books = [
  {
    id: 1,
    title: "O‘tkan kunlar",
    author: "Abdulla Qodiriy",
    price: "5 000 so‘m / kun",
    rating: 4.8,
    img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 2,
    title: "Kecha va kunduz",
    author: "Cho‘lpon",
    price: "4 500 so‘m / kun",
    rating: 4.6,
    img: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 3,
    title: "Odam bo‘lish qiyin",
    author: "Xudoyberdi To‘xtaboyev",
    price: "3 000 so‘m / kun",
    rating: 4.9,
    img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 4,
    title: "Mehrigiyo",
    author: "Erkin Vohidov",
    price: "4 000 so‘m / kun",
    rating: 4.7,
    img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=60",
  },
];

export default function IjaraBookPage() {
  const [price, setPrice] = useState(50); // default qiymat 50%

  // 0-100 oralig‘ini 0-10000 so‘m ga o‘zgartiramiz
  const minPrice = 0;
  const maxPrice = 10000;
  const displayPrice = Math.round((price / 100) * maxPrice);
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 pt-28 pb-16 px-6">
      {/* FILTER BO‘LIMI */}
      <section id="search-filter">
        <div className="max-w-7xl mx-auto px-6 ">
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* QIDIRUV */}
              <div className="flex-1 w-full">
                <input
                  type="text"
                  placeholder="Kitob, muallif yoki do‘kon nomi..."
                  className="w-full text-gray-900 pl-4 pr-4 py-3 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                />
              </div>

              {/* FILTRLAR */}
              <div className="flex flex-wrap gap-3">
                <select className="px-4 py-3 border text-gray-900 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-400 transition-all duration-300">
                  <option>Barcha toifalar</option>
                  <option>Biologiya</option>
                  <option>Kimyo</option>
                  <option>Adabiyot</option>
                </select>

                <select className="px-4 py-3 border text-gray-900 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-400 transition-all duration-300">
                  <option>Barcha do‘konlar</option>
                  <option>BookCity</option>
                  <option>Kitoblar.uz</option>
                  <option>ReadMore</option>
                </select>

                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-32 accent-blue-400"
                  />
                  <span className="text-blue-700 font-semibold">
                    {displayPrice.toLocaleString()} so‘m
                  </span>
                </div>

                <select className="px-4 py-3 border text-gray-900 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-400 transition-all duration-300">
                  <option>Saralash</option>
                  <option>Eng arzon</option>
                  <option>Eng yuqori reyting</option>
                  <option>Eng yangi</option>
                </select>

                <button className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-300">
                  Qidirish
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KITOBLAR GRID */}
      <div className="max-w-7xl mx-auto mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {books.map((book) => (
            <div
              key={book.id}
              className="relative bg-white/70 backdrop-blur-md rounded-2xl p-4 shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300"
            >
              <div className="absolute top-4 right-4 text-red-500 hover:text-red-600 cursor-pointer transition-colors">
                <FaHeart />
              </div>

              <Image
                src={book.img}
                alt={book.title}
                className="w-full h-56 object-cover rounded-xl mb-4"
                width={300}
                height={224}
              />

              <h3 className="text-lg font-semibold text-blue-900">
                {book.title}
              </h3>
              <p className="text-sm text-blue-700 mb-2">{book.author}</p>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-yellow-400">
                  <FaStar />
                  <span className="text-sm text-blue-800">{book.rating}</span>
                </div>
                <FaCommentAlt className="text-blue-400 cursor-pointer hover:scale-110 transition-transform" />
              </div>

              <p className="text-green-600 font-semibold mb-3">{book.price}</p>

              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 bg-green-400 text-black font-semibold  rounded-2xl hover:bg-green-500 transition-all duration-300">
                  <FaShoppingCart className="w-10 text-blue-700" /> Savatga
                  qo‘shish
                </button>
                <button className="flex-1 bg-blue-500 text-white font-semibold py-2 rounded-2xl hover:bg-blue-600 transition-all duration-300">
                  Ijaraga olish
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
