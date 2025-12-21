"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import SafeImage from "../../components/SafeImage";
import {
  FaBook,
  FaShoppingBag,
  FaBell,
  FaEdit,
  FaSignOutAlt,
  FaCamera,
  FaTimes,
  FaUser,
  FaBriefcase,
  FaHeart,
  FaCheck, 
  FaFeatherAlt,
  FaFlask,
  FaRocket,
  FaUserSecret,
  FaBrain,
  FaChartLine,
  FaChild,
  FaLandmark,
  FaBookOpen,
  FaMapMarkedAlt,
  FaBoxOpen,
  FaClipboardCheck,
  FaTruck,
  FaMapMarkerAlt,
  FaStar,
  FaRegStar,
  FaRegHeart,
  FaInstagram,
  FaTelegram,
  FaPhone,
  FaUserPlus
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useMain } from "../MainContext";
import toast from "react-hot-toast";
import { uploadToCloudinary } from "../../../lib/cloudinary";

export const dynamic = 'force-dynamic';

const tabs = [
  { id: "tracking", label: "Buyurtmani Kuzatish", icon: <FaMapMarkedAlt /> },
  { id: "favorites", label: "Sevimlilar", icon: <FaHeart /> }, // New Tab
  { id: "readHistory", label: "O'qilganlar", icon: <FaBookOpen /> },
  { id: "rentals", label: "Mening ijaralarim", icon: <FaBook /> },
  { id: "purchases", label: "Xaridlar tarixi", icon: <FaShoppingBag /> },
  { id: "notifications", label: "Bildirishnomalar", icon: <FaBell /> },
];

const GENRES = [
    { label: "Badiiy", icon: <FaFeatherAlt /> }, 
    { label: "Ilmiy", icon: <FaFlask /> }, 
    { label: "Fantastika", icon: <FaRocket /> }, 
    { label: "Detektiv", icon: <FaUserSecret /> }, 
    { label: "Psixologiya", icon: <FaBrain /> }, 
    { label: "Biznes", icon: <FaChartLine /> }, 
    { label: "Bolalar", icon: <FaChild /> }, 
    { label: "Tarixiy", icon: <FaLandmark /> }
];

import { useSearchParams } from "next/navigation";

import Pusher from "pusher-js";

