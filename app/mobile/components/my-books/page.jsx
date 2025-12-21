"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, UserPlus, MoreHorizontal, X, ArrowUpRight, BookOpen, Quote, PenLine, ChevronLeft, Grid, Bookmark, User as UserIcon, Instagram, Send, Heart, MessageSquare, Star, ExternalLink, Hash } from "lucide-react";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from 'react-hot-toast';

export const dynamic = 'force-dynamic';

// --- Configuration ---
const ACCENT_COLOR = "#52C6DA";

export default function MyBooksPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryUserId = searchParams.get('userId');

  const [userData, setUserData] = useState(null);
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ friends: 0, reading: 0, finished: 0 });
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'library'); // 'library', 'favorites', 'reviews'
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Review State
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Pull to refresh state
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async (showToast = true) => {
    try {
      if (showToast && !isRefreshing) setLoading(true);
      const url = queryUserId ? `/api/user/profile?userId=${queryUserId}` : '/api/user/profile';
      const res = await fetch(url);
      const profileData = await res.json();

        if (profileData.success) {
        const { user, orders, rentals, isOwner, reviews: userReviews } = profileData.data;
                setUserData({
                    ...user,
                    isOwner,
                    orders,
                    rentals,
                    reviews: userReviews
                });
        
        // Combine rentals and orders into a library
        const libraryItems = [
            ...(rentals || []).map(r => ({
                id: r._id,
                title: r.bookTitle,
                author: r.author || "Noma'lum",
                cover: r.bookImage || "https://placehold.co/400x600/png?text=Kitob",
                status: r.status === 'returned' ? 'finished' : 'reading',
                review: r.review || "",
                bookId: r.book,
                type: 'rental'
            })),
            ...(orders || []).filter(o => o.status === 'completed').flatMap(o => o.items.map(item => ({
                id: item._id,
                title: item.title,
                author: item.author || "Noma'lum",
                cover: item.image || "https://placehold.co/400x600/png?text=Kitob",
                status: 'finished',
                review: item.review || "",
                bookId: item.book,
                type: 'purchase'
            })))
        ];
        
        setBooks(libraryItems);
        setFavorites(user.favorites || []);
        setReviews(userReviews || []);
        
        setStats({
            friends: user.friendsCount || 0,
            reading: (rentals || []).filter(r => r.status !== 'returned').length,
            finished: libraryItems.filter(b => b.status === 'finished').length
        });
      }
    } catch (error) {
      console.error(error);
      if (showToast) toast.error("Ma'lumotlarni yuklashda xatolik");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData(false);
  };

  useEffect(() => {
    fetchData();
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [queryUserId, searchParams]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBook?.bookId) return;
    
    setIsSubmittingReview(true);
    try {
        const res = await fetch('/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                bookId: selectedBook.bookId,
                rating: reviewForm.rating,
                comment: reviewForm.comment
            })
        });
        const data = await res.json();
        if (data.success) {
            toast.success("Sharhingiz qabul qilindi!");
            setReviewForm({ rating: 5, comment: "" });
            // Optionally refresh to show updated review
            fetchData();
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        toast.error("Xatolik yuz berdi");
    } finally {
        setIsSubmittingReview(false);
    }
  };

  const MyBooksSkeleton = () => (
    <div className="animate-pulse">
        {/* Header Skeleton */}
        <div className="pt-12 pb-6 px-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-5">
                    <div className="w-20 h-20 bg-gray-200 dark:bg-slate-800 rounded-full" />
                    <div className="space-y-2">
                        <div className="w-32 h-6 bg-gray-200 dark:bg-slate-800 rounded" />
                        <div className="w-20 h-3 bg-gray-200 dark:bg-slate-800 rounded" />
                    </div>
                </div>
                <div className="flex gap-2">
                     <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-800" />
                     <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-800" />
                </div>
            </div>
            <div className="mb-8 pl-5 border-l-2 border-gray-200 dark:border-slate-800">
                 <div className="w-full h-4 bg-gray-200 dark:bg-slate-800 rounded mb-2" />
                 <div className="w-2/3 h-4 bg-gray-200 dark:bg-slate-800 rounded" />
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-8">
                 {[1,2,3].map(i => (
                     <div key={i} className="h-20 bg-gray-200 dark:bg-slate-800 rounded-xl" />
                 ))}
            </div>
            
            {/* Interests */}
            <div className="flex gap-3 overflow-hidden">
                 {[1,2,3,4].map(i => (
                     <div key={i} className="w-24 h-10 bg-gray-200 dark:bg-slate-800 rounded-full flex-shrink-0" />
                 ))}
            </div>
        </div>
        
        {/* Books Grid Skeleton */}
        <div className="px-6">
             <div className="flex justify-between mb-8">
                 <div className="w-40 h-6 bg-gray-200 dark:bg-slate-800 rounded" />
             </div>
             <div className="grid grid-cols-2 gap-x-6 gap-y-10">
                 {[1,2,3,4].map(i => (
                     <div key={i}>
                         <div className="aspect-[2/3] bg-gray-200 dark:bg-slate-800 rounded-sm mb-4" />
                         <div className="w-32 h-5 bg-gray-200 dark:bg-slate-800 rounded mb-2" />
                         <div className="w-20 h-3 bg-gray-200 dark:bg-slate-800 rounded" />
                     </div>
                 ))}
             </div>
        </div>
    </div>
  );

  if (loading && !isRefreshing) {
      return (
        <div className="min-h-screen bg-[#FDFBF7] dark:bg-slate-900 pb-24 font-sans transition-colors duration-300">
            <MyBooksSkeleton />
        </div>
      );
  }

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-slate-900 text-slate-800 dark:text-slate-200 pb-24 font-sans selection:bg-[#52C6DA]/20 transition-colors duration-300 relative overflow-hidden">
      
      {/* Pull to Refresh Indicator */}
      <motion.div 
        style={{ 
            position: 'absolute',
            top: -50,
            left: 0,
            right: 0,
            height: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 40
        }}
        animate={{ y: isRefreshing ? 80 : 0 }}
      >
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-lg border border-slate-100 dark:border-slate-700">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="text-[#52C6DA]"
            >
                <Sparkles size={16} />
            </motion.div>
            <span className="text-[10px] font-black uppercase tracking-widest">
                {isRefreshing ? 'Yangilanmoqda' : 'Yangilash uchun torting'}
            </span>
        </div>
      </motion.div>

      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.7}
        onDragEnd={(e, info) => {
            if (info.offset.y > 100 && !isRefreshing) {
                handleRefresh();
            }
        }}
        animate={{ y: isRefreshing ? 60 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="min-h-screen"
      >
        {/* 1. Editorial Header */}
      <header className="pt-12 pb-6 px-6">
        
        {/* Kitobdosh Style Custom Header */}
        <div className="flex flex-col gap-6 mb-8">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-[32px] p-1 bg-white dark:bg-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
                            <div className="w-full h-full rounded-[28px] overflow-hidden bg-slate-50 relative">
                                {userData.avatar ? (
                                    <Image src={userData.avatar} alt={userData.fullName} fill className="object-cover" />
                                ) : (
                                    <UserIcon className="absolute inset-0 m-auto text-slate-300" size={32} />
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col pt-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-none">{userData.fullName || "Foydalanuvchi"}</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#52C6DA]">Kitobxon</span>
                            <div className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{userData.role || "User"}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    {userData.instagram && (
                        <a href={`https://instagram.com/${userData.instagram.replace('@', '')}`} target="_blank" className="w-10 h-10 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm text-slate-600 dark:text-slate-300 active:scale-90 transition-transform">
                            <Instagram size={20} />
                        </a>
                    )}
                    {userData.telegram && (
                        <a href={`https://t.me/${userData.telegram.replace('@', '')}`} target="_blank" className="w-10 h-10 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm text-slate-600 dark:text-slate-300 active:scale-90 transition-transform">
                            <Send size={18} />
                        </a>
                    )}
                </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl border border-slate-100 dark:border-slate-700/50 p-5 rounded-[24px] shadow-sm flex justify-between text-center divide-x divide-slate-100 dark:divide-slate-700">
                <div className="flex-1 flex flex-col pr-2">
                    <span className="text-lg font-black text-slate-900 dark:text-white leading-none mb-1">{books.length}</span>
                    <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">To'plam</span>
                </div>
                <div className="flex-1 flex flex-col px-2">
                    <span className="text-lg font-black text-slate-900 dark:text-white leading-none mb-1">{stats.friends || 0}</span>
                    <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Do'stlar</span>
                </div>
                <div className="flex-1 flex flex-col px-2">
                    <span className="text-lg font-black text-slate-900 dark:text-white leading-none mb-1">{stats.reading}</span>
                    <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">O'qishda</span>
                </div>
                <div className="flex-1 flex flex-col pl-2">
                    <span className="text-lg font-black text-slate-900 dark:text-white leading-none mb-1">{stats.finished}</span>
                    <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Yakunlandi</span>
                </div>
            </div>
        </div>

        {/* Bio Section */}
        <div className="mb-8">
            <h3 className="text-sm font-black dark:text-white mb-1">Men haqimda</h3>
            <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-normal whitespace-pre-wrap font-medium">{userData.bio || "Kitoblar - qalbimizning eng yaqin do'stlaridir. ✨"}</p>
        </div>

        {/* Interests Section - Story Style */}
        <div className="mb-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-1">Qiziqqan janrlar</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6">
                {(userData.interests?.length > 0 ? userData.interests : ["Badiiy", "Psixologiya", "Biznes", "Siyosat"]).map((int, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer shrink-0">
                        <div className="w-16 h-16 rounded-full p-[3px] bg-gradient-to-tr from-[#52C6DA] to-blue-600">
                            <div className="w-full h-full rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                <Hash size={18} className="text-[#52C6DA]" />
                            </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 group-hover:text-[#52C6DA] transition-colors">{int}</span>
                    </div>
                ))}
            </div>
        </div>

      </header>

      {/* Custom Tabs */}
      <div className="flex px-6 mb-4 sticky top-0 bg-[#FDFBF7]/80 dark:bg-slate-900/80 backdrop-blur-xl z-30 py-2 border-b border-slate-100 dark:border-slate-800">
          <button 
             onClick={() => setActiveTab('library')}
             className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${activeTab === 'library' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg' : 'text-slate-400'}`}
          >
              <Grid size={16} />
              <span className="text-[11px] font-black uppercase tracking-widest">To'plam</span>
          </button>
          <button 
             onClick={() => setActiveTab('favorites')}
             className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${activeTab === 'favorites' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg' : 'text-slate-400'}`}
          >
              <Heart size={16} />
              <span className="text-[11px] font-black uppercase tracking-widest">Sevimlilar</span>
          </button>
          <button 
             onClick={() => setActiveTab('reviews')}
             className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${activeTab === 'reviews' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg' : 'text-slate-400'}`}
          >
              <MessageSquare size={16} />
              <span className="text-[11px] font-black uppercase tracking-widest">Sharhlar</span>
          </button>
      </div>

      {/* 2. Personalized Library (Custom Grid) */}
      <section className="px-6 pb-32">
        <AnimatePresence mode="wait">
            {activeTab === 'library' && (
                <motion.div 
                    key="library"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-3 gap-3"
                >
                    {books.length === 0 ? (
                        <EmptyState message="Kutubxonangiz bo'sh" />
                    ) : (
                        books.map((book) => (
                            <BookGridItem key={book.id} book={book} onSelect={setSelectedBook} />
                        ))
                    )}
                </motion.div>
            )}

            {activeTab === 'favorites' && (
                <motion.div 
                    key="favorites"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-3 gap-3"
                >
                    {favorites.length === 0 ? (
                        <EmptyState message="Sevimlilar ro'yxati bo'sh" icon={<Heart size={24} />} />
                    ) : (
                        favorites.map((book) => (
                            <BookGridItem 
                                key={book._id} 
                                book={{
                                    id: book._id,
                                    title: book.title,
                                    cover: book.images?.[0] || book.image || "https://placehold.co/400x600/png?text=Kitob",
                                    author: book.author
                                }} 
                                onSelect={() => setSelectedBook({ ...book, cover: book.images?.[0] || book.image })} 
                            />
                        ))
                    )}
                </motion.div>
            )}

            {activeTab === 'reviews' && (
                <motion.div 
                    key="reviews"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                >
                    {reviews.length === 0 ? (
                        <EmptyState message="Hali sharhlar yozilmagan" icon={<MessageSquare size={24} />} />
                    ) : (
                        reviews.map((review) => (
                            <div key={review._id} className="bg-white dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex gap-4">
                                <div className="w-16 aspect-[2/3] relative rounded-lg overflow-hidden flex-shrink-0">
                                    <Image src={review.book?.images?.[0] || review.book?.image || "https://placehold.co/400x600/png?text=Kitob"} alt={review.book?.title} fill className="object-cover" unoptimized />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate mb-1">{review.book?.title}</h4>
                                    <div className="flex text-amber-500 gap-0.5 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={i < review.rating ? 0 : 2} />
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-snug">{review.comment}</p>
                                </div>
                            </div>
                        ))
                    )}
                </motion.div>
            )}
        </AnimatePresence>
      </section>

      {/* 3. Detail Modal (Editorial Style) */}
      <AnimatePresence>
        {selectedBook && (
          <div className="fixed inset-0 z-[100] flex flex-col justify-end">
            {/* Backdrop */}
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setSelectedBook(null)}
               className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            
            {/* Modal Content */}
            <motion.div 
               layoutId={`book-${selectedBook.id}`}
               initial={{ y: "100%" }}
               animate={{ y: 0 }}
               exit={{ y: "100%" }}
               transition={{ type: "spring", damping: 25, stiffness: 200 }}
               className="relative bg-white dark:bg-slate-900 w-full max-h-[92vh] rounded-t-[40px] shadow-2xl overflow-hidden flex flex-col"
            >
                {/* Pull Handle */}
                <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mt-4 mb-4" />

                <div className="flex-1 overflow-y-auto px-8 pb-32 custom-scrollbar">
                    {/* Header Info */}
                    <div className="flex gap-6 mb-10 mt-4">
                        <div className="w-32 aspect-[2/3] relative rounded-xl shadow-2xl overflow-hidden shrink-0">
                            <Image 
                                src={selectedBook.cover} 
                                alt={selectedBook.title}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                        <div className="pt-2">
                             <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white leading-tight mb-2">{selectedBook.title}</h2>
                             <p className="text-xs font-bold uppercase tracking-widest text-[#52C6DA] mb-4">{selectedBook.author}</p>
                             <div className="flex gap-2">
                                 <span className="px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded text-[9px] font-black uppercase tracking-widest text-slate-400">Personal Copy</span>
                             </div>
                        </div>
                    </div>

                    {/* Personal Reflection / Review Section */}
                    {userData.isOwner && (
                        <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                             <div className="flex items-center gap-2 mb-4">
                                 <PenLine size={16} className="text-[#52C6DA]" />
                                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">Sharh va Baxo</h4>
                             </div>
                             
                             <form onSubmit={handleReviewSubmit} className="space-y-4">
                                 {/* Star Rating */}
                                 <div className="flex gap-1">
                                     {[1, 2, 3, 4, 5].map((star) => (
                                         <button
                                             key={star}
                                             type="button"
                                             onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                             className={`p-1 transition-transform active:scale-90 ${reviewForm.rating >= star ? 'text-amber-400' : 'text-slate-300'}`}
                                         >
                                             <Sparkles size={20} fill={reviewForm.rating >= star ? 'currentColor' : 'none'} />
                                         </button>
                                     ))}
                                 </div>
                                 
                                 <textarea 
                                    value={reviewForm.comment}
                                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                    placeholder="Ushbu kitob haqida fikringiz..."
                                    className="w-full bg-white dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-[#52C6DA] transition-all resize-none min-h-[100px]"
                                 />
                                 
                                 <button 
                                    disabled={isSubmittingReview}
                                    className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#52C6DA] dark:hover:bg-[#52C6DA] transition-colors disabled:opacity-50"
                                 >
                                    {isSubmittingReview ? "Yuborilmoqda..." : "Saqlash"}
                                 </button>
                             </form>
                        </div>
                    )}

                    {/* Shared Thoughts (If visiting or if review already exists) */}
                    {selectedBook.review && (
                        <div className="relative mb-10">
                            <Quote className="absolute -top-4 -left-2 text-[#52C6DA]/20" size={48} />
                            <p className="relative z-10 font-serif italic text-lg text-slate-700 dark:text-slate-300 leading-relaxed pl-6">
                                {selectedBook.review}
                            </p>
                        </div>
                    )}
                    
                     <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                         <button 
                            onClick={() => router.push(`/mobile/book/${selectedBook.id || selectedBook._id}`)}
                            className="flex-1 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#52C6DA] transition-colors"
                         >
                            Kitobni ko'rish
                         </button>
                         <button 
                            onClick={() => setSelectedBook(null)}
                            className="px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white"
                         >
                            Yopish
                         </button>
                     </div>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      </motion.div>
    </div>
  );
}

const BookGridItem = ({ book, onSelect }) => (
    <motion.div 
        layoutId={`book-${book.id}`}
        onClick={() => onSelect(book)}
        className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm active:scale-95 transition-transform"
    >
        <Image 
            src={book.cover} 
            alt={book.title}
            fill
            className="object-cover"
            unoptimized
        />
        {book.type === 'rental' && (
            <div className="absolute top-2 right-2 text-white drop-shadow-md">
                <Sparkles size={12} fill="currentColor" />
            </div>
        )}
    </motion.div>
);

const EmptyState = ({ message, icon = <BookOpen size={24} /> }) => (
    <div className="col-span-3 text-center py-20 bg-white/50 dark:bg-slate-800/30 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-700">
        <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm text-slate-300 dark:text-slate-600">
            {icon}
        </div>
        <p className="text-xs text-slate-400 font-black uppercase tracking-widest">{message}</p>
    </div>
);
