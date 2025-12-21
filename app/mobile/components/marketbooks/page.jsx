"use client";
import React, { useState, useEffect } from 'react';
import { Search, Bell, User, BookOpen, GraduationCap, HeartPulse, Activity, UserPlus, History, Trophy, TrendingUp, Star, Laptop, Briefcase, Lightbulb, Music, Palette, ShoppingBag, Globe, Book, Moon, Star as StarIcon, Zap, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from "next/navigation";
import { BOOK_CATEGORIES } from "@/lib/constants";
import { 
    BookMarked, ScrollText, Baby, Brain, FlaskConical, MoonStar, 
    Search as SearchIcon, Compass, History as HistoryIcon, UserCircle, Sparkles, Languages, LayoutGrid,
    Heart
} from 'lucide-react';
import { useCart } from "@/app/CartContext";
import { useFavorites } from "@/app/FavoritesContext";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";

const IconMap = {
  BookMarked, ScrollText, Baby, Brain, FlaskConical, MoonStar, 
  Search: SearchIcon, Compass, History: HistoryIcon, UserCircle, Sparkles, Languages, LayoutGrid
};

const MarketPage = () => {
    const [loading, setLoading] = useState(true);
    const [books, setBooks] = useState({ new: [], trends: [], bestsellers: [], discount: [] });
    const [stores, setStores] = useState([]);
    const [activePublisher, setActivePublisher] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const router = useRouter();

    const fetchMarketData = async (showLoading = true) => {
        if (showLoading && !isRefreshing) setLoading(true);
        try {
            // Fetch Stores & Inital Books in Parallel
            const [storesRes, newRes, trendsRes, bestsellersRes, saleRes] = await Promise.all([
                fetch(`/api/stores`),
                fetch(`/api/user/search?type=sale&limit=6&sort=createdAt${activePublisher ? `&publisher=${activePublisher}` : ''}`),
                fetch(`/api/user/search?type=sale&limit=4&sort=rating${activePublisher ? `&publisher=${activePublisher}` : ''}`),
                fetch(`/api/user/search?type=sale&limit=3&sort=rating${activePublisher ? `&publisher=${activePublisher}` : ''}`),
                fetch(`/api/user/search?type=sale&limit=14${activePublisher ? `&publisher=${activePublisher}` : ''}`)
            ]);

            const [storesData, newData, trendsData, bestsellersData, saleData] = await Promise.all([
                storesRes.json(), newRes.json(), trendsRes.json(), bestsellersRes.json(), saleRes.json()
            ]);
            
            if (storesData.success) {
                setStores(storesData.data);
                if (!activePublisher && storesData.data.length > 0) {
                    setActivePublisher(storesData.data[0].slug);
                }
            }

            setBooks({
                new: newData.success ? newData.books : [],
                trends: trendsData.success ? trendsData.books : [],
                bestsellers: bestsellersData.success ? bestsellersData.books : [],
                discount: saleData.success ? saleData.books : []
            });
        } catch (error) {
            console.error("Market Data Fetch Error:", error);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    // Re-fetch books when publisher changes
    useEffect(() => {
        if (activePublisher) {
            fetchMarketData(false);
        }
    }, [activePublisher]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchMarketData(false);
    };

    useEffect(() => {
        fetchMarketData();
    }, []);

    if (loading && !isRefreshing) {
        return <MarketSkeleton />;
    }

  return (
    <div className="bg-white dark:bg-slate-900 pb-24 min-h-screen transition-colors duration-300 relative overflow-hidden">
      
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
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
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
         className="flex flex-col gap-8 mt-2 min-h-screen"
      >
     <StoreTabs stores={stores} activeTab={activePublisher} setActiveTab={setActivePublisher} />
        
        <div className="flex justify-center w-full px-4">
           <PromoCarousel stores={stores} />
        </div>

        <CategorySection />

        <NewBooksSection books={books.new} />

        <WeeklyTrendsSection books={books.trends} />

        <BestsellerSection books={books.bestsellers} />

        <DiscountSection books={books.discount} />
      </motion.div>
    </div>
  );
};

// --- Skeleton Loader Component ---
const MarketSkeleton = () => (
    <div className="bg-white dark:bg-slate-900 pb-24 min-h-screen px-4 animate-pulse transition-colors duration-300">
        <div className="flex gap-3 overflow-x-hidden mt-4 pb-4">
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-10 w-24 bg-slate-100 dark:bg-slate-800 rounded-full flex-shrink-0"></div>
            ))}
        </div>
        <div className="w-full aspect-[2.2/1] bg-slate-100 dark:bg-slate-800 rounded-2xl mb-8"></div>
        <div className="mb-8">
            <div className="h-6 w-32 bg-slate-100 dark:bg-slate-800 rounded mb-4"></div>
            <div className="flex gap-3 overflow-x-hidden">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-[85px] h-[95px] bg-slate-100 dark:bg-slate-800 rounded-2xl flex-shrink-0"></div>
                ))}
            </div>
        </div>
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
    </div>
);

