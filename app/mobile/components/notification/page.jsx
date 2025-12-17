"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, SlidersHorizontal, BookOpen, Handshake, MessageCircle, Bell, Trash2, Check, MoreVertical, LogOut, Globe, Settings, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../context/ThemeContext';

// ... (TYPE_CONFIG and MOCK_NOTIFICATIONS remain the same) ...

const TYPE_CONFIG = {
  journey: {
    icon: <BookOpen size={20} />,
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    accent: 'border-blue-100'
  },
  handoff: {
    icon: <Handshake size={20} />,
    bg: 'bg-green-50',
    text: 'text-green-600',
    accent: 'border-green-100'
  },
  trace: {
    icon: <MessageCircle size={20} />,
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    accent: 'border-purple-100'
  },
  system: {
    icon: <Bell size={20} />,
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    accent: 'border-gray-200'
  }
};

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'journey',
    title: "Muqaddima sizga yaqinlashmoqda",
    desc: "Bu kitob sizdan oldin 3 kishi tomonidan o‘qilgan. Ularning fikrlari bilan tanishing.",
    time: "2 soat oldin",
    isRead: false,
    link: "/mobile/components/actions" 
  },
  {
    id: 2,
    type: 'handoff',
    title: "Ali sizga kitob topshirmoqchi",
    desc: "Joy: Buyuk Ipak Yo‘li metro, 18:00. Iltimos, kechikmang.",
    time: "Kecha",
    isRead: true,
    link: "/mobile/components/actions" 
  },
  {
    id: 3,
    type: 'trace',
    title: "Oldingi o‘quvchidan xabar",
    desc: "“Oxirgi sahifani yolg‘iz o‘qima…” — bu maslahatni eslab qoling.",
    time: "3 kun oldin",
    isRead: true,
    link: "/mobile/components/mobileprofile"
  },
  {
    id: 4,
    type: 'system',
    title: "Buyurtmangiz tasdiqlandi",
    desc: "Xotirjam bo‘ling, kitob yo‘lda.",
    time: "1 hafta oldin",
    isRead: true,
    link: "/mobile/components/actions"
  }
];

