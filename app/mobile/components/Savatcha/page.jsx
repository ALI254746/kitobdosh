"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ChevronDown, Info, ShoppingBag, Calendar, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useCart } from "@/app/CartContext";
import { useRouter } from "next/navigation";

// --- Constants & Types ---
const RENTAL_DURATIONS = [
  { days: 7, label: '7 kun', multiplier: 1 },
  { days: 14, label: '14 kun', multiplier: 1.5 },
  { days: 30, label: '30 kun', multiplier: 2.5 },
];

// --- Main Component ---
export default function SavatchaPage() {
  const { cartItems, removeFromCart, updateQuantity, updateRentDays } = useCart();
  const [activeTab, setActiveTab] = useState('all'); 
  const router = useRouter();

  // Handle removing item
  const handleRemove = (id) => {
    removeFromCart(id);
  };

  // Handle changing rental duration
  const handleDurationChange = (id, newDuration) => {
    updateRentDays(id, newDuration);
  };

  // Calculate prices
    const { rentTotal, buyTotal, totalCount, displayedItems } = useMemo(() => {
    let rObj = 0;
    let bObj = 0;
    
    const filtered = activeTab === 'all' 
      ? (cartItems || []) 
      : (cartItems || []).filter(item => item.type === activeTab);

    (cartItems || []).forEach(item => {
      if (item.type === 'rent') {
        const base = item.bookId?.rentalPrice || item.rentalPrice || 0;
        const durationOption = RENTAL_DURATIONS.find(d => d.days === item.rentDays) || RENTAL_DURATIONS[0];
        rObj += base * durationOption.multiplier;
      } else {
        bObj += (item.bookId?.price || item.price || 0);
      }
    });

    return { 
      rentTotal: rObj, 
      buyTotal: bObj, 
      totalCount: cartItems?.length || 0,
      displayedItems: filtered
    };
  }, [cartItems, activeTab]);

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + " so'm";
  };

  // CTA Text Logic
  const getCtaText = () => {
    const hasRent = cartItems?.some(i => i.type === 'rent');
    const hasBuy = cartItems?.some(i => i.type === 'buy');

    if (hasRent && hasBuy) return "Davom etish";
    if (hasRent) return "Ijarani tasdiqlash";
    if (hasBuy) return "Xaridni yakunlash";
    return "Davom etish";
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
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
  if (!loading && (cartItems?.length || 0) === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 text-center p-6 transition-colors duration-300 pb-24">
        <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-blue-400 dark:text-blue-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Savatcha hozircha bo‘sh</h2>
        <p className="text-gray-500 dark:text-slate-400 mb-6">Kitob seni kutyapti.</p>
        <button 
            onClick={() => router.push('/mobile')}
            className="px-8 py-3 bg-[#52C6DA] text-white font-bold rounded-2xl shadow-lg"
        >
            Kitob qidirish
        </button>
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
        <AnimatePresence mode="popLayout">
          {displayedItems.map((item) => {
            const book = item.bookId || item;
            // Use cartId as unique identifier
            const uniqueKey = item.cartId || `${item._id}-${item.type}`;
            
            return (
              <motion.div
                key={uniqueKey}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                className="relative overflow-hidden rounded-2xl group"
              >
                {/* Background Delete Action - Fixed behind the swipable content */}
                <div className="absolute inset-0 bg-red-500 flex items-center justify-end px-6 z-0">
                  <Trash2 className="text-white animate-pulse" size={24} />
                </div>

                {/* Swipable Content Wrapper */}
                <motion.div
                  drag="x"
                  dragConstraints={{ right: 0, left: -100 }}
                  dragElastic={0.1}
                  onDragEnd={(e, info) => {
                    // Lowered threshold to -70 for more responsive deletion
                    if (info.offset.x < -70) {
                      handleRemove(uniqueKey);
                    }
                  }}
                  whileDrag={{ scale: 1.02 }}
                  className="bg-white dark:bg-slate-800 p-4 border border-gray-100 dark:border-slate-700 relative z-10 transition-colors"
                  style={{ x: 0 }}
                >
                  <div className="flex gap-4">
                    {/* Book Cover */}
                    <div className="w-[80px] h-[110px] relative rounded-lg overflow-hidden flex-shrink-0 shadow-inner bg-gray-100 dark:bg-slate-700">
                      <Image
                        src={book.images?.[0] || book.image || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop"}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        fill
                        unoptimized
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full mb-2 inline-block ${
                            item.type === 'rent' 
                              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                              : 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                          }`}>
                            {item.type === 'rent' ? 'Ijara' : 'Sotib olish'}
                          </span>
                          
                          <button 
                            onClick={() => handleRemove(uniqueKey)}
                            className="text-gray-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 p-1 active:scale-90 transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <h3 className="font-bold text-gray-900 dark:text-white leading-tight mb-1 line-clamp-1">{book.title}</h3>
                        <p className="text-xs text-gray-500 dark:text-slate-400">{book.author}</p>
                      </div>

                      <div className="mt-3">
                        {item.type === 'rent' ? (
                          <div className="flex flex-col gap-2">
                            <div className="flex bg-gray-50 dark:bg-slate-700/50 rounded-lg p-1 gap-1">
                              {RENTAL_DURATIONS.map((dur) => (
                                <button
                                  key={dur.days}
                                  onClick={() => handleDurationChange(uniqueKey, dur.days)}
                                  className={`flex-1 text-[10px] py-1 rounded-md transition-all ${
                                    item.rentDays === dur.days 
                                      ? 'bg-white dark:bg-slate-600 shadow text-blue-600 dark:text-blue-400 font-bold border border-gray-100 dark:border-slate-500' 
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
                                {book.rating ? `${book.rating} reyting` : 'Siz uchun tanlov'}
                              </p>
                              <span className="font-bold text-blue-600 dark:text-blue-400">
                                {formatPrice((book.rentalPrice || 0) * (RENTAL_DURATIONS.find(d => d.days === item.rentDays)?.multiplier || 1))}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-end justify-between">
                            <p className="text-[10px] text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md">
                              Bu kitob seniki bo‘ladi
                            </p>
                            <span className="font-bold text-green-600 dark:text-green-400 text-lg">
                              {formatPrice(book.price || 0)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
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

        <button 
          onClick={() => router.push('/mobile/components/checkout')}
          className="w-full py-4 bg-[#3A7BD5] hover:bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 dark:shadow-blue-900/50 transition-all active:scale-[0.98]"
        >
            {getCtaText()}
        </button>
        <p className="text-center text-[10px] text-gray-400 dark:text-slate-500 mt-3">
            Yetkazib berish yoki qo‘ldan-qo‘lga topshirish keyingi bosqichda
        </p>
      </div>

    </div>
  );
}
