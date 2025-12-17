"use client";
import React, { useState, useEffect } from 'react';
import { Search, Bell, User, BookOpen, GraduationCap, HeartPulse, Activity, UserPlus, History, Trophy, TrendingUp, Star, Laptop, Briefcase, Lightbulb, Music, Palette, ShoppingBag, Globe, Book, Moon, Star as StarIcon, Zap } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Helper for real images (Unsplash)
const BOOKS_DATA = {
  new: [
    { id: 101, title: "The Design of Everyday Things", author: "Don Norman", img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop" },
    { id: 102, title: "Creative Confidence", author: "Tom Kelley", img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop" },
    { id: 103, title: "Sprint", author: "Jake Knapp", img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop" },
    { id: 104, title: "Hooked", author: "Nir Eyal", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop" },
    { id: 105, title: "Essentialism", author: "Greg McKeown", img: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=800&auto=format&fit=crop" },
  ],
  trends: [
    { id: 201, title: "Atomic Habits", author: "James Clear", rating: 4.9, views: "2.3k", img: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?q=80&w=800&auto=format&fit=crop" },
    { id: 202, title: "Deep Work", author: "Cal Newport", rating: 4.8, views: "1.8k", img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=800&auto=format&fit=crop" },
    { id: 203, title: "Zero to One", author: "Peter Thiel", rating: 4.7, views: "1.5k", img: "https://images.unsplash.com/photo-1555116505-a5d6d481a696?q=80&w=800&auto=format&fit=crop" },
  ],
  bestsellers: [
    { rank: 1, title: "Sapiens", author: "Yuval Noah Harari", img: "https://images.unsplash.com/photo-1543002588-acae747311df?q=80&w=800&auto=format&fit=crop" },
    { rank: 2, title: "Educated", author: "Tara Westover", img: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800&auto=format&fit=crop" },
    { rank: 3, title: "Becoming", author: "Michelle Obama", img: "https://images.unsplash.com/photo-1610810787720-333e84a229a9?q=80&w=800&auto=format&fit=crop" }
  ],
  discount: [
    { id: 301, title: "Thinking, Fast and Slow", author: "Daniel Kahneman", discount: 30, img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop" },
    { id: 302, title: "Quiet", author: "Susan Cain", discount: 50, img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop" },
    { id: 303, title: "Grit", author: "Angela Duckworth", discount: 20, img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop" },
  ]
};

const MarketPage = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <MarketSkeleton />;
    }

  return (
    <div className="bg-white dark:bg-slate-900 pb-24 min-h-screen transition-colors duration-300">
      <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.5 }}
         className="flex flex-col gap-8 mt-2"
      >
        {/* Section 1: Store Tabs */}
        <StoreTabs />
        
        {/* Section 2: Promo Banner */}
        <div className="flex justify-center w-full px-4">
           <PromoCarousel />
        </div>

        {/* Section 3: Categories */}
        <CategorySection />

        {/* Section 4: New Books */}
        <NewBooksSection />

        {/* Section 5: Weekly Trends */}
        <WeeklyTrendsSection />

        {/* Section 6: Bestsellers Table */}
        <BestsellerSection />

        {/* Section 7: Discounted Books */}
        <DiscountSection />
      </motion.div>
    </div>
  );
};

// --- Skeleton Loader Component ---
const MarketSkeleton = () => (
    <div className="bg-white dark:bg-slate-900 pb-24 min-h-screen px-4 animate-pulse transition-colors duration-300">
        {/* Tabs Skeleton */}
        <div className="flex gap-3 overflow-x-hidden mt-4 pb-4">
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-10 w-24 bg-slate-100 dark:bg-slate-800 rounded-full flex-shrink-0"></div>
            ))}
        </div>

        {/* Banner Skeleton */}
        <div className="w-full aspect-[2.2/1] bg-slate-100 dark:bg-slate-800 rounded-2xl mb-8"></div>

        {/* Categories Skeleton */}
        <div className="mb-8">
            <div className="h-6 w-32 bg-slate-100 dark:bg-slate-800 rounded mb-4"></div>
            <div className="flex gap-3 overflow-x-hidden">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-[85px] h-[95px] bg-slate-100 dark:bg-slate-800 rounded-2xl flex-shrink-0"></div>
                ))}
            </div>
        </div>

        {/* New Books Skeleton */}
        <div className="mb-8">
            <div className="flex justify-between mb-4">
                 <div className="h-6 w-32 bg-slate-100 dark:bg-slate-800 rounded"></div>
                 <div className="h-4 w-16 bg-slate-100 dark:bg-slate-800 rounded"></div>
            </div>
            <div className="flex gap-4 overflow-x-hidden">
                {[1, 2, 3].map(i => (
                    <div key={i} className="w-[130px] flex-shrink-0 flex flex-col gap-2">
                        <div className="w-full h-[190px] bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                        <div className="h-4 w-3/4 bg-slate-100 dark:bg-slate-800 rounded"></div>
                        <div className="h-3 w-1/2 bg-slate-100 dark:bg-slate-800 rounded"></div>
                    </div>
                ))}
            </div>
        </div>
        
         {/* Trends Skeleton */}
         <div className="mb-8">
            <div className="h-6 w-32 bg-slate-100 dark:bg-slate-800 rounded mb-4"></div>
            <div className="flex flex-col gap-3">
                {[1, 2].map(i => (
                    <div key={i} className="w-full h-28 bg-slate-100 dark:bg-slate-800 rounded-2xl"></div>
                ))}
            </div>
        </div>
    </div>
);


// Navbar Component
const MarketNavbar = () => {
  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-100">
      <h1 className="text-xl font-extrabold text-[#52C6DA]">Market</h1>
      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-slate-50 rounded-full transition-colors">
          <Search size={22} className="text-slate-600" />
        </button>
        <button className="p-2 hover:bg-slate-50 rounded-full transition-colors relative">
          <Bell size={22} className="text-slate-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
      </div>
    </div>
  );
};