// --- Main Page Component ---
export default function NotificationPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme(); // Assuming ThemeContext is available

  React.useEffect(() => {
     const timer = setTimeout(() => setLoading(false), 1500);
     return () => clearTimeout(timer);
  }, []);

  // --- Actions ---
  const handleMarkAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    setActiveMenuId(null);
  };

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setActiveMenuId(null);
  };

  const handleCardClick = (link) => {
      router.push(link);
  };

  const toggleMenu = (e, id) => {
      e.stopPropagation();
      setActiveMenuId(activeMenuId === id ? null : id);
  };

  const NotificationSkeleton = () => (
     <div className="animate-pulse space-y-4">
        {[1,2,3,4].map(i => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-100 dark:border-slate-700">
                <div className="flex gap-4">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                        <div className="flex justify-between">
                             <div className="w-32 h-4 bg-gray-200 dark:bg-slate-700 rounded" />
                             <div className="w-16 h-3 bg-gray-200 dark:bg-slate-700 rounded" />
                        </div>
                        <div className="w-full h-3 bg-gray-200 dark:bg-slate-700 rounded" />
                        <div className="w-2/3 h-3 bg-gray-200 dark:bg-slate-700 rounded" />
                    </div>
                </div>
            </div>
        ))}
     </div>
  );

  // --- Render ---
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 font-sans text-gray-800 dark:text-slate-200 pb-10 transition-colors duration-300 relative" onClick={() => setShowSettingsMenu(false)}>
      
      {/* 1. Header */}
      <header className="sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm z-50 px-4 py-4 flex items-center justify-between border-b border-gray-50 dark:border-slate-800 transition-colors relative">
        <Link href="/mobile" className="p-2 -ml-2 rounded-full hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-400 transition-colors">
           <ChevronLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">Bildirishnomalar</h1>
        
        <div className="relative">
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    setShowSettingsMenu(!showSettingsMenu);
                }}
                className={`p-2 -mr-2 rounded-full transition-colors ${showSettingsMenu ? 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white' : 'hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-400 dark:text-slate-500'}`}
            >
               <MoreVertical size={20} />
            </button>

            {/* Header Settings Menu */}
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
      </header>

      {/* 2. List */}
      <main className="px-4 py-4 space-y-4">
        {loading ? (
            <NotificationSkeleton />
        ) : (
            <AnimatePresence mode="popLayout">
            {notifications.length > 0 ? (
                notifications.map((notif) => {
                const style = TYPE_CONFIG[notif.type] || TYPE_CONFIG.system;
                
                return (
                    <motion.div
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`relative group rounded-2xl p-4 transition-all duration-300 border border-transparent hover:border-gray-100 dark:hover:border-slate-700 hover:shadow-sm ${notif.isRead ? 'bg-white dark:bg-slate-800' : 'bg-gray-50/50 dark:bg-slate-800/50'}`}
                    onClick={() => handleCardClick(notif.link)}
                    >
                        <div className="flex gap-4 items-start">
                            {/* Icon */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${style.bg} dark:bg-opacity-10 ${style.text} dark:text-opacity-90`}>
                                {style.icon}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`text-sm font-bold leading-tight ${notif.isRead ? 'text-gray-700 dark:text-slate-300' : 'text-gray-900 dark:text-white'}`}>
                                        {notif.title}
                                    </h3>
                                    
                                    <div className="flex items-center gap-2 pl-2 flex-shrink-0">
                                        <span className="text-[10px] text-gray-400 dark:text-slate-500 whitespace-nowrap">{notif.time}</span>
                                        {!notif.isRead && (
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                        )}
                                        
                                        {/* Action Trigger */}
                                        <button 
                                            onClick={(e) => toggleMenu(e, notif.id)}
                                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-300 dark:text-slate-600 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <MoreVertical size={14} />
                                        </button>
                                    </div>
                                </div>
                                
                                <p className={`text-xs leading-relaxed ${notif.isRead ? 'text-gray-400 dark:text-slate-500' : 'text-gray-500 dark:text-slate-400'}`}>
                                    {notif.desc}
                                </p>
                            </div>
                        </div>

                        {/* Interaction Menu (Overlay) */}
                        <AnimatePresence>
                            {activeMenuId === notif.id && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={(e) => e.stopPropagation()} 
                                    className="absolute right-4 top-10 z-10 bg-white dark:bg-slate-700 rounded-xl shadow-lg border border-gray-100 dark:border-slate-600 p-1 flex flex-col min-w-[140px]"
                                >
                                    <button 
                                        onClick={() => handleMarkAsRead(notif.id)}
                                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-600 rounded-lg text-left"
                                    >
                                        <Check size={14} /> O‘qilgan deb belgilash
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(notif.id)}
                                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-left"
                                    >
                                        <Trash2 size={14} /> O‘chirib tashlash
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </motion.div>
                );
                })
            ) : (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center pt-20 text-center px-6"
                >
                    <div className="w-24 h-24 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                        <BookOpen size={40} className="text-gray-300 dark:text-slate-600" />
                    </div>
                    <h2 className="text-gray-900 dark:text-white font-bold mb-2">Hozircha xabarlar yo‘q</h2>
                    <p className="text-gray-400 dark:text-slate-500 text-sm max-w-[200px]">
                        Kitoblar yo‘lga chiqqanda bu yerda ko‘rinasiz
                    </p>
                    
                    <button 
                        onClick={() => setNotifications(MOCK_NOTIFICATIONS)}
                        className="mt-8 text-xs text-blue-400 underline opacity-50 hover:opacity-100"
                    >
                        Demo: Xabarlarni qaytarish
                    </button>
                </motion.div>
            )}
            </AnimatePresence>
        )}
      </main>

    </div>
  );
}
