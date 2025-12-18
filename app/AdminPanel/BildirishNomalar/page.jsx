"use client";

import React, { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaDownload, FaUser, FaIdCard, FaPhone, FaClock, FaReply, FaTrash, FaLightbulb, FaExclamationCircle, FaComment, FaCheckDouble, FaEnvelopeOpen } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAdmin } from "../AdminContext";

// --- SKELETON COMPONENTS ---

const MessageSkeleton = ({ darkMode }) => (
    <div className={`p-6 rounded-2xl border animate-pulse flex flex-col md:flex-row gap-4
        ${darkMode ? "bg-white/5 border-white/5" : "bg-white border-gray-100"}
    `}>
        <div className={`w-14 h-14 rounded-full flex-shrink-0 ${darkMode ? "bg-white/10" : "bg-gray-200"}`} />
        <div className="flex-1 space-y-3">
             <div className="flex justify-between">
                 <div className={`h-4 w-1/3 rounded ${darkMode ? "bg-white/10" : "bg-gray-200"}`} />
                 <div className={`h-4 w-20 rounded ${darkMode ? "bg-white/10" : "bg-gray-200"}`} />
             </div>
             <div className={`h-6 w-3/4 rounded ${darkMode ? "bg-white/10" : "bg-gray-200"}`} />
             <div className={`h-4 w-full rounded ${darkMode ? "bg-white/10" : "bg-gray-200"}`} />
             <div className={`h-4 w-2/3 rounded ${darkMode ? "bg-white/10" : "bg-gray-200"}`} />
        </div>
    </div>
);

// --- REAL COMPONENTS ---

const FilterButton = ({ active, label, icon: Icon, onClick, darkMode }) => (
    <button
        onClick={onClick}
        className={`px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all
            ${active 
                ? (darkMode ? "bg-[#A3ED96] text-[#163201]" : "bg-[#163201] text-white shadow-lg")
                : (darkMode ? "bg-white/5 text-gray-400 hover:bg-white/10" : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-100")
            }
        `}
    >
        <Icon className={active ? "" : "opacity-70"} /> {label}
    </button>
);