// Section 1: Store Tabs (Animated & Colorful)
const StoreTabs = () => {
  const [activeTab, setActiveTab] = useState("Asaxiy");
  
  const stores = [
    { id: "Asaxiy", name: "Asaxiy", color: "#3B82F6", icon: <ShoppingBag size={16} /> }, // Blue
    { id: "HilolNashr", name: "HilolNashr", color: "#10B981", icon: <Moon size={16} /> }, // Green
    { id: "Qamar", name: "Qamar Books", color: "#F59E0B", icon: <StarIcon size={16} /> }, // Amber
    { id: "Akademnashr", name: "Akademnashr", color: "#8B5CF6", icon: <GraduationCap size={16} /> }, // Purple
    { id: "Zukko", name: "Zukko", color: "#EF4444", icon: <Zap size={16} /> }, // Red
    { id: "Book.uz", name: "Book.uz", color: "#EC4899", icon: <BookOpen size={16} /> }, // Pink
    { id: "Jadidlar", name: "Jadidlar", color: "#14B8A6", icon: <History size={16} /> }, // Teal
  ];
  
  return (
    <div className="w-full overflow-x-auto no-scrollbar pl-4">
      <div className="flex gap-2 pr-4">
        {stores.map((store) => {
           const isActive = activeTab === store.id;
           return (
            <button 
                key={store.id}
                onClick={() => setActiveTab(store.id)}
                className={`relative px-4 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all z-10 flex items-center gap-2 group border 
                  ${isActive ? 'text-white border-transparent' : 'text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800'}`}
            >
                {isActive && (
                    <motion.div 
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-full -z-10 shadow-lg"
                        style={{ backgroundColor: store.color, boxShadow: `0 4px 12px ${store.color}60` }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                )}
                <span className={isActive ? 'text-white' : ''} style={!isActive ? { color: store.color } : {}}>
                    {store.icon}
                </span>
                <span>{store.name}</span>
            </button>
           );
        })}
      </div>
    </div>
  );
};

// Section 2: Promo Carousel
const PromoCarousel = () => {
  const publishers = [
    { name: "Asaxiy Books", logo: "📘", bg: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=800&auto=format&fit=crop" },
    { name: "Hilol Nashr", logo: "🌙", bg: "https://images.unsplash.com/photo-1543002588-acae747311df?q=80&w=800&auto=format&fit=crop" },
    { name: "Qamar", logo: "⭐", bg: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop" },
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % publishers.length);
    }, 4000); 
    return () => clearInterval(timer);
  }, [publishers.length]);

  return (
    <div className="relative w-full aspect-[2.2/1] overflow-hidden rounded-2xl shadow-xl shadow-slate-100">
      <AnimatePresence mode='wait'>
         <motion.div 
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
         >
             <Image 
                src={publishers[currentIndex].bg} 
                alt={publishers[currentIndex].name}
                fill
                className="object-cover"
                unoptimized
             />
             <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center p-6">
                 <div className="bg-white/10 backdrop-blur-md w-fit p-4 rounded-2xl border border-white/20">
                     <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-lg">
                            {publishers[currentIndex].logo}
                        </div>
                        <span className="text-white/80 text-xs font-bold uppercase tracking-wider">Official Store</span>
                     </div>
                     <h3 className="text-white font-extrabold text-2xl leading-tight drop-shadow-md">{publishers[currentIndex].name}</h3>
                     <p className="text-white/70 text-sm mt-1">Eng sara asarlar to'plami</p>
                 </div>
             </div>
         </motion.div>
      </AnimatePresence>
      
      {/* Dots */}
      <div className="absolute bottom-4 left-6 flex gap-1.5 z-10">
        {publishers.map((_, idx) => (
            <div 
                key={idx} 
                className={`transition-all duration-300 rounded-full h-1.5 ${idx === currentIndex ? 'w-6 bg-[#52C6DA]' : 'w-1.5 bg-white/50'}`} 
            />
        ))}
      </div>
    </div>
  );
};

