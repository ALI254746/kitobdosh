"use client";

import { usePathname } from "next/navigation";
import { FaBell, FaSun, FaMoon, FaSignOutAlt, FaEllipsisV, FaBookOpen } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMain } from "../../mainPage/MainContext";
import useSWR, { mutate } from 'swr';
import Pusher from "pusher-js";
import { signOut } from "next-auth/react";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function TopNavbar({ mobileMenuOpen, setMobileMenuOpen }) {
  const pathname = usePathname();
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { darkMode, setDarkMode } = useMain();
  
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

  const { data: notifRes } = useSWR('/api/notifications', fetcher);
  const userData = useSWR('/api/user/profile', fetcher).data?.data?.user;

  // Real-time Pusher Integration
  useEffect(() => {
    if (!userData?._id) return;

    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (pusherKey) {
        const pusher = new Pusher(pusherKey, { cluster: pusherCluster });
        const channel = pusher.subscribe(`user-${userData._id}`);
        
        channel.bind("notification-new", (data) => {
             const audio = new Audio('/sounds/notification.mp3'); 
             audio.play().catch(e => console.log(e));
             // Revalidate SWR notifications
             mutate('/api/notifications');
        });

        return () => pusher.unsubscribe(`user-${userData._id}`);
    }
  }, [userData?._id]);

  const notifications = notifRes?.data?.filter(n => ['courier_message', 'info'].includes(n.type)) || [];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const titles = {
    "/KurierPanel/buyurtmalar": "Buyurtmalar",
    "/KurierPanel/faolTopshiriqlar": "Faol topshiriqlar",
    "/admin/completed": "Yakunlanganlar",
    "/KurierPanel/kitobniQaytarish": "Kitobni qaytarish",
    "/KurierPanel/profile": "Profil",
  };

  const title = titles[pathname] || "Kurier Panel";

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 z-40 transition-all duration-300">
      
      {/* LEFT: Logo & Title */}
      <div className="flex items-center gap-4">
        {/* Mobile Logo */}
        <div className="flex items-center gap-2 lg:hidden">
             <div className="p-2.5 bg-[#1F2937] dark:bg-white rounded-xl text-white dark:text-slate-900 shadow-lg shadow-slate-200 dark:shadow-none transition-transform active:scale-95">
                <FaBookOpen />
             </div>
             <span className="font-black text-[#1F2937] dark:text-white tracking-tight">Kitobdosh</span>
        </div>
        
        {/* Desktop Title */}
        <div className="hidden sm:flex flex-col">
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {title}
            </h1>
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#96C7B9] animate-pulse" />
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black tracking-widest uppercase">System Active</p>
            </div>
        </div>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-3">
        
        {/* Dark Mode Toggle */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-[#96C7B9] flex items-center justify-center transition-all text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white shadow-sm"
        >
            <AnimatePresence mode="wait" initial={false}>
                {darkMode ? (
                    <motion.div
                        key="moon"
                        initial={{ scale: 0.5, rotate: -45, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0.5, rotate: 45, opacity: 0 }}
                    >
                        <FaMoon />
                    </motion.div>
                ) : (
                     <motion.div
                        key="sun"
                        initial={{ scale: 0.5, rotate: 45, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0.5, rotate: -45, opacity: 0 }}
                    >
                        <FaSun />
                    </motion.div>
                )}
            </AnimatePresence>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setNotifOpen(!notifOpen)}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all relative border shadow-sm
                ${notifOpen 
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-lg" 
                    : "bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-700 hover:border-[#96C7B9]"
                }
            `}
          >
            <FaBell />
            {notifications.length > 0 && (
                <span className="absolute top-3 right-3.5 w-2 h-2 bg-red-500 border-2 border-white dark:border-slate-800 rounded-full animate-bounce"></span>
            )}
          </motion.button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                className="absolute right-0 mt-4 w-85 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-2xl z-50 overflow-hidden"
              >
                <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                  <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">Xabarnomalar</h4>
                  <span className="text-[10px] font-black text-white bg-[#96C7B9] px-2.5 py-1 rounded-full uppercase tracking-widest">
                      {notifications.length}
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto p-4 space-y-2 no-scrollbar">
                  {notifications.length === 0 ? (
                      <div className="py-12 text-center text-slate-300 dark:text-slate-600">
                          <FaBell size={32} className="mx-auto mb-2 opacity-20" />
                          <p className="text-[10px] font-black uppercase tracking-widest">Xabarlar yo'q</p>
                      </div>
                  ) : (
                      notifications.map((note) => (
                        <div key={note._id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-3xl cursor-pointer transition-all group border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                          <p className="text-slate-900 dark:text-white text-sm font-black group-hover:text-[#96C7B9] transition-colors leading-tight">{note.title}</p>
                          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 line-clamp-2 font-medium leading-relaxed">{note.message}</p>
                          <div className="flex items-center gap-2 mt-3">
                              <span className="w-1 h-1 rounded-full bg-[#96C7B9]" />
                              <span className="text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-widest">
                                  {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                          </div>
                        </div>
                      ))
                  )}
                </div>
                <button
                    onClick={() => setNotifOpen(false)}
                    className="w-full py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white border-t border-slate-50 dark:border-slate-800 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                    Mark All as Read
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
                className="w-11 h-11 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl transition-all shadow-sm"
            >
                <FaEllipsisV />
            </motion.button>

            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xl z-50 p-2 overflow-hidden"
                    >
                        <div className="p-3 border-b border-slate-50 dark:border-slate-800 mb-1 px-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Akkaunt</p>
                        </div>
                        <button 
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest"
                        >
                            <FaSignOutAlt />
                            Chiqish
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

      </div>
    </header>
  );
}
