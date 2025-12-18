"use client";

import React, { useState, useEffect } from "react";
import { 
  FaUser, 
  FaLock, 
  FaBell, 
  FaSave, 
  FaCamera, 
  FaMoon, 
  FaShieldAlt, 
  FaKey, 
  FaEnvelope, 
  FaChevronRight 
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAdmin } from "../AdminContext";

// Color Palette Constants
const COLORS = {
  white: "#FFFFFF",
  mint: "#D1F0E0",
  sage: "#96C7B9",
  darkText: "#1F2937", // Slate-800 for contrast
  lightText: "#6B7280", // Slate-500
};

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 10 }
  }
};

const titleVariant = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

// --- COMPONENTS ---

const TabButton = ({ id, label, icon: Icon, activeTab, onClick, darkMode }) => {
  const isActive = activeTab === id;
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(id)}
      className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-bold transition-all duration-300 mb-2
        ${isActive 
          ? (darkMode 
              ? "bg-[#96C7B9] text-[#0b1a00] shadow-[0_0_20px_rgba(150,199,185,0.3)]" 
              : "bg-[#D1F0E0] text-[#1F2937] shadow-lg shadow-[#D1F0E0]/50")
          : (darkMode 
              ? "text-gray-400 hover:bg-white/5" 
              : "text-gray-500 hover:bg-[#F3F4F6]")
        }
      `}
    >
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg ${isActive ? (darkMode ? "bg-white/20" : "bg-white/50") : "bg-transparent"}`}>
          <Icon className={isActive ? "" : "opacity-70"} size={20} />
        </div>
        <span>{label}</span>
      </div>
      {isActive && <FaChevronRight className="opacity-50 text-sm" />}
    </motion.button>
  );
};

