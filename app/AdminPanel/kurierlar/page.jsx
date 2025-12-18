"use client";

import React, { useState, useEffect } from "react";
import { FaMotorcycle, FaCircle, FaBox, FaUndo, FaSearch, FaPlus, FaFilter } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAdmin } from "../AdminContext";
import PickupTab from "./kitobolish";
import ReturnTab from "./kitobtopshirish";
import KurierControl from "./kuriernazorat";

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

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // 2 seconds delay
    return () => clearTimeout(timer);
  }, []);

  const tabs = [
      { id: 'kuriernazorat', label: 'Asosiy Oyna' },
      { id: 'kitobolish', label: 'Kitob Olish' },
      { id: 'kitobtopshirish', label: 'Kitob Topshirish' },
  ];

  return (
    <div className={`min-h-screen p-6 sm:p-8 transition-colors duration-300 ${darkMode ? "bg-[#0b1a00]" : "bg-[#f8fafc]"}`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
         <div>
            <h1 className={`text-3xl font-black mb-2 ${darkMode ? "text-white" : "text-[#163201]"}`}>
                Kuryerlar Boshqaruvi
            </h1>
            <p className={`text-sm ${darkMode ? "text-[#A3ED96]/60" : "text-gray-500"}`}>
                Jami 6 ta kuryer faoliyat olib bormoqda
            </p>
         </div>
         <button className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95
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
                <StatCard title="Jami Kuryerlar" value="6" icon={FaMotorcycle} color="blue" darkMode={darkMode} />
                <StatCard title="Online" value="4" icon={FaCircle} color="green" darkMode={darkMode} />
                <StatCard title="Bugungi Yetkazish" value="52" icon={FaBox} color="orange" darkMode={darkMode} />
                <StatCard title="Qaytarishlar" value="21" icon={FaUndo} color="purple" darkMode={darkMode} />
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
        </>
      )}
    </div>
  );
}
