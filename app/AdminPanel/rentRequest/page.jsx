"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaClock, FaCalendarAlt, FaUser, FaBook, FaSearch, FaEllipsisV } from "react-icons/fa";
import { useAdmin } from "../AdminContext";

const initialRequests = [
  {
    id: 1,
    user: {
      name: "Malika Karimova",
      email: "malika@email.com",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    book: {
      title: "O'tkan kunlar",
      author: "Abdulla Qodiriy",
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=150&fit=crop",
    },
    duration: "14 kun",
    price: "25,000 UZS",
    status: "new",
    date: "10-Dek 2024"
  },
  {
    id: 2,
    user: {
      name: "Sardor Aliyev",
      email: "sardor@email.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
    book: {
      title: "Mehrobdan chayon",
      author: "Abdulla Qahhor",
      cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=100&h=150&fit=crop",
    },
    duration: "7 kun",
    price: "15,000 UZS",
    status: "active",
    date: "08-Dek 2024"
  },
  {
    id: 3,
    user: {
      name: "Nilufar Rahimova",
      email: "nilufar@email.com",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
    book: {
      title: "Ufq",
      author: "Said Ahmad",
      cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=150&fit=crop",
    },
    duration: "21 kun",
    price: "35,000 UZS",
    status: "rejected",
    date: "05-Dek 2024"
  },
     {
    id: 4,
    user: {
      name: "Javohir Tursunov",
      email: "javohir@email.com",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    },
    book: {
      title: "Alkimyogar",
      author: "Paulo Koelo",
      cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=100&h=150&fit=crop",
    },
    duration: "10 kun",
    price: "20,000 UZS",
    status: "new",
    date: "12-Dek 2024"
  },
   {
    id: 5,
    user: {
      name: "Sevara Nazarova",
      email: "sevara@email.com",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    },
    book: {
      title: "Ikki eshik orasi",
      author: "O'tkir Hoshimov",
      cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100&h=150&fit=crop",
    },
    duration: "30 kun",
    price: "50,000 UZS",
    status: "completed",
    date: "01-Dek 2024"
  },
];

const COLUMNS = {
    new: { title: "Yangi So'rovlar", color: "bg-yellow-500", text: "text-yellow-500", bg: "bg-yellow-500/10" },
    active: { title: "Jarayonda", color: "bg-blue-500", text: "text-blue-500", bg: "bg-blue-500/10" },
    completed: { title: "Yakunlangan", color: "bg-green-500", text: "text-green-500", bg: "bg-green-500/10" },
    rejected: { title: "Rad Etilgan", color: "bg-red-500", text: "text-red-500", bg: "bg-red-500/10" },
};

// --- COMPONENTS ---

const RequestCard = ({ request, darkMode }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`p-4 rounded-2xl mb-4 border backdrop-blur-sm cursor-grab active:cursor-grabbing shadow-sm
                ${darkMode 
                    ? "bg-[#163201]/40 border-[#A3ED96]/20 hover:border-[#A3ED96]/50" 
                    : "bg-white border-gray-100 hover:shadow-lg"
                }
            `}
        >
            <div className="flex gap-4 mb-3">
                 <div className="relative w-12 h-16 shrink-0 shadow-md">
                     <Image src={request.book.cover} alt="Cover" fill className="rounded-md object-cover" />
                 </div>
                 <div className="flex-1 overflow-hidden">
                     <h4 className={`font-bold text-sm truncate ${darkMode ? "text-white" : "text-gray-900"}`}>{request.book.title}</h4>
                     <p className={`text-xs truncate ${darkMode ? "text-[#A3ED96]/70" : "text-gray-500"}`}>{request.book.author}</p>
                     
                     <div className="flex items-center gap-2 mt-2">
                        <div className="relative w-5 h-5">
                             <Image src={request.user.avatar} alt="User" fill className="rounded-full border border-white/20" />
                        </div>
                        <span className={`text-xs font-medium truncate ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{request.user.name}</span>
                     </div>
                 </div>
            </div>

            <div className={`flex items-center justify-between text-xs pt-3 border-t ${darkMode ? "border-white/10" : "border-gray-100"}`}>
                <div className="flex items-center gap-2">
                    <FaClock className={`${darkMode ? "text-[#A3ED96]" : "text-blue-500"}`} />
                    <span className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>{request.duration}</span>
                </div>
                 <span className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{request.price}</span>
            </div>

            {request.status === 'new' && (
                <div className="flex gap-2 mt-3">
                     <button className="flex-1 py-1.5 rounded-lg bg-green-500/10 text-green-500 text-xs font-bold hover:bg-green-500/20 transition-colors">
                        Tasdiqlash
                     </button>
                     <button className="flex-1 py-1.5 rounded-lg bg-red-500/10 text-red-500 text-xs font-bold hover:bg-red-500/20 transition-colors">
                        Rad qilish
                     </button>
                </div>
            )}
        </motion.div>
    )
}

const KanbanColumn = ({ status, items, darkMode }) => {
    const config = COLUMNS[status];
    
    return (
        <div className="flex-1 min-w-[300px]">
             <div className={`flex items-center justify-between mb-4 p-3 rounded-xl ${darkMode ? "bg-white/5" : "bg-gray-50"}`}>
                 <div className="flex items-center gap-3">
                     <span className={`w-3 h-3 rounded-full ${config.color}`} />
                     <span className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{config.title}</span>
                 </div>
                 <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${config.bg} ${config.text}`}>
                     {items.length}
                 </span>
             </div>

             <div className="space-y-2">
                 {items.map(req => (
                     <RequestCard key={req.id} request={req} darkMode={darkMode} />
                 ))}
             </div>
        </div>
    )
}

// --- MAIN PAGE ---

export default function RentRequestsPage() {
  const { darkMode } = useAdmin();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  return (
    <div className={`min-h-screen p-6 sm:p-8 transition-colors duration-300 ${darkMode ? "bg-[#0b1a00]" : "bg-[#f8fafc]"}`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className={`text-3xl font-black tracking-tight mb-2 ${darkMode ? "text-white" : "text-[#163201]"}`}>
                Ijara So&apos;rovlari
            </h1>
            <p className={`text-sm ${darkMode ? "text-[#A3ED96]/60" : "text-gray-500"}`}>
                Joriy va yakunlangan ijara holati
            </p>
          </div>
          
           {/* Quick Stats or Actions could go here */}
           <div className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold ${darkMode ? "bg-white/10 text-white" : "bg-white shadow text-gray-700"}`}>
                <FaCalendarAlt className="text-[#A3ED96]" />
                <span>Dekabr, 2024</span>
           </div>
      </div>

       {/* Kanban Board */}
       <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
           {['new', 'active', 'completed', 'rejected'].map(status => (
                <KanbanColumn 
                    key={status} 
                    status={status} 
                    items={initialRequests.filter(r => r.status === status)}
                    darkMode={darkMode}
                />
           ))}
       </div>

    </div>
  );
}
