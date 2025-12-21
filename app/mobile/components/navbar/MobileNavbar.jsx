"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaBookOpen, FaRegBell, FaSearch, FaStar } from "react-icons/fa";
import { Search, X, Moon, Sun, MoreVertical, LogOut, Globe, Settings, Book as BookIcon, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { useSession, signOut } from "next-auth/react";
import Pusher from "pusher-js";

export default function MobileNavbar() {
  const { data: session } = useSession();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ books: [], people: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  // Focus input when opened
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Click outside to close results
  useEffect(() => {
    const handleClickOutside = (event) => {
        if (resultsRef.current && !resultsRef.current.contains(event.target)) {
            setShowResults(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce search
  useEffect(() => {
    if (searchQuery.length < 2) {
        setSearchResults({ books: [], people: [] });
        setShowResults(false);
        return;
    }

    const timer = setTimeout(async () => {
        setIsSearching(true);
        try {
            const res = await fetch(`/api/user/search?q=${encodeURIComponent(searchQuery)}`);
            const data = await res.json();
            if (data.success) {
                setSearchResults({
                    books: data.books || [],
                    people: data.people || []
                });
                setShowResults(true);
            }
        } catch (error) {
            console.error("Mobile search error:", error);
        } finally {
            setIsSearching(false);
        }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Unread Count and Pusher Subscription
  useEffect(() => {
    if (!session?.user?.id) return;

    // Fetch initial count
    const fetchUnread = async () => {
        try {
            const res = await fetch('/api/notifications');
            const data = await res.json();
            if (data.success) {
                setUnreadCount(data.unread || 0);
            }
        } catch (error) {
            console.error(error);
        }
    };
    fetchUnread();

    // Pusher Subscription
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!pusherKey) return;

    const pusher = new Pusher(pusherKey, {
        cluster: pusherCluster,
    });

    const channel = pusher.subscribe(`user-${session.user.id}`);

    const handleNewNotification = (data) => {
        setUnreadCount(prev => prev + 1);
    };

    channel.bind("new-notification", handleNewNotification);
    channel.bind("status-update", handleNewNotification); // Also increment for status updates

    return () => {
        pusher.unsubscribe(`user-${session.user.id}`);
        pusher.disconnect();
    };
  }, [session]);

  const handleResultClick = (id, type = 'book') => {
      setIsSearchOpen(false);
      setSearchQuery("");
      setShowResults(false);
      
      if (type === 'people') {
          router.push(`/mobile/components/my-books?userId=${id}`);
      } else {
          router.push(`/mobile/book/${id}`);
      }
  };

  return (
    <header 
      className="sticky top-0 z-[100] bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl px-5 py-3 h-[72px] flex justify-between items-center shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-none border-b border-slate-100/50 dark:border-slate-800/50 transition-all duration-300 relative"
      onClick={() => setShowSettingsMenu(false)}
    >
      
      <AnimatePresence mode="wait">
        {!isSearchOpen ? (
          /* Logo & Brand Section */
          <motion.div 
            key="logo"
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }} 
            className="flex flex-col" 
          >
            <span className="text-[22px] font-extrabold text-[#52C6DA] tracking-tight leading-none">
                Kitobdosh
            </span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase mt-0.5">
                Mobil Ilova
            </span>
          </motion.div>
        ) : (
          /* Animated Search Input Section */
          <motion.div 
            key="search"
            initial={{ opacity: 0, width: "0%" }} 
            animate={{ opacity: 1, width: "100%" }}
            exit={{ opacity: 0, width: "0%" }} 
            className="flex-1 flex items-center gap-3 relative"
          >
             <div className="relative w-full">
                <input 
                    ref={inputRef}
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Kitob yoki muallif..." 
                    className="w-full pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#52C6DA]/20 transition-all placeholder:text-slate-400" 
                />
                {isSearching ? (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[#52C6DA] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52C6DA] w-5 h-5" />
                )}
             </div>

             {/* Search Results Dropdown */}
             <AnimatePresence>
                {(showResults && isSearchOpen) && (
                    <motion.div 
                        ref={resultsRef}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden max-h-[60vh] overflow-y-auto z-50 px-2"
                    >
                        {(searchResults?.books?.length > 0 || searchResults?.people?.length > 0) ? (
                            <div className="p-2 space-y-4">
                                {/* --- Books Section --- */}
                                {searchResults?.books?.length > 0 && (
                                    <div>
                                        <div className="px-3 py-2">
                                            <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Kitoblar</h5>
                                        </div>
                                        <div className="space-y-1">
                                            {Array.isArray(searchResults.books) && searchResults.books.map((book) => (
                                                <button 
                                                    key={book._id}
                                                    onClick={() => handleResultClick(book._id)}
                                                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
                                                >
                                                    <div className="w-12 h-16 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden flex-shrink-0 relative">
                                                        {book.image ? (
                                                            <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <BookIcon className="absolute inset-0 m-auto text-slate-300" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{book.title}</h4>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{book.author}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className="flex items-center gap-0.5 text-yellow-500">
                                                                <FaStar size={10} />
                                                                <span className="text-[10px] font-bold">{book.rating}</span>
                                                            </div>
                                                            <span className="text-[10px] text-[#52C6DA] font-bold">{book.price?.toLocaleString()} so'm</span>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {searchResults?.people?.length > 0 && (
                                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700/50">
                                        <div className="px-3 py-2">
                                            <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Odamlar</h5>
                                        </div>
                                        <div className="space-y-1">
                                            {Array.isArray(searchResults.people) && searchResults.people.map((person) => (
                                                <button 
                                                    key={person._id}
                                                    onClick={() => handleResultClick(person._id, 'people')}
                                                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex-shrink-0 relative">
                                                        {person.avatar ? (
                                                            <img src={person.avatar} alt={person.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#52C6DA] to-blue-500 text-white font-bold text-xs">
                                                                {person.name?.[0]?.toUpperCase() || <User size={18} />}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{person.name}</h4>
                                                        <div className="flex items-center gap-1.5">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${person.type === 'author' ? 'bg-orange-400' : 'bg-[#52C6DA]'}`} />
                                                            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-tighter">
                                                                {person.type === 'author' ? 'Muallif' : 'Kitobxon'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-10 text-center text-slate-400">
                                <Search size={32} className="mx-auto mb-2 opacity-20" />
                                <p className="text-sm">Hech narsa topilmadi</p>
                                <p className="text-[10px] mt-1">Boshqa kalit so'z sinab ko'ring</p>
                            </div>
                        )}
                    </motion.div>
                )}
             </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right Actions Section */}
      <div className="flex items-center gap-3 pl-4"> 
        


        {/* Toggle Search Button */}
        <AnimatePresence mode="wait">
             {isSearchOpen ? (
                 <motion.button 
                    key="close"
                    initial={{ scale: 0, rotate: -90 }} 
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 90 }} 
                    onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                        setShowResults(false);
                    }}
                    className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 active:scale-95 transition-all" 
                 >
                     <X className="w-5 h-5" />
                 </motion.button>
             ) : (
                 <motion.button 
                    key="open"
                    initial={{ scale: 0, rotate: 90 }} 
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: -90 }} 
                    onClick={() => setIsSearchOpen(true)}
                    className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-lg shadow-slate-100 dark:shadow-none flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-[#52C6DA] active:scale-95 transition-all" 
                 >
                     <Search className="w-5 h-5" />
                 </motion.button>
             )}
        </AnimatePresence>

        {!isSearchOpen && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3"
            >
                <Link href="/mobile/components/notification" prefetch={true}>
                    <button className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-sm relative transition-colors">
                        <FaRegBell className="text-lg" />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-800 animate-pulse"></span>
                        )}
                    </button>
                </Link>

                <div className="relative">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowSettingsMenu(!showSettingsMenu);
                        }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${showSettingsMenu ? 'bg-[#52C6DA] border-[#52C6DA] text-white shadow-lg shadow-[#52C6DA]/30' : 'bg-[#52C6DA]/10 border-[#52C6DA]/20 text-[#52C6DA]'}`}
                    >
                        <MoreVertical size={20} />
                    </button>

                    {/* Settings Menu */}
                    <AnimatePresence>
                        {showSettingsMenu && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-0 top-12 z-50 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden"
                            >
                                <div className="p-1">
                                    <button className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl transition-colors text-left">
                                        <Globe size={18} className="text-gray-400 dark:text-slate-500" />
                                        <span>Tilni o&apos;zgartirish</span>
                                    </button>
                                    <button 
                                        onClick={toggleTheme}
                                        className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl transition-colors text-left"
                                    >
                                        {theme === 'dark' ? (
                                            <>
                                                <Sun size={18} className="text-gray-400 dark:text-slate-500" />
                                                <span>Yorug&apos; rejim</span>
                                            </>
                                        ) : (
                                            <>
                                                <Moon size={18} className="text-gray-400 dark:text-slate-500" />
                                                <span>Tungi rejim</span>
                                            </>
                                        )}
                                    </button>
                                    <button className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl transition-colors text-left">
                                        <Settings size={18} className="text-gray-400 dark:text-slate-500" />
                                        <span>Sozlamalar</span>
                                    </button>
                                    <div className="my-1 border-t border-gray-100 dark:border-slate-700"></div>
                                    <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full flex items-center gap-3 px-3 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors text-left">
                                        <LogOut size={18} />
                                        <span>Chiqish</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        )}
      </div>
    </header>
  );
}
