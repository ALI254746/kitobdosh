"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import SafeImage from "../../components/SafeImage";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaStar, 
  FaHeart, 
  FaRegHeart, 
  FaSearch, 
  FaFilter, 
  FaClock,
  FaCalendarAlt,
  FaShoppingCart,
  FaTimes,
  FaCamera,
  FaMapMarkerAlt,
  FaUser,
  FaPhone,
  FaMoneyBillWave,
  FaBolt
} from "react-icons/fa";
import { useCart } from "../../CartContext";
import toast from "react-hot-toast";
import { useMain } from "../MainContext";
import dynamic from "next/dynamic";
import { useGetBooksQuery } from "../../../lib/features/books/booksApi";
import Link from "next/link";

const MapPicker = dynamic(() => import("../../components/MapPicker"), { 
    ssr: false,
    loading: () => <div className="h-40 flex items-center justify-center bg-gray-100 rounded-xl animate-pulse">Xarita yuklanmoqda...</div>
});

// --- COMPONENTS ---

const SkeletonRentalCard = () => {
    const { darkMode } = useMain();
    return (
        <div className={`rounded-3xl p-4 border shadow-sm animate-pulse
            ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"}
        `}>
            <div className={`w-full h-64 rounded-2xl mb-4 ${darkMode ? "bg-slate-700" : "bg-gray-200"}`} />
            <div className="flex justify-between items-center mb-3">
            <div className={`h-4 w-20 rounded ${darkMode ? "bg-slate-700" : "bg-gray-200"}`} />
            <div className={`h-6 w-6 rounded-full ${darkMode ? "bg-slate-700" : "bg-gray-200"}`} />
            </div>
            <div className={`h-6 w-3/4 rounded mb-2 ${darkMode ? "bg-slate-700" : "bg-gray-200"}`} />
            <div className={`h-4 w-1/2 rounded mb-4 ${darkMode ? "bg-slate-700" : "bg-gray-200"}`} />
            <div className="flex justify-between items-end mt-4">
            <div className={`h-8 w-24 rounded ${darkMode ? "bg-slate-700" : "bg-gray-200"}`} />
            <div className={`h-10 w-28 rounded-xl ${darkMode ? "bg-slate-700" : "bg-gray-200"}`} />
            </div>
        </div>
    )
};

