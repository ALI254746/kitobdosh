"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaBook, FaPlus, FaShoppingCart, FaStore, FaChartLine, FaStart, FaEdit, FaTrash, FaSearch, FaFilter } from "react-icons/fa";
import { delay, motion, AnimatePresence } from "framer-motion";
import { useAdmin } from "../AdminContext";

// --- SKELETON COMPONENTS ---

const StatSkeleton = ({ darkMode }) => (
    <div className={`p-6 rounded-2xl border animate-pulse
        ${darkMode ? "bg-white/5 border-white/5" : "bg-gray-100 border-gray-200"}
    `}>
        <div className="flex justify-between items-center">
             <div className="space-y-3">
                 <div className={`h-4 w-24 rounded ${darkMode ? "bg-white/10" : "bg-gray-300"}`}></div>
                 <div className={`h-8 w-16 rounded ${darkMode ? "bg-white/10" : "bg-gray-300"}`}></div>
             </div>
             <div className={`w-12 h-12 rounded-xl ${darkMode ? "bg-white/10" : "bg-gray-300"}`}></div>
        </div>
    </div>
);

const CardSkeleton = ({ darkMode }) => (
    <div className={`rounded-2xl border overflow-hidden animate-pulse
        ${darkMode ? "bg-white/5 border-white/5" : "bg-white border-gray-100"}
    `}>
        <div className={`h-48 w-full ${darkMode ? "bg-white/5" : "bg-gray-200"}`} />
        <div className="p-4 space-y-3">
            <div className={`h-6 w-3/4 rounded ${darkMode ? "bg-white/10" : "bg-gray-200"}`} />
            <div className={`h-4 w-1/2 rounded ${darkMode ? "bg-white/10" : "bg-gray-200"}`} />
            <div className="flex justify-between pt-2">
                <div className={`h-8 w-20 rounded-lg ${darkMode ? "bg-white/10" : "bg-gray-200"}`} />
                <div className={`h-8 w-8 rounded-full ${darkMode ? "bg-white/10" : "bg-gray-200"}`} />
            </div>
        </div>
    </div>
);

// --- REAL COMPONENTS ---

