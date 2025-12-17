"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ChevronDown, Info, ShoppingBag, Calendar } from 'lucide-react';
import Image from 'next/image';

// --- Constants & Types ---
const RENTAL_DURATIONS = [
  { days: 7, label: '7 kun', multiplier: 1 },
  { days: 14, label: '14 kun', multiplier: 1.5 },
  { days: 30, label: '30 kun', multiplier: 2.5 },
];

const MOCK_CART_ITEMS = [
  {
    id: 1,
    type: 'rent',
    title: 'O‘tgan kunlar',
    author: 'Abdulla Qodiriy',
    cover: 'https://placehold.co/120x180/e2e8f0/1e293b?text=Otgan+Kunlar',
    basePrice: 15000,
    duration: 7,
    readersCount: 12,
  },
  {
    id: 2,
    type: 'buy',
    title: 'Atomic Habits',
    author: 'James Clear',
    cover: 'https://placehold.co/120x180/fed7aa/9a3412?text=Atomic',
    price: 85000,
  },
  {
    id: 3,
    type: 'rent',
    title: 'Sariq devni minib',
    author: 'Xudoyberdi To‘xtaboyev',
    cover: 'https://placehold.co/120x180/bfdbfe/1e40af?text=Sariq+Dev',
    basePrice: 12000,
    duration: 14,
    readersCount: 5,
  }
];

