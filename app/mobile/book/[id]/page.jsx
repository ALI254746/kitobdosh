"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronLeft, Star, Heart, Share2, 
    BookOpen, ShoppingCart, Zap, 
    ShieldCheck, Truck, RotateCcw,
    Info, MessageSquare, Loader2
} from 'lucide-react';
import Image from 'next/image';
import { useCart } from "@/app/CartContext";
import { useFavorites } from "@/app/FavoritesContext";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";

const BookDetailPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const { toggleFavorite, isFavorite } = useFavorites();
    
    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('info'); // 'info', 'reviews'

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await fetch(`/api/user/search?id=${id}`);
                const data = await res.json();
                if (data.success && data.books && data.books.length > 0) {
                    setBook(data.books[0]);
                    
                    // Fetch reviews
                    const reviewsRes = await fetch(`/api/reviews?bookId=${id}`);
                    const reviewsData = await reviewsRes.json();
                    if (reviewsData.success) {
                        setReviews(reviewsData.reviews || []);
                    }
                }
            } catch (error) {
                console.error("Fetch Book Error:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchBook();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
                <Loader2 className="w-10 h-10 text-[#52C6DA] animate-spin mb-4" />
                <p className="text-slate-400 font-medium">Kitob yuklanmoqda...</p>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                    <Info className="w-10 h-10 text-slate-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Kitob topilmadi</h2>
                <button onClick={() => router.back()} className="text-[#52C6DA] font-bold">Ortga qaytish</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 pb-32 transition-colors duration-300">
            {/* Header Overlay */}
            <div className="fixed top-0 left-0 right-0 z-40 px-4 py-4 flex justify-between items-center bg-white/10 backdrop-blur-md">
                <button 
                    onClick={() => router.back()}
                    className="w-10 h-10 bg-white/80 dark:bg-slate-800/80 rounded-full flex items-center justify-center shadow-sm text-slate-800 dark:text-white"
                >
                    <ChevronLeft size={24} />
                </button>
                <div className="flex gap-2">
                    <button 
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: book.title,
                                    text: book.description,
                                    url: window.location.href,
                                });
                            }
                        }}
                        className="w-10 h-10 bg-white/80 dark:bg-slate-800/80 rounded-full flex items-center justify-center shadow-sm text-slate-800 dark:text-white"
                    >
                        <Share2 size={20} />
                    </button>
                    <button 
                        onClick={() => toggleFavorite(book._id)}
                        className="w-10 h-10 bg-white/80 dark:bg-slate-800/80 rounded-full flex items-center justify-center shadow-sm"
                    >
                        {isFavorite(book._id) ? (
                            <FaHeart className="text-red-500" />
                        ) : (
                            <FaRegHeart className="text-slate-400" />
                        )}
                    </button>
                </div>
            </div>

            {/* Book Cover Visual Area */}
            <div className="relative w-full h-[450px] overflow-hidden bg-slate-100 dark:bg-slate-800">
                <div className="absolute inset-0 z-0">
                    <Image 
                        src={book.images?.[0] || book.image || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop"} 
                        alt={book.title}
                        fill
                        className="object-cover blur-2xl opacity-30 dark:opacity-20 scale-110"
                        unoptimized
                    />
                </div>
                <div className="relative z-10 w-full h-full flex items-center justify-center pt-16 pb-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="w-[200px] h-[300px] relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20"
                    >
                        <Image 
                             src={book.images?.[0] || book.image || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop"} 
                             alt={book.title}
                             fill
                             className="object-cover"
                             unoptimized
                        />
                    </motion.div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-slate-900 to-transparent z-20"></div>
            </div>

            {/* Content Area */}
            <div className="px-6 -mt-8 relative z-30">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white leading-tight mb-2">{book.title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold mb-4">{book.author}</p>
                    
                    <div className="flex items-center justify-center gap-6">
                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-1 text-yellow-400 mb-1">
                                <FaStar />
                                <span className="text-slate-800 dark:text-white font-black">{book.rating || "5.0"}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Reyting</span>
                        </div>
                        <div className="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-slate-800 dark:text-white font-black mb-1">
                                {book.category || "Badiiy"}
                            </span>
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Janr</span>
                        </div>
                        <div className="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-slate-800 dark:text-white font-black mb-1">320</span>
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Betlar</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100 dark:border-slate-800 mb-6">
                    <button 
                        onClick={() => setActiveTab('info')}
                        className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'info' ? 'text-[#52C6DA] border-b-2 border-[#52C6DA]' : 'text-slate-400'}`}
                    >
                        Ma&apos;lumot
                    </button>
                    <button 
                        onClick={() => setActiveTab('reviews')}
                        className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'reviews' ? 'text-[#52C6DA] border-b-2 border-[#52C6DA]' : 'text-slate-400'}`}
                    >
                        Sharhlar
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'info' ? (
                        <motion.div 
                            key="info"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-6"
                        >
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                                {book.description || "Ushbu kitob haqida hozircha batafsil ma'lumot kiritilmagan. Kitobdosh platformasida kitoblar bilan do'stlashishni boshlang!"}
                            </p>

                            <div className="grid grid-cols-1 gap-4">
                                <FeatureRow icon={<Truck size={18} className="text-blue-500" />} label="Tezkor Yetkazish" sub="24 soat ichida" />
                                <FeatureRow icon={<ShieldCheck size={18} className="text-green-500" />} label="Original Nashr" sub="Sifat kafolati bilan" />
                                <FeatureRow icon={<RotateCcw size={18} className="text-orange-500" />} label="Oson Qaytarish" sub="3 kun ichida" />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="reviews"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-4"
                        >
                            {reviews.length > 0 ? (
                                reviews.map((review) => (
                                    <div key={review._id} className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0 overflow-hidden flex items-center justify-center">
                                                {review.user?.avatar ? (
                                                    <img src={review.user.avatar} alt={review.user.fullName} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-slate-400 text-xs font-bold">{review.user?.fullName?.[0] || 'U'}</span>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-sm text-slate-800 dark:text-white">{review.user?.fullName || "Foydalanuvchi"}</p>
                                                <div className="flex gap-0.5 mt-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FaStar key={i} size={12} className={i < review.rating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'} />
                                                    ))}
                                                </div>
                                            </div>
                                            <span className="text-[10px] text-slate-400">{new Date(review.createdAt).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' })}</span>
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{review.comment}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="py-10 text-center">
                                    <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                    <p className="text-slate-400 text-sm">Hozircha sharhlar yo&apos;q. <br/> Birinchi bo&apos;lib fikr qoldiring!</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Sticky Buy/Rent Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 z-50 transition-colors">
                <div className="flex gap-4 items-center max-w-md mx-auto">
                    <div className="flex flex-col min-w-[100px]">
                        <span className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Narxi</span>
                        <span className="text-xl font-black text-slate-800 dark:text-white">
                            {book.price?.toLocaleString()} <span className="text-xs">so&apos;m</span>
                        </span>
                    </div>
                    <div className="flex-1 flex gap-2">
                        <button 
                            onClick={() => addToCart(book, 'rent')}
                            className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-bold rounded-2xl active:scale-95 transition-all"
                        >
                            Ijara
                        </button>
                        <button 
                            onClick={() => addToCart(book, 'sale')}
                            className="flex-1 py-4 bg-[#52C6DA] text-white font-bold rounded-2xl shadow-lg shadow-[#52C6DA]/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <Zap size={18} fill="currentColor" />
                            Sotib olish
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FeatureRow = ({ icon, label, sub }) => (
    <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100/50 dark:border-slate-700/50">
        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm">
            {icon}
        </div>
        <div>
            <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{label}</p>
            <p className="text-[10px] text-slate-400 font-medium">{sub}</p>
        </div>
    </div>
);

export default BookDetailPage;