const StatCard = ({ title, value, icon: Icon, color, darkMode }) => {
    // Color mapping for Dark Mode to stick to Neon Mint palette
    const bgClass = darkMode ? "bg-[#163201]/40" : "bg-white";
    const borderClass = darkMode ? "border-[#A3ED96]/20" : "border-gray-100";
    const textClass = darkMode ? "text-white" : "text-gray-900";
    const iconBg = darkMode ? "bg-[#A3ED96]/20" : `bg-${color}-100`;
    const iconColor = darkMode ? "text-[#A3ED96]" : `text-${color}-600`;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className={`p-6 rounded-2xl border backdrop-blur-sm transition-all shadow-sm ${bgClass} ${borderClass}`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className={`text-sm font-medium mb-1 ${darkMode ? "text-[#A3ED96]/70" : "text-gray-500"}`}>{title}</p>
                    <h3 className={`text-3xl font-black ${textClass}`}>{value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-lg ${iconBg} ${iconColor}`}>
                    <Icon />
                </div>
            </div>
        </motion.div>
    );
};

export default function BooksForSalePage() {
  const { darkMode } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  // Initial Data
  const books = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&h=900&fit=crop",
      name: "O'tkan kunlar",
      author: "Abdulla Qodiriy",
      price: 45000,
      category: "Badiiy",
      status: "Mavjud",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=900&fit=crop",
      name: "Mehrobdan chayon",
      author: "Abdulla Qahhor",
      price: 38000,
      category: "Badiiy",
      status: "Mavjud",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=900&fit=crop",
      name: "Sariq devni minib",
      author: "X. To'xtaboyev",
      price: 52000,
      category: "Bolalar",
      status: "Sotilgan",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&h=900&fit=crop",
      name: "Ikki eshik orasi",
      author: "O'tkir Hoshimov",
      price: 42000,
      category: "Badiiy",
      status: "Mavjud",
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=900&fit=crop",
      name: "Dunyoning ishlari",
      author: "O'tkir Hoshimov",
      price: 40000,
      category: "Badiiy",
      status: "Mavjud",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const filteredBooks = books.filter(book => 
      (filterCategory === 'all' || book.category === filterCategory) &&
      (book.name.toLowerCase().includes(searchQuery.toLowerCase()) || book.author.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={`min-h-screen p-6 sm:p-8 transition-colors duration-300 ${darkMode ? "bg-[#0b1a00] text-white" : "bg-[#f8fafc] text-[#163201]"}`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
         <div>
            <h1 className={`text-3xl font-black mb-2 flex items-center gap-3 ${darkMode ? "text-white" : "text-[#163201]"}`}>
                <FaStore className="text-[#A3ED96]" />
                Sotuvdagi Kitoblar
            </h1>
            <p className={`text-sm font-medium ${darkMode ? "text-[#A3ED96]/60" : "text-gray-500"}`}>
                Do&apos;koningizdagi barcha kitoblar nazorati
            </p>
         </div>
         <button 
            onClick={() => setShowModal(true)}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95
            ${darkMode 
                ? "bg-[#A3ED96] text-[#163201]" 
                : "bg-[#163201] text-white"
            }
         `}>
             <FaPlus /> Yangi Kitob
         </button>
      </div>

      {loading ? (
        // SKELETON STATE
        <div className="space-y-8">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                 {[1,2,3,4].map(i => <StatSkeleton key={i} darkMode={darkMode} />)}
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {[1,2,3,4,5,6,7,8].map(i => <CardSkeleton key={i} darkMode={darkMode} />)}
             </div>
        </div>
      ) : (
        // CONTENT STATE
        <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard title="Jami Kitoblar" value="256" icon={FaBook} color="blue" darkMode={darkMode} />
                <StatCard title="Sotilgan" value="142" icon={FaShoppingCart} color="green" darkMode={darkMode} />
                <StatCard title="Sotuvda" value="114" icon={FaStore} color="purple" darkMode={darkMode} />
                <StatCard title="Yangi (7 kun)" value="18" icon={FaChartLine} color="orange" darkMode={darkMode} />
            </div>

            {/* Filter Toolbar */}
            <div className={`p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between border
                ${darkMode ? "bg-[#163201]/40 border-[#A3ED96]/10" : "bg-white border-gray-100 shadow-sm"}
            `}>
                <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                     {["all", "Badiiy", "Bolalar", "Ilmiy"].map(cat => (
                         <button
                            key={cat}
                            onClick={() => setFilterCategory(cat)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors
                                ${filterCategory === cat
                                    ? (darkMode ? "bg-[#A3ED96] text-[#163201]" : "bg-[#163201] text-white")
                                    : (darkMode ? "bg-white/5 text-gray-400 hover:bg-white/10" : "bg-gray-100 text-gray-600 hover:bg-gray-200")
                                }
                            `}
                         >
                             {cat === 'all' ? 'Barchasi' : cat}
                         </button>
                     ))}
                </div>

                <div className="relative w-full md:w-80">
                    <FaSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-[#A3ED96]/50" : "text-gray-400"}`} />
                    <input 
                        type="text"
                        placeholder="Qidirish..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl font-bold outline-none border transition-all
                            ${darkMode 
                                ? "bg-white/5 border-white/10 text-white focus:border-[#A3ED96]" 
                                : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#163201]"
                            }
                        `}
                    />
                </div>
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                    {filteredBooks.map((book) => (
                        <motion.div
                            key={book.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            whileHover={{ y: -8 }}
                            className={`group rounded-2xl border overflow-hidden relative transition-all duration-300
                                ${darkMode 
                                    ? "bg-[#163201]/40 border-[#A3ED96]/10 hover:shadow-[0_0_20px_rgba(163,237,150,0.15)]" 
                                    : "bg-white border-gray-100 hover:shadow-xl"
                                }
                            `}
                        >
                            {/* Image */}
                            <div className="relative h-[280px] w-full overflow-hidden">
                                <Image 
                                    src={book.image} 
                                    alt={book.name} 
                                    fill 
                                    className="object-cover transition-transform duration-500 group-hover:scale-110" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                                
                                {/* Status Badge */}
                                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-black backdrop-blur-md
                                    ${book.status === 'Mavjud' 
                                        ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                                    }
                                `}>
                                    {book.status}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 relative">
                                <div className="absolute -top-10 left-5">
                                     <span className={`px-3 py-1 rounded-lg text-xs font-bold shadow-lg
                                        ${darkMode ? "bg-[#A3ED96] text-[#163201]" : "bg-[#163201] text-white"}
                                     `}>
                                         {book.category}
                                     </span>
                                </div>

                                <h3 className={`text-lg font-black mb-1 line-clamp-1 ${darkMode ? "text-white" : "text-gray-900"}`}>
                                    {book.name}
                                </h3>
                                <p className={`text-sm font-medium mb-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                    {book.author}
                                </p>
                                
                                <div className="flex justify-between items-center mt-4">
                                    <span className={`text-xl font-black ${darkMode ? "text-[#A3ED96]" : "text-[#163201]"}`}>
                                        {book.price.toLocaleString()} <span className="text-xs opacity-70">so&apos;m</span>
                                    </span>
                                    
                                    <div className="flex gap-2">
                                        <button className={`p-2 rounded-lg transition-colors
                                            ${darkMode ? "hover:bg-white/10 text-gray-400 hover:text-white" : "hover:bg-gray-100 text-gray-500 hover:text-[#163201]"}
                                        `}>
                                            <FaEdit />
                                        </button>
                                        <button className={`p-2 rounded-lg transition-colors
                                            ${darkMode ? "hover:bg-red-500/20 text-gray-400 hover:text-red-400" : "hover:bg-red-50 text-gray-500 hover:text-red-600"}
                                        `}>
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </>
      )}

      {/* MODAL (Yangi Kitob) */}
      {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
               <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`w-full max-w-lg p-8 rounded-3xl shadow-2xl relative
                      ${darkMode ? "bg-[#0b1a00] border border-[#A3ED96]/20" : "bg-white"}
                  `}
               >
                   <h2 className={`text-2xl font-black mb-6 ${darkMode ? "text-white" : "text-[#163201]"}`}>
                       Yangi Kitob Qo&apos;shish
                   </h2>
                   
                   <form className="space-y-4">
                       <input type="text" placeholder="Kitob Nomi" className={`w-full p-4 rounded-xl outline-none font-bold border transition-all ${darkMode ? "bg-white/5 border-white/10 text-white focus:border-[#A3ED96]" : "bg-gray-50 border-gray-200 focus:border-[#163201]"}`} />
                       <input type="text" placeholder="Muallif" className={`w-full p-4 rounded-xl outline-none font-bold border transition-all ${darkMode ? "bg-white/5 border-white/10 text-white focus:border-[#A3ED96]" : "bg-gray-50 border-gray-200 focus:border-[#163201]"}`} />
                       <div className="flex gap-4">
                           <input type="number" placeholder="Narx" className={`w-1/2 p-4 rounded-xl outline-none font-bold border transition-all ${darkMode ? "bg-white/5 border-white/10 text-white focus:border-[#A3ED96]" : "bg-gray-50 border-gray-200 focus:border-[#163201]"}`} />
                           <select className={`w-1/2 p-4 rounded-xl outline-none font-bold border transition-all ${darkMode ? "bg-white/5 border-white/10 text-gray-400 focus:border-[#A3ED96]" : "bg-gray-50 border-gray-200 focus:border-[#163201]"}`}>
                               <option>Badiiy</option>
                               <option>Bolalar</option>
                               <option>Ilmiy</option>
                           </select>
                       </div>
                       
                       <div className="flex justify-end gap-3 mt-8">
                           <button type="button" onClick={() => setShowModal(false)} className={`px-6 py-3 rounded-xl font-bold ${darkMode ? "bg-white/10 text-white hover:bg-white/20" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>Bekor Qilish</button>
                           <button type="button" className={`px-6 py-3 rounded-xl font-bold ${darkMode ? "bg-[#A3ED96] text-[#163201]" : "bg-[#163201] text-white"}`}>Saqlash</button>
                       </div>
                   </form>
               </motion.div>
          </div>
      )}

    </div>
  );
}
