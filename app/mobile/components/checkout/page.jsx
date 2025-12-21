"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, User, Phone, MapPin, Truck, Wallet, 
  CheckCircle2, ArrowRight, Loader2, Sparkles, Home,
  CreditCard, Banknote, Search, AlertCircle, Briefcase
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/CartContext";
import { useCheckout, CheckoutProvider } from "@/app/CheckoutContext";
import toast from "react-hot-toast";

// --- Step Components ---

const Step1PersonalInfo = () => {
    const { checkoutData, updateCheckoutData } = useCheckout();
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Shaxsiy ma'lumotlar</h2>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">Buyurtmangizni kuryer yetkazishi uchun ism-sharif va telefon raqamingizni tasdiqlang.</p>
            
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">To'liq ism-sharif</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                            type="text" 
                            value={checkoutData.fullName}
                            onChange={(e) => updateCheckoutData({ fullName: e.target.value })}
                            className="w-full bg-white dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-800 dark:text-white focus:border-[#52C6DA] transition-all outline-none"
                            placeholder="Masalan: Aziz Azizov"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Telefon raqam</label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                            type="tel" 
                            value={checkoutData.phone}
                            onChange={(e) => updateCheckoutData({ phone: e.target.value })}
                            className="w-full bg-white dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-800 dark:text-white focus:border-[#52C6DA] transition-all outline-none"
                            placeholder="+998"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const Step2Address = () => {
    const { checkoutData, updateCheckoutData } = useCheckout();
    const [savedAddresses] = useState([
        { id: 1, type: 'Uy', detail: 'Toshkent sh, Yunusobod tumani, 4-kvartal, 12-uy' },
        { id: 2, type: 'Ish', detail: 'Toshkent sh, Shayxontohur tumani, Navoiy ko\'chasi, 1-uy' }
    ]);

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Yetkazish manzili</h2>
            
            <div className="space-y-4">
                {savedAddresses.map((addr) => (
                    <div 
                        key={addr.id}
                        onClick={() => updateCheckoutData({ address: addr })}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${checkoutData.address?.id === addr.id ? 'border-[#52C6DA] bg-[#52C6DA]/5' : 'border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-800'}`}
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${checkoutData.address?.id === addr.id ? 'bg-[#52C6DA] text-white' : 'bg-slate-50 dark:bg-slate-700 text-slate-400'}`}>
                            {addr.type === 'Uy' ? <Home size={24} /> : <Briefcase size={24} />}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-black text-sm text-slate-800 dark:text-white">{addr.type} manzili</h4>
                            <p className="text-xs text-slate-400 font-medium line-clamp-1">{addr.detail}</p>
                        </div>
                        {checkoutData.address?.id === addr.id && <CheckCircle2 className="text-[#52C6DA]" size={20} />}
                    </div>
                ))}
            </div>

            <button className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:border-[#52C6DA] hover:text-[#52C6DA] transition-all">
                <MapPin size={16} /> Yangi manzil qo'shish
            </button>
        </motion.div>
    );
};

