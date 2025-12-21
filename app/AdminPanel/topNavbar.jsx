"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { FaBars, FaMoon, FaSun, FaBell, FaSearch, FaUserCircle, FaBook, FaUser, FaTruck, FaShoppingCart, FaHistory } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function TopNavbar({
  darkMode,
  setDarkMode,
  sidebarOpen,
  setSidebarOpen,
}) {
  const router = useRouter();
  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    fetchNotifications();

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      // 1. Fetch System Notifications
      const resNotif = await fetch('/api/notifications');
      const dataNotif = await resNotif.json();
      
      // 2. Fetch Contact Messages (BildirishNomalar)
      const resContact = await fetch('/api/contact');
      const dataContact = await resContact.json();

      let combined = [];
      let totalUnread = 0;

      if (dataNotif.success) {
        combined = [...dataNotif.data.map(n => ({ ...n, source: 'system' }))];
        totalUnread += dataNotif.unread;
      }

      if (dataContact.success) {
        // Convert contact messages to notification format
        const contacts = dataContact.data.map(c => ({
          _id: c._id,
          title: `Xabar: ${c.name}`,
          message: c.message,
          type: c.type === 'complaint' ? 'error' : (c.type === 'suggestion' ? 'warning' : 'info'),
          isRead: c.status !== 'unread',
          createdAt: c.createdAt,
          source: 'contact'
        }));
        combined = [...combined, ...contacts];
        totalUnread += dataContact.data.filter(m => m.status === 'unread').length;
      }

      // Sort by date
      combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setNotifications(combined.slice(0, 15)); // Show last 15
      setUnreadCount(totalUnread);
    } catch (e) { 
      console.error("Fetch Notif Error:", e); 
    }
  };

  const markAllAsRead = async () => {
    try {
      // Mark system notifs as read
      await fetch('/api/notifications', { method: 'PUT', body: JSON.stringify({}) });
      
      // Mark contact messages as read (This API takes updates object)
      // Note: This API might need to be called per ID or mark all. 
      // Based on route.js, PUT marks specific ID. We'll mark what's visible.
      const unreadContacts = notifications.filter(n => n.source === 'contact' && !n.isRead);
      for (const c of unreadContacts) {
        await fetch('/api/contact', { 
            method: 'PUT', 
            body: JSON.stringify({ id: c._id, updates: { status: 'read' } }) 
        });
      }

      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success("Barcha xabarlar o'qildi");
    } catch (e) { console.error(e); }
  };

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          const res = await fetch(`/api/admin/search?q=${encodeURIComponent(searchQuery)}`);
          const data = await res.json();
          if (data.success) {
            setSearchResults(data.results);
            setShowResults(true);
          }
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults(null);
        setShowResults(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const currentDate = !mounted ? "" : new Date().toLocaleDateString("uz-UZ", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleResultClick = (href) => {
    router.push(href);
    setShowResults(false);
    setSearchQuery("");
  };

  return (
    <div
      className={`sticky top-0 z-30 px-6 py-4 transition-all duration-300 backdrop-blur-md ${
        darkMode 
          ? "bg-[#163201]/90 border-b border-[#A3ED96]/20 shadow-lg shadow-black/20" 
          : "bg-white/80 border-b border-gray-100 shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Toggle & Title/Date */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-xl transition-all duration-300 lg:hidden ${
              darkMode 
                ? "text-[#A3ED96] hover:bg-[#A3ED96]/10" 
                : "text-[#163201] hover:bg-gray-100"
            }`}
          >
            <FaBars className="text-xl" />
          </button>

          <div className="hidden md:block">
            <h2 className={`text-lg font-bold tracking-tight ${darkMode ? "text-white" : "text-[#163201]"}`}>
              Boshqaruv Paneli
            </h2>
            <p className={`text-xs font-medium ${darkMode ? "text-[#A3ED96]" : "text-gray-500"}`}>
              {currentDate}
            </p>
          </div>
        </div>

        {/* Center: Search Bar (Desktop) */}
        <div className="flex-1 max-w-xl mx-4 hidden sm:block relative group" ref={searchRef}>
          <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${
            darkMode ? "text-[#A3ED96]/50 group-focus-within:text-[#A3ED96]" : "text-gray-400 group-focus-within:text-[#163201]"
          }`}>
            <FaSearch />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
            placeholder="Qidirish... (Kitoblar, Foydalanuvchilar, Kuryerlar)"
            className={`w-full py-3 pl-11 pr-4 rounded-xl text-sm font-medium transition-all duration-300 outline-none border-2 ${
              darkMode 
                ? "bg-[#163201] border-[#A3ED96]/20 text-white placeholder-[#A3ED96]/30 focus:border-[#A3ED96] focus:shadow-[0_0_15px_-3px_rgba(163,237,150,0.3)]" 
                : "bg-gray-50 border-transparent text-gray-800 focus:bg-white focus:border-[#163201]/20 focus:shadow-lg"
            }`}
          />

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`absolute top-full mt-2 left-0 right-0 rounded-2xl shadow-2xl border overflow-hidden max-h-[500px] overflow-y-auto ${
                  darkMode ? "bg-[#163201] border-[#A3ED96]/20 text-white" : "bg-white border-gray-100 text-gray-800"
                }`}
              >
                {isSearching && (
                    <div className="p-4 text-center text-sm opacity-50 italic">Qidirilmoqda...</div>
                )}

                {!isSearching && searchResults && (
                  <div className="p-2 space-y-4">
                    {/* Kitoblar */}
                    {searchResults.books.length > 0 && (
                      <div>
                        <h3 className="px-3 text-[10px] font-black uppercase tracking-widest text-[#A3ED96] mb-2 opacity-70">Kitoblar</h3>
                        <div className="space-y-1">
                          {searchResults.books.map(book => (
                            <button key={book._id} onClick={() => handleResultClick('/AdminPanel/Kitoblar')} className={`w-full text-left p-2 rounded-xl flex items-center gap-3 transition-colors ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                                <div className="w-8 h-8 rounded-lg bg-[#A3ED96]/20 flex items-center justify-center text-[#A3ED96] shrink-0">
                                    <FaBook size={14} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold line-clamp-1">{book.title}</p>
                                    <p className="text-[10px] opacity-60">{book.author}</p>
                                </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Foydalanuvchilar */}
                    {searchResults.users.length > 0 && (
                      <div>
                        <h3 className="px-3 text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2 opacity-70">Mijozlar</h3>
                        {searchResults.users.map(user => (
                          <button key={user._id} onClick={() => handleResultClick('/AdminPanel/Foydalanuvchilar')} className={`w-full text-left p-2 rounded-xl flex items-center gap-3 transition-colors ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                               <div className="w-8 h-8 rounded-lg bg-blue-400/20 flex items-center justify-center text-blue-400 shrink-0">
                                   <FaUser size={14} />
                               </div>
                               <div>
                                   <p className="text-sm font-bold">{user.fullName || user.email}</p>
                                   <p className="text-[10px] opacity-60">{user.email}</p>
                               </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Kuryerlar */}
                    {searchResults.couriers.length > 0 && (
                      <div>
                        <h3 className="px-3 text-[10px] font-black uppercase tracking-widest text-purple-400 mb-2 opacity-70">Kuryerlar</h3>
                        {searchResults.couriers.map(c => (
                          <button key={c._id} onClick={() => handleResultClick('/AdminPanel/kurierlar')} className={`w-full text-left p-2 rounded-xl flex items-center gap-3 transition-colors ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                               <div className="w-8 h-8 rounded-lg bg-purple-400/20 flex items-center justify-center text-purple-400 shrink-0">
                                   <FaTruck size={14} />
                               </div>
                               <div>
                                   <p className="text-sm font-bold">{c.fullName || c.email}</p>
                                   <p className="text-[10px] opacity-60">{c.role}</p>
                               </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Buyurtmalar */}
                    {searchResults.orders.length > 0 && (
                      <div>
                        <h3 className="px-3 text-[10px] font-black uppercase tracking-widest text-orange-400 mb-2 opacity-70">Buyurtma & Ijara</h3>
                        {searchResults.orders.map((o, i) => (
                          <button key={i} onClick={() => handleResultClick(o.type === 'order' ? '/AdminPanel/sotuvdagiKitoblar' : '/AdminPanel/rentRequest')} className={`w-full text-left p-2 rounded-xl flex items-center gap-3 transition-colors ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                               <div className="w-8 h-8 rounded-lg bg-orange-400/20 flex items-center justify-center text-orange-400 shrink-0">
                                   <FaShoppingCart size={14} />
                               </div>
                               <div>
                                   <p className="text-sm font-bold">{o.customer?.name || o.fullName}</p>
                                   <p className="text-[10px] opacity-60">Summa: {o.totalPrice?.toLocaleString()} so'm • {o.status}</p>
                               </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {Object.values(searchResults).every(arr => arr.length === 0) && (
                        <div className="p-10 text-center text-sm opacity-50 italic flex flex-col items-center gap-3">
                            <FaSearch className="text-2xl" />
                            Natija topilmadi
                        </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-3">
          {/* Search Toggle (Mobile) */}
          <button className={`sm:hidden p-2.5 rounded-xl transition-colors ${
            darkMode ? "text-[#A3ED96] hover:bg-[#A3ED96]/10" : "text-gray-600 hover:bg-gray-100"
          }`}>
             <FaSearch size={18} />
          </button>

          {/* Theme Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2.5 rounded-xl transition-all shadow-sm ${
              darkMode 
                ? "bg-[#A3ED96]/10 text-[#A3ED96] hover:bg-[#A3ED96]/20" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
          </motion.button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-2.5 rounded-xl transition-all shadow-sm ${
                darkMode 
                    ? "bg-[#163201] text-[#A3ED96] hover:bg-[#A3ED96]/10 border border-[#A3ED96]/20" 
                    : "bg-white text-[#163201] hover:bg-gray-50 border border-gray-100"
              }`}
            >
              <FaBell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className={`absolute right-0 mt-3 w-80 md:w-96 rounded-2xl shadow-2xl border overflow-hidden ${
                    darkMode ? "bg-[#163201] border-[#A3ED96]/20" : "bg-white border-gray-100"
                  }`}
                >
                  <div className={`p-4 border-b flex justify-between items-center ${darkMode ? "border-[#A3ED96]/10" : "border-gray-100"}`}>
                    <h3 className={`font-black ${darkMode ? "text-white" : "text-gray-800"}`}>Bildirishnomalar</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-[10px] font-bold uppercase tracking-widest text-[#A3ED96] hover:underline"
                      >
                        Hammasini o'qildi
                      </button>
                    )}
                  </div>

                  <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                    {notifications.length > 0 ? (
                      notifications.map(notif => (
                        <div 
                          key={notif._id} 
                          className={`p-4 border-b transition-colors cursor-pointer group ${
                            darkMode ? "border-[#A3ED96]/5 hover:bg-white/5" : "border-gray-50 hover:bg-gray-50"
                          } ${!notif.isRead ? (darkMode ? "bg-[#A3ED96]/5" : "bg-blue-50/50") : ""}`}
                        >
                          <div className="flex gap-3">
                            <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                              notif.type === 'warning' ? 'bg-yellow-500/20 text-yellow-500' :
                              notif.type === 'error' ? 'bg-red-500/20 text-red-500' :
                              notif.type === 'success' ? 'bg-green-500/20 text-green-500' :
                              'bg-blue-500/20 text-blue-500'
                            }`}>
                               <FaBell size={12} />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <p className={`text-sm font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{notif.title}</p>
                                {notif.source === 'contact' && (
                                    <span className="text-[8px] bg-blue-500/10 text-blue-500 px-1 rounded font-bold uppercase">Xabar</span>
                                )}
                              </div>
                              <p className={`text-xs mt-1 line-clamp-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{notif.message}</p>
                              <p className="text-[10px] opacity-40 mt-2">
                                {new Date(notif.createdAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })} • {new Date(notif.createdAt).toLocaleDateString('uz-UZ')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-10 text-center opacity-40">
                        <FaBell size={24} className="mx-auto mb-3" />
                        <p className="text-sm">Hozircha bildirishnomalar yo'q</p>
                      </div>
                    )}
                  </div>
                  
                  <div className={`p-3 text-center border-t ${darkMode ? "border-[#A3ED96]/10" : "border-gray-100"}`}>
                    <button 
                      onClick={() => { handleResultClick('/AdminPanel/BildirishNomalar'); setShowNotifications(false); }}
                      className="text-xs font-bold text-[#A3ED96] hover:opacity-80 transition-all flex items-center justify-center gap-2 mx-auto"
                    >
                      Barchasini ko'rish <FaHistory size={10} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