// Section 3: Categories (Colorful Icons)
const CategorySection = () => {
  const categories = [
    { name: "Ta'lim", icon: <GraduationCap size={24} />, bg: "bg-blue-50", text: "text-blue-500", border: "hover:border-blue-300" },
    { name: "Salomatlik", icon: <HeartPulse size={24} />, bg: "bg-red-50", text: "text-red-500", border: "hover:border-red-300" },
    { name: "Siyosat", icon: <Activity size={24} />, bg: "bg-slate-100", text: "text-slate-600", border: "hover:border-slate-300" },
    { name: "Biznes", icon: <Briefcase size={24} />, bg: "bg-amber-50", text: "text-amber-600", border: "hover:border-amber-300" }, 
    { name: "IT", icon: <Laptop size={24} />, bg: "bg-cyan-50", text: "text-cyan-600", border: "hover:border-cyan-300" }, 
    { name: "Tarix", icon: <History size={24} />, bg: "bg-emerald-50", text: "text-emerald-600", border: "hover:border-emerald-300" },
    { name: "San'at", icon: <Palette size={24} />, bg: "bg-purple-50", text: "text-purple-600", border: "hover:border-purple-300" },
    { name: "Musiqa", icon: <Music size={24} />, bg: "bg-pink-50", text: "text-pink-600", border: "hover:border-pink-300" },
    { name: "Psixologiya", icon: <Lightbulb size={24} />, bg: "bg-yellow-50", text: "text-yellow-600", border: "hover:border-yellow-300" },
    { name: "Sport", icon: <Trophy size={24} />, bg: "bg-orange-50", text: "text-orange-600", border: "hover:border-orange-300" },
  ];

  return (
    <div className="pl-4">
      <div className="flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-100">
        <BookOpen size={20} className="text-[#52C6DA]"/>
        <h2 className="font-bold text-lg">Kategoriyalar</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pr-4">
        {categories.map((cat, idx) => (
          <motion.div 
            whileTap={{ scale: 0.95 }}
            key={idx} 
            className={`flex-shrink-0 flex flex-col items-center justify-center gap-2 min-w-[85px] h-[95px] bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 cursor-pointer transition-all shadow-sm ${cat.border}`}
          >
            <div className={`p-3 rounded-2xl ${cat.bg} ${cat.text} transition-colors`}>
                {cat.icon}
            </div>
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">{cat.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Section 4: New Books
const NewBooksSection = () => {
  return (
    <div className="pl-4">
      <div className="flex justify-between items-center pr-4 mb-4">
        <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">Yangi Kitoblar</h2>
        <span className="text-[#52C6DA] text-xs font-bold cursor-pointer">Barchasi</span>
      </div>
      
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 pr-4">
        {BOOKS_DATA.new.map((book) => (
          <div key={book.id} className="flex-shrink-0 w-[130px] flex flex-col gap-2 group cursor-pointer">
            <div className="w-full h-[190px] relative rounded-xl overflow-hidden shadow-md bg-slate-100 dark:bg-slate-800">
                 <Image src={book.img} alt={book.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                 <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase">New</div>
            </div>
            <div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 line-clamp-1 group-hover:text-[#52C6DA] transition-colors">{book.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{book.author}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Section 5: Weekly Trends
const WeeklyTrendsSection = () => {
  return (
    <div className="px-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={20} className="text-[#52C6DA]"/>
        <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">Hafta Urflari</h2>
      </div>
      
      <div className="flex flex-col gap-3">
        {BOOKS_DATA.trends.map((book) => (
            <div key={book.id} className="flex gap-4 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm active:scale-[0.99] transition-transform">
                <div className="w-[70px] h-[100px] flex-shrink-0 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 relative shadow-inner">
                     <Image src={book.img} alt={book.title} fill className="object-cover" unoptimized />
                </div>
                <div className="flex flex-col justify-between py-1 flex-1">
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base leading-snug">{book.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">{book.author}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-1.5 py-0.5 rounded-md border border-yellow-100 dark:border-yellow-900/30">
                            <Star size={12} className="fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">{book.rating}</span>
                        </div>
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
                            <User size={10} /> {book.views}
                        </span>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

// Section 6: Bestsellers Table
const BestsellerSection = () => {
    return (
        <div className="px-4">
            <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-3">Bestsellerlar top 3</h2>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700">
                        <tr>
                            <th className="p-3 text-xs font-bold text-slate-400 dark:text-slate-500 w-12 text-center">#</th>
                            <th className="p-3 text-xs font-bold text-slate-400 dark:text-slate-500">Kitob</th>
                            <th className="p-3 text-xs font-bold text-slate-400 dark:text-slate-500 text-right">Reyting</th>
                        </tr>
                    </thead>
                    <tbody>
                         {BOOKS_DATA.bestsellers.map((book, idx) => (
                             <tr key={idx} className="border-b border-slate-50 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors">
                                 <td className="p-3 text-center">
                                     <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${idx === 0 ? 'bg-yellow-100 text-yellow-700' : idx === 1 ? 'bg-slate-200 text-slate-600' : 'bg-[#EAE5D8] text-[#8C7B70]'}`}>
                                        {book.rank}
                                     </span>
                                 </td>
                                 <td className="p-3">
                                     <div className="flex items-center gap-3">
                                         <div className="w-9 h-12 bg-slate-200 dark:bg-slate-700 rounded-md overflow-hidden flex-shrink-0 relative shadow-sm">
                                             <Image src={book.img} alt={book.title} fill className="object-cover" unoptimized />
                                         </div>
                                         <div>
                                             <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{book.title}</h4>
                                             <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">{book.author}</p>
                                         </div>
                                     </div>
                                 </td>
                                 <td className="p-3 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                         <Star size={12} className="fill-[#52C6DA] text-[#52C6DA]" />
                                         <span className="text-sm font-bold text-slate-700 dark:text-slate-200">5.0</span>
                                    </div>
                                 </td>
                             </tr>
                         ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Section 7: Discounted Books
const DiscountSection = () => {
  return (
    <div className="pl-4">
       <div className="flex items-center mb-4">
           <div className="bg-red-500 w-1.5 h-6 rounded-r-full mr-2.5"></div>
           <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">Chegirmadagi Kitoblar</h2>
       </div>
       
       <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 pr-4">
          {BOOKS_DATA.discount.map((book) => (
             <div key={book.id} className="relative flex-shrink-0 w-[140px] group cursor-pointer">
                 <div className="w-full h-[200px] relative rounded-xl overflow-hidden shadow-sm bg-slate-100 dark:bg-slate-800">
                     <Image src={book.img} alt={book.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                     {/* Discount Badge */}
                     <div className="absolute top-0 right-0 bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-bl-xl shadow-sm z-10">
                         -{book.discount}%
                     </div>
                     {/* Kitobdosh Logo Watermark */}
                     <div className="absolute bottom-2 left-2 w-7 h-7 bg-white/90 dark:bg-slate-900/90 rounded-full flex items-center justify-center shadow-sm">
                        <BookOpen size={14} className="text-[#52C6DA]"/>
                     </div>
                 </div>
                 <div className="mt-2 text-center">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 line-clamp-1">{book.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{book.author}</p>
                 </div>
             </div>
          ))}
       </div>
    </div>
  );
};

export default MarketPage;