// Section 1: Store Tabs
const StoreTabs = ({ stores, activeTab, setActiveTab }) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar pl-4">
      <div className="flex gap-2 pr-4">
        {Array.isArray(stores) && stores.map((store) => {
           const isActive = activeTab === store.slug;
           return (
            <button 
                key={store._id}
                onClick={() => setActiveTab(store.slug)}
                className={`relative px-4 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all z-10 flex items-center gap-2 group border 
                  ${isActive ? 'text-white border-transparent premium-shadow' : 'text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800 premium-tab-shadow'}`}
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
                    {store.logoEmoji || <ShoppingBag size={16} />}
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
const PromoCarousel = ({ stores }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const bannerStores = stores.filter(s => s.bannerUrl);

  useEffect(() => {
    if (bannerStores.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerStores.length);
    }, 4000); 
    return () => clearInterval(timer);
  }, [bannerStores.length]);

  if (bannerStores.length === 0) return null;

  const currentStore = bannerStores[currentIndex];

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
                src={currentStore.bannerUrl} 
                alt={currentStore.name}
                fill
                className="object-cover"
                unoptimized
             />
             <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center p-6">
                 <div className="bg-white/10 backdrop-blur-md w-fit p-4 rounded-2xl border border-white/20">
                     <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-lg" style={{ color: currentStore.color }}>
                            {currentStore.logoEmoji}
                        </div>
                        <span className="text-white/80 text-xs font-bold uppercase tracking-wider">{currentStore.isOfficial ? 'Official Store' : 'Partner Store'}</span>
                     </div>
                     <h3 className="text-white font-extrabold text-2xl leading-tight drop-shadow-md">{currentStore.name}</h3>
                     <p className="text-white/70 text-sm mt-1">{currentStore.description}</p>
                 </div>
             </div>
         </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-4 left-6 flex gap-1.5 z-10">
        {bannerStores.map((_, idx) => (
            <div 
                key={idx} 
                className={`transition-all duration-300 rounded-full h-1.5 ${idx === currentIndex ? 'w-6 bg-[#52C6DA]' : 'w-1.5 bg-white/50'}`} 
            />
        ))}
      </div>
    </div>
  );
};

// Section 3: Categories
const CategorySection = () => {
  const router = useRouter();
  
  return (
    <div className="pl-4">
      <div className="flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-100">
        <BookOpen size={20} className="text-[#52C6DA]"/>
        <h2 className="font-bold text-lg">Kategoriyalar</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pr-4">
        {BOOK_CATEGORIES.map((cat, idx) => {
          const Icon = IconMap[cat.iconName] || BookOpen;
          return (
            <motion.div 
              whileTap={{ scale: 0.95 }}
              key={idx} 
              onClick={() => router.push(`/mobile/components/search?category=${cat.id}&type=sale`)}
              className={`flex-shrink-0 flex flex-col items-center justify-center gap-2 min-w-[85px] h-[95px] bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 cursor-pointer transition-all shadow-sm hover:border-[#52C6DA]/30`}
            >
                <div className={`p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/50 text-[#52C6DA] transition-colors`}>
                    <Icon size={24} />
                </div>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 text-center px-1 line-clamp-1">{cat.label}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// Section 4: New Books
const NewBooksSection = ({ books }) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  return (
    <div className="pl-4">
      <div className="flex justify-between items-center pr-4 mb-4">
        <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">Yangi Kitoblar</h2>
        <span onClick={() => router.push('/mobile/components/search?type=sale')} className="text-[#52C6DA] text-xs font-bold cursor-pointer">Barchasi</span>
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 pr-4">
        {Array.isArray(books) && books.map((book) => (
          <div key={book._id} className="flex-shrink-0 w-[140px] flex flex-col gap-2 group cursor-pointer">
            <div className="w-full h-[190px] relative rounded-xl overflow-hidden premium-shadow bg-slate-100 dark:bg-slate-800" onClick={() => router.push(`/mobile/book/${book._id}`)}>
                 <Image src={book.image || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop"} alt={book.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                 <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase">New</div>
                 
                 <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(book._id);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full shadow-sm z-10"
                >
                  {isFavorite(book._id) ? (
                    <FaHeart className="text-red-500 text-xs" />
                  ) : (
                    <FaRegHeart className="text-slate-400 text-xs" />
                  )}
                </button>
            </div>
            <div className="px-1">
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 line-clamp-1 group-hover:text-[#52C6DA] transition-colors">{book.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(book, 'buy');
                      }}
                      className="flex-1 bg-orange-500 text-white py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter hover:bg-orange-600 shadow-sm transition active:scale-95"
                    >
                      Sotib olish
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(book, 'buy');
                      }}
                      className="p-1.5 bg-slate-50 dark:bg-slate-700/50 text-slate-400 dark:text-slate-300 rounded-lg border border-slate-100 dark:border-slate-700 active:scale-90 transition-transform"
                    >
                      <FaShoppingCart className="text-[10px]" />
                    </button>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Section 5: Weekly Trends
const WeeklyTrendsSection = ({ books }) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  return (
    <div className="px-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={20} className="text-[#52C6DA]"/>
        <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">Hafta Urflari</h2>
      </div>
      <div className="flex flex-col gap-3">
        {Array.isArray(books) && books.map((book) => (
            <div key={book._id} className="flex gap-4 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 premium-shadow active:scale-[0.99] transition-transform cursor-pointer group">
                <div className="w-[80px] h-[110px] flex-shrink-0 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 relative shadow-inner" onClick={() => router.push(`/mobile/book/${book._id}`)}>
                     <Image src={book.image || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop"} alt={book.title} fill className="object-cover" unoptimized />
                     <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(book._id);
                        }}
                        className="absolute top-1.5 right-1.5 p-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full shadow-sm z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        {isFavorite(book._id) ? (
                            <FaHeart className="text-red-500 text-[10px]" />
                        ) : (
                            <FaRegHeart className="text-slate-400 text-[10px]" />
                        )}
                    </button>
                </div>
                <div className="flex flex-col justify-between py-1 flex-1">
                    <div onClick={() => router.push(`/mobile/book/${book._id}`)}>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base leading-snug line-clamp-1">{book.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">{book.author}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-1.5 py-0.5 rounded-md border border-yellow-100 dark:border-yellow-900/30">
                            <Star size={12} className="fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">{book.rating}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(book, 'buy');
                                    router.push('/mobile/components/checkout');
                                }}
                                className="bg-orange-500 text-white px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-tighter hover:bg-orange-600 shadow-sm transition active:scale-95"
                            >
                                Sotib
                            </button>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(book, 'buy');
                                }}
                                className="p-2 bg-slate-50 dark:bg-slate-700/50 text-slate-400 dark:text-slate-300 rounded-xl border border-slate-100 dark:border-slate-700 active:scale-90 transition-transform"
                            >
                                <FaShoppingCart size={12} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

// Section 6: Bestsellers Table
const BestsellerSection = ({ books }) => {
    const router = useRouter();
    return (
        <div className="px-4">
            <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-3">Bestsellerlar top 3</h2>
            <div className="bg-white dark:bg-slate-800 rounded-2xl premium-shadow border border-slate-100 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700">
                        <tr>
                            <th className="p-3 text-xs font-bold text-slate-400 dark:text-slate-500 w-12 text-center">#</th>
                            <th className="p-3 text-xs font-bold text-slate-400 dark:text-slate-500">Kitob</th>
                            <th className="p-3 text-xs font-bold text-slate-400 dark:text-slate-500 text-right">Reyting</th>
                        </tr>
                    </thead>
                    <tbody>
                         {Array.isArray(books) && books.map((book, idx) => (
                             <tr key={book._id} onClick={() => router.push(`/mobile/book/${book._id}`)} className="border-b border-slate-50 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors cursor-pointer">
                                 <td className="p-3 text-center">
                                     <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${idx === 0 ? 'bg-yellow-100 text-yellow-700' : idx === 1 ? 'bg-slate-200 text-slate-600' : 'bg-[#EAE5D8] text-[#8C7B70]'}`}>
                                        {idx + 1}
                                     </span>
                                 </td>
                                 <td className="p-3">
                                     <div className="flex items-center gap-3">
                                         <div className="w-9 h-12 bg-slate-200 dark:bg-slate-700 rounded-md overflow-hidden flex-shrink-0 relative shadow-sm">
                                             <Image src={book.image || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop"} alt={book.title} fill className="object-cover" unoptimized />
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
                                         <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{book.rating}</span>
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
const DiscountSection = ({ books }) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  return (
    <div className="pl-4">
       <div className="flex items-center mb-4">
           <div className="bg-red-500 w-1.5 h-6 rounded-r-full mr-2.5"></div>
           <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">Hammasi (Sotuvda)</h2>
       </div>
       <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 pr-4">
          {Array.isArray(books) && books.map((book) => (
             <div key={book._id} className="relative flex-shrink-0 w-[150px] group cursor-pointer">
                 <div className="w-full h-[200px] relative rounded-xl overflow-hidden premium-shadow bg-slate-100 dark:bg-slate-800">
                     <Image onClick={() => router.push(`/mobile/book/${book._id}`)} src={book.image || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop"} alt={book.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                     <div className="absolute top-0 right-0 bg-[#52C6DA]/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-bl-xl shadow-sm z-10">
                         Sotuvda
                     </div>
                     <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(book._id);
                        }}
                        className="absolute top-2 left-2 p-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full shadow-sm z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        {isFavorite(book._id) ? (
                            <FaHeart className="text-red-500 text-xs" />
                        ) : (
                            <FaRegHeart className="text-slate-400 text-xs" />
                        )}
                    </button>
                 </div>
                 <div className="mt-2 flex flex-col items-center">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 line-clamp-1" onClick={() => router.push(`/mobile/book/${book._id}`)}>{book.title}</h3>
                     <div className="flex flex-col gap-2 w-full px-1 mt-2">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                addToCart(book, 'buy');
                            }}
                            className="w-full bg-orange-500 text-white py-2 rounded-xl text-xs font-black uppercase tracking-tighter hover:bg-orange-600 shadow-sm transition active:scale-95"
                        >
                            Sotib olish
                        </button>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                addToCart(book, 'buy');
                            }}
                            className="w-full bg-slate-50 dark:bg-slate-700/50 text-slate-400 dark:text-slate-300 py-2 rounded-xl border border-slate-100 dark:border-slate-700 text-[10px] font-bold uppercase flex items-center justify-center gap-2 active:scale-95 transition-all"
                        >
                            <FaShoppingCart className="text-[10px]" /> Savatchaga
                        </button>
                     </div>
                 </div>
             </div>
          ))}
       </div>
    </div>
  );
};

export default MarketPage;
