"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaCheck,
  FaBook,
  FaCar,
  FaPhone,
  FaCheckDouble,
  FaUser,
  FaChevronDown,
  FaChevronUp,
  FaBox,
  FaArrowRight
} from "react-icons/fa";
import Image from "next/image";

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
      try {
          const res = await fetch('/api/courier');
          const data = await res.json();
          if(data.success) {
              setOrders(data.data.filter(o => o.status === 'new'));
          }
      } catch (e) {
          console.error(e);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchOrders();
  }, []);

  const updateOrderStatus = async (id, newStatus, type) => {
    try {
        const targetKey = mapStatusToKey(newStatus);
        const res = await fetch('/api/courier', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                id, 
                type, 
                status: targetKey,
                courierId: session?.user?.id
            })
        });
        const d = await res.json();
        if(d.success) {
            setOrders(prev => prev.filter(o => o.id !== id));
        }
    } catch (e) {
        console.error(e);
    }
  };

  const mapStatusToKey = (uiStatus) => {
      const map = {
          "Kutmoqda": "new",
          "Qabul qildim": "accepted",
          "Kitobni oldim": "picked_up",
          "Yo'ldaman": "on_way",
          "Yetkazdim": "delivered"
      };
      return map[uiStatus] || "new";
  };

  const mapKeyToStatus = (key) => {
       const map = {
          "new": "Kutmoqda",
          "accepted": "Qabul qildim",
          "picked_up": "Kitobni oldim",
          "on_way": "Yo'ldaman",
          "delivered": "Yetkazdim"
      };
      return map[key] || "Kutmoqda";
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
            <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Yangi Buyurtmalar</h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Sizga yaqin hududlardagi aktiv ishlar</p>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm self-start">
                <FaBox className="text-[#96C7B9]" />
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase">{orders.length} ta mavjud</span>
            </div>
        </div>
      
      {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
               <div className="w-12 h-12 border-4 border-[#96C7B9]/20 border-t-[#96C7B9] rounded-full animate-spin mb-4" />
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Yuklanmoqda...</p>
          </div>
      ) : (
          <div className="grid gap-6">
            <AnimatePresence mode="popLayout">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={{...order, status: mapKeyToStatus(order.status)}} onUpdateStatus={updateOrderStatus} />
                ))}
            </AnimatePresence>
            
            {orders.length === 0 && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 bg-white dark:bg-slate-800/50 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-700"
                >
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300 dark:text-slate-600 mx-auto mb-4">
                        <FaBox size={24} />
                    </div>
                    <p className="text-slate-900 dark:text-white font-black uppercase tracking-tight text-lg">Hozircha buyurtmalar yo'q</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Yangi topshiriqlar shu yerda paydo bo'ladi</p>
                </motion.div>
            )}
          </div>
      )}
    </div>
  );
}

function OrderCard({ order, onUpdateStatus }) {
    const [expanded, setExpanded] = useState(false);

    const statusStyles = {
        "Kutmoqda": "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
        "Qabul qildim": "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
        "Kitobni oldim": "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
        "Yo'ldaman": "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
        "Yetkazdim": "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
    };

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all group relative overflow-hidden"
        >
            {/* Type Indicator */}
            <div className="absolute top-0 right-0 px-6 py-2 bg-slate-900 dark:bg-[#96C7B9] text-white dark:text-slate-900 rounded-bl-3xl text-[9px] font-black uppercase tracking-[0.2em] shadow-sm">
                {order.type === 'rent' ? 'Ijara' : 'Xarid'}
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
                 <div className="w-24 h-32 sm:w-28 sm:h-40 flex-shrink-0 bg-slate-50 dark:bg-slate-700 rounded-3xl overflow-hidden relative shadow-md group-hover:scale-105 transition-transform duration-500">
                    {order.bookImage ? (
                        <Image src={order.bookImage} alt="Cover" fill className="object-cover" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-300 dark:text-slate-600"><FaBook size={32} /></div>
                    )}
                 </div>
                 
                 <div className="flex-1 space-y-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                             <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${statusStyles[order.status]}`}>
                                {order.status}
                             </span>
                             <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600">ID: #{order.id?.slice(-5).toUpperCase()}</span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight mb-1">{order.bookTitle || order.book}</h3>
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{order.author}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-600/50">
                            <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-sm"><FaUser size={12}/></div>
                            <div className="min-w-0">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Buyurtmachi</p>
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{order.userName || order.customer}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-600/50">
                            <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-red-400 shadow-sm"><FaMapMarkerAlt size={12}/></div>
                            <div className="min-w-0">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Manzil</p>
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{order.address}</p>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-700/50">
                 <button 
                  onClick={() => setExpanded(!expanded)}
                  className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all py-3 px-4 bg-slate-50 dark:bg-slate-800 rounded-2xl group/btn"
                 >
                    <span>{expanded ? "Amallarni yashirish" : "Ma'lumotlar va boshqaruv"}</span>
                    <motion.div animate={{ rotate: expanded ? 180 : 0 }} className="p-1 bg-white dark:bg-slate-700 rounded-full shadow-sm">
                        <FaChevronDown size={10} />
                    </motion.div>
                 </button>

                 <AnimatePresence>
                     {expanded && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="py-4 space-y-4">
                                <div className="flex items-center justify-between p-4 bg-[#F0FDF8] dark:bg-[#F0FDF8]/5 rounded-2xl border border-[#D1F0E0] dark:border-[#96C7B9]/20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-green-500 shadow-sm transition-transform hover:rotate-12">
                                            <FaPhone />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Mijoz raqami</p>
                                            <a href={`tel:${(order.userPhone || order.phone || "+998").replace(/\s/g, '')}`} className="text-sm font-black text-slate-900 dark:text-white uppercase">
                                                {order.userPhone || order.phone || "Kiritilmagan"}
                                            </a>
                                        </div>
                                    </div>
                                    <FaArrowRight className="text-slate-300" />
                                </div>
                                
                                <button 
                                    onClick={() => onUpdateStatus(order.id, "Qabul qildim", order.type)}
                                    className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl text-sm font-black uppercase tracking-[0.3em] shadow-xl shadow-slate-200 dark:shadow-none transform transition-all active:scale-95 hover:bg-[#96C7B9] dark:hover:bg-[#96C7B9] dark:hover:text-white"
                                >
                                    Buyurtmani Qabul Qilish
                                </button>
                            </div>
                        </motion.div>
                     )}
                 </AnimatePresence>
            </div>
        </motion.div>
    )
}
