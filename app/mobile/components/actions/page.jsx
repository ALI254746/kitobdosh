"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Truck, Package, CheckCircle2, Clock, MapPin, MessageSquare, Info, ShieldCheck, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// --- Constants & Types ---
const ORDER_STATUS = {
  ORDERED: 'ordered',
  PREPARED: 'prepared',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
};

// Mock Data
const MOCK_ORDER = {
  id: "ORD-7829",
  book: {
    title: "1984",
    author: "Jorj Oruell",
    cover: "https://placehold.co/120x180/1e293b/fee2e2?text=1984",
    type: 'rent', // 'rent' | 'buy'
    prevReaders: 5,
  },
  status: 'in_transit', // Switch this to test states
  timeline: [
    { status: 'ordered', label: "Buyurtma qabul qilindi", time: "10:30", msg: "Tizimga kiritildi" },
    { status: 'prepared', label: "Kitob tayyorlandi", time: "11:15", msg: "Zarina kitobni qutiga joyladi" },
    { status: 'in_transit', label: "Yo‘lda", time: "Hozir", msg: "Kuryer Jasur yo‘lga chiqdi", active: true },
    { status: 'delivered', label: "Yetkazildi", time: "", msg: "" },
  ],
  deliveryinfo: {
    method: 'courier', // 'courier' | 'meetup'
    location: "Chilonzor, 9-kvartal",
    courierName: "Jasur",
  },
  trace: {
    hasTrace: true,
    text: "“Oxirgi sahifani yolg‘iz o‘qima…”",
    author: "Avvalgi mehmon"
  }
};

// --- Helper Components ---

const StatusIcon = ({ status, isActive, isCompleted }) => {
  if (isCompleted) return <CheckCircle2 size={18} className="text-green-500" />;
  if (isActive) return <div className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] animate-pulse" />;
  return <div className="w-2 h-2 bg-gray-200 rounded-full" />;
};

