"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  FaTrashAlt,
  FaMinus,
  FaPlus,
  FaArrowLeft,
  FaShieldAlt,
  FaCreditCard,
  FaMoneyBillWave,
  FaTruck,
  FaBoxOpen,
} from "react-icons/fa";
import { FaLocationDot, FaClock } from "react-icons/fa6"; // Corrected import for FaClock

// --- MOCK DATA ---
const INITIAL_CART_ITEMS = [
  {
    id: 1,
    title: "Yuqori darajadagi matematika",
    author: "Dr. Sarah Wilson",
    price: 45000,
    quantity: 1,
    image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/adb4f7409e-76c10fce523b814d55d0.png",
    type: "ijara", // or 'sotib-olish'
    rentalDays: 10,
    rentalPricePerDay: 3000,
  },
  {
    id: 2,
    title: "Zamonaviy Fizika",
    author: "Prof. Einstein",
    price: 120000,
    quantity: 1,
    image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/0a3c673cab-677aa09155081621fd6a.png",
    type: "sotib-olish",
  },
];

// --- COMPONENTS ---

const SkeletonCartItem = () => (
  <div className="flex gap-4 p-4 rounded-3xl bg-white border border-gray-100 animate-pulse">
    <div className="w-24 h-32 bg-gray-200 rounded-2xl" />
    <div className="flex-1 space-y-3 py-2">
      <div className="h-6 w-3/4 bg-gray-200 rounded-lg" />
      <div className="h-4 w-1/2 bg-gray-200 rounded-lg" />
      <div className="flex justify-between items-end mt-4">
         <div className="h-8 w-24 bg-gray-200 rounded-xl" />
         <div className="h-10 w-32 bg-gray-200 rounded-xl" />
      </div>
    </div>
  </div>
);

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      className="group relative bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[#D1F0E0]/30 hover:border-[#96C7B9] transition-all duration-300"
    >
      <div className="flex gap-5">
        {/* Image */}
        <div className="relative w-24 h-32 md:w-32 md:h-40 rounded-2xl overflow-hidden shadow-inner bg-gray-50 flex-shrink-0">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {item.type === "ijara" && (
            <span className="absolute top-2 left-2 bg-[#D1F0E0] text-[#1F2937] text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
              IJARA
            </span>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="text-lg md:text-xl font-bold text-[#1F2937] line-clamp-2 leading-tight mb-1">
                {item.title}
              </h3>
              <button 
                onClick={() => onRemove(item.id)}
                className="text-gray-300 hover:text-red-500 transition-colors p-1"
              >
                <FaTrashAlt />
              </button>
            </div>
            <p className="text-sm text-gray-400 font-medium mb-3">{item.author}</p>
            
            {item.type === "ijara" && (
               <div className="inline-flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-100 mb-2">
                  <FaClock className="text-[#96C7B9] text-xs" />
                  <span className="text-xs font-bold text-gray-500">{item.rentalDays} kun</span>
                  <span className="text-xs text-gray-300">|</span>
                  <span className="text-xs font-bold text-[#1F2937]">{item.rentalPricePerDay.toLocaleString()} so&apos;m/kun</span>
               </div>
            )}
          </div>

          <div className="flex justify-between items-end">
            {/* Quantity Controls */}
            <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
               <button 
                 onClick={() => onUpdateQuantity(item.id, -1)}
                 disabled={item.quantity <= 1}
                 className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-gray-500 hover:text-[#1F2937] hover:shadow-sm disabled:opacity-50 transition-all"
               >
                 <FaMinus className="text-xs" />
               </button>
               <span className="w-10 text-center font-bold text-[#1F2937]">{item.quantity}</span>
               <button 
                 onClick={() => onUpdateQuantity(item.id, 1)}
                 className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-gray-500 hover:text-[#1F2937] hover:shadow-sm transition-all"
               >
                 <FaPlus className="text-xs" />
               </button>
            </div>

            {/* Price */}
            <div className="text-right">
              {item.type === "ijara" ? (
                 <>
                   <p className="text-xs text-gray-400">Jami ijara narxi</p>
                   <p className="text-xl font-black text-[#96C7B9]">
                     {(item.rentalPricePerDay * item.rentalDays * item.quantity).toLocaleString()} <span className="text-xs text-[#1F2937]">so&apos;m</span>
                   </p>
                 </>
              ) : (
                 <p className="text-xl font-black text-[#96C7B9]">
                   {(item.price * item.quantity).toLocaleString()} <span className="text-xs text-[#1F2937]">so&apos;m</span>
                 </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- MAIN PAGE ---

export default function CartPage() {
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [deliveryMethod, setDeliveryMethod] = useState("pickup"); // 'pickup', 'standard', 'express'

  useEffect(() => {
    // Simulate API Fetch
    setTimeout(() => {
        setCartItems(INITIAL_CART_ITEMS);
        setLoading(false);
    }, 1500);
  }, []);

  const updateQuantity = (id, change) => {
    setCartItems(items => items.map(item => 
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => {
      if (item.type === "ijara") {
          return acc + (item.rentalPricePerDay * item.rentalDays * item.quantity);
      }
      return acc + (item.price * item.quantity);
  }, 0);

  const deliveryPrice = deliveryMethod === 'standard' ? 20000 : (deliveryMethod === 'express' ? 50000 : 0);
  const total = subtotal + deliveryPrice;

  return (
    <div className="min-h-screen bg-[#F0FDF8] font-sans pb-20">
      
      {/* Header */}
      <div className="bg-white border-b border-[#D1F0E0]/50 sticky top-0 z-40 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
           <Link href="/mainPage/sotibolish" className="flex items-center gap-2 text-gray-400 hover:text-[#1F2937] transition-colors font-bold text-sm">
              <FaArrowLeft /> Ortga qaytish
           </Link>
           <h1 className="text-xl md:text-2xl font-black text-[#1F2937]">
              Savat <span className="text-[#96C7B9]">({cartItems.length})</span>
           </h1>
           <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
            
            {/* LEFT COLUMN: Cart Items */}
            <div className="flex-1 space-y-6">
                <AnimatePresence mode="popLayout">
                    {loading ? (
                        <>
                           <SkeletonCartItem />
                           <SkeletonCartItem />
                        </>
                    ) : cartItems.length > 0 ? (
                        cartItems.map(item => (
                            <CartItem 
                                key={item.id} 
                                item={item} 
                                onUpdateQuantity={updateQuantity}
                                onRemove={removeItem}
                            />
                        ))
                    ) : (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-white rounded-[2.5rem] p-12 text-center border border-dashed border-gray-200"
                        >
                           <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl text-gray-300">
                               <FaBoxOpen />
                           </div>
                           <h3 className="text-xl font-bold text-[#1F2937] mb-2">Savatingiz bo&apos;sh</h3>
                           <p className="text-gray-400 mb-8">Hozircha hech narsa tanlamadingiz.</p>
                           <Link href="/mainPage/sotibolish" className="inline-block bg-[#1F2937] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#96C7B9] hover:shadow-lg transition-all">
                               Xaridni boshlash
                           </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* RIGHT COLUMN: Summary */}
            <div className="lg:w-[400px]">
                <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-xl shadow-slate-100/50 sticky top-28">
                    <h3 className="text-lg font-black text-[#1F2937] mb-6 flex items-center gap-2">
                        Buyurtma Ma&apos;lumotlari
                    </h3>

                    {/* Delivery Options */}
                    <div className="space-y-3 mb-8">
                        <label className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all
                            ${deliveryMethod === 'pickup' ? 'border-[#96C7B9] bg-[#F0FDF8]' : 'border-gray-100 hover:border-gray-200'}
                        `}>
                            <input 
                              type="radio" 
                              name="delivery" 
                              checked={deliveryMethod === 'pickup'} 
                              onChange={() => setDeliveryMethod('pickup')}
                              className="hidden"
                            />
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                                ${deliveryMethod === 'pickup' ? 'border-[#96C7B9]' : 'border-gray-300'}
                            `}>
                                {deliveryMethod === 'pickup' && <div className="w-2.5 h-2.5 rounded-full bg-[#96C7B9]" />}
                            </div>
                            <div className="flex-1">
                                <span className="block font-bold text-[#1F2937] text-sm">Olib ketish</span>
                                <span className="text-xs text-gray-400">Kitob do&apos;konidan</span>
                            </div>
                            <span className="font-bold text-[#96C7B9] text-sm">0 so&apos;m</span>
                        </label>

                        <label className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all
                            ${deliveryMethod === 'standard' ? 'border-[#96C7B9] bg-[#F0FDF8]' : 'border-gray-100 hover:border-gray-200'}
                        `}>
                            <input 
                              type="radio" 
                              name="delivery" 
                              checked={deliveryMethod === 'standard'} 
                              onChange={() => setDeliveryMethod('standard')}
                              className="hidden"
                            />
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                                ${deliveryMethod === 'standard' ? 'border-[#96C7B9]' : 'border-gray-300'}
                            `}>
                                {deliveryMethod === 'standard' && <div className="w-2.5 h-2.5 rounded-full bg-[#96C7B9]" />}
                            </div>
                            <div className="flex-1">
                                <span className="block font-bold text-[#1F2937] text-sm">Yetkazib berish</span>
                                <span className="text-xs text-gray-400">Shahar ichida (1-3 kun)</span>
                            </div>
                            <span className="font-bold text-[#1F2937] text-sm">20,000</span>
                        </label>
                    </div>

                    {/* Summary Lines */}
                    <div className="space-y-3 py-6 border-t border-dashed border-gray-200 text-sm">
                        <div className="flex justify-between text-gray-500">
                            <span>Mahsulotlar ({cartItems.length})</span>
                            <span className="font-medium">{subtotal.toLocaleString()} so&apos;m</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                            <span>Yetkazib berish</span>
                            <span className="font-medium">{deliveryPrice.toLocaleString()} so&apos;m</span>
                        </div>
                        <div className="flex justify-between text-[#96C7B9] font-bold">
                            <span>Chegirma</span>
                            <span>0 so&apos;m</span>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 mb-6">
                        <span className="font-bold text-[#1F2937]">Jami to&apos;lov</span>
                        <span className="text-2xl font-black text-[#1F2937]">
                            {total.toLocaleString()} <span className="text-sm font-medium text-gray-400">so&apos;m</span>
                        </span>
                    </div>

                    <button className="w-full py-4 bg-[#1F2937] text-white rounded-2xl font-bold shadow-xl shadow-gray-200 hover:bg-[#96C7B9] hover:shadow-[#96C7B9]/40 transition-all transform active:scale-95 flex items-center justify-center gap-2">
                        <FaCreditCard /> To&apos;lovga o&apos;tish
                    </button>
                    
                    <p className="mt-4 text-xs text-center text-gray-400 flex items-center justify-center gap-1.5 opacity-80">
                        <FaShieldAlt /> Barcha to&apos;lovlar himoyalangan
                    </p>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