const RentalModal = ({ isOpen, onClose, rentalData }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    lat: null,
    lng: null,
    passport: null,
    payment: "payme"
  });
  const [showMap, setShowMap] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { darkMode } = useMain();

  if (!isOpen || !rentalData) return null;

  const { book, days } = rentalData;
  const totalPrice = (book.rentalPricePerDay || 0) * days;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, passport: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if(!formData.passport) {
        toast.error("Iltimos, pasport rasmini yuklang!");
        setIsSubmitting(false);
        return;
    }

    const toastId = toast.loading("Yuborilmoqda...");

    try {
        const data = new FormData();
        data.append("name", formData.name);
        data.append("phone", formData.phone);
        data.append("address", formData.address);
        data.append("passport", formData.passport);
        data.append("payment", formData.payment);
        data.append("bookId", book._id);
        data.append("bookTitle", book.title);
        data.append("bookImage", book.images?.[0] || "");
        data.append("days", days);
        data.append("totalPrice", totalPrice);
        if (formData.lat && formData.lng) {
            data.append("lat", formData.lat);
            data.append("lng", formData.lng);
        }

        if (formData.lat && formData.lng) {
            data.append("lat", formData.lat);
            data.append("lng", formData.lng);
        }

        const res = await fetch('/api/rent', {
            method: 'POST',
            body: data
        });

        const result = await res.json();

        if(result.success) {
            toast.success("Buyurtma qabul qilindi! Tez orada aloqaga chiqamiz.", { id: toastId });
            onClose();
        } else {
            toast.error(result.message || "Xatolik yuz berdi", { id: toastId });
        }
    } catch (error) {
        console.error("RENTAL CHECKOUT ERROR:", error);
        toast.error("Tarmoq xatosi: " + (error.message || "Noma'lum xatolik"), { id: toastId });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]
                ${darkMode ? "bg-slate-800" : "bg-white"}
            `}
        >
            {/* Header */}
            <div className={`p-5 border-b flex justify-between items-center z-10 sticky top-0
                ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"}
            `}>
                <h3 className={`text-xl font-black ${darkMode ? "text-white" : "text-[#1F2937]"}`}>Ijara Rasmiylashtirish</h3>
                <button onClick={onClose} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
                    ${darkMode ? "bg-slate-700 hover:bg-red-900/30 hover:text-red-400 text-gray-400" : "bg-gray-50 hover:bg-red-50 hover:text-red-500"}
                `}>
                    <FaTimes />
                </button>
            </div>

            <div className="p-6 overflow-y-auto">
                {/* Book Summary */}
                <div className={`flex gap-4 mb-6 p-4 rounded-2xl border
                    ${darkMode ? "bg-slate-700/50 border-slate-600" : "bg-gray-50 border-gray-100"}
                `}>
                    <div className={`w-16 h-20 rounded-lg overflow-hidden relative flex-shrink-0 ${darkMode ? "bg-slate-700" : "bg-gray-200"}`}>
                            <SafeImage src={book.images?.[0]} fallbackSrc="https://placehold.co/100x150" alt={book.title} fill className="object-cover" />
                    </div>
                    <div>
                        <h4 className={`font-bold line-clamp-1 ${darkMode ? "text-white" : "text-[#1F2937]"}`}>{book.title}</h4>
                        <p className={`text-sm mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{book.author}</p>
                        <div className={`flex items-center gap-2 text-xs font-bold ${darkMode ? "text-blue-400" : "text-[#96C7B9]"}`}>
                            <FaClock /> {days} kun
                            <span className="text-gray-500">|</span>
                            Jami: {totalPrice.toLocaleString()} so'm
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4" id="rental-form">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className={`text-xs font-bold ml-1 ${darkMode ? "text-gray-300" : "text-gray-500"}`}>Ism Familiya</label>
                            <div className="relative group">
                                <FaUser className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${darkMode ? "text-gray-500 group-focus-within:text-blue-400" : "text-gray-400 group-focus-within:text-[#96C7B9]"}`} />
                                <input 
                                    required
                                    type="text" 
                                    placeholder="Jahongir ..." 
                                    className={`w-full pl-10 pr-4 py-3.5 border-2 border-transparent rounded-xl outline-none focus:border-[#96C7B9] font-bold transition-all
                                            ${darkMode ? "bg-slate-700 text-white focus:bg-slate-600" : "bg-gray-50 focus:bg-white text-[#1F2937]"}
                                        `}
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className={`text-xs font-bold ml-1 ${darkMode ? "text-gray-300" : "text-gray-500"}`}>Telefon raqam</label>
                            <div className="relative group">
                                <FaPhone className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${darkMode ? "text-gray-500 group-focus-within:text-blue-400" : "text-gray-400 group-focus-within:text-[#96C7B9]"}`} />
                                <input 
                                    required
                                    type="tel" 
                                    placeholder="+998 9..." 
                                    className={`w-full pl-10 pr-4 py-3.5 border-2 border-transparent rounded-xl outline-none focus:border-[#96C7B9] font-bold transition-all
                                            ${darkMode ? "bg-slate-700 text-white focus:bg-slate-600" : "bg-gray-50 focus:bg-white text-[#1F2937]"}
                                        `}
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className={`text-xs font-bold ml-1 ${darkMode ? "text-gray-300" : "text-gray-500"}`}>Manzil (Yetkazib berish uchun)</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1 group">
                                <FaMapMarkerAlt className={`absolute left-4 top-4 transition-colors ${darkMode ? "text-gray-500 group-focus-within:text-blue-400" : "text-gray-400 group-focus-within:text-[#96C7B9]"}`} />
                                <textarea 
                                    required
                                    rows="2"
                                    placeholder="Toshkent sh, Chilonzor..." 
                                    className={`w-full pl-10 pr-4 py-3 border-2 border-transparent rounded-xl outline-none focus:border-[#96C7B9] font-medium text-sm resize-none transition-all
                                        ${darkMode ? "bg-slate-700 text-white focus:bg-slate-600" : "bg-gray-50 text-[#1F2937] focus:bg-white"}
                                    `}
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                            <button 
                                type="button"
                                onClick={() => setShowMap(true)}
                                className={`px-4 rounded-xl flex items-center justify-center transition-all ${
                                    darkMode ? "bg-slate-700 hover:bg-slate-600 text-blue-400" : "bg-gray-50 hover:bg-gray-100 text-[#96C7B9]"
                                }`}
                                title="Xaritadan tanlash"
                            >
                                <FaMapMarkerAlt className="text-xl" />
                            </button>
                        </div>
                        {formData.lat && formData.lng && (
                            <p className="text-[10px] text-green-500 font-bold ml-1 mt-1">✓ Koordinatalar belgilandi</p>
                        )}
                    </div>
                    
                    {showMap && (
                        <MapPicker 
                            darkMode={darkMode}
                            onClose={() => setShowMap(false)}
                            onSelect={(data) => {
                                setFormData(prev => ({
                                    ...prev,
                                    address: data.address,
                                    lat: data.lat,
                                    lng: data.lng
                                }));
                            }}
                            initialPosition={formData.lat ? { lat: formData.lat, lng: formData.lng } : null}
                        />
                    )}

                    <div className="space-y-1">
                         <label className={`text-xs font-bold ml-1 ${darkMode ? "text-gray-300" : "text-gray-500"}`}>Pasport Rasmi</label>
                         <label className={`flex items-center gap-3 p-3 border border-dashed rounded-xl cursor-pointer transition-colors
                            ${darkMode ? "bg-slate-700 border-slate-600 hover:bg-slate-600" : "bg-gray-50 border-gray-300 hover:bg-gray-100"}
                         `}>
                            <div className="w-10 h-10 rounded-full bg-[#D1F0E0] flex items-center justify-center text-[#96C7B9]">
                                <FaCamera />
                            </div>
                            <div className="flex-1">
                                <span className={`text-sm font-bold block ${darkMode ? "text-white" : "text-gray-600"}`}>
                                    {formData.passport ? formData.passport.name : "Rasmni yuklang"}
                                </span>
                                <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-400"}`}>Jpg, Png (Max 5mb)</span>
                            </div>
                            <input type="file" required accept="image/*" className="hidden" onChange={handleFileChange} />
                         </label>
                    </div>

                    <div className="space-y-1">
                        <label className={`text-xs font-bold ml-1 ${darkMode ? "text-gray-300" : "text-gray-500"}`}>To'lov Turi</label>
                        <div className="p-3 rounded-xl border-2 border-[#96C7B9] bg-[#D1F0E0]/20 flex items-center justify-center gap-2">
                             <FaMoneyBillWave className="text-[#96C7B9]" />
                             <span className={`font-bold text-sm ${darkMode ? "text-white" : "text-[#1F2937]"}`}>Qabulda (Naqd / Karta)</span>
                        </div>
                    </div>
                </form>
            </div>
            {/* Footer */}
            <div className={`p-5 border-t ${darkMode ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-100"}`}>
                <button 
                    type="submit"
                    form="rental-form"
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed
                        ${darkMode ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30" : "bg-[#1F2937] text-white hover:bg-[#96C7B9] shadow-gray-200"}
                    `}
                >         
                    <span>To'lov Qilish</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                        {totalPrice.toLocaleString()} so'm
                    </span>
                </button>
            </div>
        </motion.div>
    </div>
  );
};

const RentalBookCard = ({ book, onRentNow, isLiked, onToggleLike, onViewReviews }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { darkMode } = useMain();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`rounded-[2rem] p-4 border shadow-lg transition-all duration-300 relative group flex flex-col h-full
        ${darkMode 
            ? "bg-slate-800 border-slate-700 shadow-slate-900/50 hover:shadow-blue-900/20 hover:border-blue-500" 
            : "bg-white border-slate-100 shadow-slate-100/50 hover:shadow-xl hover:shadow-[#D1F0E0]/40 hover:border-[#96C7B9]"}
      `}
    >
      {/* Image Area */}
      <div className={`relative w-full h-72 rounded-3xl overflow-hidden mb-4 flex-shrink-0
        ${darkMode ? "bg-slate-700" : "bg-gray-50"}
      `}>
        <Link href={`/book/${book._id}`} className="absolute inset-0 z-0">
          <SafeImage
            src={book.images?.[0]}
            fallbackSrc="https://placehold.co/400x600?text=No+Image"
            alt={book.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
           <span className="px-3 py-1 bg-[#96C7B9]/80 backdrop-blur text-xs font-bold text-white rounded-lg shadow-sm">
             {book.category}
           </span>
           <span className="px-3 py-1 bg-blue-500/80 backdrop-blur text-xs font-bold text-white rounded-lg shadow-sm">
             IJARA
           </span>
        </div>

        {/* Action Buttons Overlay */}
        <div className={`absolute inset-x-0 bottom-4 px-4 flex gap-2 transition-all duration-300 z-20 transform ${isHovered ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
             <button 
                 onClick={(e) => {
                    e.preventDefault();
                    addToCart(book, 'rent');
                 }}
                 className={`flex-1 backdrop-blur py-3 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2
                    ${darkMode ? "bg-slate-900/90 text-white hover:bg-slate-900" : "bg-white/90 text-[#1F2937] hover:bg-white"}
                 `}
             >
                 <FaShoppingCart /> Savatcha
             </button>
        </div>

        {/* Favorite Button */}
        <button 
          onClick={(e) => {
             e.preventDefault();
             onToggleLike(book._id);
          }}
          className={`absolute top-4 right-4 w-10 h-10 backdrop-blur rounded-full flex items-center justify-center transition-all shadow-sm z-20
            ${darkMode ? "bg-slate-900/50 hover:bg-slate-900 text-white" : "bg-white/50 hover:bg-white text-[#1F2937]"}
          `}
        >
          {isLiked ? <FaHeart className="text-red-500 text-xl" /> : <FaRegHeart className="text-xl" />}
        </button>
      </div>

      {/* Content */}
      <div className="px-2 pb-2 flex-grow flex flex-col justify-between">
        <div>
            <div 
                className={`flex items-center gap-1 text-xs mb-2 transition-opacity hover:opacity-70 cursor-pointer ${darkMode ? "text-yellow-500" : "text-yellow-400"}`}
                onClick={(e) => {
                    e.stopPropagation();
                    onViewReviews(book);
                }}
            >
                {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < Math.round(book.averageRating || 0) ? "text-yellow-400" : (darkMode ? "text-slate-600" : "text-gray-200")} />
                ))}
                <span className={`ml-1 font-bold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {book.averageRating || 0} ({book.numReviews || 0})
                </span>
            </div>
            
            <Link href={`/book/${book._id}`}>
                <h3 className={`text-xl font-bold mb-1 line-clamp-1 transition-colors ${darkMode ? "text-white group-hover:text-blue-400" : "text-[#1F2937] group-hover:text-[#96C7B9]"}`} title={book.title}>
                    {book.title}
                </h3>
            </Link>
            <p className={`text-sm mb-4 line-clamp-1 ${darkMode ? "text-gray-400" : "text-gray-400"}`}>{book.author}</p>
        </div>
        
        <div className="flex items-center justify-between mt-auto">
            <Link href={`/book/${book._id}`}>
                <div>
                    <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-400"}`}>Kuniga:</p>
                    <span className={`text-xl font-black ${darkMode ? "text-blue-400" : "text-[#96C7B9]"}`}>{book.rentalPricePerDay?.toLocaleString()} <span className={`text-sm ${darkMode ? "text-gray-300" : "text-[#1F2937]"}`}>so'm</span></span>
                </div>
            </Link>
            <button 
                onClick={() => onRentNow(book, 1)} // Pass 1 day as default for rent now
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-md
                    ${darkMode 
                        ? "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/30" 
                        : "bg-[#D1F0E0] text-[#1F2937] hover:bg-[#96C7B9] hover:text-white shadow-[#D1F0E0]/50"}
                `}
            >
                <FaBolt />
            </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function RentPage() {
  const { darkMode } = useMain();
  
  // State for API params
  const [page, setPage] = useState(1);
  const [limit] = useState(16);
  const [filterCategory, setFilterCategory] = useState("Barchasi");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  // API Call with params
  const { data: booksData, isLoading: booksLoading } = useGetBooksQuery({
    page,
    limit,
    category: filterCategory,
    search: debouncedSearch,
    type: 'rent'
  });
  
  const allBooks = booksData?.data || [];
  const totalPages = booksData?.totalPages || 1;

  const { cartItems } = useCart();
  const [selectedRental, setSelectedRental] = useState(null)
  const [reviewBook, setReviewBook] = useState(null);
  
  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page on category change
  useEffect(() => {
    setPage(1);
  }, [filterCategory]);

  // Favorites Logic
  const [favoriteIds, setFavoriteIds] = useState([]);

  useEffect(() => {
     const fetchFavorites = async () => {
         try {
            const favRes = await fetch('/api/user/favorites');
            if (favRes.ok) {
                const favData = await favRes.json();
                if(favData.success) {
                        setFavoriteIds(favData.favorites.map(f => f._id));
                }
            }
         } catch (e) {
             // Ignore auth errors
         }
     };
     fetchFavorites();
  }, []);

  const handleToggleLike = async (bookId) => {
      // Optimistic update
      const isCurrentlyLiked = favoriteIds.includes(bookId);
      setFavoriteIds(prev => isCurrentlyLiked ? prev.filter(id => id !== bookId) : [...prev, bookId]);

      try {
          const res = await fetch('/api/user/favorites', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ bookId })
          });
          
          if (!res.ok) {
              if (res.status === 401) toast.error("Iltimos, avval tizimga kiring!");
              else toast.error("Xatolik yuz berdi");
              // Revert
              setFavoriteIds(prev => isCurrentlyLiked ? [...prev, bookId] : prev.filter(id => id !== bookId));
          } else {
             const data = await res.json();
             if(data.success) {
                if(data.isFavorite) toast.success("Sevimli kitoblarga qo'shildi!");
                else toast.success("Olib tashlandi");
             }
          }
      } catch (e) {
           toast.error("Tarmoq xatosi");
           setFavoriteIds(prev => isCurrentlyLiked ? [...prev, bookId] : prev.filter(id => id !== bookId));
      }
  };

  // Predefined Categories
  const categories = ["Barchasi", "Badiiy Adabiyotlar", "Darsliklar va Qo'llanmalar", "Bolalar Adabiyoti", "Psixologiya va Biznes", "Ilmiy Kitoblar", "Diniy Adabiyotlar", "Detektiv va Triller", "Sarguzashtlar", "Tarixiy Kitoblar", "Biografiya va Memuarlar", "Fantastika va Fentezi", "Chet tillari", "Boshqa"];

  // Calculate total items (optional: could be just count of items or sum of quantities)
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleRentClick = (book, days) => {
      setSelectedRental({ book, days });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-slate-900" : "bg-white"}`}>
      
      {/* FILTER & SEARCH HEADER */}
      <div className={`sticky top-[80px] z-40 backdrop-blur-xl border-b transition-colors duration-300
         ${darkMode ? "bg-slate-900/80 border-slate-700" : "bg-white/80 border-gray-100"}
      `}>
        <div className="max-w-7xl mx-auto px-6 py-6">
           <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Search */}
              <div className="relative w-full md:w-96 group">
                 <FaSearch className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${darkMode ? "text-gray-500 group-focus-within:text-blue-400" : "text-gray-400 group-focus-within:text-[#96C7B9]"}`} />
                 <input 
                   type="text" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="Kitob, muallif qidirish..." 
                   className={`w-full pl-12 pr-4 py-3.5 border-2 border-transparent rounded-2xl outline-none transition-all font-bold placeholder-gray-400
                     ${darkMode 
                        ? "bg-slate-800 text-white focus:bg-slate-900 focus:border-blue-500" 
                        : "bg-gray-50 text-[#1F2937] focus:bg-white focus:border-[#D1F0E0]"}
                   `}
                 />
              </div>
              <button className={`px-8 py-3.5 rounded-2xl font-bold transition-colors shadow-lg
                ${darkMode ? "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/30" : "bg-[#1F2937] text-white hover:bg-[#96C7B9] shadow-gray-200"}
              `}>
                 Qidiruv
              </button>
           </div>

           {/* Bottom Row: Chips */}
           <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar mt-4">
              <span className={`text-sm font-bold mr-2 flex items-center gap-1 ${darkMode ? "text-gray-300" : "text-gray-400"}`}><FaFilter /> Saralash:</span>
              {categories.map((cat) => (
                 <button
                   key={cat}
                   onClick={() => setFilterCategory(cat)}
                   className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all
                     ${filterCategory === cat 
                         ? (darkMode ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" : "bg-[#1F2937] text-white shadow-lg")
                         : (darkMode ? "bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white" : "bg-gray-50 text-gray-500 hover:bg-[#D1F0E0] hover:text-[#1F2937]")
                     }
                   `}
                 >
                     {cat}
                 </button>
              ))}
              <button className={`px-4 py-3 rounded-xl transition-all ${darkMode ? "bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white" : "bg-gray-50 text-gray-500 hover:bg-[#D1F0E0] hover:text-white"}`}>
                  <FaFilter />
              </button>
           </div>
        </div>
      </div>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-10">
         <AnimatePresence mode="wait">
            {booksLoading ? (
                <motion.div 
                   key="skeleton"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                   {[1, 2, 3, 4].map(i => <SkeletonRentalCard key={i} />)}
                </motion.div>
            ) : (
                <motion.div 
                   key="content"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                   {allBooks.map(book => (
                      <RentalBookCard 
                          key={book._id} 
                          book={book} 
                          onRentNow={handleRentClick} 
                          isLiked={favoriteIds.includes(book._id)}
                          onToggleLike={handleToggleLike}
                          onViewReviews={setReviewBook}
                      />
                   ))}
                   {allBooks.length === 0 && (
                       <div className="col-span-full text-center py-20">
                           <h3 className="text-xl font-bold text-gray-400">Kitoblar topilmadi 😔</h3>
                           <p className="text-gray-400 mt-2">Boshqa so'z bilan qidirib ko'ring yoki filterni o'zgartiring.</p>
                       </div>
                   )}
                </motion.div>
            )}
         </AnimatePresence>

         {/* PAGINATION */}
         {!booksLoading && totalPages > 1 && (
             <div className="flex justify-center items-center gap-4 mt-16">
                 <button 
                   onClick={() => setPage(prev => Math.max(1, prev - 1))}
                   disabled={page === 1}
                   className={`p-3 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed
                     ${darkMode ? "bg-slate-800 text-white" : "bg-white text-gray-800"}
                   `}
                 >
                   Oldingi
                 </button>
                 
                 <div className="flex items-center gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setPage(i + 1)}
                          className={`w-10 h-10 rounded-xl font-bold transition-all shadow-md active:scale-95
                             ${page === i + 1 
                               ? (darkMode ? "bg-blue-600 text-white shadow-blue-900/40" : "bg-[#1F2937] text-white shadow-gray-200")
                               : (darkMode ? "bg-slate-800 text-gray-400 hover:bg-slate-700" : "bg-white text-gray-600 hover:bg-gray-50")
                             }
                          `}
                        >
                            {i + 1}
                        </button>
                    ))}
                 </div>

                 <button 
                    onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={page === totalPages}
                    className={`p-3 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed
                      ${darkMode ? "bg-slate-800 text-white" : "bg-white text-gray-800"}
                    `}
                 >
                   Keyingi
                 </button>
             </div>
         )}
      </main>

      {/* RENTAL MODAL (Rendered conditionally) */}
      <AnimatePresence>
          {selectedRental && (
              <RentalModal 
                  isOpen={!!selectedRental} 
                  onClose={() => setSelectedRental(null)} 
                  rentalData={selectedRental}
              />
          )}
      </AnimatePresence>

      {/* FLOATING CART BUTTON (Shared) */}
      <motion.button
         onClick={() => window.location.href='/mainPage/savatcha'} // Simple navigation for now
         whileHover={{ scale: 1.1 }}
         whileTap={{ scale: 0.9 }}
         className="fixed bottom-8 right-8 w-16 h-16 bg-[#1F2937] text-white rounded-full shadow-2xl flex items-center justify-center z-50 group hover:shadow-[#96C7B9]/50"
      >
          <div className="relative">
             <FaShoppingCart className="text-2xl group-hover:text-[#96C7B9] transition-colors" />
             <span className="absolute -top-3 -right-3 w-6 h-6 bg-[#96C7B9] text-[#1F2937] text-xs font-bold rounded-full flex items-center justify-center border-2 border-[#1F2937]">
                {totalItems}
             </span>
          </div>
      </motion.button>
      <AnimatePresence>
          {reviewBook && (
              <BookReviewsModal 
                  book={reviewBook} 
                  onClose={() => setReviewBook(null)} 
                  darkMode={darkMode}
              />
          )}
      </AnimatePresence>
    </div>
  );
}

