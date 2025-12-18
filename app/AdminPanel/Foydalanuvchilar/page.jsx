"use client";

import React, { useState, useEffect } from "react";
import { FaUsers, FaUserPlus, FaShoppingCart, FaBookReader, FaEye, FaEnvelope, FaSearch, FaFilter } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
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

const UserCardSkeleton = ({ darkMode }) => (
    <div className={`p-6 rounded-2xl border animate-pulse flex flex-col items-center space-y-4
        ${darkMode ? "bg-white/5 border-white/5" : "bg-white border-gray-100"}
    `}>
        <div className={`w-20 h-20 rounded-full ${darkMode ? "bg-white/10" : "bg-gray-200"}`} />
        <div className={`h-5 w-3/4 rounded ${darkMode ? "bg-white/10" : "bg-gray-200"}`} />
        <div className={`h-3 w-1/2 rounded ${darkMode ? "bg-white/10" : "bg-gray-200"}`} />
        <div className="flex gap-2 w-full justify-center pt-2">
             <div className={`h-8 w-1/3 rounded ${darkMode ? "bg-white/10" : "bg-gray-200"}`} />
             <div className={`h-8 w-1/3 rounded ${darkMode ? "bg-white/10" : "bg-gray-200"}`} />
        </div>
        <div className={`h-10 w-full rounded-xl mt-2 ${darkMode ? "bg-white/10" : "bg-gray-200"}`} />
    </div>
);

// --- REAL COMPONENTS ---

const StatCard = ({ title, value, icon: Icon, color, darkMode }) => {
    // Styling adapted for Deep Green Theme
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

export default function UsersPage() {
  const { darkMode } = useAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Initial Data
  const users = [
    { id: 1, initials: "AK", name: "Alisher Karimov", email: "alisher.k@example.com", bought: 12, rented: 5, joined: "15 Yan" },
    { id: 2, initials: "DN", name: "Dilnoza Normatova", email: "dilnoza.n@example.com", bought: 8, rented: 3, joined: "12 Yan" },
    { id: 3, initials: "SO", name: "Sardor Olimov", email: "sardor.o@example.com", bought: 15, rented: 7, joined: "10 Yan" },
    { id: 4, initials: "MU", name: "Murod Usmonov", email: "murod.u@example.com", bought: 5, rented: 2, joined: "18 Yan" },
    { id: 5, initials: "NZ", name: "Nazira Zokirova", email: "nazira.z@example.com", bought: 9, rented: 4, joined: "20 Yan" },
    { id: 6, initials: "JB", name: "Jahongir Bozorov", email: "jahongir.b@example.com", bought: 11, rented: 6, joined: "22 Yan" },
    { id: 7, initials: "LT", name: "Lola Toirova", email: "lola.t@example.com", bought: 7, rented: 3, joined: "25 Yan" },
    { id: 8, initials: "FR", name: "Feruza Rasulova", email: "feruza.r@example.com", bought: 13, rented: 8, joined: "28 Yan" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const filteredUsers = users.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen p-6 sm:p-8 transition-colors duration-300 ${darkMode ? "bg-[#0b1a00] text-white" : "bg-[#f8fafc] text-[#163201]"}`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
         <div>
            <h1 className={`text-3xl font-black mb-2 flex items-center gap-3 ${darkMode ? "text-white" : "text-[#163201]"}`}>
                <FaUsers className="text-[#A3ED96]" />
                Foydalanuvchilar
            </h1>
            <p className={`text-sm font-medium ${darkMode ? "text-[#A3ED96]/60" : "text-gray-500"}`}>
                Jami 1,247 ta faol kitobxon
            </p>
         </div>
      </div>

      {loading ? (
        // SKELETON STATE
        <div className="space-y-8">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                 {[1,2,3,4].map(i => <StatSkeleton key={i} darkMode={darkMode} />)}
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                 {[1,2,3,4,5,6,7,8].map(i => <UserCardSkeleton key={i} darkMode={darkMode} />)}
             </div>
        </div>
      ) : (
        // CONTENT STATE
        <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard title="Jami Foydalanuvchilar" value="1,247" icon={FaUsers} color="blue" darkMode={darkMode} />
                <StatCard title="Yangi (Bugun)" value="23" icon={FaUserPlus} color="green" darkMode={darkMode} />
                <StatCard title="Xaridorlar" value="842" icon={FaShoppingCart} color="yellow" darkMode={darkMode} />
                <StatCard title="Ijarachilar" value="405" icon={FaBookReader} color="pink" darkMode={darkMode} />
            </div>

            {/* Filter Toolbar */}
            <div className={`p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between border
                ${darkMode ? "bg-[#163201]/40 border-[#A3ED96]/10" : "bg-white border-gray-100 shadow-sm"}
            `}>
                <div className="flex items-center gap-2">
                     <button className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors
                        ${darkMode ? "bg-[#A3ED96] text-[#163201]" : "bg-[#163201] text-white"}
                     `}>
                         <FaFilter /> Filter
                     </button>
                     <span className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                         Jami: {filteredUsers.length} ta
                     </span>
                </div>

                <div className="relative w-full md:w-80">
                    <FaSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-[#A3ED96]/50" : "text-gray-400"}`} />
                    <input 
                        type="text"
                        placeholder="Foydalanuvchi qidirish..."
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

            {/* Users Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                    {filteredUsers.map((user) => (
                        <motion.div
                            key={user.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            whileHover={{ y: -8 }}
                            className={`group rounded-2xl border p-6 flex flex-col items-center text-center relative transition-all duration-300
                                ${darkMode 
                                    ? "bg-[#163201]/40 border-[#A3ED96]/10 hover:shadow-[0_0_20px_rgba(163,237,150,0.15)]" 
                                    : "bg-white border-gray-100 hover:shadow-xl"
                                }
                            `}
                        >
                            {/* Avatar */}
                            <div className={`w-20 h-20 rounded-full mb-4 flex items-center justify-center text-2xl font-black shadow-lg
                                ${darkMode ? "bg-[#A3ED96] text-[#163201]" : "bg-[#163201] text-white"}
                            `}>
                                {user.initials}
                            </div>

                            <h3 className={`text-lg font-black mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}>
                                {user.name}
                            </h3>
                            <p className={`text-xs font-medium mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                {user.email}
                            </p>

                            {/* Stats */}
                            <div className="flex gap-2 mb-6 w-full justify-center">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border
                                    ${darkMode ? "bg-white/5 border-white/10 text-[#A3ED96]" : "bg-blue-50 border-blue-100 text-blue-600"}
                                `}>
                                    📚 {user.bought} Sotib
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border
                                    ${darkMode ? "bg-white/5 border-white/10 text-yellow-400" : "bg-yellow-50 border-yellow-100 text-yellow-600"}
                                `}>
                                    🔖 {user.rented} Ijara
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-3 w-full mt-auto">
                                <button className={`py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2
                                    ${darkMode 
                                        ? "bg-white/10 text-white hover:bg-white/20" 
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }
                                `}>
                                    <FaEye /> Profil
                                </button>
                                <button className={`py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2
                                    ${darkMode 
                                        ? "bg-[#A3ED96]/20 text-[#A3ED96] hover:bg-[#A3ED96]/30" 
                                        : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                                    }
                                `}>
                                    <FaEnvelope /> Xabar
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </>
      )}

    </div>
  );
}
