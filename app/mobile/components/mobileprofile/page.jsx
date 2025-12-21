"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Repeat, GitCommit, MessageSquare, Settings, ChevronRight, PenTool, MapPin, Eye, EyeOff, LayoutGrid, Award, Heart, Share2, MoreHorizontal, Loader2, Camera, X, Instagram, Send, User, ShoppingBag, Clock, CheckCircle2, AlertCircle, Library, Wallet, ShieldCheck, HelpCircle, Bell, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';

const TABS = {
  DASHBOARD: 'dashboard',
  ORDERS: 'orders',
  SUPPORT: 'support',
  SETTINGS: 'settings'
};

import { useFavorites } from '@/app/FavoritesContext';
import { FaHeart, FaRegHeart, FaShoppingCart, FaStar } from 'react-icons/fa';

export default function MobileProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState(TABS.DASHBOARD);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({ read: 0, handovers: 0, traces: 0, thoughts: 0, favorites: 0 });
  const [currentRead, setCurrentRead] = useState(null);
  const [likedBooks, setLikedBooks] = useState([]);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [settings, setSettings] = useState({
    visibility: 'emotional',
    allowHandover: true,
    showCity: true
  });

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/user/profile');
            const data = await res.json();
            if (data.success) {
                const u = data.data.user;
                const orders = data.data.orders || [];
                const rentals = data.data.rentals || [];

                setUserData(u);

                // Calculate Stats
                const completedOrders = orders.filter(o => o.status === 'completed').length;
                const completedRentals = rentals.filter(r => r.status === 'returned').length;
                
                setStats({
                    read: completedOrders + completedRentals,
                    handovers: rentals.length,
                    traces: orders.length + rentals.length, 
                    thoughts: (data.data.reviews || []).length,
                    favorites: (u.favorites || []).length
                });

                // Get Current Read (latest active rental or order)
                const activeRental = rentals.find(r => r.status === 'active' || r.status === 'approved');
                if (activeRental) {
                    setCurrentRead({
                        title: activeRental.bookTitle,
                        author: "Muallif", // Rent model usually has bookTitle but maybe not author
                        cover: activeRental.bookImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
                        progress: 45, // Static for now
                        lineage: ["Ali", "Bobur", u.fullName || u.email.split('@')[0]]
                    });
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    fetchProfile();
  }, [session]);

  const ProfileSkeleton = () => (
    <div className="min-h-screen bg-white dark:bg-slate-900 animate-pulse">
        <div className="pt-8 pb-4 px-5">
            <div className="flex items-center gap-6 mb-4">
                <div className="w-24 h-24 bg-gray-200 dark:bg-slate-800 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-3">
                    <div className="flex justify-between pr-4">
                        {[1,2,3].map(i => <div key={i} className="w-10 h-10 bg-gray-200 dark:bg-slate-800 rounded-lg" />)}
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1 h-8 bg-gray-200 dark:bg-slate-800 rounded-lg" />
                        <div className="w-8 h-8 bg-gray-200 dark:bg-slate-800 rounded-lg" />
                    </div>
                </div>
            </div>
            <div className="px-1 space-y-2">
                <div className="w-40 h-6 bg-gray-200 dark:bg-slate-800 rounded" />
                <div className="w-24 h-4 bg-gray-200 dark:bg-slate-800 rounded" />
                <div className="w-full h-12 bg-gray-200 dark:bg-slate-800 rounded" />
            </div>
        </div>
        <div className="px-5 mb-6 flex gap-3 overflow-hidden">
             {[1,2,3].map(i => <div key={i} className="min-w-[70px] h-20 bg-gray-200 dark:bg-slate-800 rounded-full" />)}
        </div>
    </div>
  );

  if (loading) return <ProfileSkeleton />;
  if (!userData) return <div className="min-h-screen flex items-center justify-center">Iltimos, tizimga kiring</div>;

  const profileDisplay = {
      name: userData.fullName || userData.email.split('@')[0],
      username: userData.email.split('@')[0],
      avatar: userData.avatar || `https://ui-avatars.com/api/?name=${userData.fullName || userData.email}&background=52C6DA&color=fff`,
      bio: userData.bio || "",
      isFikrdosh: userData.role === 'admin',
      id: userData._id || userData.id
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
        const formData = new FormData();
        Object.keys(updatedData).forEach(key => {
            if (key === 'avatarFile' && updatedData[key]) {
                formData.append('avatar', updatedData[key]);
            } else if (updatedData[key] !== undefined) {
                if (Array.isArray(updatedData[key])) {
                    formData.append(key, JSON.stringify(updatedData[key]));
                } else {
                    formData.append(key, updatedData[key]);
                }
            }
        });

        const res = await fetch('/api/user/profile', {
            method: 'PUT',
            body: formData
        });

        const data = await res.json();
        if (data.success) {
            setUserData(data.data);
            setIsEditModalOpen(false);
            toast.success("Yangi qiyofa o'zingizga ham yoqdi degan umiddamiz! ✨📸");
        } else {
            toast.error(data.message || "O'zgarishlarni saqlashda biroz xatolik... 🔄");
        }
    } catch (error) {
        console.error("Update Error:", error);
        toast.error("Server bilan bog'lanishda xatolik");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pb-24 font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
      
      <HeaderSection user={{ ...profileDisplay, stats }} onEdit={() => setIsEditModalOpen(true)} />

      <div className="sticky top-[72px] z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800 transition-colors">
        <div className="flex justify-around items-center px-2">
          <TabButton 
            active={activeTab === TABS.DASHBOARD} 
            onClick={() => setActiveTab(TABS.DASHBOARD)}
            icon={<LayoutGrid size={24} />}
            label="Boshqaruv"
          />
          <TabButton 
            active={activeTab === TABS.ORDERS} 
            onClick={() => setActiveTab(TABS.ORDERS)}
            icon={<ShoppingBag size={24} />}
            label="Buyurtmalar"
          />
          <TabButton 
            active={activeTab === TABS.SUPPORT} 
            onClick={() => setActiveTab(TABS.SUPPORT)}
            icon={<MessageSquare size={24} />}
            label="Yordam"
          />
          <TabButton 
            active={activeTab === TABS.SETTINGS} 
            onClick={() => setActiveTab(TABS.SETTINGS)}
            icon={<Settings size={24} />}
            label="Sozlamalar"
          />
        </div>
      </div>

      <div className="px-5 pt-6">
        <AnimatePresence mode="wait">
          {activeTab === TABS.DASHBOARD && (
             <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                 <DashboardView user={profileDisplay} stats={stats} onEdit={() => setIsEditModalOpen(true)} setActiveTab={setActiveTab} />
             </motion.div>
          )}
          {activeTab === TABS.ORDERS && (
             <OrdersHistoryView key="orders" rentals={userData.rentals} orders={userData.orders} />
          )}
          {activeTab === TABS.SUPPORT && (
             <SupportView key="support" user={userData} />
          )}
          {activeTab === TABS.SETTINGS && (
             <SettingsView key="settings" settings={settings} setSettings={setSettings} />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isEditModalOpen && (
            <EditProfileModal 
                user={userData} 
                onClose={() => setIsEditModalOpen(false)} 
                onSave={handleUpdateProfile}
            />
        )}
      </AnimatePresence>

    </div>
  );
}

