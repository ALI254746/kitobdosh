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
  FaChevronRight,
  FaCog,
  FaTruck,
  FaHandHoldingUsd,
  FaMapMarkerAlt,
  FaTelegramPlane,
  FaPhoneAlt,
  FaFont,
  FaLeaf,
  FaSun
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAdmin } from "../AdminContext";
import toast from "react-hot-toast";
import { uploadToCloudinary } from "@/lib/cloudinary";
import Image from "next/image";

// Color Palette Constants
const COLORS = {
  white: "#FFFFFF",
  mint: "#D1F0E0",
  sage: "#96C7B9",
  darkText: "#1F2937",
  lightText: "#6B7280",
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

const InputGroup = ({ label, type = "text", placeholder, value, onChange, icon: Icon, darkMode }) => (
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
          {line}
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
  const { appearance, setAppearance, fontFamily, setFontFamily, darkMode, setDarkMode } = useAdmin();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const [adminData, setAdminData] = useState(null);
  const [configData, setConfigData] = useState(null);

  // Form States
  const [profileForm, setProfileForm] = useState({ fullName: "", phone: "", avatar: "" });
  const [securityForm, setSecurityForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [configForm, setConfigForm] = useState({
      deliveryPrices: { standard: 0, express: 0 },
      rentalRules: { maxDays: 0, penaltyPerDay: 0, minDeposit: 0 },
      contactInfo: { phone: "", address: "", tgBotLink: "", email: "" }
  });

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            const [profileRes, configRes] = await Promise.all([
                fetch('/api/admin/settings/profile'),
                fetch('/api/admin/settings/config')
            ]);
            
            const profile = await profileRes.json();
            const config = await configRes.json();
            
            if (profile.success) {
                setAdminData(profile.data);
                setProfileForm({ 
                    fullName: profile.data.fullName || "", 
                    phone: profile.data.phone || "",
                    avatar: profile.data.avatar || ""
                });
                
                // Set Theme from DB
                if (profile.data.settings?.theme) {
                    setAppearance(profile.data.settings.theme);
                } else {
                    setAppearance(profile.data.settings?.darkMode ? 'dark' : 'light');
                }
                
                // Set Font from DB
                if (profile.data.settings?.fontFamily) {
                    setFontFamily(profile.data.settings.fontFamily);
                }
            }
            
            if (config.success) {
                setConfigData(config.data);
                setConfigForm(config.data);
            }
        } catch (error) {
            toast.error("Ma'lumotlarni yuklashda xato!");
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [setAppearance, setFontFamily]);

  // Update Profile
  const handleUpdateProfile = async (e) => {
      e.preventDefault();
      try {
          setUpdating(true);
          const res = await fetch('/api/admin/settings/profile', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ type: 'profile', ...profileForm })
          });
          const data = await res.json();
          if (data.success) toast.success("Profil muvaffaqiyatli yangilandi!");
          else toast.error(data.message);
      } catch (error) {
          toast.error("Profilni yangilashda xato!");
      } finally {
          setUpdating(false);
      }
  };

  // Update Security
  const handleUpdateSecurity = async (e) => {
      e.preventDefault();
      if (!securityForm.currentPassword || !securityForm.newPassword) {
          return toast.error("Barcha maydonlarni to'ldiring!");
      }
      if (securityForm.newPassword !== securityForm.confirmPassword) {
          return toast.error("Yangi parollar mos kelmadi!");
      }
      try {
          setUpdating(true);
          const res = await fetch('/api/admin/settings/security', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(securityForm)
          });
          const data = await res.json();
          if (data.success) {
              toast.success("Parol muvaffaqiyatli o'zgartirildi!");
              setSecurityForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
          } else toast.error(data.message);
      } catch (error) {
          toast.error("Parolni o'zgartirishda xato!");
      } finally {
          setUpdating(false);
      }
  };

  // Update Config
  const handleUpdateConfig = async (e) => {
      e.preventDefault();
      try {
          setUpdating(true);
          const res = await fetch('/api/admin/settings/config', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(configForm)
          });
          const data = await res.json();
          if (data.success) toast.success("Tizim sozlamalari saqlandi!");
          else toast.error(data.message);
      } catch (error) {
          toast.error("Sozlamalarni saqlashda xato!");
      } finally {
          setUpdating(false);
      }
  };

  // Handle Avatar Upload
  const handleAvatarUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
          setUpdating(true);
          const { url } = await uploadToCloudinary(file);
          setProfileForm(prev => ({ ...prev, avatar: url }));
          toast.success("Rasm yuklandi! Saqlash tugmasini bosing.");
      } catch (error) {
          toast.error("Rasm yuklashda xato!");
      } finally {
          setUpdating(false);
      }
  };

  // Theme update
  const handleAppearanceToggle = async (theme) => {
      setAppearance(theme);
      try {
          await fetch('/api/admin/settings/profile', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                  type: 'profile', 
                  settings: { 
                      theme: theme, 
                      darkMode: theme === 'dark' 
                  } 
              })
          });
      } catch (error) {
          console.error(error);
      }
  };

  // Font update
  const handleFontChange = async (font) => {
      setFontFamily(font);
      try {
          await fetch('/api/admin/settings/profile', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                  type: 'profile', 
                  settings: { fontFamily: font } 
              })
          });
          toast.success("Font o'zgartirildi!");
      } catch (error) {
          console.error(error);
      }
  };

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
                <div className={`w-full md:w-80 p-4 rounded-3xl backdrop-blur-xl border sticky top-8 z-20
                   ${darkMode 
                     ? "bg-white/5 border-white/5" 
                     : "bg-white border-[#D1F0E0] shadow-xl shadow-[#D1F0E0]/20"
                   }
                `}>
                    <TabButton id="profile" label="Profil" icon={FaUser} activeTab={activeTab} onClick={setActiveTab} darkMode={darkMode} />
                    <TabButton id="config" label="Tizim Sozlamalari" icon={FaCog} activeTab={activeTab} onClick={setActiveTab} darkMode={darkMode} />
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

                    {updating && (
                        <div className="absolute inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="w-12 h-12 border-4 border-[#96C7B9] border-t-transparent rounded-full"
                            />
                        </div>
                    )}

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
                                        <div className={`w-32 h-32 rounded-full overflow-hidden flex items-center justify-center text-4xl font-black border-4 shadow-2xl transition-transform duration-300 group-hover:scale-105
                                             ${darkMode ? "bg-[#96C7B9] text-[#0b1a00] border-[#0b1a00]" : "bg-white text-[#96C7B9] border-[#D1F0E0]"}
                                        `}>
                                            {profileForm.avatar ? (
                                                <Image src={profileForm.avatar} alt="Avatar" width={128} height={128} className="object-cover w-full h-full" />
                                            ) : (
                                                profileForm.fullName ? profileForm.fullName.substring(0, 2).toUpperCase() : "AK"
                                            )}
                                        </div>
                                        <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] cursor-pointer">
                                            <FaCamera className="text-white text-3xl drop-shadow-lg" />
                                            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                                        </label>
                                    </div>
                                    <div>
                                        <h3 className={`font-bold text-xl mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}>Profil Rasmi</h3>
                                        <p className={`text-sm mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>PNG, JPG (max. 5MB)</p>
                                        <label className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer
                                            ${darkMode ? "bg-white/10 hover:bg-white/20" : "bg-white hover:bg-gray-50 border border-gray-200 text-gray-600"}
                                        `}>
                                            Rasmni O&apos;zgartirish
                                            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                                        </label>
                                    </div>
                                </motion.div>

                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <InputGroup 
                                            label="To'liq Ism" 
                                            value={profileForm.fullName} 
                                            onChange={(val) => setProfileForm(p => ({ ...p, fullName: val }))}
                                            icon={FaUser} 
                                            darkMode={darkMode} 
                                        />
                                        <InputGroup 
                                            label="Telefon" 
                                            value={profileForm.phone} 
                                            onChange={(val) => setProfileForm(p => ({ ...p, phone: val }))}
                                            icon={FaPhoneAlt} 
                                            darkMode={darkMode} 
                                        />
                                        <div className="md:col-span-2 opacity-60">
                                             <InputGroup label="Email Manzil" value={adminData?.email || ""} icon={FaEnvelope} darkMode={darkMode} />
                                             <p className="text-xs ml-1 mt-1 font-medium text-gray-400 italic">Emailni o'zgartirib bo'lmaydi</p>
                                        </div>
                                    </div>

                                    <motion.div variants={itemVariants} className="pt-6">
                                        <motion.button 
                                          type="submit"
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          disabled={updating}
                                          className={`px-10 py-4 rounded-2xl font-black text-lg shadow-xl flex items-center gap-3 disabled:opacity-50
                                            ${darkMode 
                                              ? "bg-[#96C7B9] text-[#0b1a00] hover:bg-white" 
                                              : "bg-[#96C7B9] text-white hover:bg-[#7fae9f] shadow-[#96C7B9]/40"
                                            }
                                        `}>
                                            <FaSave /> Saqlash
                                        </motion.button>
                                    </motion.div>
                                </form>
                            </motion.div>
                        )}

                        {activeTab === "config" && (
                            <motion.div 
                                key="config"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                                className="space-y-12 max-w-4xl relative z-10"
                            >
                                <SectionTitle title="Tizim Sozlamalari" description="Marketplace narxlari va qoidalarini boshqarish" darkMode={darkMode} />
                                
                                <form onSubmit={handleUpdateConfig} className="space-y-12">
                                    {/* Delivery Prices */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <FaTruck className="text-2xl text-[#96C7B9]" />
                                            <h3 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>Yetkazib Berish Narxlari</h3>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6 p-6 rounded-3xl bg-white/5 dark:bg-white/5 border border-white/5">
                                            <InputGroup 
                                                label="Standart Yetkazib Berish" 
                                                type="number"
                                                value={configForm.deliveryPrices.standard} 
                                                onChange={(val) => setConfigForm(c => ({ 
                                                    ...c, 
                                                    deliveryPrices: { ...c.deliveryPrices, standard: Number(val) } 
                                                }))}
                                                icon={FaTruck} 
                                                darkMode={darkMode} 
                                            />
                                            <InputGroup 
                                                label="Ekspress Yetkazib Berish" 
                                                type="number"
                                                value={configForm.deliveryPrices.express} 
                                                onChange={(val) => setConfigForm(c => ({ 
                                                    ...c, 
                                                    deliveryPrices: { ...c.deliveryPrices, express: Number(val) } 
                                                }))}
                                                icon={FaTruck} 
                                                darkMode={darkMode} 
                                            />
                                        </div>
                                    </div>

                                    {/* Rental Rules */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <FaHandHoldingUsd className="text-2xl text-[#96C7B9]" />
                                            <h3 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>Ijaraga Berish Qoidalari</h3>
                                        </div>
                                        <div className="grid md:grid-cols-3 gap-6 p-6 rounded-3xl bg-white/5 dark:bg-white/5 border border-white/5">
                                            <InputGroup 
                                                label="Maksimal Ijara (kun)" 
                                                type="number"
                                                value={configForm.rentalRules.maxDays} 
                                                onChange={(val) => setConfigForm(c => ({ 
                                                    ...c, 
                                                    rentalRules: { ...c.rentalRules, maxDays: Number(val) } 
                                                }))}
                                                icon={FaHandHoldingUsd} 
                                                darkMode={darkMode} 
                                            />
                                            <InputGroup 
                                                label="Jarima (har kunga)" 
                                                type="number"
                                                value={configForm.rentalRules.penaltyPerDay} 
                                                onChange={(val) => setConfigForm(c => ({ 
                                                    ...c, 
                                                    rentalRules: { ...c.rentalRules, penaltyPerDay: Number(val) } 
                                                }))}
                                                icon={FaHandHoldingUsd} 
                                                darkMode={darkMode} 
                                            />
                                            <InputGroup 
                                                label="Minimal Depozit" 
                                                type="number"
                                                value={configForm.rentalRules.minDeposit} 
                                                onChange={(val) => setConfigForm(c => ({ 
                                                    ...c, 
                                                    rentalRules: { ...c.rentalRules, minDeposit: Number(val) } 
                                                }))}
                                                icon={FaHandHoldingUsd} 
                                                darkMode={darkMode} 
                                            />
                                        </div>
                                    </div>

                                    {/* Contact Info */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <FaTelegramPlane className="text-2xl text-[#96C7B9]" />
                                            <h3 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>Kontakt Ma'lumotlari</h3>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6 p-6 rounded-3xl bg-white/5 dark:bg-white/5 border border-white/5">
                                            <InputGroup 
                                                label="Telefon" 
                                                value={configForm.contactInfo.phone} 
                                                onChange={(val) => setConfigForm(c => ({ 
                                                    ...c, 
                                                    contactInfo: { ...c.contactInfo, phone: val } 
                                                }))}
                                                icon={FaPhoneAlt} 
                                                darkMode={darkMode} 
                                            />
                                            <InputGroup 
                                                label="Email" 
                                                value={configForm.contactInfo.email} 
                                                onChange={(val) => setConfigForm(c => ({ 
                                                    ...c, 
                                                    contactInfo: { ...c.contactInfo, email: val } 
                                                }))}
                                                icon={FaEnvelope} 
                                                darkMode={darkMode} 
                                            />
                                            <InputGroup 
                                                label="Manzil" 
                                                value={configForm.contactInfo.address} 
                                                onChange={(val) => setConfigForm(c => ({ 
                                                    ...c, 
                                                    contactInfo: { ...c.contactInfo, address: val } 
                                                }))}
                                                icon={FaMapMarkerAlt} 
                                                darkMode={darkMode} 
                                            />
                                            <InputGroup 
                                                label="Telegram Bot Link" 
                                                value={configForm.contactInfo.tgBotLink} 
                                                onChange={(val) => setConfigForm(c => ({ 
                                                    ...c, 
                                                    contactInfo: { ...c.contactInfo, tgBotLink: val } 
                                                }))}
                                                icon={FaTelegramPlane} 
                                                darkMode={darkMode} 
                                            />
                                            <InputGroup 
                                                label="Admin Telegram (Direct Chat)" 
                                                value={configForm.contactInfo.adminTelegram || ""} 
                                                onChange={(val) => setConfigForm(c => ({ 
                                                    ...c, 
                                                    contactInfo: { ...c.contactInfo, adminTelegram: val } 
                                                }))}
                                                icon={FaTelegramPlane} 
                                                darkMode={darkMode} 
                                            />
                                        </div>
                                    </div>

                                    <motion.div variants={itemVariants} className="pt-6">
                                        <motion.button 
                                          type="submit"
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          disabled={updating}
                                          className={`px-10 py-4 rounded-2xl font-black text-lg shadow-xl flex items-center gap-3 disabled:opacity-50
                                            ${darkMode 
                                              ? "bg-[#96C7B9] text-[#0b1a00] hover:bg-white" 
                                              : "bg-[#96C7B9] text-white hover:bg-[#7fae9f] shadow-[#96C7B9]/40"
                                            }
                                        `}>
                                            <FaSave /> Sozlamalarni Saqlash
                                        </motion.button>
                                    </motion.div>
                                </form>
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
                                
                                <form onSubmit={handleUpdateSecurity} className="space-y-4">
                                    <InputGroup 
                                        label="Joriy Parol" 
                                        type="password" 
                                        placeholder="••••••••" 
                                        value={securityForm.currentPassword}
                                        onChange={(val) => setSecurityForm(s => ({ ...s, currentPassword: val }))}
                                        icon={FaKey} 
                                        darkMode={darkMode} 
                                    />
                                    <InputGroup 
                                        label="Yangi Parol" 
                                        type="password" 
                                        placeholder="••••••••" 
                                        value={securityForm.newPassword}
                                        onChange={(val) => setSecurityForm(s => ({ ...s, newPassword: val }))}
                                        icon={FaLock} 
                                        darkMode={darkMode} 
                                    />
                                    <InputGroup 
                                        label="Parolni Tasdiqlang" 
                                        type="password" 
                                        placeholder="••••••••" 
                                        value={securityForm.confirmPassword}
                                        onChange={(val) => setSecurityForm(s => ({ ...s, confirmPassword: val }))}
                                        icon={FaLock} 
                                        darkMode={darkMode} 
                                    />

                                    <motion.div variants={itemVariants} className="pt-6">
                                        <motion.button 
                                          type="submit"
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          disabled={updating}
                                          className={`px-10 py-4 rounded-2xl font-black text-lg shadow-xl flex items-center gap-3 disabled:opacity-50
                                            ${darkMode 
                                              ? "bg-[#96C7B9] text-[#0b1a00] hover:bg-white" 
                                              : "bg-[#96C7B9] text-white hover:bg-[#7fae9f] shadow-[#96C7B9]/40"
                                            }
                                        `}>
                                            <FaSave /> Parolni O'zgartirish
                                        </motion.button>
                                    </motion.div>
                                </form>

                                <motion.div variants={itemVariants} className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-white/10 my-8" />
                                
                                <SectionTitle title="Ikki Bosqichli Himoya" description="Hisobingiz xavfsizligini kuchaytiring" darkMode={darkMode} />
                                <ToggleSwitch 
                                    label="2FA ni yoqish" 
                                    description="Kirishda SMS kod orqali tasdiqlash (Kelgusida)" 
                                    checked={false} 
                                    onChange={() => toast.info("Tez kunda!")} 
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
                                        checked={true} 
                                        onChange={() => {}} 
                                        darkMode={darkMode} 
                                    />
                                    <ToggleSwitch 
                                        label="Push Bildirishnomalar" 
                                        description="Saytda pop-up xabarlarni ko'rsatish" 
                                        checked={true} 
                                        onChange={() => {}} 
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
                                className="space-y-12 max-w-4xl relative z-10"
                            >
                                <div>
                                    <SectionTitle title="Tizim Ko'rinishi" description="O'zingizga qulay rejimni tanlang" darkMode={darkMode} />
                                    
                                    <div className="grid grid-cols-3 gap-6">
                                        <motion.button 
                                            variants={itemVariants}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleAppearanceToggle('light')}
                                            className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-4 transition-all duration-300
                                                ${appearance === 'light' 
                                                    ? "border-[#96C7B9] bg-white ring-8 ring-[#D1F0E0] shadow-2xl" 
                                                    : "border-gray-100 bg-gray-50 opacity-50 hover:opacity-100"
                                                }
                                            `}
                                        >
                                            <div className="w-16 h-12 bg-[#F3F4F6] rounded-xl shadow-inner border border-gray-200 flex items-center justify-center">
                                                <FaSun className="text-orange-400 text-xl" />
                                            </div>
                                            <span className={`font-black text-sm ${darkMode ? "text-gray-300" : "text-gray-800"}`}>Yorug&apos;</span>
                                        </motion.button>
                                        
                                        <motion.button 
                                            variants={itemVariants}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleAppearanceToggle('dark')}
                                            className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-4 transition-all duration-300
                                                ${appearance === 'dark' 
                                                    ? "border-[#96C7B9] bg-[#0b1a00] ring-8 ring-[#96C7B9]/20 shadow-2xl" 
                                                    : "border-gray-200 bg-gray-100 opacity-50 hover:opacity-100 dark:bg-white/5"
                                                }
                                            `}
                                        >
                                            <div className="w-16 h-12 bg-[#1a3a00] rounded-xl shadow-inner border border-white/10 flex items-center justify-center">
                                                 <FaMoon className="text-yellow-200 text-xl" />
                                            </div>
                                            <span className={`font-black text-sm ${darkMode ? "text-[#96C7B9]" : "text-gray-600"}`}>Tungi</span>
                                        </motion.button>

                                        <motion.button 
                                            variants={itemVariants}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleAppearanceToggle('celery')}
                                            className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-4 transition-all duration-300
                                                ${appearance === 'celery' 
                                                    ? "border-[#b1c44d] bg-[#f9fdf2] ring-8 ring-[#b1c44d]/20 shadow-2xl" 
                                                    : "border-gray-200 bg-gray-100 opacity-50 hover:opacity-100 dark:bg-white/5"
                                                }
                                            `}
                                        >
                                            <div className="w-16 h-12 bg-[#b1c44d] rounded-xl shadow-inner border border-[#6CCFF6]/30 flex items-center justify-center">
                                                 <FaLeaf className="text-[#6CCFF6] text-xl" />
                                            </div>
                                            <span className={`font-black text-sm ${appearance === 'celery' ? "text-[#b1c44d]" : "text-gray-600"}`}>Celery</span>
                                        </motion.button>
                                    </div>
                                </div>

                                <motion.div variants={itemVariants} className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-white/10 my-8" />

                                <div>
                                    <SectionTitle title="Matin Fontlari" description="O'zingizga yoqqan yozuv uslubini tanlang" darkMode={darkMode} />
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        {[
                                            { id: 'Inter', label: 'Inter (Standart)', class: 'font-inter' },
                                            { id: 'Outfit', label: 'Outfit (Zamonaviy)', class: 'font-outfit' },
                                            { id: 'Montserrat', label: 'Montserrat (Chiroyli)', class: 'font-montserrat' },
                                            { id: 'Fraktur', label: 'Fraktur (Blackletter)', class: 'font-fraktur' }
                                        ].map((font) => (
                                            <motion.button 
                                                key={font.id}
                                                variants={itemVariants}
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleFontChange(font.id)}
                                                className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-4 transition-all duration-300
                                                    ${fontFamily === font.id 
                                                        ? "border-[#96C7B9] bg-white ring-8 ring-[#D1F0E0] shadow-2xl" 
                                                        : "border-gray-100 bg-gray-50 opacity-50 hover:opacity-100 dark:bg-white/5"
                                                    }
                                                `}
                                            >
                                                <div className="w-16 h-12 bg-gray-100 dark:bg-white/10 rounded-xl flex items-center justify-center">
                                                    <FaFont className={`${darkMode ? 'text-white' : 'text-gray-700'}`} />
                                                </div>
                                                <span className={`font-bold text-center text-xs ${darkMode ? "text-gray-300" : "text-gray-800"}`} style={{ fontFamily: font.id === 'Fraktur' ? 'UnifrakturMaguntia' : font.id }}>
                                                    {font.label}
                                                </span>
                                            </motion.button>
                                        ))}
                                    </div>
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