export default function ProfilePage() {
  const { darkMode } = useMain(); // Changed from useAdmin() to useMain() as per original code context
  const searchParams = useSearchParams();
  const queryUserId = searchParams.get('userId');

  const [activeTab, setActiveTab] = useState("readHistory"); // Default to readHistory for visitors
  
  // If no queryUserId, default tab can be tracking
  useEffect(() => {
     if(!queryUserId) setActiveTab("tracking");
  }, [queryUserId]);
  
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [notifications, setNotifications] = useState([]); 
  const [readBooks, setReadBooks] = useState([]); 
  const [activeTracking, setActiveTracking] = useState([]); // Active orders for tracking
  const [favorites, setFavorites] = useState([]); // New Favorites State

  // Tahrirlash Modali holati
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewItem, setReviewItem] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [editForm, setEditForm] = useState({
      fullName: "",
      bio: "",
      phone: "",
      instagram: "",
      telegram: "",
      occupation: "other",
      interests: [],
      avatarFile: null,
      avatarPreview: null
  });

  // Pusher Subscription
  useEffect(() => {
    if (!userData || !userData._id) return;

    // Use environment variables for client side
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!pusherKey) return;

    const pusher = new Pusher(pusherKey, {
        cluster: pusherCluster,
    });

    const channel = pusher.subscribe(`user-${userData._id}`);

    channel.bind("status-update", (data) => {
        toast.custom((t) => (
            <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white dark:bg-slate-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
                <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                            <div className="h-10 w-10 bg-[#96C7B9] rounded-full flex items-center justify-center text-white">
                                <FaBell />
                            </div>
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {data.message}
                            </p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {data.fullMessage}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex border-l border-gray-200 dark:border-slate-700">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Yopish
                    </button>
                </div>
            </div>
        ));
        
        // Refresh data to show new status
        fetchData();
        
        // Play notification sound if desired
        // const audio = new Audio('/sounds/notification.mp3');
        // audio.play().catch(e => console.log("Audio play failed", e));
    });

    return () => {
        pusher.unsubscribe(`user-${userData._id}`);
    };
  }, [userData]);

  // Ma'lumotlarni yuklash
  const fetchData = async () => {
      try {
          const url = queryUserId ? `/api/user/profile?userId=${queryUserId}` : '/api/user/profile';
          const profileRes = await fetch(url);
          const profileData = await profileRes.json();
          
          
          console.log("PROFILE API RESPONSE:", profileData); // Debugging

          if (profileData.success) {
              const data = profileData.data || profileData; // Handle both structures
              const userObj = data.user || {};

              setUserData({ ...userObj, isOwner: data.isOwner });
              setOrders(data.orders || []);
              setRentals(data.rentals || []);

              // ---------------- TRACKING DATA ----------------
              // Filter active orders (pending, processing, approved)
              const activeOrders = profileData.data.orders.filter(o => ['pending', 'processing'].includes(o.status));
              const activeRentals = profileData.data.rentals.filter(r => ['pending', 'approved'].includes(r.status));
              
              const trackingItems = [
                  ...activeOrders.map(o => ({
                      _id: o._id,
                      title: `Buyurtma #${o._id.toString().slice(-6)}`,
                      items: o.items.map(i => i.title).join(", "),
                      status: o.status,
                      courierStatus: o.courierStatus, // Pass courierStatus
                      type: 'order',
                      date: o.createdAt,
                      image: "https://placehold.co/100x100/png?text=Order"
                  })),
                  ...activeRentals.map(r => ({
                      _id: r._id,
                      title: r.bookTitle,
                      items: "Ijara",
                      status: r.status,
                      courierStatus: r.courierStatus, // Pass courierStatus
                      type: 'rental',
                      date: r.createdAt,
                      image: r.bookImage || "https://placehold.co/100x100/png?text=Book"
                  }))
              ].sort((a,b) => new Date(b.date) - new Date(a.date));

              setActiveTracking(trackingItems);


              // ---------------- AGGREGATE READ BOOKS ----------------
              const completedOrders = profileData.data.orders.filter(o => o.status === 'completed');
              const returnedRentals = profileData.data.rentals.filter(r => r.status === 'returned');
              
              const purchasedBooks = completedOrders.flatMap(o => o.items.map(item => ({
                  _id: item.book || item._id, 
                  bookTitle: item.title,
                  bookImage: "https://placehold.co/400x600/png?text=Kitob", 
                  type: 'purchased',
                  date: o.createdAt
              })));

              const rentedBooks = returnedRentals.map(r => ({
                  _id: r._id,
                  bookTitle: r.bookTitle,
                  bookImage: r.bookImage || "https://placehold.co/400x600/png?text=Kitob",
                  type: 'rented',
                  date: r.updatedAt
              }));

              const allRead = [...rentedBooks, ...purchasedBooks].sort((a, b) => new Date(b.date) - new Date(a.date));
              setReadBooks(allRead);
              
              // Tahrirlash formasini to'ldirish
              const u = profileData.data.user;
              setEditForm({
                  fullName: u.fullName || "",
                  bio: u.bio || "",
                  phone: u.phone || "",
                  instagram: u.instagram || "",
                  telegram: u.telegram || "",
                  occupation: u.occupation || "other",
                  interests: u.interests || [],
                  avatarFile: null,
                  avatarPreview: u.avatar || null
              });
          }

          // Only fetch notifications/favorites if owner
          if (!queryUserId || (profileData.success && profileData.data.isOwner)) {
            const notifRes = await fetch('/api/notifications');
            const notifData = await notifRes.json();
            if (notifData.success) {
                setNotifications(notifData.data);
            }

            // Fetch Favorites
            const favRes = await fetch('/api/user/favorites');
            const favData = await favRes.json();
            if (favData.success) {
                setFavorites(favData.favorites);
            }
          } else {
             // If visiting someone else, maybe fetch THEIR favorites? 
             // Currently favorites API is /api/user/favorites (current user).
             // Assume favorites are private or need endpoint update. Skipping for now.
             setFavorites([]); 
          }

      } catch (error) {
          console.error(error);
          toast.error("Ma'lumotlarni yuklashda xatolik");
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchData();
  }, [queryUserId]);

  const handleEditSubmit = async (e) => {
      e.preventDefault();
      const toastId = toast.loading("Saqlanmoqda...");
      
      try {
          const formData = new FormData();
          formData.append('fullName', editForm.fullName);
          formData.append('bio', editForm.bio);
          formData.append('phone', editForm.phone);
          formData.append('instagram', editForm.instagram);
          formData.append('telegram', editForm.telegram);
          formData.append('occupation', editForm.occupation);
          formData.append('interests', JSON.stringify(editForm.interests));
          if (editForm.avatarFile) {
              formData.append('avatar', editForm.avatarFile);
          }

          const res = await fetch('/api/user/profile', {
              method: 'PUT',
              body: formData
          });
          
          const data = await res.json();
          if (data.success) {
              toast.success("Profil yangilandi!", { id: toastId });
              setUserData(data.data);
              setShowEditModal(false);
          } else {
              toast.error(data.message, { id: toastId });
          }
      } catch (error) {
          toast.error("Xatolik yuz berdi", { id: toastId });
      }
  };

  const handleReviewSubmit = async (e) => {
      e.preventDefault();
      const toastId = toast.loading("Taqriz yuborilmoqda...");
      try {
          const res = await fetch('/api/reviews', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  bookId: reviewItem.bookId,
                  rating: reviewForm.rating,
                  comment: reviewForm.comment
              })
          });
          const data = await res.json();
          if (data.success) {
              toast.success("Taqriz qabul qilindi!", { id: toastId });
              setShowReviewModal(false);
              setReviewForm({ rating: 5, comment: "" });
          } else {
              toast.error(data.message, { id: toastId });
          }
      } catch (error) {
          toast.error("Xatolik yuz berdi", { id: toastId });
      }
  };

  const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
          setEditForm(prev => ({
              ...prev,
              avatarFile: file,
              avatarPreview: URL.createObjectURL(file)
          }));
      }
  };

  const toggleInterest = (genreLabel) => {
      setEditForm(prev => {
          const exists = prev.interests.includes(genreLabel);
          return {
              ...prev,
              interests: exists 
                  ? prev.interests.filter(i => i !== genreLabel)
                  : [...prev.interests, genreLabel]
          };
      });
  };

  const markAllRead = async () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updated);
    try {
         await fetch('/api/notifications', { method: 'PUT', body: JSON.stringify({}) });
    } catch (e) {
        console.error(e);
    }
  };

  const getGenreIcon = (label) => {
      const found = GENRES.find(g => g.label === label);
      return found ? found.icon : <FaBook />;
  };

  if (loading) {
      return (
          <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-slate-900" : "bg-white"}`}>
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#96C7B9]"></div>
          </div>
      );
  }

  if (!userData) return null;

  return (
    <div className={`min-h-screen pt-24 pb-20 transition-colors duration-300
        ${darkMode ? "bg-slate-900" : "bg-gradient-to-b from-white via-[#D1F0E0] to-[#E8F8F0]"}
    `}>
      <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ---------------- Profil Sarlavhasi (Header) ---------------- */}
        <div className={`rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl mb-12 relative overflow-hidden transition-all
            ${darkMode ? "bg-[#1e293b] border border-slate-700" : "bg-gradient-to-br from-[#96C7B9] via-[#86b5a8] to-[#5a8a7d]"}
        `}>
          {/* Bezaklar */}
          <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 bg-black/10 rounded-full -ml-24 -mb-24 blur-xl"></div>

          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-8 z-10">
            
            {/* Avatar */}
            <div className="relative group">
               <div className={`w-36 h-36 rounded-full p-1 shadow-2xl relative overflow-hidden
                   ${darkMode ? "bg-gradient-to-br from-slate-700 to-slate-600" : "bg-white/30 backdrop-blur-md"}
               `}>
                   <div className="w-full h-full rounded-full overflow-hidden relative bg-white">
                       {userData.avatar ? (
                           <Image 
                               src={userData.avatar} 
                               alt="Avatar" 
                               fill 
                               className="object-cover" 
                           />
                       ) : (
                           <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400 text-5xl font-bold uppercase">
                               {userData.email[0]}
                           </div>
                       )}
                   </div>
               </div>
               {userData.isOwner && (
                   <button 
                      onClick={() => setShowEditModal(true)}
                      className="absolute bottom-2 right-2 p-3 bg-white text-[#5a8a7d] rounded-full shadow-lg hover:scale-110 transition-transform"
                    >
                      <FaCamera />
                   </button>
               )}
            </div>

            {/* Ma'lumotlar (Info) */}
            <div className="flex-1 text-center sm:text-left space-y-4">
              <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2 drop-shadow-md">
                     {userData.fullName || userData.email.split('@')[0]}
                  </h1>
                  <p className="text-white/90 font-medium text-lg flex items-center justify-center sm:justify-start gap-2">
                    <FaUser className="text-xs opacity-70" /> {userData.role === 'admin' ? 'Administrator' : userData.occupation === 'student' ? 'Talaba' : userData.occupation === 'teacher' ? "O'qituvchi" : 'Kitobxon'}
                  </p>
                  <div className="flex items-center gap-4 text-white/70 text-sm">
                      <p>{userData.email}</p>
                      <div className="flex items-center gap-3">
                        {userData.instagram && (
                            <a href={`https://instagram.com/${userData.instagram.replace('@','')}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                <FaInstagram size={18} />
                            </a>
                        )}
                        {userData.telegram && (
                            <a href={`https://t.me/${userData.telegram.replace('@','')}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                <FaTelegram size={18} />
                            </a>
                        )}
                      </div>
                  </div>
                  {userData.bio && (
                      <p className="mt-4 text-white/80 text-sm font-medium italic max-w-xl line-clamp-2">
                          &quot;{userData.bio}&quot;
                      </p>
                  )}
              </div>

              {/* Qiziqishlar Teglari */}
              {userData.interests?.length > 0 && (
                  <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-4">
                      {userData.interests.map(intLabel => (
                          <div key={intLabel} className="flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-slate-800/90 rounded-full shadow-sm border border-white/20 backdrop-blur-sm group hover:scale-105 transition-transform duration-300">
                              <span className="text-lg">{getGenreIcon(intLabel)}</span>
                              <span className="text-xs font-bold uppercase tracking-widest text-[#5a8a7d] dark:text-[#96C7B9]">{intLabel}</span>
                          </div>
                      ))}
                  </div>
              )}

              {userData.isOwner ? (
                  <div className="flex flex-wrap justify-center sm:justify-start gap-4 pt-2">
                     <button 
                        onClick={() => setShowEditModal(true)}
                        className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95
                            ${darkMode ? "bg-white text-slate-900 hover:bg-gray-100" : "bg-white text-[#5a8a7d] hover:bg-[#D1F0E0]"}
                        `}
                     >
                        <FaEdit /> Profilni Tahrirlash
                     </button>
                  </div>
              ) : (
                  <div className="flex flex-wrap justify-center sm:justify-start gap-4 pt-2">
                     <button 
                        className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95 bg-white text-[#5a8a7d] hover:bg-[#D1F0E0]`}
                     >
                        <FaUserPlus /> Do'st Bo'lish
                     </button>
                  </div>
              )}
            </div>

            {/* Statistika */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 w-full sm:w-auto self-end sm:self-center mt-4 sm:mt-0">
               {userData.isOwner && <StatBox value={activeTracking.length} label="Kuzatuv" isHighlight />}
               <StatBox value={userData.friendsCount || 0} label="Do'stlar" />
               <StatBox value={favorites.length} label="Sevimlilar" />
               <StatBox value={readBooks.length} label="O'qilgan" />
               <StatBox value={rentals.length} label="Ijara" />
               <StatBox value={orders.length} label="Xarid" />
            </div>

          </div>
        </div>

        {/* ---------------- Navigatsiya Tablari ---------------- */}
        <div className={`p-1.5 rounded-2xl shadow-lg mb-8 inline-flex flex-wrap sticky top-24 z-30 mx-auto
            ${darkMode ? "bg-[#1e293b]" : "bg-white"}
        `}>
           {tabs.filter(t => {
               if(userData.isOwner) return true;
               return ['readHistory', 'rentals', 'purchases'].includes(t.id);
           }).map(tab => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all
                      ${activeTab === tab.id 
                          ? "bg-gradient-to-r from-[#96C7B9] to-[#5a8a7d] text-white shadow-md" 
                          : (darkMode ? "text-slate-400 hover:text-white" : "text-gray-500 hover:text-[#5a8a7d]")
                      }
                  `}
               >
                   {tab.icon} {tab.label}
               </button>
           ))}
        </div>

        {/* ---------------- Asosiy Tarkib ---------------- */}
        <AnimatePresence mode="wait">
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
            >
                {activeTab === 'tracking' && <TrackingList trackingItems={activeTracking} darkMode={darkMode} />}
                {activeTab === 'favorites' && <FavoritesGrid books={favorites} darkMode={darkMode} />}
                {activeTab === 'readHistory' && <ReadBooksGrid books={readBooks} darkMode={darkMode} />}
                {activeTab === 'rentals' && <RentalsList rentals={rentals} darkMode={darkMode} setReviewItem={setReviewItem} setShowReviewModal={setShowReviewModal} />}
                {activeTab === 'purchases' && <OrdersList orders={orders} darkMode={darkMode} setReviewItem={setReviewItem} setShowReviewModal={setShowReviewModal} />}
                {activeTab === 'notifications' && <NotificationsList notifications={notifications} markAllRead={markAllRead} darkMode={darkMode} setNotifications={setNotifications} refreshData={fetchData} />}
            </motion.div>
        </AnimatePresence>

      </div>

      {/* ---------------- TAHRIRLASH MODALI ---------------- */}
      <AnimatePresence>
          {showReviewModal && (
              <ReviewModal 
                  item={reviewItem} 
                  onClose={() => setShowReviewModal(false)}
                  onSubmit={handleReviewSubmit}
                  reviewForm={reviewForm}
                  setReviewForm={setReviewForm}
                  darkMode={darkMode}
              />
          )}

          {showEditModal && (
               <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                  <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className={`w-full max-w-lg rounded-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]
                          ${darkMode ? "bg-[#0f172a] border border-slate-700" : "bg-white"}
                      `}
                  >
                      {/* Modal Bosh qismi */}
                      <div className={`p-6 border-b flex justify-between items-center shrink-0
                          ${darkMode ? "border-slate-700" : "border-gray-100"}
                      `}>
                          <h2 className={`text-xl font-black flex items-center gap-2 ${darkMode ? "text-white" : "text-slate-800"}`}>
                              <FaEdit className="text-[#96C7B9]" /> Profilni Tahrirlash
                          </h2>
                          <button onClick={() => setShowEditModal(false)} className={`p-2 rounded-full transition-colors ${darkMode ? "hover:bg-white/10 text-white" : "hover:bg-gray-100 text-gray-500"}`}>
                              <FaTimes />
                          </button>
                      </div>

                      {/* Forma */}
                      <div className="overflow-y-auto custom-scrollbar flex-1 p-6">
                        <form onSubmit={handleEditSubmit} className="space-y-5">
                            {/* Avatar */}
                            <div className="flex flex-col items-center">
                                <label className="relative cursor-pointer group">
                                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#96C7B9]/30 relative">
                                        {editForm.avatarPreview ? (
                                            <Image src={editForm.avatarPreview} alt="Preview" fill className="object-cover" />
                                        ) : (
                                            <div className={`w-full h-full flex items-center justify-center text-4xl font-bold ${darkMode ? "bg-slate-800 text-[#96C7B9]" : "bg-gray-100 text-gray-400"}`}>
                                                {userData.email[0]}
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <FaCamera className="text-white text-2xl" />
                                        </div>
                                    </div>
                                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                </label>
                                <p className={`text-xs mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Rasmni o'zgartirish uchun bosing</p>
                            </div>

                            {/* Inputs */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-bold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Ism va Familiya</label>
                                    <div className="relative">
                                        <FaUser className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
                                        <input 
                                            type="text" 
                                            value={editForm.fullName}
                                            onChange={e => setEditForm({...editForm, fullName: e.target.value})}
                                            className={`w-full pl-10 pr-4 py-3 rounded-xl font-medium outline-none border transition-all ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-gray-50 border-gray-200"}`}
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className={`block text-sm font-bold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Faoliyat turi</label>
                                    <div className="relative">
                                        <FaBriefcase className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
                                        <select 
                                            value={editForm.occupation}
                                            onChange={e => setEditForm({...editForm, occupation: e.target.value})}
                                            className={`w-full pl-10 pr-4 py-3 rounded-xl font-medium outline-none border transition-all appearance-none ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-gray-50 border-gray-200"}`}
                                        >
                                            <option value="student">Talaba 🎓</option>
                                            <option value="teacher">O'qituvchi 👨‍🏫</option>
                                            <option value="other">Boshqa</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className={`block text-sm font-bold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Telefon Raqam</label>
                                <div className="relative">
                                    <FaPhone className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
                                    <input 
                                        type="tel" 
                                        placeholder="+998"
                                        value={editForm.phone}
                                        onChange={e => setEditForm({...editForm, phone: e.target.value})}
                                        className={`w-full pl-10 pr-4 py-3 rounded-xl font-medium outline-none border transition-all ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-gray-50 border-gray-200"}`}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-bold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Instagram</label>
                                    <div className="relative">
                                        <FaInstagram className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
                                        <input 
                                            type="text" 
                                            placeholder="@username"
                                            value={editForm.instagram}
                                            onChange={e => setEditForm({...editForm, instagram: e.target.value})}
                                            className={`w-full pl-10 pr-4 py-3 rounded-xl font-medium outline-none border transition-all ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-gray-50 border-gray-200"}`}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={`block text-sm font-bold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Telegram</label>
                                    <div className="relative">
                                        <FaTelegram className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
                                        <input 
                                            type="text" 
                                            placeholder="@username"
                                            value={editForm.telegram}
                                            onChange={e => setEditForm({...editForm, telegram: e.target.value})}
                                            className={`w-full pl-10 pr-4 py-3 rounded-xl font-medium outline-none border transition-all ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-gray-50 border-gray-200"}`}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className={`block text-sm font-bold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>O'zingiz haqingizda (Bio)</label>
                                <textarea 
                                    rows="3"
                                    placeholder="Qisqacha ma'lumot qoldiring..."
                                    value={editForm.bio}
                                    onChange={e => setEditForm({...editForm, bio: e.target.value})}
                                    className={`w-full px-4 py-3 rounded-xl font-medium outline-none border transition-all resize-none ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-gray-50 border-gray-200"}`}
                                />
                            </div>
                            
                            <div>
                                <label className={`block text-sm font-bold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Qiziqishlar</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {GENRES.map(genre => {
                                        const isSelected = editForm.interests.includes(genre.label);
                                        return (
                                            <button
                                                key={genre.label}
                                                type="button"
                                                onClick={() => toggleInterest(genre.label)}
                                                className={`px-3 py-3 rounded-xl text-sm font-bold border transition-all flex items-center gap-3
                                                    ${isSelected 
                                                        ? "bg-[#96C7B9] text-white border-[#96C7B9]" 
                                                        : (darkMode ? "bg-slate-800 border-slate-700 text-gray-400" : "bg-white border-gray-200 text-gray-600")
                                                    }
                                                `}
                                            >
                                                <span className="text-lg">{genre.icon}</span>
                                                <span className="flex-1 text-left">{genre.label}</span>
                                                {isSelected && <FaCheck className="text-xs" />}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </form>
                      </div>

                      {/* Footer Actions */}
                      <div className={`p-6 border-t flex justify-end gap-3 shrink-0 ${darkMode ? "border-slate-700" : "border-gray-100"}`}>
                          <button onClick={() => setShowEditModal(false)} className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100">Bekor qilish</button>
                          <button onClick={handleEditSubmit} className="px-8 py-2.5 rounded-xl font-bold bg-[#96C7B9] text-white">Saqlash</button>
                      </div>

                  </motion.div>
               </div>
          )}
      </AnimatePresence>

    </div>
  );
}

// --- SUB COMPONENTS ---

const TrackingList = ({ trackingItems, darkMode }) => {
    if (!trackingItems.length) return <EmptyState label="Hozircha kuzatilayotgan buyurtmalar yo'q" icon={FaMapMarkedAlt} darkMode={darkMode} />

    const steps = [
        { label: "Buyurtma berildi", icon: <FaBoxOpen /> },
        { label: "Admin tasdiqladi", icon: <FaClipboardCheck /> }, // Status: Approved/Processing
        { label: "Kurier qabul qildi", icon: <FaUserSecret /> }, // Courier: Accepted
        { label: "Kurier kitobni oldi", icon: <FaBook /> },    // Courier: Picked Up
        { label: "Yo'lga chiqdi", icon: <FaTruck /> },        // Courier: On Way
        { label: "Keldi / Yetkazildi", icon: <FaMapMarkerAlt /> } // Courier: Delivered
    ];

    const getStepIndex = (item) => {
        // If delivered/completed fully
        if (item.courierStatus === "delivered" || item.status === 'completed' || item.status === 'returned') return 5;
        
        // Courier Progress
        if (item.courierStatus === 'on_way') return 4;
        if (item.courierStatus === 'picked_up') return 3;
        if (item.courierStatus === 'accepted') return 2;
        
        // Admin Progress
        if (item.status === 'approved' || item.status === 'processing') return 1;
        
        // Default
        return 0;
    };

    return (
        <div className="space-y-8">
            {trackingItems.map((item) => {
                const currentStepIndex = getStepIndex(item);

                return (
                    <div key={item._id} className={`p-6 rounded-3xl border shadow-sm ${darkMode ? "bg-[#1e293b] border-slate-700" : "bg-white border-gray-100"}`}>
                        <div className="flex items-center gap-4 mb-6 border-b pb-4 border-dashed border-gray-200 dark:border-slate-700">
                             <div className="w-16 h-16 rounded-xl overflow-hidden relative">
                                 <Image src={item.image} alt="Book" fill className="object-cover" />
                             </div>
                             <div>
                                 <h3 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{item.title}</h3>
                                 <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{item.items}</p>
                             </div>
                             <div className="ml-auto flex flex-col items-end">
                                 <StatusBadge status={item.status} />
                                 {item.courierStatus && (
                                     <span className="text-[10px] font-bold text-blue-500 uppercase mt-1">
                                         Kuryer: {item.courierStatus}
                                     </span>
                                 )}
                             </div>
                        </div>

                        {/* Timeline */}
                        <div className="relative">
                            {/* Connecting Line */}
                            <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 dark:bg-slate-700 rounded-full z-0">
                                <div className="h-full bg-[#96C7B9] rounded-full transition-all duration-1000" style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}></div>
                            </div>

                            <div className="flex justify-between relative z-10 w-full">
                                {steps.map((step, idx) => {
                                    const isActive = idx <= currentStepIndex;
                                    const isCurrent = idx === currentStepIndex;
                                    
                                    return (
                                        <div key={idx} className="flex flex-col items-center group relative">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm border-4 transition-all duration-500
                                                ${isActive ? "bg-[#96C7B9] border-white text-white shadow-md dark:border-slate-800" : "bg-gray-100 dark:bg-slate-800 border-white dark:border-slate-700 text-gray-400 dark:text-gray-600"}
                                                ${isCurrent ? "scale-125 ring-4 ring-[#96C7B9]/20" : ""}
                                            `}>
                                                {step.icon}
                                            </div>
                                            {/* Label - Hide on mobile if not current/active to save space, or show abbreviated */}
                                            <span className={`text-[9px] sm:text-xs font-bold mt-2 text-center max-w-[60px] leading-tight transition-colors hidden sm:block
                                                ${isActive ? (darkMode ? "text-white" : "text-gray-800") : (darkMode ? "text-gray-600" : "text-gray-400")}
                                            `}>
                                                {step.label}
                                            </span>
                                            {/* Mobile Label popup (only current) */}
                                            {isCurrent && (
                                                <span className="sm:hidden absolute -bottom-6 whitespace-nowrap text-[10px] bg-black/70 text-white px-2 py-1 rounded">
                                                    {step.label}
                                                </span>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        
                        {item.courierStatus === 'on_way' && (
                            <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm text-center font-medium animate-pulse border border-blue-100 dark:border-blue-800">
                                <FaTruck className="inline mr-2 text-lg" /> Kuryer yo'lda! Buyurtmangiz yaqin orada yetib boradi.
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

const FavoritesGrid = ({ books, darkMode }) => {
    if (!books.length) return <EmptyState label="Sevimlilar ro'yxati bo'sh" icon={FaHeart} darkMode={darkMode} />
    
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {books.map((book, idx) => (
                <div key={book._id || idx} className="relative aspect-[3/4] group cursor-pointer overflow-hidden rounded-2xl shadow-md bg-gray-50" onClick={() => window.location.href = '/mainPage/sotibolish'}>
                    <Image 
                        src={book.images && book.images[0] ? book.images[0] : "https://placehold.co/400x600?text=Kitob"} 
                        alt={book.title || "Kitob"} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-2 text-center text-white backdrop-blur-sm">
                        <FaHeart className="text-3xl mb-2 text-red-500 drop-shadow-lg" />
                        <h4 className="font-bold text-sm sm:text-lg line-clamp-2">{book.title}</h4>
                        <span className="text-xs opacity-90 mt-1">{book.author}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}

const ReadBooksGrid = ({ books, darkMode }) => {
    if (!books.length) return <EmptyState label="Hozircha o'qilgan kitoblar yo'q" icon={FaBookOpen} darkMode={darkMode} />
    
    return (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-1 sm:gap-4 md:gap-6">
            {books.map((book, idx) => (
                <div key={idx} className="relative aspect-[3/4] group cursor-pointer overflow-hidden rounded-md sm:rounded-xl">
                    <Image 
                        src={book.bookImage || "https://placehold.co/400x600"} 
                        alt={book.bookTitle || "Kitob"} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-2 text-center text-white backdrop-blur-sm">
                        <FaHeart className="text-2xl mb-2 animate-bounce text-[#96C7B9]" />
                        <h4 className="font-bold text-sm sm:text-base line-clamp-2">{book.bookTitle}</h4>
                        <span className="text-xs opacity-80 mt-1 uppercase tracking-wide bg-black/50 px-2 py-0.5 rounded">
                            {book.type === 'rented' ? 'Ijaraga' : 'Sotib olingan'}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    )
}

const StatBox = ({ value, label, isHighlight }) => (
    <div className={`backdrop-blur-md rounded-2xl p-2 sm:p-4 text-center border min-w-[70px] ${isHighlight ? "bg-[#96C7B9]/20 border-[#96C7B9] text-[#96C7B9]" : "bg-white/10 border-white/10 text-white"}`}>
        <h4 className={`text-xl sm:text-2xl font-black ${isHighlight ? "text-[#96C7B9]" : "text-white"}`}>{value}</h4>
        <span className={`text-[10px] sm:text-xs uppercase font-bold tracking-wider ${isHighlight ? "text-[#96C7B9]" : "text-white/70"}`}>{label}</span>
    </div>
);

const RentalsList = ({ rentals, darkMode, setReviewItem, setShowReviewModal }) => {
    if(!rentals.length) return <EmptyState label="Ijaralar tarixi bo'sh" icon={FaBook} darkMode={darkMode} />
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentals.map(rent => (
                <div key={rent._id} className={`rounded-2xl overflow-hidden border transition-all hover:shadow-lg
                    ${darkMode ? "bg-[#1e293b] border-slate-700" : "bg-white border-gray-100"}
                `}>
                    <div className="h-40 relative">
                         <Image src={rent.bookImage || "https://placehold.co/400x200"} alt="Book" fill className="object-cover" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                         <div className="absolute bottom-4 left-4 right-4">
                             <h3 className="text-white font-bold text-lg line-clamp-1">{rent.bookTitle}</h3>
                             <StatusBadge status={rent.status} />
                         </div>
                    </div>
                    <div className="p-4 space-y-2 text-sm">
                        <div className={`flex justify-between ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            <span>Muddati:</span> <span className={`font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>{rent.days} kun</span>
                        </div>
                        <div className={`flex justify-between ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            <span>Narx:</span> <span className={`font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>{rent.totalPrice?.toLocaleString()} so'm</span>
                        </div>
                        {rent.status === 'returned' && (
                            <button 
                                onClick={() => {
                                    setReviewItem({ bookId: rent.book, title: rent.bookTitle });
                                    setShowReviewModal(true);
                                }}
                                className="w-full mt-2 py-2 rounded-xl bg-[#96C7B9] text-white text-xs font-bold hover:bg-[#5a8a7d] transition-all flex items-center justify-center gap-2"
                            >
                                <FaStar /> Taqriz qoldirish
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

const OrdersList = ({ orders, darkMode, setReviewItem, setShowReviewModal }) => {
    if(!orders.length) return <EmptyState label="Xaridlar tarixi bo'sh" icon={FaShoppingBag} darkMode={darkMode} />
    return (
        <div className="space-y-4">
            {orders.map(order => (
                <div key={order._id} className={`p-5 rounded-2xl border flex flex-col sm:flex-row gap-6 items-center
                    ${darkMode ? "bg-[#1e293b] border-slate-700" : "bg-white border-gray-100 hover:shadow-md transition-shadow"}
                `}>
                     <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${darkMode ? "bg-slate-800 text-[#96C7B9]" : "bg-[#D1F0E0] text-[#5a8a7d]"}`}>
                         <FaShoppingBag />
                     </div>
                     <div className="flex-1 w-full text-center sm:text-left">
                         <h4 className={`font-bold text-lg ${darkMode ? "text-white" : "text-slate-800"}`}>Buyurtma #{order._id.toString().slice(-6)}</h4>
                         <p className={`text-sm mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                             {new Date(order.createdAt).toLocaleDateString()}
                         </p>
                         <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                             {order.items.map((item, i) => (
                                 <div key={i} className="flex items-center gap-2">
                                     <span className={`text-xs px-2 py-1 rounded bg-gray-100 text-gray-600 font-medium ${darkMode ? "bg-slate-700 text-gray-300" : ""}`}>
                                         {item.quantity}x {item.title}
                                     </span>
                                     {order.status === 'delivered' && (
                                         <button 
                                            onClick={() => {
                                                setReviewItem({ bookId: item.book, title: item.title });
                                                setShowReviewModal(true);
                                            }}
                                            className="text-[#96C7B9] hover:text-[#5a8a7d] transition-colors"
                                            title="Taqriz qoldirish"
                                         >
                                             <FaStar className="text-sm" />
                                         </button>
                                     )}
                                 </div>
                             ))}
                         </div>
                     </div>
                     <div className="text-right">
                         <span className={`block text-xl font-black mb-1 ${darkMode ? "text-white" : "text-slate-800"}`}>
                             {order.totalPrice?.toLocaleString()} so'm
                         </span>
                         <StatusBadge status={order.status} />
                     </div>
                </div>
            ))}
        </div>
    )
}

const NotificationsList = ({ notifications, markAllRead, darkMode, setNotifications, refreshData }) => {
    if(!notifications.length) return <EmptyState label="Xabarlar yo'q" icon={FaBell} darkMode={darkMode} />

    const [extendingNotif, setExtendingNotif] = useState(null);

    const handleAction = async (notifId, action, data, days = 1) => {
        const toastId = toast.loading("Jarayonda...");
        try {
            const { rentId } = data || {};
            if(!rentId) throw new Error("Rent ID not found");

            const res = await fetch('/api/rent/action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rentId, action, notifId, days })
            });
            const resData = await res.json();
            
            if(resData.success) {
                toast.success(resData.message, { id: toastId });
                setExtendingNotif(null);
                
                // Local state update: mark as read and change type/message
                setNotifications(prev => prev.map(notif => {
                    if (notif._id === notifId) {
                        return {
                            ...notif,
                            isRead: true,
                            type: 'success',
                            message: action === 'return' 
                                ? "Topshirish so'rovi yuborildi. Kuryer tez orada bog'lanadi." 
                                : `Ijara muddati ${days} kunga uzaytirildi.`
                        };
                    }
                    return notif;
                }));

                // Quietly refresh all profile data (rentals, tracking, etc) without reload
                if (refreshData) refreshData();
            } else {
                 toast.error(resData.message, { id: toastId });
            }
        } catch (e) {
            toast.error("Xatolik: " + e.message, { id: toastId });
        }
    };

    const ExtendModal = ({ notif }) => (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
            <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                className={`${darkMode ? 'bg-slate-900' : 'bg-white'} w-full max-w-sm rounded-3xl p-6 shadow-2xl border ${darkMode ? 'border-white/10' : 'border-gray-100'}`}
            >
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                        <FaRocket />
                    </div>
                    <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Ijarani uzaytirish</h3>
                    <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Necha kunga uzaytirishni xohlaysiz?
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                    {[1, 3, 7].map(d => (
                        <button 
                            key={d}
                            onClick={() => handleAction(notif._id, 'extend', notif.data, d)}
                            className={`py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1
                                ${darkMode 
                                    ? 'border-white/10 hover:border-[#96C7B9] hover:bg-white/5 text-white' 
                                    : 'border-gray-100 hover:border-[#96C7B9] hover:bg-[#D1F0E0]/30 text-slate-900'}
                            `}
                        >
                            <span className="text-lg font-bold">+{d}</span>
                            <span className={`text-[10px] uppercase font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>kun</span>
                        </button>
                    ))}
                </div>

                <button 
                    onClick={() => setExtendingNotif(null)}
                    className="w-full py-3 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
                >
                    Bekor qilish
                </button>
            </motion.div>
        </motion.div>
    );

    const getNotificationIcon = (type) => {
        switch(type) {
            case 'success': return <FaCheck className="text-xl" />;
            case 'error': return <FaTimes className="text-xl" />;
            case 'action_required': 
            case 'rental_expiry': return <FaBell className="text-xl animate-bounce" />;
            case 'warning': return <FaBell className="text-xl" />;
            default: return <FaBell className="text-xl" />;
        }
    };

    const getNotificationStyle = (type, isRead, darkMode) => {
        const baseStyles = "relative overflow-hidden backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-xl";
        
        if (type === 'success') {
            return `${baseStyles} ${darkMode 
                ? 'bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 border-2 border-emerald-500/30' 
                : 'bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200'}`;
        } else if (type === 'error') {
            return `${baseStyles} ${darkMode 
                ? 'bg-gradient-to-br from-red-900/40 to-red-800/20 border-2 border-red-500/30' 
                : 'bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200'}`;
        } else if (type === 'action_required' || type === 'rental_expiry') {
            return `${baseStyles} ${darkMode 
                ? 'bg-gradient-to-br from-orange-900/40 to-amber-800/20 border-2 border-orange-500/30' 
                : 'bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-300'}`;
        } else if (type === 'warning') {
            return `${baseStyles} ${darkMode 
                ? 'bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 border-2 border-yellow-500/30' 
                : 'bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-300'}`;
        } else {
            return `${baseStyles} ${darkMode 
                ? 'bg-gradient-to-br from-blue-900/40 to-blue-800/20 border-2 border-blue-500/30' 
                : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200'}`;
        }
    };

    const getIconBgColor = (type, darkMode) => {
        if (type === 'success') return darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600';
        if (type === 'error') return darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600';
        if (type === 'action_required' || type === 'rental_expiry') return darkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600';
        if (type === 'warning') return darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-600';
        return darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600';
    };

    return (
        <div className="space-y-6">
             {notifications.some(n => !n.isRead) && (
                 <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-center p-4 rounded-2xl bg-gradient-to-r from-[#96C7B9]/10 to-[#D1F0E0]/10 border border-[#96C7B9]/20">
                     <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-[#96C7B9]/20 flex items-center justify-center">
                             <FaBell className="text-[#96C7B9] text-lg" />
                         </div>
                         <div>
                             <h3 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                                 {notifications.filter(n => !n.isRead).length} ta o'qilmagan xabar
                             </h3>
                             <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                 Yangi bildirishnomalaringiz bor
                             </p>
                         </div>
                     </div>
                     <button 
                        onClick={markAllRead} 
                        className="px-4 py-2 rounded-xl bg-[#96C7B9] text-white text-xs font-bold hover:bg-[#5a8a7d] transition-all active:scale-95 shadow-lg">
                         Hammasini o'qildi
                     </button>
                 </motion.div>
             )}
            
            {notifications.map((n, index) => (
                <motion.div 
                    key={n._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`${getNotificationStyle(n.type, n.isRead, darkMode)} p-6 rounded-2xl ${n.isRead ? 'opacity-60' : 'opacity-100'}`}
                >
                    {/* Decorative gradient overlay */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    
                    <div className="relative z-10">
                        {/* Header with Icon */}
                        <div className="flex items-start gap-4 mb-4">
                            <div className={`w-14 h-14 rounded-2xl ${getIconBgColor(n.type, darkMode)} flex items-center justify-center shrink-0 shadow-lg`}>
                                {getNotificationIcon(n.type)}
                            </div>
                            
                            <div className="flex-1">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <h4 className={`font-black text-base ${darkMode ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                                        {n.title}
                                        {!n.isRead && (
                                            <span className="relative flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                            </span>
                                        )}
                                    </h4>
                                </div>
                                
                                <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                                    {n.message}
                                </p>
                                
                                <div className="flex items-center gap-2 mt-3">
                                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${darkMode ? 'bg-white/10 text-gray-400' : 'bg-black/5 text-gray-600'}`}>
                                        {new Date(n.createdAt).toLocaleDateString('uz-UZ', { 
                                            day: 'numeric', 
                                            month: 'short', 
                                            hour: '2-digit', 
                                            minute: '2-digit' 
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {(n.type === 'action_required' || n.type === 'rental_expiry') && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className={`flex flex-col sm:flex-row gap-3 mt-5 pt-5 border-t border-dashed ${darkMode ? 'border-white/10' : 'border-black/10'}`}>
                                <button 
                                    onClick={() => handleAction(n._id, 'return', n.data)}
                                    className="flex-1 group relative overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 hover:from-black hover:to-slate-900 text-white py-3.5 px-6 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
                                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                                    <FaBook className="text-base" />
                                    <span>Kitobni Topshirish</span>
                                </button>
                                
                                <button 
                                    onClick={() => setExtendingNotif(n)}
                                    className={`flex-1 group relative overflow-hidden py-3.5 px-6 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2
                                        ${darkMode 
                                            ? 'bg-white/10 hover:bg-white/20 text-white border-2 border-white/20' 
                                            : 'bg-white hover:bg-gray-50 text-slate-800 border-2 border-slate-200'
                                        }`}>
                                    <span className="absolute inset-0 bg-gradient-to-r from-[#96C7B9]/0 via-[#96C7B9]/20 to-[#96C7B9]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                                    <FaRocket className="text-base" />
                                    <span>Muddatni Uzaytirish</span>
                                </button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            ))}

            <AnimatePresence>
                {extendingNotif && <ExtendModal notif={extendingNotif} />}
            </AnimatePresence>
        </div>
    )
}

const StatusBadge = ({ status }) => {
    const config = {
        completed: { bg: "bg-green-100", text: "text-green-600", label: "Yakunlangan" },
        approved: { bg: "bg-emerald-100", text: "text-emerald-600", label: "Tasdiqlangan" },
        returned: { bg: "bg-blue-100", text: "text-blue-600", label: "Qaytarilgan" },
        pending: { bg: "bg-amber-100", text: "text-amber-600", label: "Kutilmoqda" },
        active: { bg: "bg-green-100", text: "text-green-600", label: "Faol" },
        cancelled: { bg: "bg-rose-100", text: "text-rose-600", label: "Bekor qilingan" },
        rejected: { bg: "bg-red-100", text: "text-red-600", label: "Rad etilgan" },
        processing: { bg: "bg-blue-100", text: "text-blue-600", label: "Jarayonda" },
        return_requested: { bg: "bg-orange-100", text: "text-orange-600", label: "Qaytarish so'ralgan" },
        courier_assigned: { bg: "bg-indigo-100", text: "text-indigo-600", label: "Kuryer tayinlangan" },
        courier_picked_up: { bg: "bg-purple-100", text: "text-purple-600", label: "Kuryer oldi" },
        on_way: { bg: "bg-blue-100", text: "text-blue-600", label: "Yo'lda" },
        delivered: { bg: "bg-green-100", text: "text-green-600", label: "Yetkazildi" },
    };
    const c = config[status] || { bg: "bg-gray-100", text: "text-gray-600", label: status };
    return <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${c.bg} ${c.text}`}>{c.label}</span>
};

const EmptyState = ({ label, icon: Icon, darkMode }) => (
    <div className={`py-12 flex flex-col items-center justify-center opacity-40 ${darkMode ? "text-white" : "text-slate-400"}`}>
        <Icon className="text-4xl mb-3" />
        <p className="font-bold">{label}</p>
    </div>
);

const ReviewModal = ({ item, onClose, onSubmit, reviewForm, setReviewForm, darkMode }) => {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div 
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                className={`w-full max-w-md rounded-3xl p-6 shadow-2xl border ${darkMode ? "bg-slate-900 border-white/10" : "bg-white border-gray-100"}`}
            >
                <div className="text-center mb-6">
                    <h3 className={`text-xl font-black ${darkMode ? "text-white" : "text-slate-800"}`}>
                        Taqriz qoldirish
                    </h3>
                    <p className={`text-sm mt-1 font-bold text-[#96C7B9]`}>
                        {item?.title}
                    </p>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="flex flex-col items-center gap-3">
                        <label className={`text-sm font-bold ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            Baholang
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button 
                                    key={star}
                                    type="button"
                                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                    className="text-3xl transition-transform active:scale-90"
                                >
                                    {star <= reviewForm.rating ? (
                                        <FaStar className="text-yellow-400" />
                                    ) : (
                                        <FaRegStar className={darkMode ? "text-gray-600" : "text-gray-300"} />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className={`block text-sm font-bold mb-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            Fikringiz
                        </label>
                        <textarea 
                            required
                            rows={4}
                            value={reviewForm.comment}
                            onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                            placeholder="Kitob sizga yoqdimi? Qanday taassurotlar qoldi?"
                            className={`w-full p-4 rounded-2xl outline-none border transition-all resize-none ${
                                darkMode 
                                ? "bg-slate-800 border-slate-700 text-white focus:border-[#96C7B9]" 
                                : "bg-gray-50 border-gray-200 focus:border-[#96C7B9]"
                            }`}
                        ></textarea>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button 
                            type="button"
                            onClick={onClose}
                            className={`flex-1 py-3.5 rounded-xl font-bold transition-all ${
                                darkMode ? "bg-white/5 text-gray-400 hover:bg-white/10" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                        >
                            Bekor qilish
                        </button>
                        <button 
                            type="submit"
                            className="flex-1 py-3.5 rounded-xl bg-[#96C7B9] text-white font-bold hover:bg-[#5a8a7d] transition-all shadow-lg shadow-[#96C7B9]/20"
                        >
                            Yuborish
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};
