"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaStar, 
  FaHeart, 
  FaRegHeart, 
  FaSearch, 
  FaFilter, 
  FaClock,
  FaCalendarAlt,
  FaShoppingCart
} from "react-icons/fa";

// --- MOCK RENTAL DATA ---
const RENTAL_BOOKS = [
  {
    id: 1,
    title: "O‘tkan kunlar",
    author: "Abdulla Qodiriy",
    dailyPrice: 5000,
    rating: 4.8,
    reviews: 120,
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=500&q=60",
    condition: "Yangi",
    minDays: 3,
    category: "Badiiy",
    store: "Kitoblar.uz"
  },
  {
    id: 2,
    title: "Kecha va kunduz",
    author: "Abdulhamid Cho‘lpon",
    dailyPrice: 4500,
    rating: 4.6,
    reviews: 85,
    image: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=500&q=60",
    condition: "Yaxshi",
    minDays: 2,
    category: "Badiiy",
    store: "BookCity"
  },
  {
    id: 3,
    title: "Odam bo‘lish qiyin",
    author: "Xudoyberdi To‘xtaboyev",
    dailyPrice: 3000,
    rating: 4.9,
    reviews: 200,
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=500&q=60",
    condition: "O'rta",
    minDays: 5,
    category: "Bolalar",
    store: "ReadMore"
  },
  {
    id: 4,
    title: "Mehrigiyo",
    author: "Erkin Vohidov",
    dailyPrice: 4000,
    rating: 4.7,
    reviews: 95,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=60",
    condition: "Yangi",
    minDays: 3,
    category: "She'riyat",
    store: "Kitoblar.uz"
  },
];

// --- COMPONENTS ---

const SkeletonRentalCard = () => (
  <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm animate-pulse">
    <div className="w-full h-64 bg-gray-200 rounded-2xl mb-4" />
    <div className="flex justify-between items-center mb-3">
       <div className="h-5 w-24 bg-gray-200 rounded-full" />
       <div className="h-4 w-12 bg-gray-200 rounded" />
    </div>
    <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
    <div className="h-4 w-1/2 bg-gray-200 rounded mb-4" />
    <div className="flex gap-2 mt-4">
       <div className="h-10 flex-1 bg-gray-200 rounded-xl" />
       <div className="h-10 flex-1 bg-gray-200 rounded-xl" />
    </div>
  </div>
);

