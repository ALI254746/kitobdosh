"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Truck, Package, CheckCircle2, Clock, MapPin, MessageSquare, Info, ShieldCheck, User, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import Pusher from 'pusher-js';
import toast from 'react-hot-toast';

// --- Constants ---
import { 
  FaBoxOpen, 
  FaClipboardCheck, 
  FaUserSecret, 
  FaBook, 
  FaTruck, 
  FaMapMarkerAlt,
  FaMapMarkedAlt
} from "react-icons/fa";

const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  APPROVED: 'approved',
  COMPLETED: 'completed',
  RETURNED: 'returned',
};

export default function OrderTrackingPage() {
  const { data: session } = useSession();
  const [trackingItems, setTrackingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const fetchProfileAndTracking = async () => {
      try {
          const res = await fetch('/api/user/profile');
          const result = await res.json();
          
          if (result.success && result.data) {
              const data = result.data;
              
              // Active Orders & Rentals logic from desktop profile
              const activeOrders = (data.orders || []).filter(o => ['pending', 'processing'].includes(o.status));
              const activeRentals = (data.rentals || []).filter(r => ['pending', 'approved'].includes(r.status));
              
              const items = [
                  ...activeOrders.map(o => ({
                      _id: o._id,
                      id: o._id.toString().slice(-6),
                      title: `Buyurtma #${o._id.toString().slice(-6)}`,
                      itemsCount: (o.items || []).map(i => i.title).join(", "),
                      status: o.status,
                      courierStatus: o.courierStatus,
                      type: 'order',
                      date: o.createdAt,
                      image: "https://placehold.co/100x100/png?text=Order",
                      book: {
                        title: o.items?.[0]?.title || "Kitoblar",
                        author: (o.items?.length || 0) > 1 ? `${o.items.length} ta kitob` : (o.items?.[0]?.book?.author || o.items?.[0]?.author || ""),
                        cover: o.items?.[0]?.book?.images?.[0] || o.items?.[0]?.image || null
                      },
                      delivery: o.delivery || { address: o.customer?.address || "Manzil ko'rsatilmadi" }
                  })),
                  ...activeRentals.map(r => ({
                      _id: r._id,
                      id: r._id.toString().slice(-6),
                      title: r.bookTitle,
                      itemsCount: "Ijara",
                      status: r.status,
                      courierStatus: r.courierStatus,
                      type: 'rent',
                      date: r.createdAt,
                      image: r.bookImage || "https://placehold.co/100x100/png?text=Book",
                      book: {
                        title: r.bookTitle,
                        author: r.author || "Muallif noma'lum",
                        cover: r.bookImage
                      },
                      delivery: r.delivery || { address: r.address || "Manzil ko'rsatilmadi" }
                  }))
              ].sort((a,b) => new Date(b.date) - new Date(a.date));

              setTrackingItems(items);
          }
      } catch (error) {
          console.error(error);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    fetchProfileAndTracking();
  }, []);

  // Pusher Real-time Updates
  useEffect(() => {
    if (!session?.user?.id) return;

    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!pusherKey) return;

    const pusher = new Pusher(pusherKey, { cluster: pusherCluster });
    const channel = pusher.subscribe(`user-${session.user.id}`);

    channel.bind("status-update", (data) => {
        toast.success(data.message || "Buyurtma statusi yangilandi!");
        // Refresh tracking data
        fetchProfileAndTracking();
    });

    return () => {
        pusher.unsubscribe(`user-${session.user.id}`);
        pusher.disconnect();
    };
  }, [session]);

  if (loading) {
      return (
          <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-10">
              <div className="w-12 h-12 border-4 border-[#52C6DA] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-400 font-medium">Marshrut aniqlanmoqda...</p>
          </div>
      );
  }

  const getSteps = () => [
    { label: "Buyurtma berildi", icon: <FaBoxOpen />, status: 'pending' },
    { label: "Admin tasdiqladi", icon: <FaClipboardCheck />, status: 'approved' }, 
    { label: "Kurier qabul qildi", icon: <FaUserSecret />, status: 'accepted' }, 
    { label: "Kurier kitobni oldi", icon: <FaBook />, status: 'picked_up' },    
    { label: "Yo'lga chiqdi", icon: <FaTruck />, status: 'on_way' },        
    { label: "Keldi / Yetkazildi", icon: <FaMapMarkerAlt />, status: 'delivered' } 
  ];

  const getStepIndex = (item) => {
    if (item.courierStatus === "delivered" || item.status === 'completed' || item.status === 'returned') return 5;
    if (item.courierStatus === 'on_way') return 4;
    if (item.courierStatus === 'picked_up') return 3;
    if (item.courierStatus === 'accepted') return 2;
    if (item.status === 'approved' || item.status === 'processing') return 1;
    return 0;
  };

  const steps = getSteps();

  if (!trackingItems.length) {
      return (
          <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-10 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <FaMapMarkedAlt size={32} className="text-gray-300" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">Faol kuzatuvlar yo'q</h1>
              <p className="text-gray-500 mb-8 max-w-[240px]">Hozircha sizda yo'lda bo'lgan yoki tasdiqlanishini kutayotgan buyurtmalar yo'q.</p>
              <Link href="/mobile" className="px-6 py-3 bg-[#52C6DA] text-white font-bold rounded-2xl shadow-lg ring-4 ring-[#52C6DA]/10">
                  Asosiy sahifaga qaytish
              </Link>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 font-sans pb-10 transition-colors duration-300">
      
      {/* 1. Navbar */}
      <header className="sticky top-[72px] bg-gray-50/80 dark:bg-slate-900/80 backdrop-blur-sm z-30 px-4 py-4 flex items-center gap-4 border-b border-transparent dark:border-slate-800">
        <Link href="/mobile" className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
           <ChevronLeft size={20} />
        </Link>
        <div>
           <h1 className="text-lg font-bold text-gray-900 dark:text-slate-100 leading-tight">📦 Buyurtmalar Kuzatuvi</h1>
           <p className="text-xs text-gray-400 dark:text-slate-500">Kitoblaringiz safar tarixi</p>
        </div>
      </header>

      <div className="px-5 mt-4 space-y-10">
        {trackingItems.map((item) => {
          const currentStepIndex = getStepIndex(item);
          const isDelivered = currentStepIndex === 5;

          return (
            <motion.div 
              key={item._id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* ID and Label */}
              <div className="flex justify-between items-end px-1">
                 <div>
                    <h2 className="text-base font-black text-gray-900 dark:text-slate-100">📦 {item.title}</h2>
                    <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">ID: #{item.id}</p>
                 </div>
                 <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-sm border-b-2 ${
                   item.type === 'rent' 
                   ? 'bg-blue-50 dark:bg-blue-900/20 text-[#52C6DA] border-blue-100 dark:border-blue-900/30' 
                   : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/30'
                 }`}>
                    {item.type === 'rent' ? 'Ijara Olami' : 'Sotuv Marshi'}
                 </span>
              </div>

              {/* Book Info Card */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-soft border border-gray-100 dark:border-slate-700/50 flex gap-4 items-center">
                 <div className="w-14 h-20 rounded-xl overflow-hidden shadow-sm bg-gray-100 dark:bg-slate-700 flex-shrink-0 relative">
                    {item.book.cover ? (
                        <Image src={item.book.cover} alt="Cover" className="w-full h-full object-cover" width={56} height={80} unoptimized />
                    ) : (
                        <BookOpen className="absolute inset-0 m-auto text-gray-300 dark:text-slate-600" />
                    )}
                 </div>
                 <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-slate-100 leading-tight mb-0.5 truncate">{item.book.title}</h3>
                    <p className="text-[11px] text-gray-500 dark:text-slate-400 truncate">{item.book.author}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                       <div className={`w-1.5 h-1.5 rounded-full ${isDelivered ? 'bg-green-500' : 'bg-blue-500 animate-pulse'}`} />
                       <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
                          {steps[currentStepIndex].label}
                       </span>
                    </div>
                 </div>
              </div>

              {/* Timeline */}
              <div className="px-1 py-4">
                  <div className="relative">
                      {/* Line */}
                      <div className="absolute top-5 left-0 w-full h-1 bg-gray-100 dark:bg-slate-800 rounded-full">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(currentStepIndex / 5) * 100}%` }}
                            className="h-full bg-gradient-to-r from-[#52C6DA] to-blue-500 rounded-full" 
                          />
                      </div>

                      <div className="flex justify-between relative z-10 w-full">
                          {steps.map((step, idx) => {
                              const isActive = idx <= currentStepIndex;
                              const isCurrent = idx === currentStepIndex;
                              
                              return (
                                  <div key={idx} className="flex flex-col items-center">
                                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm border-2 transition-all duration-500 shadow-sm
                                          ${isActive ? "bg-[#52C6DA] border-white dark:border-slate-900 text-white" : "bg-white dark:bg-slate-800 border-gray-50 dark:border-slate-700 text-gray-300 dark:text-slate-600"}
                                          ${isCurrent ? "scale-110 ring-4 ring-[#52C6DA]/20" : ""}
                                      `}>
                                          {React.cloneElement(step.icon, { size: 16 })}
                                      </div>
                                  </div>
                              )
                          })}
                      </div>
                      
                      {/* Current Step Label */}
                      <div className="mt-4 text-center">
                         <p className="text-[11px] font-bold text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 px-4 py-1.5 rounded-full inline-block">
                           {steps[currentStepIndex].label}: <span className="text-gray-400 dark:text-slate-500 font-medium">Tayyorgarlik ketmoqda</span>
                         </p>
                      </div>
                  </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700/50">
                   <div className="flex items-center gap-3">
                       <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-[#52C6DA] rounded-2xl">
                           <Truck size={18} />
                       </div>
                       <div className="flex-1">
                           <h3 className="font-black text-[10px] text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">
                               Yetkazib berish manzili
                           </h3>
                           <p className="text-xs text-gray-800 dark:text-slate-100 font-bold leading-tight">{item.delivery.address}</p>
                       </div>
                   </div>
              </div>

              {/* Trace or Message */}
              {item.courierStatus === 'on_way' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-3xl bg-gradient-to-br from-[#52C6DA] to-blue-500 text-white shadow-lg shadow-blue-200"
                  >
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-white/20 rounded-xl">
                            <Truck size={20} className="animate-bounce" />
                         </div>
                         <p className="text-xs font-bold leading-relaxed">
                            Kuryer hozirgina yo'lga chiqdi. Kitobingiz tez orada siz bilan bo'ladi!
                         </p>
                      </div>
                  </motion.div>
              )}

              {isDelivered && (
                <div className="bg-green-50 p-4 rounded-3xl border border-green-100 flex items-center gap-3">
                    <CheckCircle2 size={24} className="text-green-500" />
                    <div>
                        <h4 className="text-xs font-black text-green-700 uppercase">Topshirilgan</h4>
                        <p className="text-[11px] text-green-600 font-medium">Bu kitob endi sizning hamrohingiz.</p>
                    </div>
                </div>
              )}

              {/* Divider if not last */}
              <div className="h-0.5 w-1/3 bg-gray-100 dark:bg-slate-800 mx-auto rounded-full" />
            </motion.div>
          );
        })}

        {/* Support Actions */}
        <div className="flex justify-center gap-8 pt-4">
            <button className="text-[11px] text-gray-400 dark:text-slate-500 font-black uppercase tracking-widest hover:text-[#52C6DA] transition-colors border-b border-transparent hover:border-[#52C6DA]">Savol-javob</button>
            <button className="text-[11px] text-gray-400 dark:text-slate-500 font-black uppercase tracking-widest hover:text-[#52C6DA] transition-colors border-b border-transparent hover:border-[#52C6DA]">Markaz</button>
        </div>
      </div>


    </div>
  );
}
