"use client";

import React, { useState, useEffect } from "react";
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
  FaBoxOpen,
  FaTimes,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaTruck,
  FaStore
} from "react-icons/fa";
import { FaClock } from "react-icons/fa6";
import { useCart } from "../../CartContext";
import toast from "react-hot-toast";
import { useMain } from "../MainContext";

// --- COMPONENTS ---

const CheckoutModal = ({ isOpen, onClose, cartItems, subtotal, clearCart }) => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        deliveryMethod: "pickup" // 'pickup', 'standard'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { darkMode } = useMain();

    if (!isOpen) return null;

    const deliveryPrice = formData.deliveryMethod === 'standard' ? 20000 : 0;
    const finalTotal = subtotal + deliveryPrice;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const orderData = {
            items: cartItems.map(item => ({
                book: item._id,
                title: item.title,
                quantity: item.quantity,
                price: item.price || 0,
                type: item.type,
                rentDays: item.rentDays || 0
            })),
            customer: {
                name: formData.name,
                phone: formData.phone,
                address: formData.deliveryMethod === 'standard' ? formData.address : 'Do\'kon (Olib ketish)'
            },
            deliveryMethod: formData.deliveryMethod,
            totalPrice: finalTotal
        };

        try {
            const res = await fetch('/api/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });
            const data = await res.json();

            if (data.success) {
                toast.success("Buyurtmangiz qabul qilindi! Tez orada aloqaga chiqamiz.");
                clearCart();
                onClose();
            } else {
                toast.error("Xatolik: " + data.message);
            }
        } catch (error) {
            toast.error("Tarmoq xatosi");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]
                    ${darkMode ? "bg-slate-800" : "bg-white"}
                `}
            >
                {/* Header */}
                <div className={`p-5 border-b flex justify-between items-center z-10 sticky top-0
                    ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"}
                `}>
                    <h3 className={`text-xl font-black ${darkMode ? "text-white" : "text-[#1F2937]"}`}>Rasmiylashtirish</h3>
                    <button onClick={onClose} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
                        ${darkMode ? "bg-slate-700 hover:bg-red-900/30 hover:text-red-400 text-gray-400" : "bg-gray-50 hover:bg-red-50 hover:text-red-500"}
                    `}>
                        <FaTimes />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-1">
                                <label className={`text-xs font-bold uppercase ml-1 ${darkMode ? "text-gray-400" : "text-gray-400"}`}>Ism Familiya</label>
                                <div className="relative group">
                                    <FaUser className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${darkMode ? "text-gray-500 group-focus-within:text-blue-400" : "text-gray-300 group-focus-within:text-[#96C7B9]"}`} />
                                    <input 
                                        required
                                        type="text" 
                                        placeholder="Ismingizni kiriting" 
                                        className={`w-full pl-10 pr-4 py-3.5 border-2 border-transparent rounded-xl outline-none focus:border-[#96C7B9] font-bold transition-all
                                            ${darkMode ? "bg-slate-700 text-white focus:bg-slate-600" : "bg-gray-50 focus:bg-white text-[#1F2937]"}
                                        `}
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className={`text-xs font-bold uppercase ml-1 ${darkMode ? "text-gray-400" : "text-gray-400"}`}>Telefon Raqam</label>
                                <div className="relative group">
                                    <FaPhone className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${darkMode ? "text-gray-500 group-focus-within:text-blue-400" : "text-gray-300 group-focus-within:text-[#96C7B9]"}`} />
                                    <input 
                                        required
                                        type="tel" 
                                        placeholder="+998 9..." 
                                        className={`w-full pl-10 pr-4 py-3.5 border-2 border-transparent rounded-xl outline-none focus:border-[#96C7B9] font-bold transition-all
                                            ${darkMode ? "bg-slate-700 text-white focus:bg-slate-600" : "bg-gray-50 focus:bg-white text-[#1F2937]"}
                                        `}
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                             <label className="text-xs font-bold text-gray-400 uppercase ml-1">Yetkazib berish turi</label>
                             <div className="grid grid-cols-2 gap-3">
                                 <label className={`relative cursor-pointer p-3 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-2
                                    ${formData.deliveryMethod === 'pickup' 
                                        ? (darkMode ? 'border-blue-500 bg-blue-900/30' : 'border-[#96C7B9] bg-[#F0FDF8]') 
                                        : (darkMode ? 'border-slate-700 hover:border-slate-600' : 'border-gray-100 hover:border-gray-200')}
                                 `}>
                                     <input 
                                        type="radio" 
                                        name="delivery" 
                                        value="pickup" 
                                        checked={formData.deliveryMethod === 'pickup'}
                                        onChange={() => setFormData({ ...formData, deliveryMethod: 'pickup' })}
                                        className="hidden" 
                                     />
                                     <FaStore className={`text-2xl ${formData.deliveryMethod === 'pickup' ? (darkMode ? 'text-blue-400' : 'text-[#96C7B9]') : 'text-gray-300'}`} />
                                     <div>
                                         <span className={`block font-bold text-sm ${darkMode ? "text-white" : "text-[#1F2937]"}`}>Olib ketish</span>
                                         <span className="text-[10px] items-center text-green-500 font-bold bg-green-100 px-2 py-0.5 rounded-full inline-block mt-1">Bepul</span>
                                     </div>
                                 </label>
                                 <label className={`relative cursor-pointer p-3 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-2
                                    ${formData.deliveryMethod === 'standard' 
                                        ? (darkMode ? 'border-blue-500 bg-blue-900/30' : 'border-[#96C7B9] bg-[#F0FDF8]') 
                                        : (darkMode ? 'border-slate-700 hover:border-slate-600' : 'border-gray-100 hover:border-gray-200')}
                                 `}>
                                     <input 
                                        type="radio" 
                                        name="delivery" 
                                        value="standard" 
                                        checked={formData.deliveryMethod === 'standard'}
                                        onChange={() => setFormData({ ...formData, deliveryMethod: 'standard' })}
                                        className="hidden" 
                                     />
                                     <FaTruck className={`text-2xl ${formData.deliveryMethod === 'standard' ? (darkMode ? 'text-blue-400' : 'text-[#96C7B9]') : 'text-gray-300'}`} />
                                     <div>
                                         <span className={`block font-bold text-sm ${darkMode ? "text-white" : "text-[#1F2937]"}`}>Yetkazib berish</span>
                                         <span className="text-[10px] items-center text-blue-500 font-bold bg-blue-100 px-2 py-0.5 rounded-full inline-block mt-1">20,000 so'm</span>
                                     </div>
                                 </label>
                             </div>
                        </div>

                        <AnimatePresence>
                            {formData.deliveryMethod === 'standard' && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-1 overflow-hidden"
                                >
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Manzil</label>
                                    <div className="relative group">
                                        <FaMapMarkerAlt className={`absolute left-4 top-4 transition-colors ${darkMode ? "text-gray-500 group-focus-within:text-blue-400" : "text-gray-300 group-focus-within:text-[#96C7B9]"}`} />
                                        <textarea 
                                            required
                                            rows="2"
                                            placeholder="Toshkent sh, Chilonzor..." 
                                            className={`w-full pl-10 pr-4 py-3 border-2 border-transparent rounded-xl outline-none focus:border-[#96C7B9] font-medium text-sm resize-none transition-all
                                                ${darkMode ? "bg-slate-700 text-white focus:bg-slate-600" : "bg-gray-50 text-[#1F2937] focus:bg-white"}
                                            `}
                                            value={formData.address}
                                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Summary Block */}
                        {/* Summary Block */}
                        <div className={`rounded-2xl p-4 border
                             ${darkMode ? "bg-slate-700/50 border-slate-600" : "bg-gray-50 border-gray-100"}
                        `}>
                             <div className={`flex justify-between text-sm mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                 <span>Mahsulotlar</span>
                                 <span className={`font-bold ${darkMode ? "text-white" : "text-[#1F2937]"}`}>{subtotal.toLocaleString()} so'm</span>
                             </div>
                             <div className={`flex justify-between text-sm mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                 <span>Yetkazib berish</span>
                                 <span className={`font-bold ${darkMode ? "text-white" : "text-[#1F2937]"}`}>{deliveryPrice.toLocaleString()} so'm</span>
                             </div>
                             <div className={`flex justify-between items-center pt-2 border-t mt-2 ${darkMode ? "border-slate-600" : "border-gray-200"}`}>
                                 <span className={`font-bold ${darkMode ? "text-white" : "text-[#1F2937]"}`}>Jami</span>
                                 <span className={`text-xl font-black ${darkMode ? "text-blue-400" : "text-[#96C7B9]"}`}>{finalTotal.toLocaleString()} <span className="text-xs text-gray-400">so'm</span></span>
                             </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className={`p-5 border-t ${darkMode ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-100"}`}>
                    <button 
                        type="submit"
                        form="checkout-form"
                        disabled={isSubmitting}
                        className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed
                            ${darkMode ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30" : "bg-[#1F2937] text-white hover:bg-[#96C7B9] shadow-gray-200"}
                        `}
                    >
                        {isSubmitting ? (
                            <span className="loading loading-spinner loading-sm"></span> // Simple spinner placeholder
                        ) : (
                            <>Tasdiqlash va To'lash</>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const { darkMode } = useMain();
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      className={`group relative rounded-3xl p-5 border shadow-sm transition-all duration-300
        ${darkMode 
            ? "bg-slate-800 border-slate-700 shadow-slate-900/50 hover:shadow-blue-900/20 hover:border-blue-500" 
            : "bg-white border-slate-100 hover:shadow-xl hover:shadow-[#D1F0E0]/30 hover:border-[#96C7B9]"}
      `}
    >
      <div className="flex gap-5">
        {/* Image */}
        <div className={`relative w-24 h-32 md:w-32 md:h-40 rounded-2xl overflow-hidden shadow-inner flex-shrink-0
            ${darkMode ? "bg-slate-700" : "bg-gray-50"}
        `}>
          <Image
            src={item.images && item.images[0] ? item.images[0] : "https://placehold.co/400x600?text=No+Image"}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {item.type === "rent" && (
            <span className="absolute top-2 left-2 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
              IJARA
            </span>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <h3 className={`text-lg md:text-xl font-bold line-clamp-2 leading-tight mb-1 ${darkMode ? "text-white" : "text-[#1F2937]"}`} title={item.title}>
                {item.title}
              </h3>
              <button 
                onClick={() => onRemove(item.cartId)}
                className={`transition-colors p-1 ${darkMode ? "text-gray-500 hover:text-red-400" : "text-gray-300 hover:text-red-500"}`}
              >
                <FaTrashAlt />
              </button>
            </div>
            <p className={`text-sm font-medium mb-3 ${darkMode ? "text-gray-400" : "text-gray-400"}`}>{item.author}</p>
            
            {item.type === "rent" && (
               <div className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 border mb-2
                    ${darkMode ? "bg-slate-700 border-slate-600" : "bg-gray-50 border-gray-100"}
               `}>
                  <FaClock className="text-[#96C7B9] text-xs" />
                  <span className={`text-xs font-bold ${darkMode ? "text-gray-300" : "text-gray-500"}`}>{item.rentDays} kun</span>
                  <span className="text-xs text-gray-300">|</span>
                  <span className={`text-xs font-bold ${darkMode ? "text-white" : "text-[#1F2937]"}`}>{item.rentalPricePerDay?.toLocaleString()} so&apos;m/kun</span>
               </div>
            )}
          </div>

          <div className="flex justify-between items-end">
            {/* Quantity Controls */}
            <div className={`flex items-center rounded-xl p-1 border
                ${darkMode ? "bg-slate-700/50 border-slate-600" : "bg-gray-50 border-gray-100"}
            `}>
               <button 
                 onClick={() => onUpdateQuantity(item.cartId, -1)}
                 disabled={item.quantity <= 1}
                 className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all
                    ${darkMode 
                        ? "bg-slate-600 text-gray-300 hover:text-white disabled:opacity-30" 
                        : "bg-white text-gray-500 hover:text-[#1F2937] hover:shadow-sm disabled:opacity-50"}
                 `}
               >
                 <FaMinus className="text-xs" />
               </button>
               <span className={`w-10 text-center font-bold ${darkMode ? "text-white" : "text-[#1F2937]"}`}>{item.quantity}</span>
               <button 
                 onClick={() => onUpdateQuantity(item.cartId, 1)}
                 className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all
                    ${darkMode 
                        ? "bg-slate-600 text-gray-300 hover:text-white" 
                        : "bg-white text-gray-500 hover:text-[#1F2937] hover:shadow-sm"}
                 `}
               >
                 <FaPlus className="text-xs" />
               </button>
            </div>

            {/* Price */}
            <div className="text-right">
              {item.type === "rent" ? (
                 <>
                   <p className="text-xs text-gray-400">Jami ijara narxi</p>
                   <p className={`text-xl font-black ${darkMode ? "text-blue-400" : "text-[#96C7B9]"}`}>
                     {(item.rentalPricePerDay * item.rentDays * item.quantity).toLocaleString()} <span className={`text-xs ${darkMode ? "text-gray-300" : "text-[#1F2937]"}`}>so&apos;m</span>
                   </p>
                 </>
              ) : (
                 <p className={`text-xl font-black ${darkMode ? "text-blue-400" : "text-[#96C7B9]"}`}>
                   {(item.price * item.quantity).toLocaleString()} <span className={`text-xs ${darkMode ? "text-gray-300" : "text-[#1F2937]"}`}>so&apos;m</span>
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
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { darkMode } = useMain();
  const [mounted, setMounted] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // Avoid hydration mismatch

  const subtotal = getTotalPrice();

  return (
    <div className={`min-h-screen font-sans pb-20 transition-colors duration-300 ${darkMode ? "bg-slate-900" : "bg-[#F0FDF8]"}`}>
      
      {/* Header */}
      <div className={`border-b sticky top-0 z-40 backdrop-blur-md
        ${darkMode ? "bg-slate-900/80 border-slate-700" : "bg-white/80 border-[#D1F0E0]/50"}
      `}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
           <Link href="/mainPage/sotibolish" className={`flex items-center gap-2 transition-colors font-bold text-sm ${darkMode ? "text-gray-400 hover:text-white" : "text-gray-400 hover:text-[#1F2937]"}`}>
              <FaArrowLeft /> Ortga qaytish
           </Link>
           <h1 className={`text-xl md:text-2xl font-black ${darkMode ? "text-white" : "text-[#1F2937]"}`}>
              Savat <span className={darkMode ? "text-blue-400" : "text-[#96C7B9]"}>({cartItems.length})</span>
           </h1>
           <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
            
            {/* LEFT COLUMN: Cart Items */}
            <div className="flex-1 space-y-6">
                <AnimatePresence mode="popLayout">
                    {cartItems.length > 0 ? (
                        cartItems.map(item => (
                            <CartItem 
                                key={item.cartId} 
                                item={item} 
                                onUpdateQuantity={updateQuantity}
                                onRemove={removeFromCart}
                            />
                        ))
                    ) : (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`rounded-[2.5rem] p-12 text-center border border-dashed
                             ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}
                          `}
                        >
                           <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl
                              ${darkMode ? "bg-slate-700 text-gray-500" : "bg-gray-50 text-gray-300"}
                           `}>
                               <FaBoxOpen />
                           </div>
                           <h3 className={`text-xl font-bold mb-2 ${darkMode ? "text-white" : "text-[#1F2937]"}`}>Savatingiz bo&apos;sh</h3>
                           <p className="text-gray-400 mb-8">Hozircha hech narsa tanlamadingiz.</p>
                           <Link href="/mainPage/sotibolish" className={`inline-block px-8 py-4 rounded-xl font-bold transition-all shadow-lg
                                ${darkMode 
                                    ? "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/30" 
                                    : "bg-[#1F2937] text-white hover:bg-[#96C7B9] shadow-gray-200"}
                           `}>
                               Xaridni boshlash
                           </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* RIGHT COLUMN: Summary */}
            {cartItems.length > 0 && (
                <div className="lg:w-[400px]">
                    <div className={`rounded-[2.5rem] p-6 border shadow-xl sticky top-28
                        ${darkMode 
                            ? "bg-slate-800 border-slate-700 shadow-slate-900/50" 
                            : "bg-white border-slate-100 shadow-slate-100/50"}
                    `}>
                        <h3 className={`text-lg font-black mb-6 flex items-center gap-2 ${darkMode ? "text-white" : "text-[#1F2937]"}`}>
                            Buyurtma Ma&apos;lumotlari
                        </h3>

                        {/* Summary Lines */}
                        <div className="space-y-3 py-6 text-sm">
                            <div className={`flex justify-between ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                <span>Mahsulotlar ({cartItems.length})</span>
                                <span className="font-medium">{subtotal.toLocaleString()} so&apos;m</span>
                            </div>
                            <div className={`p-3 rounded-xl text-xs text-center
                                ${darkMode ? "bg-slate-700 text-gray-400" : "bg-gray-50 text-gray-400"}
                            `}>
                                Yetkazib berish narxi keyingi bosqichda hisoblanadi
                            </div>
                        </div>

                        {/* Total */}
                        <div className={`flex justify-between items-center pt-4 border-t mb-6 ${darkMode ? "border-slate-700" : "border-gray-100"}`}>
                            <span className={`font-bold ${darkMode ? "text-white" : "text-[#1F2937]"}`}>Jami (Tahminiy)</span>
                            <span className={`text-2xl font-black ${darkMode ? "text-white" : "text-[#1F2937]"}`}>
                                {subtotal.toLocaleString()} <span className="text-sm font-medium text-gray-400">so&apos;m</span>
                            </span>
                        </div>

                        <button 
                            onClick={() => setIsCheckoutOpen(true)}
                            className={`w-full py-4 rounded-2xl font-bold shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2
                                ${darkMode 
                                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40" 
                                    : "bg-[#1F2937] text-white hover:bg-[#96C7B9] shadow-gray-200 hover:shadow-[#96C7B9]/40"}
                            `}
                        >
                            <FaCreditCard /> Rasmiylashtirish
                        </button>
                        
                        <p className="mt-4 text-xs text-center text-gray-400 flex items-center justify-center gap-1.5 opacity-80">
                            <FaShieldAlt /> Barcha to&apos;lovlar himoyalangan
                        </p>
                    </div>
                </div>
            )}
        </div>
      </main>

      {/* CHECKOUT MODAL */}
      <AnimatePresence>
          {isCheckoutOpen && (
              <CheckoutModal 
                 isOpen={isCheckoutOpen} 
                 onClose={() => setIsCheckoutOpen(false)} 
                 cartItems={cartItems}
                 subtotal={subtotal}
                 clearCart={clearCart}
              />
          )}
      </AnimatePresence>
    </div>
  );
}