const RentalCard = ({ book }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [days, setDays] = useState(book.minDays);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-[2rem] p-4 border border-slate-100 shadow-lg shadow-slate-100/50 hover:shadow-2xl hover:shadow-[#D1F0E0]/40 hover:border-[#96C7B9] transition-all duration-300 group relative"
    >
      {/* Image Container */}
      <div className="relative w-full h-72 rounded-3xl overflow-hidden mb-4 bg-gray-50 group">
        <Image
          src={book.image}
          alt={book.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-[#D1F0E0]/90 backdrop-blur text-[#1F2937] text-xs font-bold px-3 py-1 rounded-lg">
                <FaClock className="inline mr-1 mb-0.5" />
                Min: {book.minDays} kun
            </span>
        </div>

        {/* Favorite */}
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-4 right-4 w-10 h-10 bg-white/60 backdrop-blur rounded-full flex items-center justify-center text-[#1F2937] hover:bg-white hover:text-red-500 transition-all shadow-sm"
        >
          {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
        </button>

        {/* Condition Badge */}
        <div className="absolute bottom-4 left-4">
           <span className={`px-3 py-1 rounded-lg text-xs font-bold backdrop-blur
              ${book.condition === 'Yangi' ? 'bg-green-100/90 text-green-700' : 'bg-orange-100/90 text-orange-700'}
           `}>
             Holati: {book.condition}
           </span>
        </div>
      </div>

      {/* Info */}
      <div className="px-2">
         <div className="flex justify-between items-start mb-2">
            <div>
               <h3 className="text-xl font-bold text-[#1F2937] line-clamp-1 group-hover:text-[#96C7B9] transition-colors">{book.title}</h3>
               <p className="text-sm text-gray-400 font-medium">{book.author}</p>
            </div>
            <div className="flex flex-col items-end">
               <span className="text-lg font-black text-[#96C7B9]">{book.dailyPrice.toLocaleString()}</span>
               <span className="text-[10px] text-gray-400">so&apos;m / kun</span>
            </div>
         </div>

         {/* Duration Select */}
         <div className="bg-[#F9FAFB] rounded-xl p-3 mb-4 border border-gray-100 flex justify-between items-center group-hover:border-[#D1F0E0] transition-colors">
            <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                <FaCalendarAlt /> Muddat:
            </span>
            <div className="flex items-center gap-3">
                <button 
                  onClick={() => setDays(d => Math.max(book.minDays, d - 1))}
                  className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-[#1F2937]"
                >
                    -
                </button>
                <span className="font-bold text-[#1F2937] w-4 text-center">{days}</span>
                <button 
                  onClick={() => setDays(d => d + 1)}
                  className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-[#1F2937]"
                >
                    +
                </button>
            </div>
         </div>

         {/* Actions */}
         <div className="flex gap-2">
            <button className="flex-1 bg-white border-2 border-[#D1F0E0] text-[#1F2937] py-3 rounded-xl font-bold text-sm hover:bg-[#D1F0E0] transition-colors flex items-center justify-center gap-2">
                <FaShoppingCart />
            </button>
            <button className="flex-[3] bg-[#1F2937] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#96C7B9] hover:shadow-lg transition-all shadow-gray-200">
                Ijaraga Olish
            </button>
         </div>
      </div>
    </motion.div>
  );
};

// --- MAIN PAGE ---

export default function RentalPage() {
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Barchasi");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      
      {/* HEADER & FILTERS */}
      <div className="sticky top-[80px] z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6 space-y-4">
           {/* Top Row: Search */}
           <div className="flex gap-4">
              <div className="relative flex-1 group">
                 <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#96C7B9] transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Kitob nomini kiriting..." 
                   className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#D1F0E0] transition-all font-bold text-[#1F2937] placeholder-gray-400"
                 />
              </div>
              <button className="bg-[#1F2937] text-white px-8 rounded-2xl font-bold hover:bg-[#96C7B9] transition-colors shadow-lg shadow-gray-200">
                 Qidirsh
              </button>
           </div>

           {/* Bottom Row: Chips */}
           <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              <span className="text-sm font-bold text-gray-400 mr-2 flex items-center gap-1"><FaFilter /> Saralash:</span>
              {["Barchasi", "Badiiy", "Darsliklar", "Bolalar", "Ilmiy"].map((cat) => (
                 <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all border
                        ${activeCategory === cat 
                            ? "bg-[#D1F0E0] border-[#D1F0E0] text-[#1F2937]" 
                            : "bg-white border-gray-100 text-gray-500 hover:border-[#D1F0E0] hover:text-[#1F2937]"
                        }
                    `}
                 >
                    {cat}
                 </button>
              ))}
           </div>
        </div>
      </div>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-10">
         <AnimatePresence mode="wait">
            {loading ? (
                <motion.div 
                   key="loading"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                   {[1, 2, 3, 4].map(i => <SkeletonRentalCard key={i} />)}
                </motion.div>
            ) : (
                <motion.div 
                   key="content"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                   {RENTAL_BOOKS.map(book => (
                      <RentalCard key={book.id} book={book} />
                   ))}
                </motion.div>
            )}
         </AnimatePresence>
      </main>

      {/* FLOATING CART BUTTON (Shared) */}
      <motion.button
         whileHover={{ scale: 1.1 }}
         whileTap={{ scale: 0.9 }}
         className="fixed bottom-8 right-8 w-16 h-16 bg-[#1F2937] text-white rounded-full shadow-2xl flex items-center justify-center z-50 group hover:shadow-[#96C7B9]/50"
      >
          <div className="relative">
             <FaShoppingCart className="text-2xl group-hover:text-[#96C7B9] transition-colors" />
             <span className="absolute -top-3 -right-3 w-6 h-6 bg-[#96C7B9] text-[#1F2937] text-xs font-bold rounded-full flex items-center justify-center border-2 border-[#1F2937]">
                0
             </span>
          </div>
      </motion.button>
    </div>
  );
}
