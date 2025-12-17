"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, UserPlus, MoreHorizontal, X, ArrowUpRight, BookOpen, Quote, PenLine } from "lucide-react";

// --- Configuration ---
const ACCENT_COLOR = "#52C6DA";

// --- Mock Data ---
const MOCK_USER = {
  name: "Kitobxon",
  title: "Bibliophile & Reviewer", 
  bio: "Kitoblar — bu jim turib gapiradigan eng donishmand do'stlardir.",
  stats: {
    friends: 128,
    reading: 3,
    finished: 39,
  },
  interests: [
    { id: 1, label: "Falsafa", icon: "🧠" },
    { id: 2, label: "Jadidlar", icon: "📜" },
    { id: 3, label: "She'riyat", icon: "✍️" },
    { id: 4, label: "Psixologiya", icon: "🧩" },
    { id: 5, label: "Tarix", icon: "🏛️" },
  ]
};

const BOOKS = [
  { id: 1, title: "O'tkan Kunlar", author: "Abdulla Qodiriy", cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600", status: "finished", date: "2024", review: "Sharq adabiyotining durdonasi." },
  { id: 2, title: "Siddhartha", author: "Hermann Hesse", cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600", status: "reading", date: "Dec 2024", review: "Ruhoniy safar." },
  { id: 3, title: "1984", author: "George Orwell", cover: "https://images.unsplash.com/photo-1531988042232-e9a184d80175?q=80&w=600", status: "finished", date: "2023", review: "Dystopian masterpiece." },
  { id: 4, title: "Alximik", author: "Paulo Coelho", cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600", status: "finished", date: "2023", review: "Orzular sari yo'l." },
  { id: 5, title: "Martin Eden", author: "Jack London", cover: "https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?q=80&w=600", status: "finished", date: "2022", review: "Muvaffaqiyat fojiasi." },
  { id: 6, title: "Chol va Dengiz", author: "Ernest Hemingway", cover: "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?q=80&w=600", status: "reading", date: "Hozir", review: "Matonat haqida." },
];

// --- Components ---

export default function MyBooksPage() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

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

  if (loading) {
      return (
        <div className="min-h-screen bg-[#FDFBF7] dark:bg-slate-900 pb-24 font-sans transition-colors duration-300">
            <MyBooksSkeleton />
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-slate-900 text-slate-800 dark:text-slate-200 pb-24 font-sans selection:bg-[#52C6DA]/20 transition-colors duration-300">
      
      {/* 1. Editorial Header */}
      <header className="pt-12 pb-6 px-6">
        
        {/* Profile Row: Avatar + Name + Actions */}
        <div className="flex justify-between items-center mb-6">
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8, ease: "easeOut" }}
               className="flex items-center gap-5"
            >
                {/* Avatar */}
                <div className="w-20 h-20 relative rounded-full overflow-hidden shadow-xl grayscale hover:grayscale-0 transition-all duration-700 ease-in-out">
                    <Image 
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop"
                        alt="Profile"
                        fill
                        className="object-cover"
                        unoptimized
                    />
                </div>
                
                {/* Name & Title */}
                <div>
                    <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-white leading-tight mb-1 tracking-tight">
                        {MOCK_USER.name}
                    </h1>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#52C6DA]">
                        {MOCK_USER.title}
                    </p>
                </div>
            </motion.div>

            {/* Actions */}
            <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.2 }}
                 className="flex gap-2"
            >
                 <button className="w-10 h-10 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 border border-slate-900 dark:border-white flex items-center justify-center hover:bg-[#52C6DA] hover:border-[#52C6DA] dark:hover:bg-[#52C6DA] dark:hover:border-[#52C6DA] transition-all duration-300 shadow-md">
                     <UserPlus size={18} strokeWidth={1.5}/>
                 </button>
                 <button className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 shadow-sm">
                     <PenLine size={18} strokeWidth={1.5}/>
                 </button>
            </motion.div>
        </div>
        
        {/* Bio Section */}
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 pl-1"
        >
             <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed max-w-sm font-serif italic border-l-2 border-slate-200 dark:border-slate-700 pl-4">
                "{MOCK_USER.bio}"
            </p>
        </motion.div>

        {/* Glassmorphic Stats */}
        <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
             className="grid grid-cols-3 gap-3 mb-8"
        >
            {[
                { label: "Do'stlar", value: MOCK_USER.stats.friends },
                { label: "O'qilmoqda", value: MOCK_USER.stats.reading },
                { label: "Tugallangan", value: MOCK_USER.stats.finished }
            ].map((stat, idx) => (
                <div key={idx} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 p-4 rounded-xl hover:shadow-lg dark:hover:shadow-slate-800 transition-shadow duration-300 cursor-default">
                    <span className="block text-2xl font-serif text-slate-900 dark:text-white mb-1">{stat.value}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{stat.label}</span>
                </div>
            ))}
        </motion.div>

        {/* Interests Section - Restored & Refined */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="overflow-x-auto no-scrollbar -mx-6 px-6 pb-2"
        >
            <div className="flex gap-3">
                {MOCK_USER.interests.map((interest) => (
                    <div key={interest.id} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full shadow-sm min-w-max">
                        <span className="text-lg">{interest.icon}</span>
                        <span className="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">{interest.label}</span>
                    </div>
                ))}
            </div>
        </motion.div>

      </header>

      {/* 2. Cinematic Library Grid */}
      <section className="px-6">
        <div className="flex items-center justify-between mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="font-serif text-xl italic text-slate-800 dark:text-slate-100">Shaxsiy Kutubxona</h2>
            <div className="flex gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                <span className="w-2 h-2 rounded-full bg-slate-800 dark:bg-slate-400"></span>
            </div>
        </div>

        <motion.div 
             initial="hidden"
             animate="visible"
             variants={{
                 visible: { transition: { staggerChildren: 0.1 } }
             }}
             className="grid grid-cols-2 gap-x-6 gap-y-10"
        >
            {BOOKS.map((book) => (
                <motion.div 
                    key={book.id}
                    variants={{
                        hidden: { opacity: 0, y: 30 },
                        visible: { opacity: 1, y: 0 }
                    }}
                    onClick={() => setSelectedBook(book)}
                    className="group cursor-pointer"
                >
                    {/* Realistic Book Cover */}
                    <motion.div 
                        layoutId={`book-card-${book.id}`}
                        className="relative aspect-[2/3] mb-4 bg-slate-200 rounded-sm shadow-xl shadow-slate-200 group-hover:shadow-2xl group-hover:shadow-slate-300 group-hover:-translate-y-2 transition-all duration-500 ease-out"
                    >
                        <Image 
                            src={book.cover} 
                            alt={book.title} 
                            fill 
                            className="object-cover rounded-sm"
                            unoptimized
                        />
                        {/* Lighting effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 pointer-events-none mix-blend-overlay"></div>
                    </motion.div>

                    <div className="space-y-1 text-center">
                        <h3 className="font-serif text-lg leading-tight text-slate-900 dark:text-slate-100 group-hover:text-[#52C6DA] transition-colors duration-300">
                            {book.title}
                        </h3>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                            {book.author}
                        </p>
                    </div>
                </motion.div>
            ))}
        </motion.div>
      </section>

      {/* 3. Detail Modal (Editorial Style) */}
      <AnimatePresence>
        {selectedBook && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-[#FDFBF7]/95 dark:bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-6"
                onClick={() => setSelectedBook(null)}
            >
                <motion.div 
                    layoutId={`book-card-${selectedBook.id}`}
                    className="w-full max-w-lg relative bg-white dark:bg-slate-800 shadow-2xl rounded-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button 
                         onClick={() => setSelectedBook(null)}
                         className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-md flex items-center justify-center text-slate-900 dark:text-white hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2">
                        {/* Image Side */}
                        <div className="relative aspect-[3/4] sm:aspect-auto">
                            <Image 
                                src={selectedBook.cover} 
                                alt={selectedBook.title} 
                                fill 
                                className="object-cover"
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-black/10"></div>
                        </div>

                        {/* Content Side */}
                        <div className="p-8 flex flex-col justify-center">
                            <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-widest rounded-full w-fit mb-6">
                                {selectedBook.status}
                            </span>

                            <h2 className="text-3xl font-serif text-slate-900 dark:text-white mb-2 leading-tight">
                                {selectedBook.title}
                            </h2>
                            <p className="text-sm font-bold uppercase tracking-wide text-[#52C6DA] mb-8">
                                {selectedBook.author}
                            </p>

                            <div className="relative pl-6 border-l-2 border-[#52C6DA]/30">
                                <Quote size={24} className="absolute -top-3 -left-[13px] text-[#52C6DA] bg-white dark:bg-slate-800" fill="currentColor" />
                                <p className="text-slate-600 dark:text-slate-300 font-serif italic text-lg leading-relaxed">
                                    {selectedBook.review}
                                </p>
                            </div>

                            <div className="mt-10 flex gap-4">
                                <button className="flex-1 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs uppercase tracking-widest hover:bg-[#52C6DA] dark:hover:bg-[#52C6DA] transition-colors rounded-sm">
                                    O'qish
                                </button>
                                <button className="w-12 flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:border-slate-900 dark:hover:border-white transition-colors rounded-sm text-slate-600 dark:text-slate-300">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
