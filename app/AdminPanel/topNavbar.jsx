"use client";

import { motion } from "framer-motion";
import { FaBars, FaMoon, FaSun, FaBell, FaSearch, FaUserCircle } from "react-icons/fa";

export default function TopNavbar({
  darkMode,
  setDarkMode,
  sidebarOpen,
  setSidebarOpen,
}) {
  const currentDate = new Date().toLocaleDateString("aa-UZ", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className={`sticky top-0 z-30 px-6 py-4 transition-all duration-300 backdrop-blur-md ${
        darkMode 
          ? "bg-[#163201]/90 border-b border-[#A3ED96]/20 shadow-lg shadow-black/20" 
          : "bg-white/80 border-b border-gray-100 shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Toggle & Title/Date */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-xl transition-all duration-300 lg:hidden ${
              darkMode 
                ? "text-[#A3ED96] hover:bg-[#A3ED96]/10" 
                : "text-[#163201] hover:bg-gray-100"
            }`}
          >
            <FaBars className="text-xl" />
          </button>

          <div className="hidden md:block">
            <h2 className={`text-lg font-bold tracking-tight ${darkMode ? "text-white" : "text-[#163201]"}`}>
              Boshqaruv Paneli
            </h2>
            <p className={`text-xs font-medium ${darkMode ? "text-[#A3ED96]" : "text-gray-500"}`}>
              {currentDate}
            </p>
          </div>
        </div>

        {/* Center: Search Bar (Desktop) */}
        <div className="flex-1 max-w-xl mx-4 hidden sm:block relative group">
          <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${
            darkMode ? "text-[#A3ED96]/50 group-focus-within:text-[#A3ED96]" : "text-gray-400 group-focus-within:text-[#163201]"
          }`}>
            <FaSearch />
          </div>
          <input
            type="text"
            placeholder="Qidirish... (Kitoblar, Foydalanuvchilar)"
            className={`w-full py-3 pl-11 pr-4 rounded-xl text-sm font-medium transition-all duration-300 outline-none border-2 ${
              darkMode 
                ? "bg-[#163201] border-[#A3ED96]/20 text-white placeholder-[#A3ED96]/30 focus:border-[#A3ED96] focus:shadow-[0_0_15px_-3px_rgba(163,237,150,0.3)]" 
                : "bg-gray-50 border-transparent text-gray-800 focus:bg-white focus:border-[#163201]/20 focus:shadow-lg"
            }`}
          />
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-3">
          {/* Search Toggle (Mobile) */}
          <button className={`sm:hidden p-2.5 rounded-xl transition-colors ${
            darkMode ? "text-[#A3ED96] hover:bg-[#A3ED96]/10" : "text-gray-600 hover:bg-gray-100"
          }`}>
             <FaSearch size={18} />
          </button>

          {/* Theme Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2.5 rounded-xl transition-all shadow-sm ${
              darkMode 
                ? "bg-[#A3ED96]/10 text-[#A3ED96] hover:bg-[#A3ED96]/20" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
          </motion.button>

          {/* Notifications */}
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className={`relative p-2.5 rounded-xl transition-all shadow-sm ${
              darkMode 
                  ? "bg-[#163201] text-[#A3ED96] hover:bg-[#A3ED96]/10 border border-[#A3ED96]/20" 
                  : "bg-white text-[#163201] hover:bg-gray-50 border border-gray-100"
            }`}
          >
            <FaBell size={18} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </motion.button>

        </div>
      </div>
    </div>
  );
}
