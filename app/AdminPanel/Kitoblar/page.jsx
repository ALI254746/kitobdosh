"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaEdit, FaTrash, FaSearch, FaPlus, FaFilter, FaSortAmountDown, FaLayerGroup, FaTags, FaStar, FaBookmark } from "react-icons/fa";
import { useAdmin } from "../AdminContext";

const initialBooks = [
  {
    id: 1,
    title: "Jinoyat va Jazo",
    author: "Fyodor Dostoyevskiy",
    genre: "Badiiy",
    price: "45,000 UZS",
    rentPrice: "5,000 UZS/kun",
    status: "Mavjud",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop",
  },
  {
    id: 2,
    title: "O'tkan kunlar",
    author: "Abdulla Qodiriy",
    genre: "Tarixiy",
    price: "38,000 UZS",
    rentPrice: "4,000 UZS/kun",
    status: "Ijarada",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop",
  },
  {
    id: 3,
    title: "Mehrobdan chayon",
    author: "Abdulla Qahhor",
    genre: "Badiiy",
    price: "35,000 UZS",
    rentPrice: "3,500 UZS/kun",
    status: "Mavjud",
    cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=450&fit=crop",
  },
  {
    id: 4,
    title: "Alkimyogar",
    author: "Paulo Koelo",
    genre: "Falsafiy",
    price: "42,000 UZS",
    rentPrice: "4,500 UZS/kun",
    status: "Mavjud",
    cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&h=450&fit=crop",
  },
   {
    id: 5,
    title: "Ikki eshik orasi",
    author: "O'tkir Hoshimov",
    genre: "Badiiy",
    price: "50,000 UZS",
    rentPrice: "6,000 UZS/kun",
    status: "Zarar yetgan",
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop",
  },
];

// --- COMPONENTS ---

