"use client";

import React, { useState, useEffect } from "react";
import { FaMotorcycle, FaCircle, FaBox, FaUndo, FaSearch, FaPlus, FaFilter } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAdmin } from "../AdminContext";
import PickupTab from "./kitobolish";
import ReturnTab from "./kitobtopshirish";
import KurierControl from "./kuriernazorat";
import toast, { Toaster } from 'react-hot-toast';

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

const ContentSkeleton = ({ darkMode }) => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
                <div key={i} className={`h-64 rounded-2xl animate-pulse ${darkMode ? "bg-white/5" : "bg-gray-100"}`}></div>
            ))}
        </div>
    </div>
);

// --- REAL COMPONENTS ---

const StatCard = ({ title, value, icon: Icon, color, darkMode }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        className={`p-6 rounded-2xl border backdrop-blur-sm transition-all
            ${darkMode 
                ? "bg-[#163201]/40 border-[#A3ED96]/20" 
                : "bg-white border-gray-100 shadow-sm"
            }
        `}
    >
        <div className="flex items-center justify-between">
            <div>
                <p className={`text-sm font-medium mb-1 ${darkMode ? "text-[#A3ED96]/70" : "text-gray-500"}`}>{title}</p>
                <h3 className={`text-3xl font-black ${darkMode ? "text-white" : "text-gray-900"}`}>{value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-lg
                ${darkMode 
                    ? "bg-[#A3ED96]/20 text-[#A3ED96]" 
                    : `bg-${color}-100 text-${color}-600`
                }
            `}>
                <Icon />
            </div>
        </div>
    </motion.div>
);

export default function CourierStats() {
  const { darkMode } = useAdmin();
  const [activeTab, setActiveTab] = useState("kuriernazorat");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', phone: '' });
  const [creating, setCreating] = useState(false);

  // Stats state
  const [stats, setStats] = useState({
      total: 0,
      online: 0,
      todayDeliveries: 0,
      todayReturns: 0
  });

  // Fetch Stats
  useEffect(() => {
    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/couriers');
            const result = await res.json();
            if(result.success) {
                const couriers = result.data;
                const total = couriers.length;
                const online = couriers.filter(c => c.status !== 'blocked').length; 
                
                const deliveries = couriers.reduce((acc, curr) => acc + (curr.todayDeliveries || 0), 0);
                const returns = couriers.reduce((acc, curr) => acc + (curr.todayReturns || 0), 0);
                
                setStats({
                    total,
                    online,
                    todayDeliveries: deliveries,
                    todayReturns: returns
                });
            }
        } catch (e) {
            console.error(e);
            toast.error("Statistikani yuklashda xatolik");
        } finally {
            setLoading(false);
        }
    };
    
    fetchStats();
  }, []);

  const handleCreate = async (e) => {
      e.preventDefault();
      setCreating(true);
      try {
          const res = await fetch('/api/admin/couriers', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData)
          });
          const data = await res.json();
          if(data.success) {
              toast.success("Kuryer qo'shildi!");
              setShowModal(false);
              setFormData({ fullName: '', email: '', password: '', phone: '' });
              // Reload to refresh data
              setTimeout(() => window.location.reload(), 1000);
          } else {
              toast.error(data.message);
          }
      } catch (err) {
          toast.error("Xatolik yuz berdi");
      } finally {
          setCreating(false);
      }
  };

  const tabs = [
      { id: 'kuriernazorat', label: 'Asosiy Oyna' },
      { id: 'kitobolish', label: 'Kitob Olish' },
      { id: 'kitobtopshirish', label: 'Kitob Topshirish' },
  ];

  return (
    <div className={`min-h-screen p-6 sm:p-8 transition-colors duration-300 ${darkMode ? "bg-[#0b1a00]" : "bg-[#f8fafc]"}`}>
      <Toaster />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
         <div>
            <h1 className={`text-3xl font-black mb-2 ${darkMode ? "text-white" : "text-[#163201]"}`}>
                Kuryerlar Boshqaruvi
            </h1>
            <p className={`text-sm ${darkMode ? "text-[#A3ED96]/60" : "text-gray-500"}`}>
                Jami {stats.total} ta kuryer faoliyat olib bormoqda
            </p>
         </div>
         <button 
            onClick={() => setShowModal(true)}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95
            ${darkMode 
                ? "bg-[#A3ED96] text-[#163201]" 
                : "bg-[#163201] text-white"
            }
         `}>
             <FaPlus /> Yangi Kuryer
         </button>
      </div>

      {loading ? (
        // SKELETON STATE
        <div className="space-y-8">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                 {[1,2,3,4].map(i => <StatSkeleton key={i} darkMode={darkMode} />)}
             </div>
             <div className={`h-96 rounded-3xl animate-pulse ${darkMode ? "bg-white/5" : "bg-gray-100"}`}></div>
        </div>
      ) : (
        // LOADED STATE
        <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard title="Jami Kuryerlar" value={stats.total} icon={FaMotorcycle} color="blue" darkMode={darkMode} />
                <StatCard title="Online" value={stats.online} icon={FaCircle} color="green" darkMode={darkMode} />
                <StatCard title="Bugungi Yetkazish" value={stats.todayDeliveries} icon={FaBox} color="orange" darkMode={darkMode} />
                <StatCard title="Qaytarishlar" value={stats.todayReturns} icon={FaUndo} color="purple" darkMode={darkMode} />
            </div>

            {/* Main Content Card */}
            <div className={`rounded-3xl border overflow-hidden min-h-[600px]
                ${darkMode 
                    ? "bg-[#163201]/20 border-[#A3ED96]/10" 
                    : "bg-white border-gray-200 shadow-sm"
                }
            `}>
                {/* Tabs & Toolbar */}
                <div className={`p-4 border-b flex flex-col xl:flex-row gap-4 justify-between items-center
                    ${darkMode ? "border-[#A3ED96]/10" : "border-gray-100"}
                `}>
                    {/* Tab Nav */}
                    <div className={`flex p-1.5 rounded-xl w-full xl:w-auto overflow-x-auto relative
                        ${darkMode ? "bg-black/20" : "bg-gray-100"}
                    `}>
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative px-6 py-3 rounded-lg text-sm font-bold whitespace-nowrap transition-colors z-10 flex-1 xl:flex-none
                                    ${activeTab === tab.id 
                                        ? (darkMode ? "text-[#163201]" : "text-gray-900") // Active Text
                                        : (darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700") // Inactive Text
                                    }
                                `}
                            >
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTabIndicator"
                                        className={`absolute inset-0 rounded-lg shadow-sm -z-10
                                            ${darkMode ? "bg-[#A3ED96]" : "bg-white"}
                                        `}
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                  
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                             {activeTab === 'kuriernazorat' && <KurierControl darkMode={darkMode} />}
                             {activeTab === 'kitobolish' && <PickupTab darkMode={darkMode} />}
                             {activeTab === 'kitobtopshirish' && <ReturnTab darkMode={darkMode} />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className={`w-full max-w-md rounded-2xl p-6 shadow-2xl ${darkMode ? "bg-[#0b1a00] border border-[#A3ED96]/20" : "bg-white"}`}
                        >
                            <h2 className={`text-xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>Yangi Kuryer Qo'shish</h2>
                            
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div>
                                    <label className={`block text-xs font-bold mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>F.I.SH</label>
                                    <input 
                                        required
                                        type="text" 
                                        className={`w-full p-3 rounded-xl outline-none border ${darkMode ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200"}`}
                                        value={formData.fullName}
                                        onChange={e => setFormData({...formData, fullName: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-xs font-bold mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Telefon</label>
                                    <input 
                                        required
                                        type="text" 
                                        className={`w-full p-3 rounded-xl outline-none border ${darkMode ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200"}`}
                                        value={formData.phone}
                                        onChange={e => setFormData({...formData, phone: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-xs font-bold mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Email</label>
                                    <input 
                                        required
                                        type="email" 
                                        className={`w-full p-3 rounded-xl outline-none border ${darkMode ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200"}`}
                                        value={formData.email}
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-xs font-bold mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Parol</label>
                                    <input 
                                        required
                                        type="password" 
                                        className={`w-full p-3 rounded-xl outline-none border ${darkMode ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200"}`}
                                        value={formData.password}
                                        onChange={e => setFormData({...formData, password: e.target.value})}
                                    />
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <button 
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold ${darkMode ? "text-gray-400 hover:bg-white/5" : "text-gray-500 hover:bg-gray-100"}`}
                                    >
                                        Bekor qilish
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={creating}
                                        className={`px-6 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2
                                            ${darkMode ? "bg-[#A3ED96] text-[#163201]" : "bg-[#163201] text-white"}
                                            ${creating ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"}
                                        `}
                                    >
                                        {creating ? "Saqlanmoqda..." : "Saqlash"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
      )}
    </div>
  );
}