const SectionTitle = ({ title, description, darkMode }) => (
  <motion.div variants={itemVariants} className="mb-8">
    <h2 className={`text-3xl font-black mb-2 ${darkMode ? "text-white" : "text-[#1F2937]"}`}>
      {title}
    </h2>
    <p className={`text-base font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
      {description}
    </p>
  </motion.div>
);

const InputGroup = ({ label, type = "text", placeholder, defaultValue, icon: Icon, darkMode }) => (
  <motion.div variants={itemVariants} className="space-y-2 group">
    <label className={`text-xs font-bold uppercase tracking-wider ml-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
      {label}
    </label>
    <div className="relative">
      <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 transition-colors duration-300
        ${darkMode ? "text-[#96C7B9]" : "text-[#96C7B9] group-focus-within:text-[#2E7D32]"}`} 
      />
      <input 
        type={type} 
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={`w-full pl-12 pr-4 py-4 rounded-2xl font-bold border-2 outline-none transition-all duration-300
          ${darkMode 
            ? "bg-white/5 border-white/5 text-white focus:border-[#96C7B9] focus:bg-white/10" 
            : "bg-white border-[#F3F4F6] text-gray-900 focus:border-[#96C7B9] focus:shadow-[0_0_0_4px_rgba(209,240,224,0.5)]"
          }
        `}
      />
    </div>
  </motion.div>
);

const ToggleSwitch = ({ label, description, checked, onChange, darkMode }) => (
  <motion.div 
    variants={itemVariants}
    className={`p-5 rounded-3xl border-2 flex items-center justify-between transition-all duration-300 cursor-pointer
      ${darkMode 
        ? "bg-white/5 border-white/5 hover:border-[#96C7B9]/30" 
        : "bg-white border-[#F3F4F6] hover:border-[#D1F0E0] hover:shadow-lg hover:shadow-[#D1F0E0]/20"
      }
    `}
    onClick={() => onChange(!checked)}
  >
    <div>
      <h4 className={`font-bold text-lg ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{label}</h4>
      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{description}</p>
    </div>
    <div className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 relative
        ${checked 
            ? "bg-[#96C7B9]" 
            : (darkMode ? "bg-white/20" : "bg-gray-200")
        }
    `}>
      <motion.div 
        layout
        className="w-6 h-6 rounded-full bg-white shadow-sm"
        animate={{ x: checked ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </div>
  </motion.div>
);

const WelcomeText = ({ darkMode }) => {
  const lines = ["Xush kelibsiz,", "Hurmatli Administrator!"];
  
  return (
    <div className="mb-8 pl-1">
      {lines.map((line, i) => (
        <motion.h1
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: i * 0.2, ease: [0.2, 0.65, 0.3, 0.9] }}
          className={`text-4xl md:text-5xl font-black ${darkMode ? "text-white" : "text-[#1F2937]"}`}
        >
          {line.split("").map((char, index) => (
             <motion.span
               key={index}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 0.2, delay: 0.5 + (i * 0.2) + (index * 0.03) }}
             >
               {char}
             </motion.span>
          ))}
        </motion.h1>
      ))}
      <motion.p 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 1.5 }}
        className={`mt-3 text-lg font-medium ${darkMode ? "text-[#96C7B9]" : "text-[#7f9c93]"}`}
      >
        Bugun qanday o&apos;zgarishlar qilamiz?
      </motion.p>
    </div>
  );
};

export default function SettingsPage() {
  const { darkMode, setDarkMode } = useAdmin();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  
  // Toggle States
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`min-h-screen p-6 sm:p-10 transition-colors duration-500 font-sans
      ${darkMode ? "bg-[#0b1a00]" : "bg-[#FFFFFF]"}
    `}>
      
      <div className="max-w-7xl mx-auto">
        <WelcomeText darkMode={darkMode} />

        <AnimatePresence mode="wait">
          {loading ? (
             <motion.div
               key="skeleton"
               exit={{ opacity: 0 }}
               className="flex flex-col md:flex-row gap-8 min-h-[600px]"
             >
                <div className="w-full md:w-80 h-96 rounded-3xl animate-pulse bg-gray-200 dark:bg-white/5" />
                <div className="flex-1 rounded-3xl animate-pulse bg-gray-200 dark:bg-white/5" />
             </motion.div>
          ) : (
             <motion.div 
               key="content"
               initial={{ opacity: 0, y: 40 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, ease: "easeOut" }}
               className="flex flex-col md:flex-row gap-8 items-start"
             >
                {/* Sidebar Navigation */}
                <div className={`w-full md:w-80 p-4 rounded-3xl backdrop-blur-xl border sticky top-8
                   ${darkMode 
                     ? "bg-white/5 border-white/5" 
                     : "bg-white border-[#D1F0E0] shadow-xl shadow-[#D1F0E0]/20"
                   }
                `}>
                    <TabButton id="profile" label="Profil" icon={FaUser} activeTab={activeTab} onClick={setActiveTab} darkMode={darkMode} />
                    <TabButton id="security" label="Xavfsizlik" icon={FaShieldAlt} activeTab={activeTab} onClick={setActiveTab} darkMode={darkMode} />
                    <TabButton id="notifications" label="Xabarnomalar" icon={FaBell} activeTab={activeTab} onClick={setActiveTab} darkMode={darkMode} />
                    <TabButton id="appearance" label="Ko'rinish" icon={FaMoon} activeTab={activeTab} onClick={setActiveTab} darkMode={darkMode} />
                </div>

                {/* Content Area */}
                <div className={`flex-1 p-8 rounded-3xl border min-h-[600px] relative overflow-hidden
                   ${darkMode 
                     ? "bg-white/5 border-white/5" 
                     : "bg-white border-[#D1F0E0] shadow-2xl shadow-[#D1F0E0]/30"
                   }
                `}>
                    {/* Decorative Blob */}
                    <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[100px] pointer-events-none opacity-50
                      ${darkMode ? "bg-[#96C7B9]/20" : "bg-[#D1F0E0]"}
                    `} />

                    <AnimatePresence mode="wait">
                        {activeTab === "profile" && (
                            <motion.div 
                                key="profile"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                                className="space-y-8 max-w-3xl relative z-10"
                            >
                                <SectionTitle title="Profil Ma'lumotlari" description="Shaxsiy ma'lumotlaringiz va suratingizni boshqaring" darkMode={darkMode} />
                                
                                <motion.div variants={itemVariants} className={`flex items-center gap-8 p-6 rounded-3xl border border-dashed
                                   ${darkMode ? 'border-white/10 bg-white/5' : 'border-[#96C7B9] bg-[#F0FDF8]'}
                                `}>
                                    <div className="relative group cursor-pointer">
                                        <div className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl font-black border-4 shadow-2xl transition-transform duration-300 group-hover:scale-105
                                             ${darkMode ? "bg-[#96C7B9] text-[#0b1a00] border-[#0b1a00]" : "bg-white text-[#96C7B9] border-[#D1F0E0]"}
                                        `}>
                                            AK
                                        </div>
                                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                                            <FaCamera className="text-white text-3xl drop-shadow-lg" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className={`font-bold text-xl mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}>Profil Rasmi</h3>
                                        <p className={`text-sm mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>PNG, JPG (max. 2MB)</p>
                                        <button className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors
                                            ${darkMode ? "bg-white/10 hover:bg-white/20" : "bg-white hover:bg-gray-50 border border-gray-200 text-gray-600"}
                                        `}>
                                            Rasmni O&apos;zgartirish
                                        </button>
                                    </div>
                                </motion.div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <InputGroup label="Ism" defaultValue="Alisher" icon={FaUser} darkMode={darkMode} />
                                    <InputGroup label="Familiya" defaultValue="Karimov" icon={FaUser} darkMode={darkMode} />
                                    <div className="md:col-span-2">
                                         <InputGroup label="Email Manzil" type="email" defaultValue="admin@kitobdosh.uz" icon={FaEnvelope} darkMode={darkMode} />
                                    </div>
                                    <div className="md:col-span-2">
                                         <InputGroup label="Lavozim" defaultValue="Bosh Administrator" icon={FaShieldAlt} darkMode={darkMode} />
                                    </div>
                                </div>

                                <motion.div variants={itemVariants} className="pt-6">
                                    <motion.button 
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      className={`px-10 py-4 rounded-2xl font-black text-lg shadow-xl flex items-center gap-3
                                        ${darkMode 
                                          ? "bg-[#96C7B9] text-[#0b1a00] hover:bg-white" 
                                          : "bg-[#96C7B9] text-white hover:bg-[#7fae9f] shadow-[#96C7B9]/40"
                                        }
                                    `}>
                                        <FaSave /> Saqlash
                                    </motion.button>
                                </motion.div>
                            </motion.div>
                        )}

                        {activeTab === "security" && (
                            <motion.div 
                                key="security"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                                className="space-y-8 max-w-3xl relative z-10"
                            >
                                <SectionTitle title="Xavfsizlik" description="Parol va himoya sozlamalari" darkMode={darkMode} />
                                
                                <div className="space-y-4">
                                    <InputGroup label="Joriy Parol" type="password" placeholder="••••••••" icon={FaKey} darkMode={darkMode} />
                                    <InputGroup label="Yangi Parol" type="password" placeholder="••••••••" icon={FaLock} darkMode={darkMode} />
                                    <InputGroup label="Parolni Tasdiqlang" type="password" placeholder="••••••••" icon={FaLock} darkMode={darkMode} />
                                </div>

                                <motion.div variants={itemVariants} className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-white/10 my-8" />
                                
                                <SectionTitle title="Ikki Bosqichli Himoya" description="Hisobingiz xavfsizligini kuchaytiring" darkMode={darkMode} />
                                <ToggleSwitch 
                                    label="2FA ni yoqish" 
                                    description="Kirishda SMS kod orqali tasdiqlash" 
                                    checked={twoFactor} 
                                    onChange={setTwoFactor} 
                                    darkMode={darkMode} 
                                />
                            </motion.div>
                        )}

                        {activeTab === "notifications" && (
                            <motion.div 
                                key="notifications"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                                className="space-y-8 max-w-3xl relative z-10"
                            >
                                <SectionTitle title="Xabarnomalar" description="Qaysi turdagi xabarlarni qabul qilishni belgilang" darkMode={darkMode} />
                                
                                <div className="space-y-4">
                                    <ToggleSwitch 
                                        label="Email Xabarlari" 
                                        description="Yangi buyurtmalar va xabarlar haqida email olish" 
                                        checked={emailNotif} 
                                        onChange={setEmailNotif} 
                                        darkMode={darkMode} 
                                    />
                                    <ToggleSwitch 
                                        label="Push Bildirishnomalar" 
                                        description="Saytda pop-up xabarlarni ko'rsatish" 
                                        checked={pushNotif} 
                                        onChange={setPushNotif} 
                                        darkMode={darkMode} 
                                    />
                                </div>
                            </motion.div>
                        )}
                        
                        {activeTab === "appearance" && (
                            <motion.div 
                                key="appearance"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                                className="space-y-8 max-w-3xl relative z-10"
                            >
                                <SectionTitle title="Tizim Ko'rinishi" description="O'zingizga qulay rejimni tanlang" darkMode={darkMode} />
                                
                                <div className="grid grid-cols-2 gap-6">
                                    <motion.button 
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setDarkMode(false)}
                                        className={`p-8 rounded-3xl border-2 flex flex-col items-center gap-6 transition-all duration-300
                                            ${!darkMode 
                                                ? "border-[#96C7B9] bg-white ring-8 ring-[#D1F0E0] shadow-2xl" 
                                                : "border-gray-700 bg-white/5 opacity-50 hover:opacity-100"
                                            }
                                        `}
                                    >
                                        <div className="w-24 h-16 bg-[#F3F4F6] rounded-xl shadow-inner border border-gray-200 flex items-center justify-center">
                                            <FaUser className="text-gray-300 text-2xl" />
                                        </div>
                                        <span className={`font-black text-lg ${darkMode ? "text-gray-300" : "text-gray-800"}`}>Yorug&apos; (Light)</span>
                                    </motion.button>
                                    
                                    <motion.button 
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setDarkMode(true)}
                                        className={`p-8 rounded-3xl border-2 flex flex-col items-center gap-6 transition-all duration-300
                                            ${darkMode 
                                                ? "border-[#96C7B9] bg-[#0b1a00] ring-8 ring-[#96C7B9]/20 shadow-2xl" 
                                                : "border-gray-200 bg-gray-100 opacity-50 hover:opacity-100"
                                            }
                                        `}
                                    >
                                        <div className="w-24 h-16 bg-[#1a3a00] rounded-xl shadow-inner border border-white/10 flex items-center justify-center">
                                             <FaUser className="text-white/20 text-2xl" />
                                        </div>
                                        <span className={`font-black text-lg ${darkMode ? "text-[#96C7B9]" : "text-gray-600"}`}>Tungi (Dark)</span>
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
