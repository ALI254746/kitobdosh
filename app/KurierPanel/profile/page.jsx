"use client";
import React, { useState, useEffect } from "react";
import { 
  FaPhone, 
  FaEnvelope, 
  FaBox, 
  FaCheckCircle, 
  FaStar, 
  FaClock, 
  FaCog, 
  FaQuestionCircle, 
  FaSignOutAlt, 
  FaChevronRight,
  FaUserEdit,
  FaWallet,
  FaBell,
  FaArrowRight,
  FaChartLine,
  FaUser
} from "react-icons/fa";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courierStats, setCourierStats] = useState({ today: 0, total: 0, delivered: 0 });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: "", phone: "", avatar: null });

  const fetchProfileData = async () => {
    try {
      const [profileRes, courierRes] = await Promise.all([
        fetch('/api/user/profile'),
        fetch('/api/courier')
      ]);

      const profileData = await profileRes.json();
      const courierData = await courierRes.json();

      if (profileData.success) {
        setUser(profileData.data.user);
        setEditForm({
          fullName: profileData.data.user.fullName || "",
          phone: profileData.data.user.phone || "",
          avatar: null
        });
      }

      if (courierData.success) {
        const orders = courierData.data;
        const today = new Date().setHours(0,0,0,0);
        
        const stats = {
          today: orders.filter(o => new Date(o.createdAt) >= today).length,
          total: orders.length,
          delivered: orders.filter(o => o.status === 'delivered').length
        };
        setCourierStats(stats);
      }
    } catch (error) {
      console.error("Failed to fetch profile data", error);
      toast.error("Ma'lumotlarni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleLogout = async () => {
    const confirm = window.confirm("Tizimdan chiqishni xohlaysizmi?");
    if (confirm) {
      await signOut({ callbackUrl: '/' });
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const formData = new FormData();
      formData.append('fullName', editForm.fullName);
      formData.append('phone', editForm.phone);
      if (editForm.avatar) {
        formData.append('avatar', editForm.avatar);
      }

      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Profil yangilandi");
        setUser(data.data);
        setIsEditModalOpen(false);
      } else {
        toast.error(data.message || "Xatolik yuz berdi");
      }
    } catch (error) {
      console.error(error);
      toast.error("Yangilashda xatolik");
    } finally {
      setUpdateLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const stats = [
    { label: "Bugun", value: courierStats.today, icon: <FaBox />, color: "bg-blue-50 text-blue-500 dark:bg-blue-900/20" },
    { label: "Jami", value: courierStats.total, icon: <FaCheckCircle />, color: "bg-green-50 text-green-500 dark:bg-green-900/20" },
    { label: "Reyting", value: "5.0", icon: <FaStar />, color: "bg-yellow-50 text-yellow-500 dark:bg-yellow-900/20" },
    { label: "Yetkazildi", value: courierStats.delivered, icon: <FaClock />, color: "bg-purple-50 text-purple-500 dark:bg-purple-900/20" },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-[#96C7B9]/20 border-t-[#96C7B9] rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      
      {/* HEADER SECTION (Aesthetic) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 dark:bg-white p-10 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] relative overflow-hidden group"
      >
        {/* ... existing header code ... */}
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="relative w-32 h-32 shrink-0"
            >
               <div className="w-full h-full rounded-[2.5rem] overflow-hidden border-4 border-white/20 dark:border-slate-100 relative shadow-2xl bg-slate-800 flex items-center justify-center">
                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt="Profil"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <FaUser size={48} className="text-slate-500" />
                  )}
               </div>
               <div className="absolute -bottom-2 -right-2 bg-[#96C7B9] w-8 h-8 rounded-2xl border-4 border-slate-900 dark:border-white shadow-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
               </div>
            </motion.div>
            
            <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 dark:bg-slate-900/5 rounded-full text-[9px] font-black uppercase tracking-widest text-[#96C7B9] border border-white/5 mb-4">
                    <FaStar size={10} /> {user?.role === 'admin' ? 'Administrator' : 'Professional Kuryer'}
                </div>
                <h2 className="text-4xl font-black text-white dark:text-slate-900 tracking-tight leading-none mb-2 text-balance">{user?.fullName || "Ism kiritilmagan"}</h2>
                <p className="text-white/40 dark:text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mb-6">Toshkent, O'zbekiston</p>
                
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                     <button onClick={() => setIsEditModalOpen(true)} className="flex items-center gap-3 bg-white/10 dark:bg-slate-900/5 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white dark:text-slate-900 hover:bg-white dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white transition-all transform active:scale-95">
                         <FaUserEdit /> Tahrirlash
                     </button>
                     <div className="flex items-center gap-3 bg-white/10 dark:bg-slate-900/5 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white dark:text-slate-900 border border-white/5">
                         <FaPhone /> {user?.phone || 'Raqam yo\'q'}
                     </div>
                </div>
            </div>
        </div>

        {/* Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#96C7B9]/20 to-transparent rounded-full -mr-24 -mt-24 blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-1000"></div>
      </motion.div>

      {/* STATS GRID */}
      <motion.div 
         variants={containerVariants}
         initial="hidden"
         whileInView="visible"
         viewport={{ once: true }}
         className="grid grid-cols-2 lg:grid-cols-4 gap-6 px-1"
      >
          {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center group transition-all"
              >
                  <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center text-xl transition-transform group-hover:rotate-12 ${stat.color}`}>
                      {stat.icon}
                  </div>
                  <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest leading-none mb-1">{stat.label}</span>
                  <span className="text-xl font-black text-slate-900 dark:text-white uppercase">{stat.value}</span>
              </motion.div>
          ))}
      </motion.div>

      {/* PERFORMANCE METRICS */}
      {/* ... existing performance code ... */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-700 p-8 sm:p-10"
      >
          <div className="flex items-center justify-between mb-10">
              <div>
                  <h3 className="font-black text-xl text-slate-900 dark:text-white uppercase tracking-tight">Ish Faoliyati</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">So'nggi 30 kunlik tahlil</p>
              </div>
              <div className="w-12 h-12 bg-slate-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-[#96C7B9] shadow-sm">
                  <FaChartLine />
              </div>
          </div>
          
          <div className="space-y-8">
              {[
                  { label: "O'z vaqtida yetkazilgan", val: 95, color: "bg-[#96C7B9]" },
                  { label: "Mijozlar mamnuniyati", val: 98, color: "bg-blue-500" },
                  { label: "Faollik darajasi", val: 88, color: "bg-orange-500" }
              ].map((item, idx) => (
                  <div key={idx}>
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                          <span className="text-slate-400">{item.label}</span>
                          <span className="text-slate-900 dark:text-white">{item.val}%</span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden p-0.5 border border-slate-50 dark:border-slate-600">
                          <motion.div 
                             initial={{ width: 0 }}
                             whileInView={{ width: `${item.val}%` }}
                             transition={{ duration: 1.5, delay: idx * 0.2, ease: "circOut" }}
                             className={`h-full rounded-full ${item.color} shadow-sm`}
                          ></motion.div>
                      </div>
                  </div>
              ))}
          </div>
      </motion.div>

      {/* MENU LIST */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden"
      >
          <button onClick={() => setIsEditModalOpen(true)} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all border-b border-slate-50 dark:border-slate-700/50 group">
              <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-xl transition-transform group-hover:scale-110">
                      <FaUserEdit className="text-blue-500" />
                  </div>
                  <span className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm">Profilni Tahrirlash</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-300 dark:text-slate-600 group-hover:bg-slate-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-slate-900 transition-all">
                  <FaChevronRight size={12} />
              </div>
          </button>

          <button className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all border-b border-slate-50 dark:border-slate-700/50 group">
              <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-xl transition-transform group-hover:scale-110">
                      <FaWallet className="text-green-500" />
                  </div>
                  <span className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm">Hamyon va To'lovlar</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-300 dark:text-slate-600 group-hover:bg-slate-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-slate-900 transition-all">
                  <FaChevronRight size={12} />
              </div>
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-6 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all group"
          >
              <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-xl transition-transform group-hover:scale-110 group-hover:bg-red-500">
                      <FaSignOutAlt className="text-red-500 group-hover:text-white transition-colors" />
                  </div>
                  <span className="font-black text-red-500 uppercase tracking-tight text-sm">Tizimdan Chiqish</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-200 group-hover:bg-red-500 group-hover:text-white transition-all">
                  <FaChevronRight size={12} />
              </div>
          </button>
      </motion.div>
      
      {/* EDIT PROFILE MODAL */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !updateLoading && setIsEditModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-[3rem] p-8 shadow-2xl overflow-hidden"
            >
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8">Profilni Tahrirlash</h3>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Profil Rasmi</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-slate-50 dark:bg-slate-700 overflow-hidden relative border border-slate-100 dark:border-slate-600">
                      {(editForm.avatar || user?.avatar) ? (
                        <img 
                          src={editForm.avatar ? URL.createObjectURL(editForm.avatar) : user.avatar} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300"><FaUser /></div>
                      )}
                    </div>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setEditForm({...editForm, avatar: e.target.files[0]})}
                      className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-[#96C7B9]/10 file:text-[#96C7B9] hover:file:bg-[#96C7B9]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Ism Familiya</label>
                  <input 
                    type="text" 
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                    placeholder="Ismingizni kiriting"
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 rounded-2xl outline-none focus:border-[#96C7B9] transition-all font-bold text-sm text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Telefon Raqam</label>
                  <input 
                    type="text" 
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    placeholder="+998"
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 rounded-2xl outline-none focus:border-[#96C7B9] transition-all font-bold text-sm text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                   <button 
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    disabled={updateLoading}
                    className="flex-1 py-4 px-6 border border-slate-100 dark:border-slate-600 text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                   >
                     Bekor Qilish
                   </button>
                   <button 
                    type="submit"
                    disabled={updateLoading}
                    className="flex-[2] py-4 px-6 bg-slate-900 dark:bg-[#96C7B9] text-white dark:text-slate-900 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-[#96C7B9] transition-all shadow-xl shadow-slate-200 dark:shadow-none flex items-center justify-center"
                   >
                     {updateLoading ? (
                       <div className="w-4 h-4 border-2 border-white dark:border-slate-900 border-t-transparent rounded-full animate-spin" />
                     ) : "Saqlash"}
                   </button>
                </div>
              </form>

              {/* Decor */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#96C7B9]/10 rounded-full blur-2xl pointer-events-none"></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <div className="text-center space-y-2 opacity-30 group pb-8">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Kitobdosh Delivery System</p>
          <p className="text-[8px] font-bold text-slate-300">Version 2.0.0 • Build #REDESIGN-2025</p>
      </div>

    </div>
  );
}
