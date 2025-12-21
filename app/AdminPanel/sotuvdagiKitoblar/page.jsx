"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaBook, FaPlus, FaShoppingCart, FaStore, FaChartLine, FaStart, FaEdit, FaTrash, FaSearch, FaFilter, FaTruck, FaMapMarkerAlt, FaPhone, FaUser, FaCheck, FaTimes, FaBox } from "react-icons/fa";
import { delay, motion, AnimatePresence } from "framer-motion";
import { useAdmin } from "../AdminContext";
import toast from "react-hot-toast";

// --- SKELETON COMPONENTS ---

const StatSkeleton = ({ darkMode }) => (
    <div className={`p-6 rounded-2xl border animate-pulse
        ${darkMode ? "bg-white/5 border-white/5" : "bg-gray-100 border-gray-200"}
    `}>
        <div className="flex justify-between items-center">
             <div className="space-y-3">
                 <div className={`h-4 w-24 rounded ${darkMode ? "bg-white/10" : "bg-gray-300"}`}></div>
                 <div className={`h-8 w-16 rounded ${darkMode ? "bg-white/10" : "bg-gray-300"}`}></div>
             </div>
             <div className={`w-12 h-12 rounded-xl ${darkMode ? "bg-white/10" : "bg-gray-300"}`}></div>
        </div>
    </div>
);

const CardSkeleton = ({ darkMode }) => (
    <div className={`rounded-2xl border overflow-hidden animate-pulse
        ${darkMode ? "bg-white/5 border-white/5" : "bg-white border-gray-100"}
    `}>
        <div className={`h-48 w-full ${darkMode ? "bg-white/5" : "bg-gray-200"}`} />
        <div className="p-4 space-y-3">
            <div className={`h-6 w-3/4 rounded ${darkMode ? "bg-white/10" : "bg-gray-200"}`} />
            <div className={`h-4 w-1/2 rounded ${darkMode ? "bg-white/10" : "bg-gray-200"}`} />
            <div className="flex justify-between pt-2">
                <div className={`h-8 w-20 rounded-lg ${darkMode ? "bg-white/10" : "bg-gray-200"}`} />
                <div className={`h-8 w-8 rounded-full ${darkMode ? "bg-white/10" : "bg-gray-200"}`} />
            </div>
        </div>
    </div>
);

// --- REAL COMPONENTS ---