const FilterSidebar = ({ darkMode }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`hidden lg:block w-72 rounded-2xl p-6 h-fit sticky top-28 border backdrop-blur-md
                ${darkMode 
                    ? "bg-[#163201]/40 border-[#A3ED96]/20" 
                    : "bg-white border-gray-100 shadow-xl"
                }
            `}
        >
            <h3 className={`text-lg font-black mb-6 flex items-center gap-2 ${darkMode ? "text-white" : "text-[#163201]"}`}>
                <FaFilter className="text-[#A3ED96]" /> Filterlar
            </h3>

            {/* Categories */}
            <div className="mb-8">
                <p className={`text-xs font-bold uppercase tracking-wider mb-4 ${darkMode ? "text-[#A3ED96]/60" : "text-gray-400"}`}>
                    Kategoriyalar
                </p>
                <div className="space-y-2">
                    {['Barchasi', 'Badiiy', 'Ilmiy', 'Tarixiy', 'Bolalar', 'Falsafiy'].map((item, index) => (
                        <div key={index} className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 group
                            ${index === 0 
                                ? (darkMode ? "bg-[#A3ED96] text-[#163201]" : "bg-[#163201] text-[#A3ED96]")
                                : (darkMode ? "hover:bg-white/5 text-gray-300" : "hover:bg-gray-50 text-gray-600")
                            }
                        `}>
                            <div className="flex items-center gap-3">
                                {index === 0 ? <FaLayerGroup /> : <FaTags className="opacity-70" />}
                                <span className="font-bold text-sm">{item}</span>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-md font-bold
                                ${index === 0 
                                    ? "bg-black/10" 
                                    : (darkMode ? "bg-white/10" : "bg-gray-100")
                                }
                            `}>
                               {index === 0 ? '124' : Math.floor(Math.random() * 50)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

             {/* Status */}
             <div>
                <p className={`text-xs font-bold uppercase tracking-wider mb-4 ${darkMode ? "text-[#A3ED96]/60" : "text-gray-400"}`}>
                    Holat bo&apos;yicha
                </p>
                <div className="space-y-2">
                     <div className={`p-3 rounded-xl border-l-4 border-green-500 cursor-pointer ${darkMode ? "bg-white/5 hover:bg-white/10" : "bg-gray-50 hover:bg-gray-100"}`}>
                         <div className="flex justify-between items-center">
                             <span className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-700"}`}>Mavjud</span>
                             <FaStar className="text-green-500 text-xs" />
                         </div>
                     </div>
                     <div className={`p-3 rounded-xl border-l-4 border-yellow-500 cursor-pointer ${darkMode ? "bg-white/5 hover:bg-white/10" : "bg-gray-50 hover:bg-gray-100"}`}>
                         <div className="flex justify-between items-center">
                             <span className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-700"}`}>Ijarada</span>
                             <FaBookmark className="text-yellow-500 text-xs" />
                         </div>
                     </div>
                </div>
            </div>
        </motion.div>
    )
}

const BookSkeleton = ({ darkMode }) => {
    const shimmerBase = darkMode ? "bg-[#A3ED96]/[0.05]" : "bg-gray-200";
    return (
        <div className={`rounded-2xl p-4 animate-pulse flex flex-col gap-4 border ${darkMode ? 'border-[#A3ED96]/10' : 'border-gray-100'}`}>
            <div className={`w-full h-48 rounded-xl ${shimmerBase}`} />
            <div className={`w-3/4 h-6 rounded-lg ${shimmerBase}`} />
            <div className={`w-1/2 h-4 rounded-lg ${shimmerBase}`} />
            <div className="flex justify-between mt-2">
                 <div className={`w-20 h-8 rounded-lg ${shimmerBase}`} />
                 <div className={`w-20 h-8 rounded-lg ${shimmerBase}`} />
            </div>
        </div>
    )
}

const BookCard = ({ book, darkMode }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className={`group relative rounded-2xl overflow-hidden shadow-lg border backdrop-blur-sm transition-all duration-300
                ${darkMode 
                    ? "bg-[#163201]/40 border-[#A3ED96]/20 text-white hover:border-[#A3ED96]/50" 
                    : "bg-white border-gray-100 text-gray-800 hover:shadow-xl"
                }
            `}
        >
            <div className="relative w-full h-64 overflow-hidden">
                <Image 
                    src={book.cover} 
                    alt={book.title} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                     <p className="text-white text-xs font-bold mb-1 opacity-80">JANR</p>
                     <p className="text-[#A3ED96] font-bold">{book.genre}</p>
                </div>
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-md
                    ${book.status === 'Mavjud' ? 'bg-green-500 text-white' : 
                      book.status === 'Ijarada' ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'}
                `}>
                    {book.status}
                </div>
            </div>

            <div className="p-5">
                <h3 className={`text-lg font-bold mb-1 truncate ${darkMode ? "text-white" : "text-[#163201]"}`}>
                    {book.title}
                </h3>
                <p className={`text-sm mb-4 ${darkMode ? "text-[#A3ED96]/70" : "text-gray-500"}`}>
                    {book.author}
                </p>

                <div className="flex items-center justify-between mb-4">
                     <div>
                        <p className={`text-xs font-bold ${darkMode ? "text-gray-400" : "text-gray-400"}`}>JARAYON NARXI</p>
                        <p className={`font-bold ${darkMode ? "text-[#A3ED96]" : "text-blue-600"}`}>{book.rentPrice}</p>
                     </div>
                     <div className="text-right">
                        <p className={`text-xs font-bold ${darkMode ? "text-gray-400" : "text-gray-400"}`}>NARXI</p>
                        <p className={`font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{book.price}</p>
                     </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-dashed border-gray-200 dark:border-white/10">
                    <button className={`flex-1 flex items-center justify-center p-2 rounded-lg transition-colors
                        ${darkMode ? "bg-white/10 hover:bg-white/20 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}
                    `} title="Ko'rish">
                        <FaEye />
                    </button>
                    <button className={`flex-1 flex items-center justify-center p-2 rounded-lg transition-colors
                        ${darkMode ? "bg-[#A3ED96]/20 hover:bg-[#A3ED96]/30 text-[#A3ED96]" : "bg-blue-100 hover:bg-blue-200 text-blue-600"}
                    `} title="Tahrirlash">
                        <FaEdit />
                    </button>
                    <button className={`flex-1 flex items-center justify-center p-2 rounded-lg transition-colors
                        ${darkMode ? "bg-red-500/20 hover:bg-red-500/30 text-red-500" : "bg-red-100 hover:bg-red-200 text-red-600"}
                    `} title="O'chirish">
                        <FaTrash />
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

// --- MAIN PAGE ---

export default function BooksPage() {
  const { darkMode } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [books] = useState(initialBooks);

  useEffect(() => {
    const timer = setTimeout(() => {
        setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`min-h-screen p-6 sm:p-8 transition-colors duration-300 ${darkMode ? "bg-[#0b1a00]" : "bg-[#f8fafc]"}`}>
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`text-3xl font-black tracking-tight mb-2 ${darkMode ? "text-white" : "text-[#163201]"}`}
            >
                Kitoblar Boshqaruvi
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className={`text-sm ${darkMode ? "text-[#A3ED96]/60" : "text-gray-500"}`}
            >
                Jami {books.length} ta kitob mavjud
            </motion.p>
          </div>

          <motion.button 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg shadow-green-500/20 transition-all
                ${darkMode 
                    ? "bg-[#A3ED96] text-[#163201] hover:bg-[#bbfeb0]" 
                    : "bg-[#163201] text-[#A3ED96] hover:bg-[#1f4202]"
                }
             `}
          >
              <FaPlus />
              Yangi Kitob
          </motion.button>
      </div>

     <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Component */}
        <FilterSidebar darkMode={darkMode} />

        {/* Main Content Area */}
        <div className="flex-1 w-full">
            {/* Toolkit */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col md:flex-row gap-4 mb-8"
            >
                {/* Search */}
                <div className="flex-1 relative">
                    <FaSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-[#A3ED96]/50" : "text-gray-400"}`} />
                    <input 
                        type="text" 
                        placeholder="Qidirish (Nomi, Muallifi, ISBN)..." 
                        className={`w-full pl-12 pr-4 py-4 rounded-xl border outline-none font-bold transition-all
                            ${darkMode 
                                ? "bg-[#163201]/40 border-[#A3ED96]/20 text-white focus:border-[#A3ED96] placeholder-[#A3ED96]/30" 
                                : "bg-white border-gray-200 text-gray-900 focus:border-[#163201] focus:ring-1 focus:ring-[#163201]"
                            }
                        `}
                    />
                </div>

                {/* Filters (Mobile Only or Additional) */}
                <div className="flex gap-4 lg:hidden">
                     {/* Mobile Dropdowns if needed */}
                </div>
                 <div className="relative">
                    <FaSortAmountDown className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-[#A3ED96]/50" : "text-gray-400"}`} />
                    <select className={`pl-12 pr-8 py-4 rounded-xl border outline-none font-bold cursor-pointer appearance-none
                        ${darkMode 
                            ? "bg-[#163201]/40 border-[#A3ED96]/20 text-[#A3ED96] focus:border-[#A3ED96]" 
                            : "bg-white border-gray-200 text-gray-700 focus:border-[#163201]"
                        }
                    `}>
                        <option>Saralash</option>
                        <option>Narx (Arzon)</option>
                        <option>Narx (Qimmat)</option>
                        <option>Yangi qo&apos;shilgan</option>
                    </select>
                </div>
            </motion.div>

            {/* Grid Content */}
            <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
            >
                <AnimatePresence>
                    {loading 
                        ? [...Array(6)].map((_, i) => <BookSkeleton key={i} darkMode={darkMode} />)
                        : books.map((book) => (
                            <BookCard key={book.id} book={book} darkMode={darkMode} />
                        ))
                    }
                </AnimatePresence>
            </motion.div>
        </div>
     </div>

    </div>
  );
}