// --- Sub-Components ---

const HeaderSection = ({ user, onEdit }) => {
  const router = useRouter();
  
  return (
    <div className="pt-8 pb-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#52C6DA]/10 flex items-center justify-center overflow-hidden">
                <Image src={user.avatar} alt={user.name} width={48} height={48} className="object-cover" unoptimized />
          </div>
          <div>
              <h1 className="text-lg font-black text-slate-900 dark:text-white leading-tight">Salom, {user.name.split(' ')[0]}! ✨</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Boshqaruv markazi</p>
          </div>
      </div>

      <button 
          onClick={() => router.push(`/mobile/components/my-books?userId=${user.id}`)}
          className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#52C6DA] hover:bg-[#52C6DA]/10 transition-colors border border-slate-100 dark:border-slate-700"
      >
          <Library size={14} />
          Profil
      </button>
    </div>
  );
};

const DashboardView = ({ user, stats, onEdit, setActiveTab }) => {
    const router = useRouter();
    
    const menuItems = [
        { label: "Mening Buyurtmalarim", icon: <ShoppingBag size={20} />, color: "text-blue-500", bg: "bg-blue-50", desc: `${stats.traces} ta tranzaksiya`, action: TABS.ORDERS },
        { label: "Saqlanganlar", icon: <Heart size={20} />, color: "text-red-500", bg: "bg-red-50", desc: `${stats.favorites} ta kitob`, action: 'favorites_link' },
        { label: "Xavfsizlik", icon: <ShieldCheck size={20} />, color: "text-green-500", bg: "bg-green-50", desc: "Akkauntni himoyalash", action: TABS.SETTINGS },
        { label: "Yordam va Aloqa", icon: <HelpCircle size={20} />, color: "text-purple-500", bg: "bg-purple-50", desc: "Admin bilan bog'lanish", action: TABS.SUPPORT }
    ];

    const handleAction = (item) => {
        if (item.action === 'favorites_link') {
            router.push(`/mobile/components/my-books?userId=${user.id}&tab=favorites`);
        } else {
            setActiveTab(item.action);
        }
    };

    return (
        <div className="space-y-6 pb-12">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div 
                    onClick={() => setActiveTab(TABS.ORDERS)}
                    className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                    <div className="w-10 h-10 rounded-xl bg-[#52C6DA]/10 flex items-center justify-center text-[#52C6DA] mb-3">
                        <ShoppingBag size={20} />
                    </div>
                    <span className="block text-2xl font-black text-slate-900 dark:text-white">{stats.read}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Jami buyurtmalar</span>
                </div>
                <div 
                    onClick={() => setActiveTab(TABS.ORDERS)}
                    className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-3">
                        <Repeat size={20} />
                    </div>
                    <span className="block text-2xl font-black text-slate-900 dark:text-white">{stats.handovers}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ijaralar tarixi</span>
                </div>
            </div>

            {/* Management Cards */}
            <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 pl-1">Asosiy amallar</h3>
                {menuItems.map((item, i) => (
                    <button 
                        key={i}
                        onClick={() => handleAction(item)}
                        className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl ${item.bg} dark:bg-opacity-10 flex items-center justify-center ${item.color}`}>
                                {item.icon}
                            </div>
                            <div className="text-left">
                                <span className="block text-sm font-bold text-slate-900 dark:text-white">{item.label}</span>
                                <span className="text-[10px] font-medium text-slate-400">{item.desc}</span>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-slate-300" />
                    </button>
                ))}
            </div>

            {/* Profile Action */}
            <div className="bg-slate-900 dark:bg-white p-5 rounded-[2.5rem] text-white dark:text-slate-900 flex items-center justify-between shadow-xl">
                <div>
                   <h4 className="text-lg font-black leading-tight">Shaxsiy Profilingiz</h4>
                   <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Ma'lumotlarni tahrirlash</p>
                </div>
                <button 
                   onClick={onEdit}
                   className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-900 dark:text-white active:scale-90 transition-transform"
                >
                   <PenTool size={20} />
                </button>
            </div>
        </div>
    );
};

const OrdersHistoryView = ({ rentals = [], orders = [] }) => {
  const allTransactions = [
    ...rentals.map(r => ({ ...r, txType: 'rent' })),
    ...orders.map(o => ({ ...o, txType: 'buy' }))
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (allTransactions.length === 0) return (
    <div className="py-20 text-center opacity-60">
        <ShoppingBag size={48} className="mx-auto mb-4 text-slate-300" />
        <p className="font-bold text-slate-400">Tranzaksiyalar tarixi bo&apos;sh</p>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pb-10">
      {allTransactions.map((tx, idx) => (
        <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 premium-shadow">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${tx.txType === 'rent' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                {tx.txType === 'rent' ? 'Ijara' : 'Xarid'}
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                {new Date(tx.createdAt).toLocaleDateString('uz-UZ')}
              </span>
            </div>
            <StatusBadge status={tx.status} />
          </div>
          
          <div className="flex gap-3">
            <div className="w-12 h-16 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden flex-shrink-0 relative">
               <Image src={tx.bookImage || (tx.items?.[0]?.image) || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop"} alt="book" fill className="object-cover" unoptimized />
            </div>
            <div className="flex-1">
               <h4 className="font-bold text-sm text-slate-800 dark:text-white line-clamp-1">{tx.bookTitle || tx.items?.[0]?.title}</h4>
               <p className="text-xs font-extrabold text-[#52C6DA] mt-1">
                 {new Intl.NumberFormat('uz-UZ').format(tx.totalAmount || tx.totalPrice || 0)} so&apos;m
               </p>
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );
};

const StatusBadge = ({ status }) => {
  const configs = {
    pending: { color: "text-amber-500 bg-amber-50", icon: <Clock size={10}/>, label: "Kutilmoqda" },
    completed: { color: "text-green-500 bg-green-50", icon: <CheckCircle2 size={10}/>, label: "Yetkazildi" },
    returned: { color: "text-blue-500 bg-blue-50", icon: <CheckCircle2 size={10}/>, label: "Qaytarildi" },
    cancelled: { color: "text-red-500 bg-red-50", icon: <AlertCircle size={10}/>, label: "Bekor qilindi" },
  };
  const config = configs[status] || configs.pending;
  return (
    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${config.color}`}>
      {config.icon}
      {config.label}
    </div>
  );
};

const SupportView = ({ user }) => {
  const [form, setForm] = useState({ type: 'general', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.message) return toast.error("Xabar matnini kiriting");
    
    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.fullName || user.email,
          phone: user.phone || "Kiritilmagan",
          email: user.email,
          message: form.message,
          type: form.type
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Murojaatingiz adolatli qo'llarda! Tez orada siz bilan bog'lanamiz 🕊️✨");
        setForm({ ...form, message: '' });
      } else {
        toast.error(data.message || "Xabar yetib bormadi, qayta urinib ko'ramizmi? 🔄");
      }
    } catch (e) {
      toast.error("Server bilan bog'lanishda muammo bo'ldi 🔄");
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pb-10">
      <div className="bg-gradient-to-br from-[#52C6DA] to-blue-600 rounded-[2.5rem] p-8 text-white mb-8 shadow-xl relative overflow-hidden">
         <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
         <h3 className="text-2xl font-black mb-2">Qanday yordam bera olamiz?</h3>
         <p className="text-white/80 text-sm font-medium leading-relaxed">Adminlarimiz sizning har bir murojaatingizni diqqat bilan o&apos;rganishadi.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Murojaat turi</label>
            <div className="flex gap-2">
                {[
                  { id: 'general', label: 'Umumiy' },
                  { id: 'suggestion', label: 'Taklif' },
                  { id: 'complaint', label: 'Shikoyat' }
                ].map(t => (
                  <button 
                    key={t.id}
                    type="button"
                    onClick={() => setForm({...form, type: t.id})}
                    className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all ${form.type === t.id ? 'bg-[#52C6DA] text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-500'}`}
                  >
                    {t.label}
                  </button>
                ))}
            </div>
        </div>

        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Xabaringiz</label>
            <textarea 
                value={form.message}
                onChange={(e) => setForm({...form, message: e.target.value})}
                className="w-full min-h-[150px] bg-slate-50 dark:bg-slate-800 border-none rounded-[2rem] p-6 text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-[#52C6DA] transition-all resize-none shadow-inner"
                placeholder="Bu yerga yozing..."
            />
        </div>

        <button 
            disabled={sending}
            type="submit"
            className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all disabled:opacity-50"
        >
            {sending ? <Loader2 size={20} className="animate-spin" /> : (
              <>
                <Send size={18} />
                Xabarni yuborish
              </>
            )}
        </button>
      </form>
    </motion.div>
  );
};

const TabButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className="flex-1 flex flex-col items-center gap-1 py-3 relative group"
  >
    <div className={`transition-colors duration-300 ${active ? "text-[#52C6DA]" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"}`}>
        {icon}
    </div>
    {active && (
        <motion.div 
            layoutId="activeProfileTab"
            className="absolute bottom-0 w-1/2 h-0.5 bg-[#52C6DA] rounded-full"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
    )}
  </button>
);





const EditProfileModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: user.fullName || "",
    bio: user.bio || "",
    phone: user.phone || "",
    instagram: user.instagram || "",
    telegram: user.telegram || "",
    occupation: user.occupation || "other",
    interests: user.interests?.join(", ") || "",
    avatarFile: null,
    avatarPreview: user.avatar || `https://ui-avatars.com/api/?name=${user.fullName || user.email}&background=52C6DA&color=fff`
  });
  const [saving, setSaving] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setFormData({
            ...formData,
            avatarFile: file,
            avatarPreview: URL.createObjectURL(file)
        });
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    await onSave({
        fullName: formData.fullName,
        bio: formData.bio,
        phone: formData.phone,
        instagram: formData.instagram,
        telegram: formData.telegram,
        occupation: formData.occupation,
        interests: formData.interests.split(",").map(i => i.trim()).filter(i => i !== ""),
        avatarFile: formData.avatarFile
    });
    setSaving(false);
  };

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
    >
        <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-[2.5rem] sm:rounded-3xl p-8 pb-10 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
        >
            <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500">
                <X size={20} />
            </button>

            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6">Profilni Tahrirlash</h2>

            <div className="space-y-6">
                {/* Avatar Edit */}
                <div className="flex flex-col items-center gap-3">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#52C6DA] shadow-lg">
                            <Image src={formData.avatarPreview} alt="Preview" fill className="object-cover" unoptimized />
                        </div>
                        <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera size={24} />
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </label>
                    </div>
                    <span className="text-xs font-bold text-[#52C6DA]">Rasm o'zgartirish</span>
                </div>

                {/* Inputs */}
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Ism Sharif</label>
                        <input 
                            type="text" 
                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-5 text-sm font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-[#52C6DA] transition-all"
                            value={formData.fullName}
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                            placeholder="Ismingizni kiriting"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Telefon</label>
                            <input 
                                type="tel" 
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3 px-4 text-xs font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-[#52C6DA] transition-all"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                placeholder="+998"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Mashg'ulot</label>
                            <select 
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3 px-4 text-xs font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-[#52C6DA] transition-all appearance-none"
                                value={formData.occupation}
                                onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                            >
                                <option value="student">Talaba</option>
                                <option value="teacher">O'qituvchi</option>
                                <option value="courier">Kuryer</option>
                                <option value="other">Boshqa</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Instagram</label>
                            <div className="relative">
                                <Instagram size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3 pl-9 pr-4 text-xs font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-[#52C6DA] transition-all"
                                    value={formData.instagram}
                                    onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                                    placeholder="username"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Telegram</label>
                            <div className="relative">
                                <Send size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3 pl-9 pr-4 text-xs font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-[#52C6DA] transition-all"
                                    value={formData.telegram}
                                    onChange={(e) => setFormData({...formData, telegram: e.target.value})}
                                    placeholder="username"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Qiziqqan janrlar (vergul bilan ajrating)</label>
                        <input 
                            type="text" 
                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-5 text-sm font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-[#52C6DA] transition-all"
                            value={formData.interests}
                            onChange={(e) => setFormData({...formData, interests: e.target.value})}
                            placeholder="Badiiy, Psixologiya, Biznes"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">O'zingiz haqingizda (Bio)</label>
                        <textarea 
                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-5 text-sm font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-[#52C6DA] transition-all min-h-[80px] resize-none"
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                            placeholder="Qisqacha ma'lumot qoldiring"
                        />
                    </div>
                </div>

                <button 
                    disabled={saving}
                    onClick={handleSubmit}
                    className="w-full bg-[#52C6DA] text-white py-4 rounded-2xl font-black shadow-lg shadow-[#52C6DA]/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    {saving ? <Loader2 size={20} className="animate-spin" /> : "Saqlash"}
                </button>
            </div>
        </motion.div>
    </motion.div>
  );
};

const SettingsView = ({ settings, setSettings }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
     
     <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="font-extrabold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <Settings size={20} className="text-slate-400"/>
            Sozlamalar
        </h3>
        
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center"><Eye size={20}/></div>
                    <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">Ko‘rinish darajasi</p>
                        <p className="text-[10px] font-medium text-slate-400">Profil maxfiyligi</p>
                    </div>
                </div>
                <select 
                    value={settings.visibility}
                    onChange={(e) => setSettings({...settings, visibility: e.target.value})}
                    className="bg-slate-50 dark:bg-slate-700 border-none text-xs font-extrabold text-slate-700 dark:text-slate-200 rounded-xl py-2 px-3 focus:ring-0 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                >
                    <option value="minimal">Minimal</option>
                    <option value="emotional">Emotsional</option>
                    <option value="full">To‘liq</option>
                </select>
            </div>
            
            <div className="h-[1px] bg-slate-50 dark:bg-slate-700 w-full" />

            <ToggleRow 
                label="Joylashuv" 
                sub="Shaharni ko'rsatish"
                checked={settings.showCity}
                onChange={() => setSettings({...settings, showCity: !settings.showCity})}
                icon={<MapPin size={20}/>}
                color="text-orange-600 bg-orange-50"
            />
        </div>
     </div>

     <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="font-extrabold text-slate-800 dark:text-white mb-6">Muloqot</h3>
        <ToggleRow 
             label="Qo‘ldan-qo‘lga" 
             sub="Kitob almashishga ruxsat"
             checked={settings.allowHandover}
             onChange={() => setSettings({...settings, allowHandover: !settings.allowHandover})}
             icon={<Repeat size={20}/>}
             color="text-green-600 bg-green-50"
        />
     </div>
    
     <div className="text-center mt-8 pb-8">
        <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-red-500 text-sm font-bold hover:bg-red-50 dark:hover:bg-red-900/20 px-6 py-3 rounded-xl transition-colors w-full border border-red-100 dark:border-red-900/30"
        >
            Profildan Chiqish
        </button>
     </div>
  </motion.div>
);



const ToggleRow = ({ label, sub, checked, onChange, icon, color }) => (
    <div className="flex items-center justify-between cursor-pointer" onClick={onChange}>
        <div className="flex gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${checked ? color + ' dark:bg-opacity-20' : 'bg-slate-50 dark:bg-slate-700 text-slate-400'}`}>
                {icon}
            </div>
            <div className="max-w-[150px]">
                <p className="font-bold text-sm text-slate-900 dark:text-white">{label}</p>
                <p className="text-[10px] font-medium text-slate-400 leading-tight mt-0.5">{sub}</p>
            </div>
        </div>
        <div className={`w-12 h-7 rounded-full relative transition-colors duration-300 ${checked ? 'bg-[#52C6DA]' : 'bg-slate-200 dark:bg-slate-700'}`}>
            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${checked ? 'left-6' : 'left-1'}`}></div>
        </div>
    </div>
);