const BookReviewsModal = ({ book, onClose, darkMode }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`/api/reviews?bookId=${book._id}`);
                const data = await res.json();
                if (data.success) {
                    setReviews(data.reviews);
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }
        };
        if (book) fetchReviews();
    }, [book]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className={`w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ${
                    darkMode ? "bg-slate-900 border border-slate-700" : "bg-white"
                }`}
            >
                <div className={`p-6 border-b flex justify-between items-center sticky top-0 z-10 ${
                    darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"
                }`}>
                    <div>
                        <h3 className={`text-xl font-black ${darkMode ? "text-white" : "text-slate-800"}`}>
                            Kitob Taqrizlari
                        </h3>
                        <p className={`text-sm font-bold text-[#96C7B9]`}>{book.title}</p>
                    </div>
                    <button onClick={onClose} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        darkMode ? "bg-slate-800 text-gray-400 hover:bg-slate-700" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                    }`}>
                        <FaTimes />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <span className="loading loading-spinner loading-lg text-[#96C7B9]"></span>
                            <p className="text-gray-500 font-bold">Yuklanmoqda...</p>
                        </div>
                    ) : reviews.length > 0 ? (
                        <div className="space-y-6">
                            {reviews.map((rev) => (
                                <div key={rev._id} className={`p-5 rounded-3xl border transition-all ${
                                    darkMode ? "bg-slate-800/50 border-slate-700" : "bg-gray-50 border-gray-100"
                                }`}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#96C7B9]/20 flex items-center justify-center text-[#96C7B9] font-bold">
                                                {rev.user?.avatar ? (
                                                    <Image src={rev.user.avatar} alt="Avatar" width={40} height={40} className="rounded-full object-cover" />
                                                ) : (
                                                    <FaUser />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-slate-800"}`}>
                                                    {rev.user?.fullName || "Foydalanuvchi"}
                                                </h4>
                                                <div className="flex text-yellow-400 text-[10px] items-center gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FaStar key={i} className={i < rev.rating ? "text-yellow-400" : "text-gray-300"} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-gray-400 font-medium">
                                            {new Date(rev.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-300" : "text-slate-600"}`}>
                                        {rev.comment}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
                            <FaStar className="text-6xl mb-4" />
                            <p className="font-bold text-lg">Hozircha taqrizlar yo'q</p>
                            <p className="text-sm">Birinchilardan bo'lib fikr qoldiring!</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
