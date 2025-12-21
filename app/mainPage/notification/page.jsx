"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaBell, FaCheck, FaInfoCircle, FaExclamationTriangle, FaTimes, FaRocket, FaBook } from "react-icons/fa";
import { useMain } from "../MainContext";
import toast, { Toaster } from "react-hot-toast";

const NotificationCard = ({ notif, onMarkRead, onAction, onExtend }) => {
    const { darkMode } = useMain();
    
    let icon = <FaInfoCircle />;
    let colorClass = "text-blue-500 bg-blue-100";

    if (notif.type === 'success') {
        icon = <FaCheck />;
        colorClass = "text-green-500 bg-green-100";
    } else if (notif.type === 'error') {
        icon = <FaTimes />;
        colorClass = "text-red-500 bg-red-100";
    } else if (notif.type === 'warning' || notif.type === 'rental_expiry') {
        icon = <FaBell className={notif.type === 'rental_expiry' ? 'animate-bounce' : ''} />;
        colorClass = notif.type === 'rental_expiry' ? "text-orange-500 bg-orange-100" : "text-yellow-500 bg-yellow-100";
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className={`p-4 rounded-2xl border mb-3 flex gap-4 transition-all
                ${notif.isRead ? 'opacity-60' : 'opacity-100 shadow-md'}
                ${darkMode 
                    ? `bg-[#1e293b] border-slate-700 ${notif.isRead ? '' : 'border-l-4 border-l-[#A3ED96]'}` 
                    : `bg-white border-gray-100 ${notif.isRead ? '' : 'border-l-4 border-l-[#3b82f6]'}`
                }
            `}
        >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
                {icon}
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                    <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>{notif.title}</h4>
                    <span className="text-[10px] text-gray-400">{new Date(notif.createdAt).toLocaleDateString()}</span>
                </div>
                <p className={`text-sm mb-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{notif.message}</p>
                
                {!notif.isRead && (
                    <button 
                        onClick={() => onMarkRead(notif._id)}
                        className={`text-xs font-bold underline ${darkMode ? "text-[#A3ED96]" : "text-blue-600"}`}
                    >
                        O'qildi deb belgilash
                    </button>
                )}

                {(notif.type === 'rental_expiry' || notif.type === 'action_required') && (
                    <div className="flex gap-3 mt-3">
                        <button 
                            onClick={() => onExtend(notif)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-transform active:scale-95 flex items-center gap-2
                                ${darkMode ? "bg-[#A3ED96] text-[#163201]" : "bg-green-600 text-white"}
                            `}
                        >
                            <FaRocket /> Muddatni uzaytirish
                        </button>
                        <button 
                            onClick={() => onAction(notif._id, 'return', notif.data)} 
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-transform active:scale-95 flex items-center gap-2
                                ${darkMode ? "border-white/20 text-white hover:bg-white/10" : "border-gray-200 text-gray-700 hover:bg-gray-100"}
                            `}
                        >
                            <FaBook /> Topshirish
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default function NotificationPage() {
  const { darkMode } = useMain();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
      try {
          const res = await fetch('/api/notifications');
          const data = await res.json();
          if (data.success) {
              setNotifications(data.data);
          }
      } catch (error) {
          console.error("Error fetching notifications:", error);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
      try {
          const res = await fetch('/api/notifications', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id })
          });
          if (res.ok) {
              setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
          }
      } catch (error) {
          console.error(error);
      }
  };

  const markAllRead = async () => {
      try {
          await fetch('/api/notifications', { method: 'PUT', body: JSON.stringify({}) });
          setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      } catch (error) {
           console.error(error);
      }
  };

  const [extendingNotif, setExtendingNotif] = useState(null);

    const handleAction = async (notifId, action, data, days = 1) => {
        const toastId = toast.loading("Jarayonda...");
        try {
            const { rentId } = data || {};
            if(!rentId) throw new Error("Rent ID topilmadi");

            const res = await fetch('/api/rent/action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rentId, action, notifId, days })
            });
            const resData = await res.json();
            
            if(resData.success) {
                toast.success(resData.message, { id: toastId });
                setExtendingNotif(null);
                
                // Local state update
                setNotifications(prev => prev.map(notif => {
                    if (notif._id === notifId) {
                        return {
                            ...notif,
                            isRead: true,
                            type: 'success',
                            message: action === 'return' 
                                ? "Topshirish so'rovi yuborildi. Kuryer tez orada bog'lanadi." 
                                : `Ijara muddati ${days} kunga uzaytirildi.`
                        };
                    }
                    return notif;
                }));
            } else {
                 toast.error(resData.message, { id: toastId });
            }
        } catch (e) {
            toast.error("Xatolik: " + e.message, { id: toastId });
        }
    };

    const ExtendModal = ({ notif }) => (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
            <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                className={`${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-100'} w-full max-w-sm rounded-3xl p-6 shadow-2xl border`}
            >
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                        <FaRocket />
                    </div>
                    <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Ijarani uzaytirish</h3>
                    <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Necha kunga uzaytirishni xohlaysiz?
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                    {[1, 3, 7].map(d => (
                        <button 
                            key={d}
                            onClick={() => handleAction(notif._id, 'extend', notif.data, d)}
                            className={`py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1
                                ${darkMode 
                                    ? 'border-white/10 hover:border-[#96C7B9] hover:bg-white/5 text-white' 
                                    : 'border-gray-100 hover:border-[#96C7B9] hover:bg-[#D1F0E0]/30 text-slate-900'}
                            `}
                        >
                            <span className="text-lg font-bold">+{d}</span>
                            <span className={`text-[10px] uppercase font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>kun</span>
                        </button>
                    ))}
                </div>

                <button 
                    onClick={() => setExtendingNotif(null)}
                    className="w-full py-3 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
                >
                    Bekor qilish
                </button>
            </motion.div>
        </motion.div>
    );

  return (
    <div className={`min-h-screen pt-10 pb-20 px-6 max-w-3xl mx-auto font-sans transition-colors duration-300 ${darkMode ? "bg-slate-900" : "bg-gray-50"}`}>
        <Toaster position="bottom-center" />
        <div className="flex items-center justify-between mb-8">
            <h1 className={`text-2xl font-black flex items-center gap-3 ${darkMode ? "text-white" : "text-slate-800"}`}>
                <FaBell className={darkMode ? "text-[#A3ED96]" : "text-blue-500"} />
                Bildirishnomalar
            </h1>
            {notifications.some(n => !n.isRead) && (
                <button 
                    onClick={markAllRead}
                    className={`text-sm font-bold px-4 py-2 rounded-xl transition-all
                        ${darkMode ? "bg-white/10 hover:bg-white/20 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}
                    `}
                >
                    Barchasini o'qildi qilish
                </button>
            )}
        </div>

        {loading ? (
             <div className="space-y-4">
                 {[1,2,3].map(i => (
                     <div key={i} className={`h-24 rounded-2xl animate-pulse ${darkMode ? "bg-white/5" : "bg-white border border-gray-100"}`} />
                 ))}
             </div>
        ) : (
            <AnimatePresence>
                {notifications.length > 0 ? (
                    notifications.map(notif => (
                        <NotificationCard 
                            key={notif._id} 
                            notif={notif} 
                            onMarkRead={markAsRead} 
                            onAction={handleAction} 
                            onExtend={setExtendingNotif} 
                        />
                    ))
                ) : (
                    <div className="text-center py-20 opacity-50">
                        <FaBell className="text-5xl mx-auto mb-4 text-gray-400" />
                        <p className={darkMode ? "text-gray-400" : "text-gray-500"}>Hozircha yangilik yo'q</p>
                    </div>
                )}
            </AnimatePresence>
        )}

        <AnimatePresence>
            {extendingNotif && <ExtendModal notif={extendingNotif} />}
        </AnimatePresence>
    </div>
  );
}