// --- Main Component ---
export default function SavatchaPage() {
  const [items, setItems] = useState(MOCK_CART_ITEMS);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'rent', 'buy'

  // --- Logic Helpers ---

  // Handle removing item
  const handleRemove = (id) => {
    // In a real app, show confirmation modal here
    if (window.confirm("Rostdan ham o'chirmoqchimisiz?")) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  // Handle changing rental duration
  const handleDurationChange = (id, newDuration) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, duration: newDuration } : item
    ));
  };

  // Calculate prices
  const { rentTotal, buyTotal, totalCount } = useMemo(() => {
    let rObj = 0;
    let bObj = 0;
    
    items.forEach(item => {
      if (item.type === 'rent') {
        const durationOption = RENTAL_DURATIONS.find(d => d.days === item.duration) || RENTAL_DURATIONS[0];
        rObj += item.basePrice * durationOption.multiplier;
      } else {
        bObj += item.price;
      }
    });

    return { rentTotal: rObj, buyTotal: bObj, totalCount: items.length };
  }, [items]);

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + " so'm";
  };

  // Filter items for display
  const displayedItems = activeTab === 'all' 
    ? items 
    : items.filter(item => item.type === activeTab);

  // CTA Text Logic
  const getCtaText = () => {
    const hasRent = items.some(i => i.type === 'rent');
    const hasBuy = items.some(i => i.type === 'buy');

    if (hasRent && hasBuy) return "Davom etish";
    if (hasRent) return "Ijarani tasdiqlash";
    if (hasBuy) return "Xaridni yakunlash";
    return "Davom etish";
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // --- Skeleton Component ---
  const CartSkeleton = () => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden animate-pulse">
        <div className="flex gap-4">
            <div className="w-[80px] h-[110px] bg-gray-200 dark:bg-slate-700 rounded-lg flex-shrink-0" />
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <div className="w-16 h-4 bg-gray-200 dark:bg-slate-700 rounded-full" />
                        <div className="w-5 h-5 bg-gray-200 dark:bg-slate-700 rounded-md" />
                    </div>
                    <div className="w-3/4 h-5 bg-gray-200 dark:bg-slate-700 rounded mb-2" />
                    <div className="w-1/2 h-4 bg-gray-200 dark:bg-slate-700 rounded" />
                </div>
                <div className="h-8 w-full bg-gray-200 dark:bg-slate-700 rounded-lg mt-3" />
            </div>
        </div>
    </div>
  );

  // --- Empty State ---
  if (!loading && items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 text-center p-6 transition-colors duration-300">
        <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-blue-400 dark:text-blue-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Savatcha hozircha bo‘sh</h2>
        <p className="text-gray-500 dark:text-slate-400">Kitob seni kutyapti.</p>
      </div>
    );
  }

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-32 font-sans relative transition-colors duration-300">
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-4 border-b border-gray-100 dark:border-slate-800 mb-4 transition-colors">
            <div className="h-8 w-1/3 bg-gray-200 dark:bg-slate-800 rounded mb-1 animate-pulse" />
            <div className="h-4 w-2/3 bg-gray-200 dark:bg-slate-800 rounded animate-pulse" />
        </header>

        <div className="px-4 mb-6">
             <div className="h-10 w-full bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        </div>

        <div className="px-4 space-y-4">
             {[1, 2, 3].map((i) => <CartSkeleton key={i} />)}
        </div>
        
        {/* Skeleton Bottom Bar */}
        <div className="fixed bottom-[65px] left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 p-4 pb-4 z-40">
             <div className="flex justify-between items-end mb-4 animate-pulse">
                <div className="space-y-2">
                    <div className="h-3 w-24 bg-gray-200 dark:bg-slate-700 rounded" />
                    <div className="h-3 w-32 bg-gray-200 dark:bg-slate-700 rounded" />
                </div>
                <div className="text-right space-y-2">
                    <div className="h-3 w-20 bg-gray-200 dark:bg-slate-700 rounded ml-auto" />
                    <div className="h-8 w-28 bg-gray-200 dark:bg-slate-700 rounded ml-auto" />
                </div>
             </div>
             <div className="h-14 w-full bg-gray-200 dark:bg-slate-700 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  // --- Render ---
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-32 font-sans relative transition-colors duration-300">
      
      {/* 1. Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-4 border-b border-gray-100 dark:border-slate-800 mb-4 transition-colors">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Savatcha</h1>
        <p className="text-xs text-gray-500 dark:text-slate-400 font-medium mt-1">
          Kitoblar vaqtincha mehmon bo‘lishi mumkin
        </p>
      </header>

      {/* 2. Tabs (Segmented Control) */}
      <div className="px-4 mb-6">
        <div className="bg-gray-200 dark:bg-slate-800 p-1 rounded-xl flex relative transition-colors">
          {/* Active Indicator Background */}
          <motion.div 
            className="absolute top-1 bottom-1 bg-white dark:bg-slate-700 rounded-lg shadow-sm z-0"
            animate={{ 
               left: activeTab === 'all' ? '4px' : activeTab === 'rent' ? '33%' : '66%',
               width: '32%' 
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />

          {['all', 'rent', 'buy'].map((tab) => (
             <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 relative z-10 py-2 text-sm font-medium transition-colors duration-200 ${activeTab === tab ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-slate-400'}`}
             >
                {tab === 'all' ? 'Hammasi' : tab === 'rent' ? 'Ijara' : 'Sotib olish'}
             </button>
          ))}
        </div>
      </div>

      {/* 3. Items List */}
      <div className="px-4 space-y-4">
        <AnimatePresence>
          {displayedItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden transition-colors"
            >
              <div className="flex gap-4">
                {/* Book Cover */}
                <div className="w-[80px] h-[110px] relative rounded-lg overflow-hidden flex-shrink-0 shadow-inner bg-gray-100 dark:bg-slate-700">
                    <Image
                        src={item.cover}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        width={80}
                        height={110}
                        unoptimized
                    />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between">
                   <div>
                       <div className="flex justify-between items-start">
                           {/* Badge */}
                           <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full mb-2 inline-block ${
                               item.type === 'rent' 
                                 ? 'bg-blue-50 text-blue-600' 
                                 : 'bg-green-50 text-green-600'
                           }`}>
                               {item.type === 'rent' ? 'Ijara' : 'Sotib olish'}
                           </span>
                           
                           {/* Remove Button */}
                           <button 
                             onClick={() => handleRemove(item.id)}
                             className="text-gray-400 hover:text-red-400 dark:text-slate-500 dark:hover:text-red-400 p-1"
                           >
                               <Trash2 size={16} />
                           </button>
                       </div>

                       <h3 className="font-bold text-gray-900 dark:text-white leading-tight mb-1">{item.title}</h3>
                       <p className="text-xs text-gray-500 dark:text-slate-400">{item.author}</p>
                   </div>

                   {/* Variable Footer Section per type */}
                   <div className="mt-3">
                       {item.type === 'rent' ? (
                           <div className="flex flex-col gap-2">
                               {/* Duration Selector */}
                               <div className="flex bg-gray-50 rounded-lg p-1 gap-1">
                                   {RENTAL_DURATIONS.map((dur) => (
                                       <button
                                           key={dur.days}
                                           onClick={() => handleDurationChange(item.id, dur.days)}
                                           className={`flex-1 text-[10px] py-1 rounded-md transition-all ${
                                               item.duration === dur.days 
                                                 ? 'bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400 font-bold border border-gray-100 dark:border-slate-600' 
                                                 : 'text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300'
                                           }`}
                                       >
                                           {dur.label}
                                       </button>
                                   ))}
                               </div>
                               <div className="flex items-center justify-between mt-1">
                                   <p className="text-[10px] text-gray-400 flex items-center gap-1">
                                       <Info size={10} />
                                       avval {item.readersCount} kishi o‘qigan
                                   </p>
                                   <span className="font-bold text-blue-600">
                                       {formatPrice(item.basePrice * (RENTAL_DURATIONS.find(d => d.days === item.duration)?.multiplier || 1))}
                                   </span>
                               </div>
                           </div>
                       ) : (
                           <div className="flex items-end justify-between">
                                <p className="text-[10px] text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md">
                                    Bu kitob seniki bo‘ladi
                                </p>
                                <span className="font-bold text-green-600 dark:text-green-400 text-lg">
                                    {formatPrice(item.price)}
                                </span>
                           </div>
                       )}
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 4. Emotional Divider */}
      <div className="flex items-center justify-center my-8 px-8 opacity-60">
        <div className="h-[1px] bg-gray-300 flex-1"></div>
        <span className="px-4 text-xs font-medium text-gray-400 text-center italic">
          &quot;Kitoblar egasi emas, <br/>mehmoni bo‘lamiz&quot;
        </span>
        <div className="h-[1px] bg-gray-300 flex-1"></div>
      </div>

      {/* 5. Sticky Bottom Summary - Lifted above Footer */}
      <div className="fixed bottom-[65px] left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] p-4 pb-4 z-40 transition-colors">
        <div className="flex justify-between items-end mb-4">
           <div>
               <p className="text-gray-400 dark:text-slate-500 text-xs mb-1">Jami kitoblar: {totalCount} ta</p>
               <div className="flex flex-col">
                   {rentTotal > 0 && (
                       <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Ijara: {formatPrice(rentTotal)}</span>
                   )}
                   {buyTotal > 0 && (
                       <span className="text-xs text-green-600 dark:text-green-400 font-medium">Sotib olish: {formatPrice(buyTotal)}</span>
                   )}
               </div>
           </div>
           <div className="text-right">
               <span className="text-xs text-gray-400 dark:text-slate-500">Umumiy hisob</span>
               <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(rentTotal + buyTotal)}</h2>
           </div>
        </div>

        <button className="w-full py-4 bg-[#3A7BD5] hover:bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 dark:shadow-blue-900/50 transition-all active:scale-[0.98]">
            {getCtaText()}
        </button>
        <p className="text-center text-[10px] text-gray-400 dark:text-slate-500 mt-3">
            Yetkazib berish yoki qo‘ldan-qo‘lga topshirish keyingi bosqichda
        </p>
      </div>

    </div>
  );
}
