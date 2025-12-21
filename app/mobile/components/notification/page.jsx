"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, SlidersHorizontal, BookOpen, Handshake, MessageCircle, Bell, Trash2, Check, MoreVertical, LogOut, Globe, Settings, Moon, Sun, Rocket, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../context/ThemeContext';
import { useSession, signOut } from "next-auth/react";
import Pusher from "pusher-js";
import toast, { Toaster } from 'react-hot-toast';

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

const mapType = (type) => {
    const mapping = {
        'rental_expiry': 'journey',
        'action_required': 'journey',
        'courier_message': 'handoff',
        'user_message': 'trace',
        'info': 'system',
        'success': 'system',
        'warning': 'system',
        'error': 'system'
    };
    return mapping[type] || 'system';
};

const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return "Hozir";
    if (diff < 3600) return `${Math.floor(diff / 60)} daqiqa oldin`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} soat oldin`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} kun oldin`;
    return date.toLocaleDateString();
};

export default function NotificationPage() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [extendingNotif, setExtendingNotif] = useState(null);
  const [extendDays, setExtendDays] = useState(7);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const handleRentAction = async (notifId, action, rentId) => {
    const toastId = toast.loading("Jarayonda...");
    try {
      const res = await fetch('/api/rent/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          rentId, 
          action, 
          notifId,
          ...(action === 'extend' && { days: extendDays })
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast.success(data.message, { id: toastId });
        // Remove notification from list or mark as read
        setNotifications(prev => prev.filter(n => n._id !== notifId));
        setExtendingNotif(null);
      } else {
        toast.error(data.message, { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("Xatolik yuz berdi", { id: toastId });
    }
  };

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications');
            const data = await res.json();
            if (data.success) {
                setNotifications(data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    fetchNotifications();

    // Pusher
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!pusherKey) return;

    const pusher = new Pusher(pusherKey, { cluster: pusherCluster });
    const channel = pusher.subscribe(`user-${session.user.id}`);

    const handleNew = (data) => {
        // Build notification object from pusher data
        const newNotif = {
            _id: Date.now().toString(), // Temp ID if not provided
            title: data.message || "Xabar",
            message: data.fullMessage || "",
            type: data.type || 'info',
            isRead: false,
            createdAt: new Date().toISOString(),
            ...data
        };
        setNotifications(prev => [newNotif, ...prev]);
    };

    channel.bind("new-notification", handleNew);
    channel.bind("status-update", (data) => {
        handleNew({ ...data, type: 'info' });
    });

    return () => {
        pusher.unsubscribe(`user-${session.user.id}`);
        pusher.disconnect();
    };
  }, [session]);

  const handleMarkAsRead = async (id) => {
    try {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        await fetch('/api/notifications', {
            method: 'PUT',
            body: JSON.stringify({ id })
        });
    } catch (e) {
        console.error(e);
    }
    setActiveMenuId(null);
  };

  const markAllRead = async () => {
      try {
          setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
          await fetch('/api/notifications', { method: 'PUT', body: JSON.stringify({}) });
      } catch (e) {
          console.error(e);
      }
  };

  const handleDelete = async (id) => {
    // Note: API doesn't have DELETE yet but we'll mock it locally for now 
    // or add DELETE method if needed. For now, just local removal or mark as read.
    setNotifications(prev => prev.filter(n => n._id !== id));
    setActiveMenuId(null);
  };

  const handleCardClick = (notif) => {
      if (notif.link) {
          router.push(notif.link);
      } else if (notif.data?.orderId || notif.data?.rentId) {
          router.push('/mobile/components/actions');
      }
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

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 font-sans text-gray-800 dark:text-slate-200 pb-32 transition-colors duration-300 relative" onClick={() => setShowSettingsMenu(false)}>
      
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
                            <button onClick={markAllRead} className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl transition-colors text-left">
                                <Check size={18} className="text-blue-500" />
                                <span>Hammasini o&apos;qilgan deb belgilash</span>
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
                            <div className="my-1 border-t border-gray-100 dark:border-slate-700"></div>
                            <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full flex items-center gap-3 px-3 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors text-left">
                                <LogOut size={18} />
                                <span>Chiqish</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </header>

      <main className="px-4 py-4 space-y-4">
        {loading ? (
            <NotificationSkeleton />
        ) : (
            <AnimatePresence mode="popLayout">
            {notifications.length > 0 ? (
                notifications.map((notif) => {
                const style = TYPE_CONFIG[mapType(notif.type)] || TYPE_CONFIG.system;
                
                return (
                    <motion.div
                    key={notif._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`relative group rounded-2xl p-4 transition-all duration-300 border border-transparent hover:border-gray-50 dark:hover:border-slate-800 ${notif.isRead ? 'bg-white dark:bg-slate-900 shadow-sm' : 'bg-blue-50/30 dark:bg-blue-900/10'}`}
                    onClick={() => handleCardClick(notif)}
                    >
                        <div className="flex gap-4 items-start">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${style.bg} dark:bg-opacity-10 ${style.text} dark:text-opacity-90`}>
                                {style.icon}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`text-sm font-bold leading-tight ${notif.isRead ? 'text-gray-700 dark:text-slate-300' : 'text-gray-900 dark:text-white'}`}>
                                        {notif.title}
                                    </h3>
                                    
                                    <div className="flex items-center gap-2 pl-2 flex-shrink-0">
                                        <span className="text-[10px] text-gray-400 dark:text-slate-500 whitespace-nowrap">{formatTime(notif.createdAt)}</span>
                                        {!notif.isRead && (
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                        )}
                                        
                                        <button 
                                            onClick={(e) => toggleMenu(e, notif._id)}
                                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-300 dark:text-slate-600 group-hover:opacity-100 transition-opacity"
                                        >
                                            <MoreVertical size={14} />
                                        </button>
                                    </div>
                                </div>
                                
                                <p className={`text-xs leading-relaxed ${notif.isRead ? 'text-gray-400 dark:text-slate-500' : 'text-gray-500 dark:text-slate-400'}`}>
                                    {notif.message}
                                </p>
                            </div>
                        </div>

                        <AnimatePresence>
                            {activeMenuId === notif._id && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={(e) => e.stopPropagation()} 
                                    className="absolute right-4 top-10 z-10 bg-white dark:bg-slate-700 rounded-xl shadow-lg border border-gray-100 dark:border-slate-600 p-1 flex flex-col min-w-[140px]"
                                >
                                    {!notif.isRead && (
                                        <button 
                                            onClick={() => handleMarkAsRead(notif._id)}
                                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-600 rounded-lg text-left"
                                        >
                                            <Check size={14} /> O‘qilgan deb belgilash
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => handleDelete(notif._id)}
                                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-left"
                                    >
                                         <Trash2 size={14} /> O'chirib tashlash
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Action Buttons for Rental Notifications */}
                        {notif.type === 'rental_expiry' && notif.data?.rentId && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-slate-800"
                            >
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRentAction(notif._id, 'return', notif.data.rentId);
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-800 dark:hover:bg-slate-100 transition-all active:scale-95"
                                >
                                    <BookOpen size={16} />
                                    <span>Topshirish</span>
                                </button>
                                
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setExtendingNotif(notif);
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 bg-[#52C6DA] text-white py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-[#41b5c9] transition-all active:scale-95"
                                >
                                    <Rocket size={16} />
                                    <span>Uzaytirish</span>
                                </button>
                            </motion.div>
                        )}
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
                        <Bell size={40} className="text-gray-300 dark:text-slate-600" />
                    </div>
                    <h2 className="text-gray-900 dark:text-white font-bold mb-2">Hozircha xabarlar yo‘q</h2>
                    <p className="text-gray-400 dark:text-slate-500 text-sm max-w-[200px]">
                        Hammasi joyida, kitoblar kelishi bilan sizga yetkazamiz
                    </p>
                </motion.div>
            )}
            </AnimatePresence>
        )}
      </main>

      {/* Extend Modal */}
      <AnimatePresence>
        {extendingNotif && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExtendingNotif(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 z-[100] bg-white dark:bg-slate-800 rounded-t-[2.5rem] p-8 pt-6 shadow-[0_-20px_50px_rgba(0,0,0,0.1)] max-h-[92vh] overflow-y-auto no-scrollbar"
            >
              {/* Handle Bar */}
              <div className="w-12 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full mx-auto mb-8" />

              <button 
                onClick={() => setExtendingNotif(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#52C6DA]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Rocket size={32} className="text-[#52C6DA]" />
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Ijarani uzaytirish</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Necha kunga uzaytirishni xohlaysiz?
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {[7, 14, 21, 30].map(days => (
                  <button
                    key={days}
                    onClick={() => setExtendDays(days)}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                      extendDays === days
                        ? 'border-[#52C6DA] bg-[#52C6DA]/5'
                        : 'border-gray-100 dark:border-slate-700 hover:border-gray-200 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-black text-gray-900 dark:text-white">{days} kun</p>
                        <p className="text-xs text-gray-400 dark:text-slate-500">+{days * 1000} so'm</p>
                      </div>
                      {extendDays === days && (
                        <div className="w-5 h-5 bg-[#52C6DA] rounded-full flex items-center justify-center">
                          <Check size={14} className="text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  handleRentAction(extendingNotif._id, 'extend', extendingNotif.data.rentId);
                }}
                className="w-full bg-[#52C6DA] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-[#41b5c9] transition-all active:scale-95"
              >
                Tasdiqlash
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