const Step3Delivery = () => {
    const { checkoutData, updateCheckoutData } = useCheckout();
    const options = [
        { id: 'courier', label: 'Kuryer orqali', price: '15,000 so\'m', time: '1-2 kun ichida', icon: <Truck size={24} /> },
        { id: 'pickup', label: 'O\'zi olib ketish', price: '0 so\'m', time: 'Hozirroq', icon: <UserCircle size={24} /> }
    ];

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Yetkazish usuli</h2>
            
            <div className="space-y-4">
                {options.map((opt) => (
                    <div 
                        key={opt.id}
                        onClick={() => updateCheckoutData({ deliveryMethod: opt.id })}
                        className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${checkoutData.deliveryMethod === opt.id ? 'border-[#52C6DA] bg-[#52C6DA]/5' : 'border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-800'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${checkoutData.deliveryMethod === opt.id ? 'bg-[#52C6DA] text-white' : 'bg-slate-50 dark:bg-slate-700 text-slate-400'}`}>
                                {opt.icon}
                            </div>
                            <div>
                                <h4 className="font-black text-sm text-slate-800 dark:text-white">{opt.label}</h4>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#52C6DA]">{opt.price}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-bold text-slate-400">{opt.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

const Step4Payment = () => {
    const { checkoutData, updateCheckoutData } = useCheckout();
    const options = [
        { id: 'payme', label: 'Payme', icon: <CreditCard size={24} />, color: 'bg-[#52C6DA]' },
        { id: 'click', label: 'Click', icon: <CreditCard size={24} />, color: 'bg-blue-600' },
        { id: 'cash', label: 'Naqd pulda', icon: <Banknote size={24} />, color: 'bg-slate-900' }
    ];

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">To'lov turi</h2>
            
            <div className="grid grid-cols-1 gap-4">
                {options.map((opt) => (
                    <div 
                        key={opt.id}
                        onClick={() => updateCheckoutData({ paymentMethod: opt.id })}
                        className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${checkoutData.paymentMethod === opt.id ? 'border-[#52C6DA] bg-[#52C6DA]/5' : 'border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-800'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${checkoutData.paymentMethod === opt.id ? opt.color : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                                {opt.icon}
                            </div>
                            <h4 className="font-black text-sm text-slate-800 dark:text-white">{opt.label}</h4>
                        </div>
                        {checkoutData.paymentMethod === opt.id && <CheckCircle2 className="text-[#52C6DA]" size={20} />}
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

const StepPassport = () => {
    const { checkoutData, updateCheckoutData } = useCheckout();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            updateCheckoutData({ 
                passportFile: file,
                passportPreview: URL.createObjectURL(file)
            });
        }
    };

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Pasport ma'lumotlari</h2>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">Kitobni ijaraga olish uchun pasportingizning asosiy sahifasi rasmini yuklashingiz kerak. Bu xavfsizlik uchun talab qilinadi.</p>
            
            <div className="relative aspect-video w-full bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden flex flex-col items-center justify-center gap-4 group hover:border-[#52C6DA] transition-all cursor-pointer">
                {checkoutData.passportPreview ? (
                    <>
                        <Image src={checkoutData.passportPreview} alt="Passport" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white font-black uppercase text-xs tracking-widest">Almashtirish</span>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-300 group-hover:bg-[#52C6DA]/10 group-hover:text-[#52C6DA] transition-all">
                            <Sparkles size={32} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-[#52C6DA] transition-all">Rasm tanlang yoki oling</span>
                    </>
                )}
                <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                />
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border-2 border-blue-100 dark:border-blue-900/30 flex gap-3">
                <AlertCircle className="text-blue-500 shrink-0" size={20} />
                <p className="text-[10px] text-blue-900 dark:text-blue-200 font-bold leading-tight uppercase">Sizning ma'lumotlaringiz xavfsiz saqlanadi va faqat mahsulotni topshirish-qabul qilish uchun ishlatiladi.</p>
            </div>
        </motion.div>
    );
};

const StepReview = ({ items, total }) => {
    const { checkoutData } = useCheckout();
    const formatPrice = (price) => new Intl.NumberFormat('uz-UZ').format(price) + " so'm";

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Tasdiqlash</h2>
            
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border-2 border-slate-50 dark:border-slate-800 space-y-6">
                {/* User Summary */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400"><User size={16}/></div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Qabul qiluvchi</p>
                            <p className="text-sm font-bold text-slate-800 dark:text-white">{checkoutData.fullName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400"><MapPin size={16}/></div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Manzil</p>
                            <p className="text-sm font-bold text-slate-800 dark:text-white">{checkoutData.address?.detail || "Tanlanmagan"}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400"><Wallet size={16}/></div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">To'lov</p>
                            <p className="text-sm font-bold text-slate-800 dark:text-white uppercase">{checkoutData.paymentMethod}</p>
                        </div>
                    </div>
                </div>

                {/* Items Summary */}
                <div className="pt-6 border-t border-slate-50 dark:border-slate-700 space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Kitoblar ({items?.length || 0})</p>
                    {Array.isArray(items) && items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-50 dark:bg-slate-700/30 p-3 rounded-2xl">
                            <span className="text-xs font-bold text-slate-800 dark:text-white truncate max-w-[200px]">{item.bookId?.title || item.title}</span>
                            <span className="text-[10px] font-black text-[#52C6DA]">{formatPrice(item.type === 'rent' ? (item.rentalPrice || 0) : (item.price || 0))}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-2xl border-2 border-amber-100 dark:border-amber-900/30 flex gap-3">
                <AlertCircle className="text-amber-500 shrink-0" size={20} />
                <p className="text-[10px] text-amber-900 dark:text-amber-200 font-bold leading-tight uppercase">Buyurtma tasdiqlangandan so'ng u kuryerga yuboriladi. Iltimos, ma'lumotlarni qayta tekshiring.</p>
            </div>
        </motion.div>
    );
};

// --- Main Content Component ---

const CheckoutContent = () => {
    const router = useRouter();
    const { cartItems, clearCart } = useCart();
    const { checkoutData, updateCheckoutData } = useCheckout();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const hasRentItems = cartItems?.some(i => i.type === 'rent') || false;
    const totalSteps = hasRentItems ? 6 : 5;

    // Calculate Totals
    const totalAmount = cartItems?.reduce((acc, item) => {
        const price = item.type === 'rent' ? (item.rentalPrice || 0) : (item.price || 0);
        return acc + price;
    }, 0) || 0;

    const formatPrice = (price) => new Intl.NumberFormat('uz-UZ').format(price) + " so'm";

    const nextStep = () => {
        if (currentStep === 1 && (!checkoutData.fullName || !checkoutData.phone)) {
            toast.error("Ismingiz va raqamingiz bo'lmasa, sizni qanday topamiz? 😊");
            return;
        }
        if (currentStep === 2 && !checkoutData.address) {
            toast.error("Sizni qayerda kutaylik? Manzilni ko'rsatib yuboring 📍");
            return;
        }
        if (hasRentItems && currentStep === 5 && !checkoutData.passportFile) {
            toast.error("Xavfsizlik uchun pasport rasmi zarur, bu muhim 🛡️");
            return;
        }
        setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    };

    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleSubmitOrder = async () => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('customer', JSON.stringify({
                name: checkoutData.fullName,
                phone: checkoutData.phone,
                address: checkoutData.address?.detail || "",
            }));
            formData.append('items', JSON.stringify((cartItems || []).map(i => ({
                book: i.bookId?._id || i._id,
                title: i.bookId?.title || i.title,
                author: i.bookId?.author || i.author || "Noma'lum",
                quantity: i.quantity || 1,
                price: i.type === 'rent' ? (i.rentalPrice || 0) : (i.price || 0),
                type: i.type === 'rent' ? 'rent' : 'buy', // Fix: convert 'sale' to 'buy'
                rentDays: i.rentDays || 0,
                image: i.bookId?.images?.[0] || i.image || ""
            }))));
            formData.append('deliveryMethod', checkoutData.deliveryMethod);
            formData.append('paymentMethod', checkoutData.paymentMethod);
            formData.append('totalPrice', totalAmount);

            if (checkoutData.passportFile) {
                formData.append('passport', checkoutData.passportFile);
            }

            const res = await fetch('/api/order', {
                method: 'POST',
                body: formData
            });
            
            const data = await res.json();
            if (data.success) {
                toast.success("Muborak bo'lsin! Kitobingiz yo'lga hozirlik ko'rmoqda! 🚀📚✨");
                clearCart();
                router.push('/mobile/components/actions');
            } else {
                toast.error(data.message || "Nimadir noto'g'ri ketdi, qaytadan urinib ko'ramizmi? 🔄");
            }
        } catch (error) {
            console.error("Order Error:", error);
            toast.error("Xatolik yuz berdi");
        } finally {
            setIsSubmitting(false);
        }
    };

    const steps_ui_raw = [
        { id: 1, label: "Ma'lumotlar", icon: <User size={18} /> },
        { id: 2, label: "Manzil", icon: <MapPin size={18} /> },
        { id: 3, label: "Yetkazib berish", icon: <Truck size={18} /> },
        { id: 4, label: "To'lov", icon: <Wallet size={18} /> },
        ...(hasRentItems ? [{ id: 5, label: "Pasport", icon: <Sparkles size={18} /> }] : []),
        { id: totalSteps, label: "Tasdiqlash", icon: <CheckCircle2 size={18} /> }
    ];

    return (
        <div className="min-h-screen bg-[#FDFBF7] dark:bg-slate-900 pb-32 transition-colors duration-300">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
                <button onClick={() => currentStep === 1 ? router.back() : prevStep()} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <div className="text-center">
                    <h1 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white">Rasmiylashtirish</h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Qadam {currentStep} dan {totalSteps}</p>
                </div>
                <div className="w-10"></div>
            </header>

            {/* Progress Stepper */}
            <div className="px-6 py-8">
                <div className="flex justify-between items-center relative">
                    <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-100 dark:bg-slate-800 -translate-y-1/2 z-0"></div>
                    <motion.div 
                        className="absolute top-1/2 left-0 h-[2px] bg-[#52C6DA] -translate-y-1/2 z-0"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                    
                    {steps_ui_raw.map((s) => (
                        <div key={s.id} className="relative z-10">
                            <motion.div 
                                animate={{ 
                                    scale: currentStep === s.id ? 1.2 : 1,
                                    backgroundColor: s.id <= currentStep ? "#52C6DA" : "#CBD5E1"
                                }}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm transition-colors`}
                            >
                                {s.id < currentStep ? <CheckCircle2 size={16} /> : s.icon}
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <main className="px-6 min-h-[400px]">
                <AnimatePresence mode="wait">
                    {currentStep === 1 && <Step1PersonalInfo key="step1" />}
                    {currentStep === 2 && <Step2Address key="step2" />}
                    {currentStep === 3 && <Step3Delivery key="step3" />}
                    {currentStep === 4 && <Step4Payment key="step4" />}
                    {hasRentItems && currentStep === 5 && <StepPassport key="step5-passport" />}
                    {currentStep === totalSteps && <StepReview items={cartItems} total={totalAmount} key="step-review" />}
                </AnimatePresence>
            </main>

            {/* Sticky Actions */}
            <div className="fixed bottom-[65px] left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 p-6 z-40">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Jami</span>
                        <span className="text-xl font-black text-slate-800 dark:text-white">{formatPrice(totalAmount)}</span>
                    </div>
                    {currentStep === totalSteps ? (
                        <button 
                            onClick={handleSubmitOrder}
                            disabled={isSubmitting}
                            className="bg-[#52C6DA] text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-[#52C6DA]/30 flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Buyurtma berish"}
                        </button>
                    ) : (
                        <button 
                            onClick={nextStep}
                            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg active:scale-95 transition-all flex items-center gap-2"
                        >
                            Keyingi <ArrowRight size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Helper Components ---

function UserCircle(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
    </svg>
  );
}

// --- Export Page ---

export default function CheckoutPage() {
  return (
    <CheckoutProvider>
      <CheckoutContent />
    </CheckoutProvider>
  );
}
