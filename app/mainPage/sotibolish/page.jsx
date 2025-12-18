"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaStar, 
  FaShoppingCart, 
  FaSearch, 
  FaFilter, 
  FaHeart,
  FaRegHeart,
  FaBolt
} from "react-icons/fa";

// --- MOCK DATA ---
const BOOKS = [
  {
    id: 1,
    title: "Zamonaviy Biologiya",
    author: "Dr. Sarah Johnson",
    price: 45.99,
    oldPrice: 55.99,
    rating: 4.8,
    reviews: 156,
    image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/25745aa5fc-be88d0bb286347101d2b.png",
    category: "Fan",
    store: "BookCity",
    tag: "Yangi"
  },
  {
    id: 2,
    title: "Organic Chemistry",
    author: "Prof. Michael Chen",
    price: 52.99,
    oldPrice: null,
    rating: 4.9,
    reviews: 203,
    image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/9b4b0d5ffc-14429b36cbaf686cd17a.png",
    category: "Kimyo",
    store: "Kitoblar.uz",
    tag: "Top"
  },
  {
    id: 3,
    title: "Jahon Adabiyoti",
    author: "Turli Mualliflar",
    price: 38.99,
    oldPrice: 42.00,
    rating: 4.5,
    reviews: 89,
    image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/607c096b87-40f40db40b3aaeb4c00c.png",
    category: "Adabiyot",
    store: "BookStore",
    tag: null
  },
  {
    id: 4,
    title: "Oliy Matematika",
    author: "Dr. Emma Wilson",
    price: 49.99,
    oldPrice: 60.00,
    rating: 4.7,
    reviews: 124,
    image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/2d20d5d4c4-fdf914593cc48643a79c.png",
    category: "Matematika",
    store: "BookCity",
    tag: "Chegirma"
  }
];

// --- COMPONENTS ---

const SkeletonCard = () => (
  <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm animate-pulse">
    <div className="w-full h-64 bg-gray-200 rounded-2xl mb-4" />
    <div className="flex justify-between items-center mb-3">
      <div className="h-4 w-20 bg-gray-200 rounded" />
      <div className="h-6 w-6 bg-gray-200 rounded-full" />
    </div>
    <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
    <div className="h-4 w-1/2 bg-gray-200 rounded mb-4" />
    <div className="flex justify-between items-end mt-4">
      <div className="h-8 w-24 bg-gray-200 rounded" />
      <div className="h-10 w-28 bg-gray-200 rounded-xl" />
    </div>
  </div>
);

const BookCard = ({ book }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white rounded-[2rem] p-4 border border-slate-100 shadow-lg shadow-slate-100/50 hover:shadow-xl hover:shadow-[#D1F0E0]/40 hover:border-[#96C7B9] transition-all duration-300 relative group"
    >
      {/* Image Area */}
      <div className="relative w-full h-72 rounded-3xl overflow-hidden mb-4 bg-gray-50">
        <Image
          src={book.image}
          alt={book.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
           {book.tag && (
             <span className="px-3 py-1 bg-white/90 backdrop-blur text-xs font-bold text-[#1F2937] rounded-lg shadow-sm">
                🔥 {book.tag}
             </span>
           )}
           <span className="px-3 py-1 bg-[#96C7B9]/80 backdrop-blur text-xs font-bold text-white rounded-lg shadow-sm">
             {book.store}
           </span>
        </div>

        {/* Action Buttons Overlay */}
        <div className={`absolute inset-x-0 bottom-4 px-4 flex gap-2 transition-all duration-300 transform ${isHovered ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
             <button className="flex-1 bg-white/90 backdrop-blur text-[#1F2937] py-3 rounded-xl font-bold text-sm hover:bg-white shadow-lg flex items-center justify-center gap-2">
                 <FaShoppingCart /> Savatcha
             </button>
        </div>

        {/* Favorite Button */}
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-4 right-4 w-10 h-10 bg-white/50 backdrop-blur rounded-full flex items-center justify-center text-[#1F2937] hover:bg-white hover:text-red-500 transition-all shadow-sm"
        >
          {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
        </button>
      </div>

      {/* Content */}
      <div className="px-2 pb-2">
        <div className="flex items-center gap-1 text-yellow-400 text-xs mb-2">
            {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < Math.floor(book.rating) ? "" : "text-gray-300"} />
            ))}
            <span className="text-gray-400 ml-1 font-medium">({book.reviews})</span>
        </div>
        
        <h3 className="text-xl font-bold text-[#1F2937] mb-1 line-clamp-1 group-hover:text-[#96C7B9] transition-colors">
            {book.title}
        </h3>
        <p className="text-sm text-gray-400 mb-4">{book.author}</p>
        
        <div className="flex items-center justify-between">
            <div>
                <span className="text-2xl font-black text-[#96C7B9]">${book.price}</span>
                {book.oldPrice && (
                    <span className="text-sm text-gray-300 line-through ml-2">${book.oldPrice}</span>
                )}
            </div>
            <button className="w-12 h-12 rounded-2xl bg-[#D1F0E0] text-[#1F2937] flex items-center justify-center hover:bg-[#96C7B9] hover:text-white transition-all shadow-md shadow-[#D1F0E0]/50">
                <FaBolt />
            </button>
        </div>
      </div>
    </motion.div>
  );
};

// --- MAIN PAGE ---

export default function MarketPage() {
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("All");

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      
      {/* FILTER & SEARCH HEADER */}
      <div className="sticky top-[80px] z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
           <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Search */}
              <div className="relative w-full md:w-96 group">
                 <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#96C7B9] transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Kitob, muallif yoki janr..." 
                   className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#D1F0E0] transition-all font-bold text-[#1F2937] placeholder-gray-400"
                 />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                 {["Barchasi", "Ilmiy", "Badiiy", "Darsliklar", "Biznes"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all
                        ${filterCategory === cat 
                            ? "bg-[#1F2937] text-white shadow-lg" 
                            : "bg-gray-50 text-gray-500 hover:bg-[#D1F0E0] hover:text-[#1F2937]"
                        }
                      `}
                    >
                        {cat}
                    </button>
                 ))}
                 <button className="px-4 py-3 bg-gray-50 rounded-xl text-gray-500 hover:bg-[#D1F0E0] hover:text-[#1F2937] transition-all">
                     <FaFilter />
                 </button>
              </div>

           </div>
        </div>
      </div>

      {/* CONTENT GRID */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
             {loading ? (
                 <motion.div 
                   key="skeleton"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                 >
                     {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
                 </motion.div>
             ) : (
                 <motion.div 
                    key="content"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                 >
                    {BOOKS.map((book) => (
                        <BookCard key={book.id} book={book} />
                    ))}
                 </motion.div>
             )}
        </AnimatePresence>
      </main>

      {/* FLOATING CART BUTTON */}
      <motion.button
         whileHover={{ scale: 1.1 }}
         whileTap={{ scale: 0.9 }}
         className="fixed bottom-8 right-8 w-16 h-16 bg-[#1F2937] text-white rounded-full shadow-2xl flex items-center justify-center z-50 group hover:shadow-[#96C7B9]/50"
      >
          <div className="relative">
             <FaShoppingCart className="text-2xl group-hover:text-[#96C7B9] transition-colors" />
             <span className="absolute -top-3 -right-3 w-6 h-6 bg-[#96C7B9] text-[#1F2937] text-xs font-bold rounded-full flex items-center justify-center border-2 border-[#1F2937]">
                3
             </span>
          </div>
      </motion.button>

    </div>
  );
}