export default function MessagesPage() {
  const { darkMode } = useAdmin();
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Initial Data
  const messages = [
    {
      id: 1,
      name: "Alisher Karimov",
      phone: "+998 90 123 45 67",
      date: "Bugun, 14:30",
      status: "unread",
      type: "suggestion",
      title: "Yangi funksiya taklifi",
      text: "Assalomu alaykum! Tizimga yangi statistika bo'limini qo'shsak yaxshi bo'lardi deb o'ylayman.",
    },
    {
      id: 2,
      name: "Dilshod Rahimov",
      phone: "+998 91 234 56 78",
      date: "Bugun, 10:15",
      status: "read",
      type: "complaint",
      title: "Tizimda xatolik",
      text: "Salom! Sahifa yuklanishida muammo bo'lyapti, iltimos tekshirib ko'ring.",
    },
    {
      id: 3,
      name: "Nodira Toshmatova",
      phone: "+998 93 345 67 89",
      date: "Kecha, 16:45",
      status: "unread",
      type: "general",
      title: "Umumiy savol",
      text: "Qanday qilib kuryerlikka ariza topshirsam bo'ladi?",
    },
    {
        id: 4,
        name: "Botir Zokirov",
        phone: "+998 90 999 88 77",
        date: "Kecha, 09:20",
        status: "read",
        type: "suggestion",
        title: "Dizayn bo'yicha",
        text: "Mobil ilovadagi ranglarni biroz yorqinroq qilishni taklif qilaman.",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const filteredMessages = messages.filter(msg => 
      (filterType === 'all' || msg.type === filterType) &&
      (msg.name.toLowerCase().includes(searchQuery.toLowerCase()) || msg.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getTypeIcon = (type) => {
      switch(type) {
          case 'suggestion': return <FaLightbulb className="text-yellow-400" />;
          case 'complaint': return <FaExclamationCircle className="text-red-400" />;
          default: return <FaComment className="text-blue-400" />;
      }
  };

  const getTypeLabel = (type) => {
      switch(type) {
          case 'suggestion': return "Taklif";
          case 'complaint': return "Shikoyat";
          default: return "Umumiy";
      }
  };

  return (
    <div className={`min-h-screen p-6 sm:p-8 transition-colors duration-300 ${darkMode ? "bg-[#0b1a00] text-white" : "bg-[#f8fafc] text-[#163201]"}`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
         <div>
            <h1 className={`text-3xl font-black mb-2 flex items-center gap-3 ${darkMode ? "text-white" : "text-[#163201]"}`}>
                <FaEnvelopeOpen className="text-[#A3ED96]" />
                Bildirishnomalar
            </h1>
            <p className={`text-sm font-medium ${darkMode ? "text-[#A3ED96]/60" : "text-gray-500"}`}>
                Foydalanuvchilardan kelgan xabarlar markazi
            </p>
         </div>
         <div className="flex gap-3">
             <button className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border transition-all
                ${darkMode ? "bg-white/5 border-white/10 text-white hover:bg-white/10" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}
             `}>
                 <FaDownload /> Eksport
             </button>
             <button className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all
                ${darkMode ? "bg-[#A3ED96] text-[#163201]" : "bg-[#163201] text-white"}
             `}>
                 <FaCheckDouble /> Barchasini O&apos;qish
             </button>
         </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8 justify-between">
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
               <FilterButton active={filterType === 'all'} label="Barchasi" icon={FaEnvelopeOpen} onClick={() => setFilterType('all')} darkMode={darkMode} />
               <FilterButton active={filterType === 'suggestion'} label="Takliflar" icon={FaLightbulb} onClick={() => setFilterType('suggestion')} darkMode={darkMode} />
               <FilterButton active={filterType === 'complaint'} label="Shikoyatlar" icon={FaExclamationCircle} onClick={() => setFilterType('complaint')} darkMode={darkMode} />
               <FilterButton active={filterType === 'general'} label="Umumiy" icon={FaComment} onClick={() => setFilterType('general')} darkMode={darkMode} />
          </div>

          <div className="relative w-full lg:w-80">
                <FaSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-[#A3ED96]/50" : "text-gray-400"}`} />
                <input 
                    type="text"
                    placeholder="Qidirish..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl font-bold outline-none border transition-all
                        ${darkMode 
                            ? "bg-white/5 border-white/10 text-white focus:border-[#A3ED96]" 
                            : "bg-white border-gray-200 text-gray-900 focus:border-[#163201]"
                        }
                    `}
                />
            </div>
      </div>

      {loading ? (
        // SKELETON STATE
        <div className="space-y-4">
             {[1,2,3,4].map(i => <MessageSkeleton key={i} darkMode={darkMode} />)}
        </div>
      ) : (
        // CONTENT STATE
        <div className="space-y-4 max-w-5xl mx-auto lg:mx-0">
            <AnimatePresence>
                {filteredMessages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        whileHover={{ scale: 1.01 }}
                        className={`group relative rounded-2xl border p-5 sm:p-6 transition-all duration-300
                            ${darkMode 
                                ? `bg-[#163201]/40 border-[#A3ED96]/10 hover:border-[#A3ED96]/30 ${msg.status === 'unread' ? "bg-white/5 border-l-4 border-l-[#A3ED96]" : ""}`
                                : `bg-white border-gray-100 hover:shadow-lg ${msg.status === 'unread' ? "bg-blue-50/30 border-l-4 border-l-[#163201]" : ""}`
                            }
                        `}
                    >
                         <div className="flex flex-col sm:flex-row gap-5">
                             {/* Icon Box */}
                             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm flex-shrink-0
                                ${darkMode ? "bg-[#A3ED96]/10" : "bg-gray-50"}
                             `}>
                                 {getTypeIcon(msg.type)}
                             </div>

                             {/* Content */}
                             <div className="flex-1">
                                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                     <div className="flex items-center gap-3">
                                         <h3 className={`text-lg font-black ${darkMode ? "text-white" : "text-[#163201]"}`}>
                                             {msg.name}
                                         </h3>
                                         <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider
                                            ${darkMode ? "bg-white/5 text-gray-400" : "bg-gray-100 text-gray-500"}
                                         `}>
                                             {getTypeLabel(msg.type)}
                                         </span>
                                     </div>
                                     <div className={`flex items-center gap-2 text-xs font-bold ${darkMode ? "text-[#A3ED96]" : "text-gray-400"}`}>
                                         <FaClock /> {msg.date}
                                     </div>
                                 </div>

                                 <h4 className={`font-bold mb-1 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                                     {msg.title}
                                 </h4>
                                 <p className={`text-sm mb-4 leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                     {msg.text}
                                 </p>

                                 {/* Footer Info & Actions */}
                                 <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-dashed border-gray-200 dark:border-white/10">
                                     <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                                         <span className="flex items-center gap-1"><FaPhone /> {msg.phone}</span>
                                         <span className="flex items-center gap-1"><FaIdCard /> ID: #{1000 + msg.id}</span>
                                     </div>

                                     <div className="flex gap-2">
                                         <button className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors
                                             ${darkMode ? "bg-[#A3ED96]/20 text-[#A3ED96] hover:bg-[#A3ED96]/30" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}
                                         `}>
                                             <FaReply /> Javob
                                         </button>
                                         <button className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors
                                             ${darkMode ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" : "bg-red-50 text-red-500 hover:bg-red-100"}
                                         `}>
                                             <FaTrash /> O&apos;chirish
                                         </button>
                                     </div>
                                 </div>
                             </div>
                         </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
      )}

    </div>
  );
}
