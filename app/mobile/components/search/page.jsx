"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
import {
  BookOpen,
  BookMarked,
  Feather,
  ScrollText,
  Brain,
  MoonStar,
  Sparkles,
  Baby,
  FlaskConical,
  Loader2,
  Book as BookIcon,
  Search,
  Compass,
  History,
  UserCircle,
  Languages,
  LayoutGrid
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { BOOK_CATEGORIES } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/app/CartContext";
import { useFavorites } from "@/app/FavoritesContext";
import { FaHeart, FaRegHeart, FaCartPlus } from "react-icons/fa";

export const dynamic = 'force-dynamic';

// Map icon names to components
const IconMap = {
  BookOpen,
  BookMarked,
  Feather,
  ScrollText,
  Brain,
  MoonStar,
  Sparkles,
  Baby,
  FlaskConical,
  Search,
  Compass,
  History,
  UserCircle,
  Languages,
  LayoutGrid
};

export default function SearchWithCategories() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("category");
  const initialType = searchParams.get("type") || "rent";
  
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCat || "Asosiy");
  const [mode, setMode] = useState(initialType);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const t = searchParams.get("type");
    if (t) setMode(t);
  }, [searchParams]);

  const categories = [
    { id: "Asosiy", label: "Asosiy", icon: BookOpen },
    ...BOOK_CATEGORIES.map(cat => ({
        id: cat.id,
        label: cat.label,
        icon: IconMap[cat.iconName] || BookOpen
    }))
  ];

  const fetchBooks = useCallback(async (query, category, pageNum = 1, append = false) => {
    setLoading(true);
    try {
      const url = new URL("/api/user/search", window.location.origin);
      if (query) url.searchParams.set("q", query);
      if (category && category !== "Asosiy") url.searchParams.set("category", category);
      url.searchParams.set("type", mode); 
      url.searchParams.set("page", pageNum);
      url.searchParams.set("limit", 10);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        if (append) {
          setResults(prev => [...prev, ...data.books]);
        } else {
          setResults(data.books);
        }
        setHasMore(data.pagination.page < data.pagination.pages);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [mode]);

  const debouncedFetch = useRef(
    debounce((q, cat) => {
      setPage(1);
      fetchBooks(q, cat, 1, false);
    }, 500)
  ).current;

  useEffect(() => {
    debouncedFetch(search, activeCategory);
  }, [search, activeCategory, debouncedFetch, mode]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchBooks(search, activeCategory, nextPage, true);
  };

  return (
    <div className="w-full pt-1 px-3 pl-3 mb-6">

      
      {/* Mode Switcher */}
      <div className="flex gap-2 mb-5 px-1">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] shadow-lg border-b-2 transition-all ${
              mode === 'sale' 
              ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white border-orange-700/30 shadow-orange-500/20' 
              : 'bg-gradient-to-br from-[#52C6DA] to-[#3db5c9] text-white border-[#3db5c9]/30 shadow-[#52C6DA]/20'
            }`}
          >
             {mode === 'sale' ? (
               <LayoutGrid className="w-3 h-3" />
             ) : (
               <BookMarked className="w-3 h-3" />
             )}
             {mode === 'sale' ? 'Sotuv Marshi' : 'Ijara Olami'}
          </motion.div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-6 -mx-5 px-5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;

          return (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setActiveCategory(cat.id);
                setSearch("");
                setPage(1);
              }}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
                activeCategory === cat.id
                  ? (mode === 'sale' ? "bg-orange-500 text-white border-transparent shadow-lg shadow-orange-500/20" : "bg-[#52C6DA] text-white border-transparent premium-shadow")
                  : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-700 hover:border-slate-200 premium-tab-shadow"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? "text-white" : "text-slate-500"
                }`}
              />
              {cat.label}
            </motion.button>
          );
        })}
      </div>

      {/* Results Section */}
      <AnimatePresence>
        {(search || activeCategory !== "Asosiy" || mode === 'sale') && (
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-4"
            >
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-gray-800 dark:text-white">
                        {loading ? "Qidirilmoqda..." : ((results?.length || 0) > 0 ? `Natijalar (${results.length})` : "Natija topilmadi")}
                    </h3>
                    {loading && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
                </div>

                <div className="mt-4 px-1 space-y-4 pb-10">
        <AnimatePresence mode="popLayout">
          {Array.isArray(results) && results.map((book, index) => (
            <motion.div
              key={book._id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => router.push(`/mobile/book/${book._id}`)}
              className="flex gap-4 p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 premium-shadow active:scale-[0.98] transition-all cursor-pointer group"
            >
              <div className="w-20 h-28 relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 shadow-inner flex-shrink-0">
                <Image
                  src={book.image || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop"}
                  alt={book.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  unoptimized
                />
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
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm line-clamp-1 group-hover:text-[#52C6DA] transition-colors">{book.title}</h3>
                    <div className="flex items-center gap-1">
                      <FaStar className="text-yellow-400 text-[10px]" />
                      <span className="text-[10px] font-bold text-slate-500">{book.rating}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">{book.author}</p>
                  <span className="inline-block mt-2 px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
                    {book.category}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                   <div className="flex flex-col">
                      <div className="flex items-center gap-1 mb-0.5">
                        <div className={`w-1 h-1 rounded-full ${mode === 'sale' ? 'bg-orange-400' : 'bg-[#52C6DA]'}`} />
                        <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
                          {mode === 'sale' ? 'Sotib Olish' : 'Ijara Haqgi'}
                        </span>
                      </div>
                      <span className={`text-sm font-black tracking-tight ${mode === 'sale' ? 'text-orange-500' : 'text-[#52C6DA]'}`}>
                          {mode === 'sale' ? `${book.price?.toLocaleString()}` : `${book.rentalPrice?.toLocaleString()}`}
                          <span className="text-[10px] ml-0.5 opacity-80 font-bold">UZS</span>
                      </span>
                   </div>
                    <div className="flex gap-2 w-full mt-2">
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           addToCart(book, mode);
                           router.push('/mobile/components/checkout');
                         }}
                         className={`flex-1 py-2.5 ${mode === 'sale' ? 'bg-orange-500 shadow-orange-500/20' : 'bg-[#52C6DA] shadow-cyan-500/20'} text-white text-[10px] font-black uppercase tracking-wider rounded-xl shadow-lg active:scale-95 transition-all`}
                       >
                         {mode === 'sale' ? 'Sotib' : 'Ijara'}
                       </button>
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           addToCart(book, mode);
                         }}
                         className={`p-2.5 bg-slate-50 dark:bg-slate-700 ${mode === 'sale' ? 'text-orange-500' : 'text-[#52C6DA]'} rounded-xl border border-slate-100 dark:border-slate-600 active:scale-90 transition-all`}
                       >
                         <FaCartPlus size={16} />
                       </button>
                    </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {hasMore && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="pt-4 flex justify-center"
           >
              <button 
                onClick={loadMore}
                disabled={loading}
                className="px-8 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 premium-shadow active:scale-95 transition-all flex items-center gap-2"
              >
                {loading ? (
                   <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Yuklanmoqda...
                   </>
                ) : (
                  "Yana yuklash"
                )}
              </button>
           </motion.div>
        )}

        {!loading && (results?.length || 0) === 0 && (search || activeCategory !== "Asosiy") && (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookIcon className="text-slate-300 dark:text-slate-600 w-10 h-10" />
            </div>
            <p className="text-slate-400 dark:text-slate-500 font-bold">Kitob topilmadi</p>
            <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">Boshqa so&apos;z bilan qidirib ko&apos;ring</p>
          </div>
        )}
      </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
