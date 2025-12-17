"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaBookOpen, FaRegBell } from "react-icons/fa";
import { Search, X, Moon, Sun, MoreVertical, LogOut, Globe, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

export default function MobileNavbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const inputRef = useRef(null);
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  // Focus input when opened
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  return (
    <header 
      className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-5 py-3 h-[72px] flex justify-between items-center shadow-sm border-b border-slate-50 dark:border-slate-800 transition-colors duration-300 relative"
      onClick={() => setShowSettingsMenu(false)}
    >
      
      <AnimatePresence mode="wait">
        {!isSearchOpen ? (
          /* Logo & Brand Section */
          <motion.div 
            key="logo"
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }} 
            className="flex flex-col" 
          >
            <span className="text-[22px] font-extrabold text-[#52C6DA] tracking-tight leading-none">
                Kitobdosh
            </span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase mt-0.5">
                Mobil Ilova
            </span>
          </motion.div>
        ) : (
          /* Animated Search Input Section */
          <motion.div 
            key="search"
            initial={{ opacity: 0, width: "0%" }} 
            animate={{ opacity: 1, width: "100%" }}
            exit={{ opacity: 0, width: "0%" }} 
            className="flex-1 flex items-center gap-3"
          >
             <div className="relative w-full">
                <input 
                    ref={inputRef}
                    type="text" 
                    placeholder="Kitob yoki muallifni qidiring..." 
                    className="w-full pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#52C6DA]/20 transition-all placeholder:text-slate-400" 
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52C6DA] w-5 h-5" />
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right Actions Section */}
      <div className="flex items-center gap-3 pl-4"> 
        
        {/* Toggle Theme Button */}
        {!isSearchOpen && (
            <button 
                onClick={toggleTheme}
                className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 active:scale-95 transition-all"
            >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        )}

        {/* Toggle Search Button */}
        <AnimatePresence mode="wait">
             {isSearchOpen ? (
                 <motion.button 
                    key="close"
                    initial={{ scale: 0, rotate: -90 }} 
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 90 }} 
                    onClick={() => setIsSearchOpen(false)}
                    className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 active:scale-95 transition-all" 
                 >
                     <X className="w-5 h-5" />
                 </motion.button>
             ) : (
                 <motion.button 
                    key="open"
                    initial={{ scale: 0, rotate: 90 }} 
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: -90 }} 
                    onClick={() => setIsSearchOpen(true)}
                    className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-lg shadow-slate-100 dark:shadow-none flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-[#52C6DA] active:scale-95 transition-all" 
                 >
                     <Search className="w-5 h-5" />
                 </motion.button>
             )}
        </AnimatePresence>

        {!isSearchOpen && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3"
            >
                <Link href="/mobile/components/notification">
                    <button className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-sm relative transition-colors">
                        <FaRegBell className="text-lg" />
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-800"></span>
                    </button>
                </Link>

                <div className="relative">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowSettingsMenu(!showSettingsMenu);
                        }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${showSettingsMenu ? 'bg-[#52C6DA] border-[#52C6DA] text-white shadow-lg shadow-[#52C6DA]/30' : 'bg-[#52C6DA]/10 border-[#52C6DA]/20 text-[#52C6DA]'}`}
                    >
                        <MoreVertical size={20} />
                    </button>

                    {/* Settings Menu */}
                    <AnimatePresence>
                        {showSettingsMenu && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-0 top-12 z-50 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden"
                            >
                                <div className="p-1">
                                    <button className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl transition-colors text-left">
                                        <Globe size={18} className="text-gray-400 dark:text-slate-500" />
                                        <span>Tilni o&apos;zgartirish</span>
                                    </button>
                                    <button 
                                        onClick={toggleTheme}
                                        className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl transition-colors text-left"
                                    >
                                        {theme === 'dark' ? (
                                            <>
                                                <Sun size={18} className="text-gray-400 dark:text-slate-500" />
                                                <span>Yorug&apos; rejim</span>
                                            </>
                                        ) : (
                                            <>
                                                <Moon size={18} className="text-gray-400 dark:text-slate-500" />
                                                <span>Tungi rejim</span>
                                            </>
                                        )}
                                    </button>
                                    <button className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl transition-colors text-left">
                                        <Settings size={18} className="text-gray-400 dark:text-slate-500" />
                                        <span>Sozlamalar</span>
                                    </button>
                                    <div className="my-1 border-t border-gray-100 dark:border-slate-700"></div>
                                    <button onClick={() => router.push('/')} className="w-full flex items-center gap-3 px-3 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors text-left">
                                        <LogOut size={18} />
                                        <span>Chiqish</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        )}
      </div>
    </header>
  );
}