const StatCard = ({ title, value, icon: Icon, color, darkMode }) => {
    const bgClass = darkMode ? "bg-[#163201]/40" : "bg-white";
    const borderClass = darkMode ? "border-[#A3ED96]/20" : "border-gray-100";
    const textClass = darkMode ? "text-white" : "text-gray-900";
    const iconBg = darkMode ? "bg-[#A3ED96]/20" : `bg-${color}-100`;
    const iconColor = darkMode ? "text-[#A3ED96]" : `text-${color}-600`;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className={`p-6 rounded-2xl border backdrop-blur-sm transition-all shadow-sm ${bgClass} ${borderClass}`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className={`text-sm font-medium mb-1 ${darkMode ? "text-[#A3ED96]/70" : "text-gray-500"}`}>{title}</p>
                    <h3 className={`text-3xl font-black ${textClass}`}>{value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-lg ${iconBg} ${iconColor}`}>
                    <Icon />
                </div>
            </div>
        </motion.div>
    );
};

const OrderCard = ({ order, darkMode, onUpdateStatus }) => {
    const isRegistered = !!order.user;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-5 rounded-2xl border mb-4 relative overflow-hidden
                ${darkMode ? "bg-[#163201]/40 border-[#A3ED96]/20" : "bg-white border-gray-100 shadow-sm"}
            `}
        >
            <div className="flex flex-col md:flex-row justify-between gap-4">
                {/* Customer Info */}
                <div className="flex items-start gap-4">
                     <div 
                        title={isRegistered ? "Ro'yxatdan o'tgan foydalanuvchi" : "Mehmon (Ro'yxatdan o'tmagan)"}
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 relative group cursor-help
                         ${isRegistered 
                            ? (darkMode ? "bg-[#A3ED96]/20 text-[#A3ED96]" : "bg-blue-100 text-blue-600") 
                            : (darkMode ? "bg-white/10 text-gray-400" : "bg-gray-100 text-gray-500")
                         }
                     `}>
                         <FaUser />
                         {isRegistered && (
                             <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-[#163201] flex items-center justify-center">
                                 <FaCheck className="text-[8px] text-white" />
                             </span>
                         )}
                     </div>
                     <div>
                         <h4 className={`font-bold text-lg ${darkMode ? "text-white" : "text-gray-900"}`}>
                             {order.customer.name}
                             {!isRegistered && <span className="text-xs font-normal text-gray-400 ml-2">(Mehmon)</span>}
                         </h4>
                         <div className={`flex flex-col gap-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                             <div className="flex items-center gap-2">
                                 <FaPhone className="text-xs" /> {order.customer.phone}
                             </div>
                             <div className="flex items-center gap-2">
                                 <FaMapMarkerAlt className="text-xs" /> {order.customer.address}
                             </div>
                             {order.deliveryMethod === 'standard' && (
                                 <div className="flex items-center gap-2 text-blue-500 font-bold">
                                     <FaTruck className="text-xs" /> Yetkazib berish (20,000 so'm)
                                 </div>
                             )}
                              {order.deliveryMethod === 'pickup' && (
                                 <div className="flex items-center gap-2 text-green-500 font-bold">
                                     <FaStore className="text-xs" /> Olib ketish
                                 </div>
                             )}
                         </div>
                     </div>
                </div>

                {/* Items & Total */}
                <div className="flex-1 md:pl-8 md:border-l border-dashed border-gray-200/20">
                    <h5 className={`text-xs font-bold uppercase mb-2 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Buyurtma Tarkibi</h5>
                    <div className="space-y-2 mb-4">
                        {order.items.filter(i => i.type === 'buy' || !i.type).map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <span className={`w-5 h-5 flex items-center justify-center rounded text-xs font-bold ${darkMode ? "bg-white/10 text-white" : "bg-gray-100 text-gray-700"}`}>
                                        {item.quantity}x
                                    </span>
                                    <span className={darkMode ? "text-gray-300" : "text-gray-700"}>{item.title}</span>
                                </div>
                                <span className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{item.price.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-200/20">
                        <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Jami To'lov</span>
                        <span className={`text-xl font-black ${darkMode ? "text-[#A3ED96]" : "text-[#163201]"}`}>
                            {order.totalPrice.toLocaleString()} <span className="text-sm opacity-50">so'm</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className={`mt-4 pt-4 border-t ${darkMode ? "border-white/5" : "border-gray-100"} flex justify-end gap-3`}>
                 <span className={`px-3 py-2 rounded-lg text-xs font-bold mr-auto flex items-center gap-2
                    ${order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 
                      order.status === 'processing' ? 'bg-blue-500/10 text-blue-500' :
                      order.status === 'completed' ? 'bg-green-500/10 text-green-500' : 
                      order.status === 'cancelled' ? 'bg-red-500/10 text-red-500' : 'bg-gray-500/10 text-gray-500'}
                 `}>
                    <span className={`w-2 h-2 rounded-full ${order.status === 'pending' ? 'bg-yellow-500' : order.status === 'processing' ? 'bg-blue-500' : order.status === 'completed' ? 'bg-green-500' : order.status === 'cancelled' ? 'bg-red-500' : 'bg-gray-500'}`} />
                    {order.status === 'completed' ? 'Yetkazildi' : order.status === 'processing' ? 'Kuryerda' : order.status === 'cancelled' ? 'Bekor qilindi' : order.status.toUpperCase()}
                 </span>

                 {order.status === 'pending' && (
                     <>
                        <button 
                            onClick={() => onUpdateStatus(order._id, 'cancelled')}
                            className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${darkMode ? "border-white/10 hover:bg-white/5 text-white" : "border-gray-200 hover:bg-gray-50 text-gray-700"}`}
                        >
                             <FaTimes className="inline mr-2" /> Bekor qilish
                        </button>
                        <button 
                            onClick={() => onUpdateStatus(order._id, 'processing')}
                            className={`px-4 py-2 rounded-xl text-sm font-bold text-white transition-colors bg-[#163201] hover:bg-[#163201]/90`}
                        >
                             <FaCheck className="inline mr-2" /> Tasdiqlash (Kuryerga)
                        </button>
                     </>
                 )}
            </div>
        </motion.div>
    )
}

import Pusher from "pusher-js";

