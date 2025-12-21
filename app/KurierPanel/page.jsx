"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  FaBox, 
  FaCheckCircle, 
  FaTruck, 
  FaInfoCircle, 
  FaChevronRight,
  FaCalendarAlt,
  FaSearch,
  FaMapMarkerAlt,
  FaArrowRight,
  FaHistory,
  FaUndo
} from "react-icons/fa";

import useSWR, { mutate } from 'swr';
import Pusher from "pusher-js";
import toast from "react-hot-toast";
import { DashboardSkeleton } from "./components/Skeleton";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function KurierHome() {
  // SWR for speed and automatic revalidation
  const { data: courierRes, isLoading: courierLoading } = useSWR('/api/courier', fetcher);
  const { data: profileRes, isLoading: profileLoading } = useSWR('/api/user/profile', fetcher);

  useEffect(() => {
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (pusherKey) {
        const pusher = new Pusher(pusherKey, { cluster: pusherCluster });
        const channel = pusher.subscribe("courier-channel");
        
        channel.bind("new-job", (data) => {
             const audio = new Audio('/sounds/notification.mp3'); 
             audio.play().catch(e => console.log(e));
             toast.success(data.message || "Yangi buyurtma keldi!", {
                icon: '📦',
                style: {
                    borderRadius: '1.5rem',
                    background: '#1F2937',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }
             });
             // Revalidate all courier data
             mutate('/api/courier');
        });
        return () => pusher.unsubscribe("courier-channel");
    }
  }, []);

  if (courierLoading || profileLoading) {
      return (
        <div className="max-w-4xl mx-auto py-10 px-4">
           <DashboardSkeleton />
        </div>
      );
  }

  const orders = courierRes?.data || [];
  const userData = profileRes?.data?.user;
  
  const activeRental = orders.find(o => ['on_way', 'picked_up'].includes(o.status));
  
  const counts = orders.reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
  }, { new: 0, accepted: 0, picked_up: 0, on_way: 0, delivered: 0 });

  // Calculate Today's Earnings
  const now = new Date();
  const startOfToday = new Date(now.setHours(0,0,0,0));
  const todayDelivered = orders.filter(o => o.status === 'delivered' && new Date(o.updatedAt) >= startOfToday);
  
  const stats = {
      ...counts,
      fullName: userData?.fullName || "Kuryer",
      todayEarnings: todayDelivered.length * 15000,
      deliveredCount: orders.filter(o => o.status === 'delivered').length
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto pb-12">
      
      {/* HEADER: Welcome & Date */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
        >
           <div className="flex items-center gap-2 text-[#96C7B9] text-[10px] font-black uppercase tracking-widest mb-2">
               <FaCalendarAlt />
               <span>{new Date().toLocaleDateString('uz-UZ', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
           </div>
           <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">Xush kelibsiz, <br className="sm:hidden" /> {stats.fullName?.split(' ')[0] || "Azizbek"}! 👋</h1>
        </motion.div>
        
        {/* Search Bar (Aesthetic) */}
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative group w-full md:w-auto"
        >
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#96C7B9] transition-colors" />
            <input 
               type="text" 
               placeholder="Buyurtma ID si..." 
               className="w-full md:w-72 pl-14 pr-6 py-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl outline-none focus:border-[#96C7B9] focus:ring-4 focus:ring-[#96C7B9]/10 transition-all font-bold text-xs uppercase tracking-widest text-slate-900 dark:text-white shadow-sm"
            />
        </motion.div>
      </div>

      {/* HERO SECTION: Active Task */}
      <AnimatePresence mode="wait">
          {activeRental ? (
              <motion.div 
                key="active"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[3rem] p-8 sm:p-10 relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] group"
              >
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="relative w-32 h-44 shrink-0 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 hidden md:block">
                     {activeRental.image ? (
                       <Image 
                          src={activeRental.image} 
                          alt={activeRental.book} 
                          fill 
                          priority 
                          className="object-cover" 
                       />
                     ) : (
                       <div className="w-full h-full bg-slate-800 flex items-center justify-center text-[#96C7B9]"><FaBox size={40} /></div>
                     )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-slate-900/5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#96C7B9] border border-white/5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#96C7B9] animate-pulse"></span>
                            Faol topshiriq
                        </span>
                        <span className="text-white/40 dark:text-slate-400 text-[10px] font-bold">#{activeRental.id?.slice(-5).toUpperCase()}</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black leading-none mb-6 max-w-md">{activeRental.book}</h2>
                    
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 bg-white/5 dark:bg-slate-900/5 px-4 py-2.5 rounded-2xl border border-white/5 dark:border-slate-900/5">
                            <FaMapMarkerAlt className="text-[#96C7B9]" />
                            <span className="text-[11px] font-bold uppercase tracking-tight truncate max-w-[200px]">{activeRental.address || "Toshkent shahar"}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 dark:bg-slate-900/5 px-4 py-2.5 rounded-2xl border border-white/5 dark:border-slate-900/5">
                            <FaTruck className="text-[#96C7B9]" />
                            <span className="text-[11px] font-bold uppercase tracking-tight">{activeRental.status === 'on_way' ? "Yo'lda" : "Qabul qilingan"}</span>
                        </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3 shrink-0">
                      <Link 
                        href="/KurierPanel/buyurtmalar" 
                        className="flex items-center justify-center gap-3 bg-[#96C7B9] text-white px-8 py-5 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] transform transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#96C7B9]/30"
                      >
                           Boshqarish <FaArrowRight />
                      </Link>
                      <button className="text-[10px] font-black uppercase tracking-widest text-white/50 dark:text-slate-400 hover:text-white dark:hover:text-slate-900 transition-colors">Yordam kerakmi?</button>
                  </div>
                </div>

                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#96C7B9]/20 to-transparent rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#96C7B9]/10 to-transparent rounded-full -ml-24 -mb-24 blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-1000"></div>
              </motion.div>
          ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-slate-800/50 rounded-[3rem] p-12 border border-dashed border-slate-200 dark:border-slate-700 text-center flex flex-col items-center justify-center min-h-[300px] shadow-sm"
              >
                 <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center text-slate-300 dark:text-slate-600 mb-6 transition-transform hover:rotate-12 cursor-default">
                     <FaTruck size={32} />
                 </div>
                 <h3 className="font-black text-slate-900 dark:text-white text-2xl mb-2">Hozircha bo'shliq...</h3>
                 <p className="text-slate-400 dark:text-slate-500 text-sm font-medium mb-8 max-w-xs mx-auto uppercase tracking-widest leading-relaxed">Hozirda hech qanday faol yetkazish topshirig'ingiz mavjud emas.</p>
                 <Link href="/KurierPanel/buyurtmalar" className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200 dark:shadow-none">
                     Yangi topshiriqlar
                 </Link>
              </motion.div>
          )}
      </AnimatePresence>

      {/* STATS GRID */}
      <div>
        <div className="flex items-center justify-between mb-8 px-2">
            <div>
                <h3 className="font-black text-slate-900 dark:text-white text-xl uppercase tracking-tighter">Bugungi ko'rsatkichlar</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Real-vaqt ma'lumotlari</p>
            </div>
            <button className="p-3 bg-white dark:bg-slate-800 rounded-2xl text-[#96C7B9] border border-slate-100 dark:border-slate-700 shadow-sm hover:scale-105 transition-transform">
                <FaHistory />
            </button>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              icon={<FaBox size={20} />} 
              label="Yangi" 
              value={stats.new || 0} 
              color="#F3F4F6"
              textColor="#374151"
            />
            <StatCard 
              icon={<FaTruck size={20} />} 
              label="Jarayonda" 
              value={(stats.on_way || 0) + (stats.picked_up || 0)} 
              color="#EEF2FF"
              textColor="#4F46E5"
            />
            <StatCard 
              icon={<FaCheckCircle size={20} />} 
              label="Yetkazildi" 
              value={stats.deliveredCount || 0} 
              color="#F0FDF4"
              textColor="#16A34A"
            />
            <StatCard 
              icon={<FaInfoCircle size={20} />} 
              label="Kutilmoqda" 
              value={stats.accepted || 0} 
              color="#FFF7ED"
              textColor="#EA580C"
            />
        </div>
        
        {/* Earnings Card */}
        <div className="mt-6">
            <Link href="/KurierPanel/hamyon" className="block p-8 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-slate-100 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#96C7B9] mb-2">Bugungi daromadingiz</p>
                        <h4 className="text-3xl font-black text-white dark:text-slate-900 uppercase tracking-tight">{(stats.todayEarnings || 0).toLocaleString()} UZS</h4>
                    </div>
                    <div className="w-14 h-14 bg-white/10 dark:bg-slate-900/5 rounded-2xl flex items-center justify-center text-[#96C7B9] group-hover:scale-110 transition-transform">
                        <FaArrowRight />
                    </div>
                </div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 dark:bg-slate-900/5 rounded-full blur-2xl"></div>
            </Link>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid md:grid-cols-2 gap-6">
          <ActionCard 
            title="Buyurtmalar" 
            desc="Sizga yaqin yangi topshiriqlarni ko'ring" 
            href="/KurierPanel/buyurtmalar"
            icon={<FaBox size={24} />}
            bg="bg-white dark:bg-slate-800 hover:border-[#96C7B9]"
          />
          <ActionCard 
            title="Kitobni Qaytarish" 
            desc="Foydalanuvchilardan ijarani yig'ish" 
            href="/KurierPanel/kitobniQaytarish"
            icon={<FaUndo size={24} />}
            bg="bg-white dark:bg-slate-800 hover:border-[#96C7B9]"
          />
      </div>

    </div>
  );
}

function StatCard({ icon, label, value, color, textColor }) {
  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden relative group"
    >
      <div className="relative z-10">
          <div className="text-2xl font-black text-slate-900 dark:text-white mb-1">{value}</div>
          <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</div>
      </div>
      <div 
        className="absolute -right-4 -bottom-4 w-16 h-16 rounded-[2rem] flex items-center justify-center transition-transform group-hover:rotate-12 duration-500 opacity-20 dark:opacity-10"
        style={{ backgroundColor: color, color: textColor }}
      >
          {icon}
      </div>
    </motion.div>
  );
}

function ActionCard({ title, desc, href, icon, bg }) {
  return (
    <Link href={href}>
        <motion.div 
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            className={`p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 transition-all flex items-center justify-between group shadow-sm ${bg}`}
        >
            <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700/50 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-[#96C7B9] group-hover:bg-[#96C7B9]/10 transition-all">
                    {icon}
                </div>
                <div>
                    <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter text-lg leading-none mb-1.5">{title}</h4>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{desc}</p>
                </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-300 dark:text-slate-600 group-hover:bg-[#96C7B9] group-hover:text-white transition-all">
                <FaChevronRight size={12} />
            </div>
        </motion.div>
    </Link>
  );
}
