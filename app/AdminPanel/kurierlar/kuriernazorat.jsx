"use client";

import React from "react";
import { FaBox, FaUndo, FaArrowRight, FaCircle, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const couriers = [
  {
    id: 1,
    name: "Alisher Karimov",
    phone: "+998 90 123 45 67",
    online: true,
    todayDeliveries: 8,
    todayReturns: 3,
    status: "active",
    location: "Chilonzor, Toshkent"
  },
  {
    id: 2,
    name: "Jasur Abdullayev",
    phone: "+998 91 234 56 78",
    online: false,
    todayDeliveries: 12,
    todayReturns: 5,
    status: "busy",
    location: "Yunusobod, Toshkent"
  },
  {
    id: 3,
    name: "Davron Ergashev",
    phone: "+998 94 456 78 90",
    online: true,
    todayDeliveries: 10,
    todayReturns: 4,
    status: "active",
    location: "Mirzo Ulug'bek, Toshkent"
  },
  {
    id: 4,
    name: "Shohruh Mirzayev",
    phone: "+998 93 345 67 89",
    online: false,
    todayDeliveries: 6,
    todayReturns: 2,
    status: "active",
    location: "Sergeli, Toshkent"
  },
];

const CourierCard = ({ courier, darkMode }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-6 rounded-2xl shadow-lg border backdrop-blur-sm transition-all duration-300
        ${darkMode 
            ? "bg-[#163201]/40 border-[#A3ED96]/20 hover:border-[#A3ED96]/50" 
            : "bg-white border-gray-100 hover:shadow-xl"
        }
      `}
    >
      {/* HEADER */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-gradient-to-br from-[#163201] to-[#2a5c02] rounded-2xl flex items-center justify-center text-[#A3ED96] font-bold text-xl shadow-lg shadow-green-900/20">
            {courier.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <h3 className={`font-bold text-lg ${darkMode ? "text-white" : "text-gray-900"}`}>{courier.name}</h3>
            <div className={`flex items-center gap-2 text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                <FaPhone className="text-[10px]" />
                {courier.phone}
            </div>
          </div>
        </div>

        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border
            ${courier.online 
                ? (darkMode ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-green-50 text-green-600 border-green-100")
                : (darkMode ? "bg-gray-700/30 text-gray-400 border-gray-600" : "bg-gray-50 text-gray-500 border-gray-100")
            }
        `}>
          <span className={`w-2 h-2 rounded-full ${courier.online ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
          {courier.online ? "Online" : "Offline"}
        </div>
      </div>

      {/* LOCATION */}
      <div className={`flex items-center gap-2 mb-6 text-sm ${darkMode ? "text-[#A3ED96]/70" : "text-gray-500"}`}>
        <FaMapMarkerAlt />
        {courier.location}
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={`rounded-xl p-4 ${darkMode ? "bg-white/5" : "bg-blue-50"}`}>
          <div className="flex items-center gap-2 mb-2">
            <FaBox className={`text-sm ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
            <span className={`text-xs font-bold ${darkMode ? "text-blue-200" : "text-blue-700"}`}>Yetkazish</span>
          </div>
          <p className={`text-2xl font-black ${darkMode ? "text-white" : "text-blue-900"}`}>
            {courier.todayDeliveries}
          </p>
        </div>

        <div className={`rounded-xl p-4 ${darkMode ? "bg-white/5" : "bg-purple-50"}`}>
          <div className="flex items-center gap-2 mb-2">
            <FaUndo className={`text-sm ${darkMode ? "text-purple-400" : "text-purple-600"}`} />
            <span className={`text-xs font-bold ${darkMode ? "text-purple-200" : "text-purple-700"}`}>Qaytarish</span>
          </div>
          <p className={`text-2xl font-black ${darkMode ? "text-white" : "text-purple-900"}`}>
            {courier.todayReturns}
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <div className={`flex items-center justify-between pt-4 border-t ${darkMode ? "border-white/10" : "border-gray-100"}`}>
        <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg
            ${courier.status === 'active' 
                ? (darkMode ? "bg-[#A3ED96]/10 text-[#A3ED96]" : "bg-green-100 text-green-700")
                : (darkMode ? "bg-orange-500/10 text-orange-400" : "bg-orange-100 text-orange-700")
            }
        `}>
            <FaCircle className="text-[8px]" />
            {courier.status === 'active' ? 'Faol' : 'Band'}
        </div>

        <button className={`flex items-center gap-2 text-sm font-bold transition-colors
            ${darkMode ? "text-white hover:text-[#A3ED96]" : "text-gray-900 hover:text-blue-600"}
        `}>
           Tafsilotlar <FaArrowRight className="text-xs" />
        </button>
      </div>
    </motion.div>
  );
};

export default function KurierControl({ darkMode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {couriers.map((courier) => (
        <CourierCard key={courier.id} courier={courier} darkMode={darkMode} />
      ))}
    </div>
  );
}