// --- Main Page Component ---
export default function OrderTrackingPage() {
  // Simulating fetching order status from backend
  const [order, setOrder] = useState(MOCK_ORDER);
  
  // Determine current step index based on status strings
  const getStepIndex = (status) => {
    const steps = [ORDER_STATUS.ORDERED, ORDER_STATUS.PREPARED, ORDER_STATUS.IN_TRANSIT, ORDER_STATUS.DELIVERED];
    return steps.indexOf(status);
  };

  const currentStepIndex = getStepIndex(order.status);
  const isDelivered = order.status === ORDER_STATUS.DELIVERED;

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10">
      
      {/* 1. Navbar */}
      <header className="sticky top-0 bg-gray-50/80 backdrop-blur-sm z-50 px-4 py-4 flex items-center gap-4">
        <Link href="/mobile" className="p-2 bg-white rounded-full shadow-sm text-gray-600 hover:bg-gray-100 transition-colors">
           <ChevronLeft size={20} />
        </Link>
        <div>
           <h1 className="text-lg font-bold text-gray-900 leading-tight">📦 Kitob yo‘lda</h1>
           <p className="text-xs text-gray-400">
             {isDelivered ? "Safar yakunlandi" : "Bu kitob hozir safarda"}
           </p>
        </div>
      </header>

      <div className="px-5 mt-4 flex flex-col gap-6">

        {/* 2. Book Summary Card */}
        <motion.div 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-white p-4 rounded-3xl shadow-soft border border-gray-100 flex gap-4 items-center"
        >
           <div className="w-16 h-24 rounded-xl overflow-hidden shadow-sm bg-gray-200 flex-shrink-0">
              <Image src={order.book.cover} alt="Cover" className="w-full h-full object-cover" width={64} height={96} unoptimized />
           </div>
           <div>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full mb-1 inline-block ${order.book.type === 'rent' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                 {order.book.type === 'rent' ? 'Ijara' : 'Sotib olish'}
              </span>
              <h2 className="font-bold text-gray-900 leading-tight mb-0.5">{order.book.title}</h2>
              <p className="text-xs text-gray-500 mb-2">{order.book.author}</p>
              {order.book.type === 'rent' && (
                 <p className="text-[10px] text-gray-400 flex items-center gap-1">
                    <User size={10} /> Bu kitobdan oldin {order.book.prevReaders} kishi o‘qigan
                 </p>
              )}
           </div>
        </motion.div>

        {/* 3. Journey Timeline */}
        <div className="pl-2">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 pl-2">Safar tarixi</h3>
            <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 pb-2">
                {order.timeline.map((step, idx) => {
                    const isCompleted = idx < currentStepIndex;
                    const isActive = idx === currentStepIndex;
                    const isFuture = idx > currentStepIndex;

                    return (
                        <div key={idx} className={`relative pl-6 transition-all duration-500 ${isFuture ? 'opacity-40 grayscale' : 'opacity-100'}`}>
                            {/* Dot Icon */}
                            <div className="absolute -left-[7px] top-1 bg-gray-50 p-1">
                                <StatusIcon status={step.status} isActive={isActive} isCompleted={isCompleted || isDelivered} />
                            </div>
                            
                            {/* Text */}
                            <div>
                                <h4 className={`text-sm font-bold ${isActive ? 'text-blue-600' : 'text-gray-900'}`}>{step.label}</h4>
                                {step.msg && <p className="text-xs text-gray-500 mt-1 font-medium">{step.msg}</p>}
                                {step.time && <span className="text-[10px] text-gray-400 block mt-1">{step.time}</span>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* 4. Delivery Method Info - Only show if not delivered */}
        {!isDelivered && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100"
          >
             <div className="flex items-center gap-3 mb-3">
                 <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
                     {order.deliveryinfo.method === 'courier' ? <Truck size={20} /> : <User size={20} />}
                 </div>
                 <div>
                     <h3 className="font-bold text-sm text-gray-900">
                         {order.deliveryinfo.method === 'courier' ? 'Kuryer orqali yetkazish' : 'Qo‘ldan-qo‘lga'}
                     </h3>
                     <p className="text-xs text-gray-400">{order.deliveryinfo.location}</p>
                 </div>
             </div>
             
             {order.deliveryinfo.method === 'meetup' && (
                 <div className="bg-yellow-50 p-3 rounded-xl flex gap-2 items-start">
                     <ShieldCheck size={16} className="text-yellow-600 mt-0.5" />
                     <p className="text-xs text-yellow-700 leading-snug">
                         Xavfsizlik uchun uchrashuvni faqat <strong>jamoat joylarida</strong> (metro, park, kafe) belgilang.
                     </p>
                 </div>
             )}

             <div className="mt-4 flex gap-3">
                 <button className="flex-1 py-2.5 bg-gray-50 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-100 transition-colors">
                     Uchrashuv tafsilotlari
                 </button>
             </div>
          </motion.div>
        )}

        {/* 5. Emotional Trace (Optional) */}
        {!isDelivered && (
            <div className="bg-gradient-to-br from-gray-100 to-gray-50 p-5 rounded-3xl border border-white shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 text-gray-200 opacity-50">
                    <MessageSquare size={40} />
                </div>
                
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 relative z-10">📜 Kitobdan iz</h3>
                
                {order.trace && order.trace.hasTrace ? (
                    <div className="relative z-10">
                        <p className="text-gray-600 italic font-serif text-sm mb-2">
                           {order.trace.text}
                        </p>
                        <p className="text-[10px] text-gray-400 text-right">— {order.trace.author}</p>
                    </div>
                ) : (
                    <p className="text-gray-400 text-xs italic relative z-10">
                        Bu safar kitob jim. Undan faqat qog‘oz hidi kelyapti.
                    </p>
                )}
            </div>
        )}

        {/* 6. Calm Actions (Footer) */}
        <div className="flex justify-center gap-6 mt-2 opacity-60 hover:opacity-100 transition-opacity">
            <button className="text-xs text-gray-400 font-medium hover:text-blue-500 transition-colors">Savol berish</button>
            <button className="text-xs text-gray-400 font-medium hover:text-blue-500 transition-colors">Yordam</button>
            {!isDelivered && <button className="text-xs text-gray-400 font-medium hover:text-red-400 transition-colors">Bekor qilish</button>}
        </div>

        {/* 7. Delivered State (Overlay or Transformation) */}
        <AnimatePresence>
            {isDelivered && (
                <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ duration: 0.8 }}
                   className="fixed inset-0 bg-white/90 backdrop-blur-md z-[60] flex flex-col items-center justify-center p-8 text-center"
                >
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-soft">
                        <CheckCircle2 size={40} className="text-blue-500" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">📘 Kitob siz bilan</h2>
                    <p className="text-gray-500 mb-8 max-w-[200px] mx-auto">
                        Bu kitob endi sizning hamrohingiz. Uning safarini davom ettiring.
                    </p>

                    <Link 
                        href="/mobile/components/mobileprofile" // Link to lineage/profile
                        className="px-8 py-3 bg-[#3A7BD5] text-white font-bold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-600 transition-transform active:scale-95"
                    >
                        Fikr qoldirish
                    </Link>

                    <button className="mt-6 text-sm text-gray-400 hover:text-gray-600">
                        Asosiy ekranga qaytish
                    </button>
                </motion.div>
            )}
        </AnimatePresence>

      </div>
    </div>
  );
}
