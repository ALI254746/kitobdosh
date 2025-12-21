"use client";

import React, { useState, useEffect } from "react";
import { FaBox, FaUndo, FaArrowRight, FaCircle, FaPhone, FaMapMarkerAlt, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import toast from 'react-hot-toast';

const CourierCard = ({ courier, darkMode, onEdit, onDelete }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-6 rounded-2xl shadow-lg border backdrop-blur-sm transition-all duration-300 relative group
        ${darkMode 
            ? "bg-[#163201]/40 border-[#A3ED96]/20 hover:border-[#A3ED96]/50" 
            : "bg-white border-gray-100 hover:shadow-xl"
        }
      `}
    >
      {/* Action Buttons (Visible on Hover or always on mobile) */}
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
              onClick={() => onEdit(courier)}
              className={`p-2 rounded-lg shadow-sm transition-colors ${darkMode ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}
              title="Tahrirlash"
          >
              <FaEdit />
          </button>
          <button 
              onClick={() => onDelete(courier.id)}
              className={`p-2 rounded-lg shadow-sm transition-colors ${darkMode ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-red-50 text-red-600 hover:bg-red-100"}`}
              title="O'chirish"
          >
              <FaTrash />
          </button>
      </div>

      {/* HEADER */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-gradient-to-br from-[#163201] to-[#2a5c02] rounded-2xl flex items-center justify-center text-[#A3ED96] font-bold text-xl shadow-lg shadow-green-900/20 uppercase">
            {courier.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <h3 className={`font-bold text-lg ${darkMode ? "text-white" : "text-gray-900"}`}>{courier.name}</h3>
            <div className={`flex items-center gap-2 text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                <FaPhone className="text-[10px]" />
                {courier.phone}
            </div>
          </div>
        </div>

        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border mr-8 sm:mr-0
            ${courier.online 
                ? (darkMode ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-green-50 text-green-600 border-green-100")
                : (darkMode ? "bg-gray-700/30 text-gray-400 border-gray-600" : "bg-gray-50 text-gray-500 border-gray-100")
            }
        `}>
          <span className={`w-2 h-2 rounded-full ${courier.online ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
          {courier.online ? "Online" : "Offline"}
        </div>
      </div>

      {/* LOCATION */}
      <div className={`flex items-center gap-2 mb-6 text-sm ${darkMode ? "text-[#A3ED96]/70" : "text-gray-500"}`}>
        <FaMapMarkerAlt />
        {courier.location}
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={`rounded-xl p-4 ${darkMode ? "bg-white/5" : "bg-blue-50"}`}>
          <div className="flex items-center gap-2 mb-2">
            <FaBox className={`text-sm ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
            <span className={`text-xs font-bold ${darkMode ? "text-blue-200" : "text-blue-700"}`}>Yetkazish</span>
          </div>
          <p className={`text-2xl font-black ${darkMode ? "text-white" : "text-blue-900"}`}>
            {courier.todayDeliveries}
          </p>
        </div>

        <div className={`rounded-xl p-4 ${darkMode ? "bg-white/5" : "bg-purple-50"}`}>
          <div className="flex items-center gap-2 mb-2">
            <FaUndo className={`text-sm ${darkMode ? "text-purple-400" : "text-purple-600"}`} />
            <span className={`text-xs font-bold ${darkMode ? "text-purple-200" : "text-purple-700"}`}>Qaytarish</span>
          </div>
          <p className={`text-2xl font-black ${darkMode ? "text-white" : "text-purple-900"}`}>
            {courier.todayReturns}
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <div className={`flex items-center justify-between pt-4 border-t ${darkMode ? "border-white/10" : "border-gray-100"}`}>
        <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg
            ${courier.status === 'active' 
                ? (darkMode ? "bg-[#A3ED96]/10 text-[#A3ED96]" : "bg-green-100 text-green-700")
                : (darkMode ? "bg-orange-500/10 text-orange-400" : "bg-orange-100 text-orange-700")
            }
        `}>
            <FaCircle className="text-[8px]" />
            {courier.status === 'active' ? 'Faol' : 'Band'}
        </div>

        <button className={`flex items-center gap-2 text-sm font-bold transition-colors
            ${darkMode ? "text-white hover:text-[#A3ED96]" : "text-gray-900 hover:text-blue-600"}
        `}>
           Tafsilotlar <FaArrowRight className="text-xs" />
        </button>
      </div>
    </motion.div>
  );
};

export default function KurierControl({ darkMode }) {
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Edit State
  const [editingUser, setEditingUser] = useState(null); // The user object being edited
  const [editForm, setEditForm] = useState({ fullName: '', email: '', phone: '', password: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCouriers();
  }, []);

  const fetchCouriers = async () => {
    try {
        const res = await fetch('/api/admin/couriers');
        const data = await res.json();
        if(data.success) {
            setCouriers(data.data);
        }
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async (id) => {
      if(!window.confirm("Rostdan ham bu kuryerni o'chirmoqchimisiz?")) return;
      
      const toastId = toast.loading("O'chirilmoqda...");
      try {
          const res = await fetch(`/api/admin/couriers/${id}`, { method: 'DELETE' });
          const data = await res.json();
          if (data.success) {
              toast.success("Kuryer o'chirildi", { id: toastId });
              setCouriers(prev => prev.filter(c => c.id !== id));
          } else {
              toast.error(data.message, { id: toastId });
          }
      } catch (e) {
          toast.error("Xatolik", { id: toastId });
      }
  };

  const openEditModal = (courier) => {
      setEditingUser(courier);
      setEditForm({
          fullName: courier.name,
          email: '', // We might need to fetch email or assume it was part of courier object. 
                     // Wait, GET /api/admin/couriers returns 'name', 'phone'. It might not return 'email'.
                     // Let's check API. Yes, it returns name (from fullName) and phone. 
                     // We need Email for editing.
                     // I should update GET API to include Email. 
                     // For now, I'll set email empty or if available in courier object.
          phone: courier.phone,
          password: ''
      });
  };

  const handleUpdate = async (e) => {
      e.preventDefault();
      setSaving(true);
      try {
          const res = await fetch(`/api/admin/couriers/${editingUser.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(editForm)
          });
          const data = await res.json();
          if(data.success) {
              toast.success("Yangilandi");
              setEditingUser(null);
              fetchCouriers(); // Refresh list to see changes
          } else {
              toast.error(data.message);
          }
      } catch (err) {
          toast.error("Xatolik");
      } finally {
          setSaving(false);
      }
  };

  if(loading) {
      return (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                  <div key={i} className={`h-64 rounded-2xl animate-pulse ${darkMode ? "bg-white/5" : "bg-gray-100"}`}></div>
              ))}
          </div>
      )
  }

  if(couriers.length === 0) {
      return (
          <div className={`text-center py-10 opacity-50 ${darkMode ? "text-white" : "text-gray-500"}`}>
              <p>Hozircha kuryerlar yo'q</p>
          </div>
      )
  }

  return (
    <>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {couriers.map((courier) => (
            <CourierCard 
                key={courier.id} 
                courier={courier} 
                darkMode={darkMode} 
                onEdit={openEditModal}
                onDelete={handleDelete}
            />
          ))}
        </div>

        {/* Edit Modal */}
        <AnimatePresence>
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className={`w-full max-w-md rounded-2xl p-6 shadow-2xl relative ${darkMode ? "bg-[#0b1a00] border border-[#A3ED96]/20" : "bg-white"}`}
                    >
                        <button 
                            onClick={() => setEditingUser(null)}
                            className={`absolute top-4 right-4 p-2 rounded-full ${darkMode ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
                        >
                            <FaTimes />
                        </button>

                        <h2 className={`text-xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>Kuryerni Tahrirlash</h2>
                        
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className={`block text-xs font-bold mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>F.I.SH</label>
                                <input 
                                    required
                                    type="text" 
                                    className={`w-full p-3 rounded-xl outline-none border ${darkMode ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200"}`}
                                    value={editForm.fullName}
                                    onChange={e => setEditForm({...editForm, fullName: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className={`block text-xs font-bold mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Telefon</label>
                                <input 
                                    required
                                    type="text" 
                                    className={`w-full p-3 rounded-xl outline-none border ${darkMode ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200"}`}
                                    value={editForm.phone}
                                    onChange={e => setEditForm({...editForm, phone: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className={`block text-xs font-bold mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Email (Agar o'zgartirilsa)</label>
                                <input 
                                    type="email" 
                                    placeholder="Emailni o'zgartirish uchun kiriting..."
                                    className={`w-full p-3 rounded-xl outline-none border ${darkMode ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200"}`}
                                    value={editForm.email}
                                    onChange={e => setEditForm({...editForm, email: e.target.value})}
                                />
                                <p className="text-[10px] opacity-60 mt-1">Hozirgi emaili saqlanib qolishi uchun bo'sh qoldiring yoki to'ldiring.</p>
                            </div>
                            <div>
                                <label className={`block text-xs font-bold mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Yangi Parol</label>
                                <input 
                                    type="password" 
                                    placeholder="O'zgartirish uchun kiriting..."
                                    className={`w-full p-3 rounded-xl outline-none border ${darkMode ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200"}`}
                                    value={editForm.password}
                                    onChange={e => setEditForm({...editForm, password: e.target.value})}
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button 
                                    type="button"
                                    onClick={() => setEditingUser(null)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold ${darkMode ? "text-gray-400 hover:bg-white/5" : "text-gray-500 hover:bg-gray-100"}`}
                                >
                                    Bekor qilish
                                </button>
                                <button 
                                    type="submit"
                                    disabled={saving}
                                    className={`px-6 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2
                                        ${darkMode ? "bg-[#A3ED96] text-[#163201]" : "bg-[#163201] text-white"}
                                        ${saving ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"}
                                    `}
                                >
                                    {saving ? "Saqlanmoqda..." : "Saqlash"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    </>
  );
}