export default function BooksAndOrdersPage() {
  const { darkMode } = useAdmin();
  const [activeTab, setActiveTab] = useState('books'); // 'books' or 'orders'
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);

  // Fetch Data
  const fetchData = async () => {
     setLoading(true);
     try {
         // Fetch Books
         const booksRes = await fetch('/api/books');
         const booksData = await booksRes.json();
         if(booksData.success) setBooks(booksData.data);

         // Fetch Orders
         const ordersRes = await fetch('/api/order');
         const ordersData = await ordersRes.json();
         if(ordersData.success) {
             // Filter only orders that have at least one 'buy' item
             const buyOrders = ordersData.data.filter(o => 
                 o.items.some(item => item.type === 'buy' || !item.type) // !item.type is for legacy orders
             );
             setOrders(buyOrders);
         }

     } catch (error) {
         console.error("Error fetching data:", error);
         toast.error("Ma'lumotlarni yuklashda xatolik");
     } finally {
         setLoading(false);
     }
  };

  useEffect(() => {
    fetchData();

    // Pusher Subscription
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (pusherKey) {
        const pusher = new Pusher(pusherKey, {
            cluster: pusherCluster,
        });

        const channel = pusher.subscribe("admin-channel");

        channel.bind("new-order", (data) => {
            // Play notification sound
            const audio = new Audio('/sounds/notification.mp3'); // Ensure this file exists or remove
            audio.play().catch(e => console.log("Audio play failed", e));
            
            toast.custom((t) => (
                <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white dark:bg-[#163201] shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 border border-[#A3ED96]`}>
                    <div className="flex-1 w-0 p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 pt-0.5">
                                <div className="h-10 w-10 bg-[#A3ED96] rounded-full flex items-center justify-center text-[#163201]">
                                    <FaShoppingCart />
                                </div>
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                    {data.message}
                                </p>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                                    Mijoz: {data.customer} <br/>
                                    Summa: {data.totalPrice?.toLocaleString()} so'm
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ));

            // Refresh orders list
            fetchOrdersOnly();
            setActiveTab('orders'); // Auto switch tab to show new order
        });

        return () => {
            pusher.unsubscribe("admin-channel");
        };
    }
  }, []);

  // Helper to refresh only orders quietly
  const fetchOrdersOnly = async () => {
      try {
          const res = await fetch('/api/order');
          const data = await res.json();
          if(data.success) setOrders(data.data);
      } catch(e) { console.error(e) }
  };

  const updateOrderStatus = async (id, status) => {
      const toastId = toast.loading('Yangilanmoqda...');
      try {
          const res = await fetch('/api/order', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id, status })
          });
          const data = await res.json();
          if(data.success) {
              toast.success("Holat o'zgartirildi", { id: toastId });
              fetchData(); // Refresh list
          } else {
              toast.error(data.message, { id: toastId });
          }
      } catch (error) {
          toast.error("Xatolik", { id: toastId });
      }
  };

  const filteredBooks = books.filter(book => 
      (filterCategory === 'all' || book.category === filterCategory) &&
      (book.title?.toLowerCase().includes(searchQuery.toLowerCase()) || book.author?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={`w-full min-w-0 transition-colors duration-300 ${darkMode ? "bg-[#0b1a00] text-white" : "bg-[#f8fafc] text-[#163201]"}`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div>
            <h1 className={`text-3xl font-black mb-2 flex items-center gap-3 ${darkMode ? "text-white" : "text-[#163201]"}`}>
                {activeTab === 'books' ? <FaStore className="text-[#A3ED96]" /> : <FaShoppingCart className="text-[#A3ED96]" />}
                {activeTab === 'books' ? 'Sotuvdagi Kitoblar' : 'Buyurtmalar'}
            </h1>
            <p className={`text-sm font-medium ${darkMode ? "text-[#A3ED96]/60" : "text-gray-500"}`}>
                {activeTab === 'books' ? "Do'koningizdagi barcha kitoblar nazorati" : "Yangi kelib tushgan buyurtmalar"}
            </p>
          </div>
          
          <div className={`flex p-1 rounded-xl overflow-x-auto max-w-full ${darkMode ? "bg-white/10" : "bg-gray-200"}`}>
               <button 
                  onClick={() => setActiveTab('books')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'books' ? (darkMode ? "bg-[#A3ED96] text-[#163201]" : "bg-white text-[#163201] shadow-sm") : "text-gray-500"}`}
               >
                   Kitoblar ({books.length})
               </button>
               <button 
                  onClick={() => setActiveTab('orders')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'orders' ? (darkMode ? "bg-[#A3ED96] text-[#163201]" : "bg-white text-[#163201] shadow-sm") : "text-gray-500"}`}
               >
                   Buyurtmalar ({orders.length})
               </button>
          </div>

          {activeTab === 'books' && (
              <button 
                onClick={() => setShowModal(true)}
                className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95
                ${darkMode 
                    ? "bg-[#A3ED96] text-[#163201]" 
                    : "bg-[#163201] text-white"
                }
             `}>
                 <FaPlus /> Yangi Kitob
             </button>
          )}
      </div>

      {loading ? (
        <div className="space-y-8">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                 {[1,2,3,4].map(i => <StatSkeleton key={i} darkMode={darkMode} />)}
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 {[1,2,3,4,5,6,7,8].map(i => <CardSkeleton key={i} darkMode={darkMode} />)}
             </div>
        </div>
      ) : (
        <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard title="Jami Kitoblar" value={books.length} icon={FaBook} color="blue" darkMode={darkMode} />
                <StatCard title="Buyurtmalar" value={orders.length} icon={FaShoppingCart} color="green" darkMode={darkMode} />
                <StatCard title="Sotilgan (Jami)" value={orders.reduce((acc, o) => acc + o.items.reduce((sum, i) => sum + i.quantity, 0), 0)} icon={FaChartLine} color="purple" darkMode={darkMode} />
                <StatCard title="Tushum" value={`${(orders.reduce((acc, o) => acc + o.totalPrice, 0) / 1000000).toFixed(1)}m`} icon={FaStore} color="orange" darkMode={darkMode} />
            </div>

            {/* --- BOOKS VIEW --- */}
            {activeTab === 'books' && (
                <>
                    {/* Filter Toolbar */}
                    <div className={`p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between border w-full overflow-hidden
                        ${darkMode ? "bg-[#163201]/40 border-[#A3ED96]/10" : "bg-white border-gray-100 shadow-sm"}
                    `}>
                        <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                             {["all", ...new Set(books.map(b => b.category))].map(cat => (
                                 <button
                                    key={cat}
                                    onClick={() => setFilterCategory(cat)}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors
                                        ${filterCategory === cat
                                            ? (darkMode ? "bg-[#A3ED96] text-[#163201]" : "bg-[#163201] text-white")
                                            : (darkMode ? "bg-white/5 text-gray-400 hover:bg-white/10" : "bg-gray-100 text-gray-600 hover:bg-gray-200")
                                        }
                                    `}
                                 >
                                     {cat === 'all' ? 'Barchasi' : cat}
                                 </button>
                             ))}
                        </div>

                        <div className="relative w-full md:w-80">
                            <FaSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-[#A3ED96]/50" : "text-gray-400"}`} />
                            <input 
                                type="text"
                                placeholder="Qidirish..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full pl-10 pr-4 py-2.5 rounded-xl font-bold outline-none border transition-all
                                    ${darkMode 
                                        ? "bg-white/5 border-white/10 text-white focus:border-[#A3ED96]" 
                                        : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#163201]"
                                    }
                                `}
                            />
                        </div>
                    </div>

                    {/* Books Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {filteredBooks.map((book) => (
                                <motion.div
                                    key={book._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileHover={{ y: -8 }}
                                    className={`group rounded-2xl border overflow-hidden relative transition-all duration-300
                                        ${darkMode 
                                            ? "bg-[#163201]/40 border-[#A3ED96]/10 hover:shadow-[0_0_20px_rgba(163,237,150,0.15)]" 
                                            : "bg-white border-gray-100 hover:shadow-xl"
                                        }
                                    `}
                                >
                                    {/* Image */}
                                    <div className="relative h-[280px] w-full overflow-hidden">
                                        <Image 
                                            src={book.images?.[0] || "https://placehold.co/400x600"} 
                                            alt={book.title} 
                                            fill 
                                            className="object-cover transition-transform duration-500 group-hover:scale-110" 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                                        
                                        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-black backdrop-blur-md
                                            ${book.stock > 0
                                                ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                                                : "bg-red-500/20 text-red-400 border border-red-500/30"
                                            }
                                        `}>
                                            {book.stock > 0 ? "Mavjud" : "Tugagan"}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 relative">
                                        <div className="absolute -top-10 left-5">
                                             <span className={`px-3 py-1 rounded-lg text-xs font-bold shadow-lg
                                                ${darkMode ? "bg-[#A3ED96] text-[#163201]" : "bg-[#163201] text-white"}
                                             `}>
                                                 {book.category}
                                             </span>
                                        </div>

                                        <h3 className={`text-lg font-black mb-1 line-clamp-1 ${darkMode ? "text-white" : "text-gray-900"}`}>
                                            {book.title}
                                        </h3>
                                        <p className={`text-sm font-medium mb-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                            {book.author}
                                        </p>
                                        
                                        <div className="flex justify-between items-center mt-4">
                                            <span className={`text-xl font-black ${darkMode ? "text-[#A3ED96]" : "text-[#163201]"}`}>
                                                {book.price.toLocaleString()} <span className="text-xs opacity-70">so&apos;m</span>
                                            </span>
                                            
                                            <div className="flex gap-2">
                                                <button className={`p-2 rounded-lg transition-colors
                                                    ${darkMode ? "hover:bg-white/10 text-gray-400 hover:text-white" : "hover:bg-gray-100 text-gray-500 hover:text-[#163201]"}
                                                `}>
                                                    <FaEdit />
                                                </button>
                                                <button className={`p-2 rounded-lg transition-colors
                                                    ${darkMode ? "hover:bg-red-500/20 text-gray-400 hover:text-red-400" : "hover:bg-red-50 text-gray-500 hover:text-red-600"}
                                                `}>
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </>
            )}

            {/* --- ORDERS VIEW --- */}
            {activeTab === 'orders' && (
                <div className="max-w-full lg:max-w-4xl">
                     <AnimatePresence>
                         {orders.map(order => (
                             <OrderCard key={order._id} order={order} darkMode={darkMode} onUpdateStatus={updateOrderStatus} />
                         ))}
                         {orders.length === 0 && (
                             <div className="text-center py-20 opacity-50">
                                 <FaBox className="text-4xl mx-auto mb-4" />
                                 <p>Hozircha buyurtmalar yo'q</p>
                             </div>
                         )}
                     </AnimatePresence>
                </div>
            )}
        </>
      )}

      {/* MODAL (Yangi Kitob) */}
      {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
               <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`w-full max-w-lg p-8 rounded-3xl shadow-2xl relative
                      ${darkMode ? "bg-[#0b1a00] border border-[#A3ED96]/20" : "bg-white"}
                  `}
               >
                   <h2 className={`text-2xl font-black mb-6 ${darkMode ? "text-white" : "text-[#163201]"}`}>
                       Yangi Kitob Qo&apos;shish
                   </h2>
                   
                   <form className="space-y-4">
                       <input type="text" placeholder="Kitob Nomi" className={`w-full p-4 rounded-xl outline-none font-bold border transition-all ${darkMode ? "bg-white/5 border-white/10 text-white focus:border-[#A3ED96]" : "bg-gray-50 border-gray-200 focus:border-[#163201]"}`} />
                       <input type="text" placeholder="Muallif" className={`w-full p-4 rounded-xl outline-none font-bold border transition-all ${darkMode ? "bg-white/5 border-white/10 text-white focus:border-[#A3ED96]" : "bg-gray-50 border-gray-200 focus:border-[#163201]"}`} />
                       <div className="flex gap-4">
                           <input type="number" placeholder="Narx" className={`w-1/2 p-4 rounded-xl outline-none font-bold border transition-all ${darkMode ? "bg-white/5 border-white/10 text-white focus:border-[#A3ED96]" : "bg-gray-50 border-gray-200 focus:border-[#163201]"}`} />
                           <select className={`w-1/2 p-4 rounded-xl outline-none font-bold border transition-all ${darkMode ? "bg-white/5 border-white/10 text-gray-400 focus:border-[#A3ED96]" : "bg-gray-50 border-gray-200 focus:border-[#163201]"}`}>
                               <option>Badiiy</option>
                               <option>Bolalar</option>
                               <option>Ilmiy</option>
                           </select>
                       </div>
                       
                       <div className="flex justify-end gap-3 mt-8">
                           <button type="button" onClick={() => setShowModal(false)} className={`px-6 py-3 rounded-xl font-bold ${darkMode ? "bg-white/10 text-white hover:bg-white/20" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>Bekor Qilish</button>
                           <button type="button" className={`px-6 py-3 rounded-xl font-bold ${darkMode ? "bg-[#A3ED96] text-[#163201]" : "bg-[#163201] text-white"}`}>Saqlash</button>
                       </div>
                   </form>
               </motion.div>
          </div>
      )}

    </div>
  );
}
