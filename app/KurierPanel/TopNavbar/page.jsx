"use client";

import { usePathname } from "next/navigation";
import { FaBell, FaSun, FaMoon, FaSignOutAlt, FaEllipsisV, FaBookOpen } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TopNavbar({ mobileMenuOpen, setMobileMenuOpen }) {
  const pathname = usePathname();
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  const notifRef = useRef(null);
  const menuRef = useRef(null);

  // Close popovers on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, text: "Yangi buyurtma keldi", time: "2 daqiqa oldin" },
    { id: 2, text: "Kitob yetkazib berildi", time: "1 soat oldin" },
    { id: 3, text: "Yangi mijoz qo'shildi", time: "3 soat oldin" },
  ];

  const titles = {
    "/KurierPanel/buyurtmalar": "Buyurtmalar",
    "/KurierPanel/faolTopshiriqlar": "Faol topshiriqlar",
    "/admin/completed": "Yakunlanganlar",
    "/KurierPanel/kitobniQaytarish": "Kitobni qaytarish",
    "/KurierPanel/profile": "Profil",
  };

  const title = titles[pathname] || "Kurier Panel";

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 z-40 transition-colors duration-300">
      
      {/* LEFT: Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-blue-600">
             <motion.div 
               whileHover={{ rotate: 10, scale: 1.1 }}
               className="p-1.5 bg-blue-50 rounded-lg"
             >
                <FaBookOpen className="text-xl" />
             </motion.div>
             <span className="text-xl font-black tracking-tight text-gray-800 hidden sm:block">Kitobdosh</span>
        </div>
        <div className="h-6 w-px bg-gray-200 hidden sm:block mx-1"></div>
        <h1 className="text-sm sm:text-lg text-gray-600 font-bold truncate max-w-[150px] sm:max-w-none">
            {title}
        </h1>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* Dark Mode Toggle */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors relative overflow-hidden"
        >
            <AnimatePresence mode="wait" initial={false}>
                {darkMode ? (
                    <motion.div
                        key="moon"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <FaMoon className="text-xl text-blue-600" />
                    </motion.div>
                ) : (
                     <motion.div
                        key="sun"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <FaSun className="text-xl text-orange-500" />
                    </motion.div>
                )}
            </AnimatePresence>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
          >
            <FaBell className="text-xl" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full flex">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            </span>
          </motion.button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden"
              >
                <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                  <h4 className="font-bold text-gray-800">Xabarnomalar</h4>
                  <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">New</span>
                </div>
                <div className="max-h-64 overflow-y-auto p-2 space-y-1">
                  {notifications.map((note) => (
                    <div key={note.id} className="p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors group">
                      <p className="text-gray-800 text-sm font-medium group-hover:text-blue-600 transition-colors">{note.text}</p>
                      <span className="text-gray-400 text-xs mt-1 block">{note.time}</span>
                    </div>
                  ))}
                </div>
                <button
                    onClick={() => setNotifOpen(false)}
                    className="w-full py-3 text-sm text-center text-gray-500 hover:text-blue-600 border-t border-gray-50 font-medium transition-colors hover:bg-gray-50"
                >
                    Barchasini o‘qish
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Menu (Popover) */}
        <div className="relative" ref={menuRef}>
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
            >
                <FaEllipsisV className="text-lg" />
            </motion.button>

            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 p-1.5"
                    >
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors text-sm font-medium">
                            <FaSignOutAlt />
                            Ilovadan chiqish
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

      </div>
    </header>
  );
}
