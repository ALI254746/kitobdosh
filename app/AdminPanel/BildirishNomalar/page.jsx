"use client";

import React, { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaDownload, FaUser, FaIdCard, FaPhone, FaClock, FaReply, FaTrash, FaLightbulb, FaExclamationCircle, FaComment, FaCheckDouble, FaEnvelopeOpen, FaTimes, FaPlane } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAdmin } from "../AdminContext";
import toast from "react-hot-toast";

// --- SKELETON COMPONENTS ---

const MessageSkeleton = ({ darkMode }) => (
    <div className={`p-6 rounded-2xl border animate-pulse flex flex-col md:flex-row gap-4
        ${darkMode ? "bg-white/5 border-white/5" : "bg-white border-gray-100"}
    `}>
        <div className={`w-14 h-14 rounded-full flex-shrink-0 ${darkMode ? "bg-white/10" : "bg-gray-200"}`} />
        <div className="flex-1 space-y-3">
             <div className="flex justify-between">
                 <div className={`h-4 w-1/3 rounded ${darkMode ? "bg-white/10" : "bg-gray-200"}`} />
                 <div className={`h-4 w-20 rounded ${darkMode ? "bg-white/10" : "bg-gray-200"}`} />
             </div>
             <div className={`h-6 w-3/4 rounded ${darkMode ? "bg-white/10" : "bg-gray-200"}`} />
             <div className={`h-4 w-full rounded ${darkMode ? "bg-white/10" : "bg-gray-200"}`} />
             <div className={`h-4 w-2/3 rounded ${darkMode ? "bg-white/10" : "bg-gray-200"}`} />
        </div>
    </div>
);

// --- REAL COMPONENTS ---

const FilterButton = ({ active, label, icon: Icon, onClick, darkMode }) => (
    <button
        onClick={onClick}
        className={`px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all
            ${active 
                ? (darkMode ? "bg-[#A3ED96] text-[#163201]" : "bg-[#163201] text-white shadow-lg")
                : (darkMode ? "bg-white/5 text-gray-400 hover:bg-white/10" : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-100")
            }
        `}
    >
        <Icon className={active ? "" : "opacity-70"} /> {label}
    </button>
);

export default function MessagesPage() {
  const { darkMode } = useAdmin();
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);

  // Reply Modal State
  const [replyModal, setReplyModal] = useState({ show: false, messageId: null, userId: null, replyText: "" });

  // Fetch Messages from API
  const fetchMessages = async () => {
      try {
          const res = await fetch("/api/contact");
          const data = await res.json();
          if (data.success) {
              setMessages(data.data);
          }
      } catch (error) {
          console.error("Error fetching messages:", error);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchMessages();
      const interval = setInterval(fetchMessages, 30000);
      return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id) => {
      if(!confirm("Haqiqatan ham bu xabarni o'chirmoqchimisiz?")) return;
      
      const toastId = toast.loading("O'chirilmoqda...");
      try {
          const res = await fetch("/api/contact", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id })
          });
          
          if(res.ok) {
              toast.success("O'chirildi", { id: toastId });
              setMessages(prev => prev.filter(m => m._id !== id));
          } else {
              toast.error("Xatolik", { id: toastId });
          }
      } catch (e) {
          toast.error("Xatolik", { id: toastId });
      }
  };

  const markAsRead = async (id, currentStatus) => {
      if(currentStatus === 'read' || currentStatus === 'replied') return;
      try {
          await fetch("/api/contact", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id, updates: { status: "read" } })
          });
          setMessages(prev => prev.map(m => m._id === id ? { ...m, status: "read" } : m));
      } catch (e) {
          console.error(e);
      }
  };

  const openReplyModal = (msg) => {
      if (!msg.user) {
          toast.error("Faqat ro'yxatdan o'tgan foydalanuvchilarga javob berish mumkin.");
          return;
      }
      setReplyModal({ show: true, messageId: msg._id, userId: msg.user, replyText: `Assalomu alaykum, ${msg.name}! Murojaatingiz uchun rahmat. \n\n` });
  };

  const sendReply = async () => {
      if(!replyModal.replyText.trim()) return toast.error("Matn yozing");

      const toastId = toast.loading("Javob yuborilmoqda...");
      try {
          const res = await fetch("/api/contact", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({
                 action: 'reply',
                 messageId: replyModal.messageId,
                 userId: replyModal.userId,
                 replyText: replyModal.replyText
             })
          });

          const data = await res.json();
          if(data.success) {
              toast.success("Javob yuborildi!", { id: toastId });
              setMessages(prev => prev.map(m => m._id === replyModal.messageId ? { ...m, status: "replied" } : m));
              setReplyModal({ show: false, messageId: null, userId: null, replyText: "" });
          } else {
              toast.error(data.message, { id: toastId });
          }
      } catch (e) {
          toast.error("Xatolik", { id: toastId });
      }
  };

  const filteredMessages = messages.filter(msg => 
      (filterType === 'all' || msg.type === filterType) &&
      (msg.name.toLowerCase().includes(searchQuery.toLowerCase()) || (msg.message && msg.message.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const getTypeIcon = (type) => {
      switch(type) {
          case 'suggestion': return <FaLightbulb className="text-yellow-400" />;
          case 'complaint': return <FaExclamationCircle className="text-red-400" />;
          default: return <FaComment className="text-blue-400" />;
      }
  };

  const getStatusLabel = (status) => {
        if(status === 'replied') return <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded text-[10px] uppercase font-bold">Javob berilgan</span>;
        if(status === 'read') return <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-[10px] uppercase font-bold">O'qilgan</span>;
        return <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[10px] uppercase font-bold">Yangi</span>;
  }

  const getTypeLabel = (type) => {
      switch(type) {
          case 'suggestion': return "Taklif";
          case 'complaint': return "Shikoyat";
          default: return "Umumiy";
      }
  };

  return (
    <div className={`min-h-screen p-6 sm:p-8 transition-colors duration-300 ${darkMode ? "bg-[#0b1a00] text-white" : "bg-[#f8fafc] text-[#163201]"}`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
         <div>
            <h1 className={`text-3xl font-black mb-2 flex items-center gap-3 ${darkMode ? "text-white" : "text-[#163201]"}`}>
                <FaEnvelopeOpen className="text-[#A3ED96]" />
                Bildirishnomalar
            </h1>
            <p className={`text-sm font-medium ${darkMode ? "text-[#A3ED96]/60" : "text-gray-500"}`}>
                Foydalanuvchilardan kelgan xabarlar markazi ({messages.filter(m => m.status === 'unread').length} yangi)
            </p>
         </div>
         <div className="flex gap-3">
             <button 
                 onClick={fetchMessages}
                 className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all
                ${darkMode ? "bg-[#A3ED96] text-[#163201]" : "bg-[#163201] text-white"}
             `}>
                 <FaCheckDouble /> Yangilash
             </button>
         </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8 justify-between">
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
               <FilterButton active={filterType === 'all'} label="Barchasi" icon={FaEnvelopeOpen} onClick={() => setFilterType('all')} darkMode={darkMode} />
               <FilterButton active={filterType === 'suggestion'} label="Takliflar" icon={FaLightbulb} onClick={() => setFilterType('suggestion')} darkMode={darkMode} />
               <FilterButton active={filterType === 'complaint'} label="Shikoyatlar" icon={FaExclamationCircle} onClick={() => setFilterType('complaint')} darkMode={darkMode} />
               <FilterButton active={filterType === 'general'} label="Umumiy" icon={FaComment} onClick={() => setFilterType('general')} darkMode={darkMode} />
          </div>

          <div className="relative w-full lg:w-80">
                <FaSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-[#A3ED96]/50" : "text-gray-400"}`} />
                <input 
                    type="text"
                    placeholder="Qidirish..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl font-bold outline-none border transition-all
                        ${darkMode 
                            ? "bg-white/5 border-white/10 text-white focus:border-[#A3ED96]" 
                            : "bg-white border-gray-200 text-gray-900 focus:border-[#163201]"
                        }
                    `}
                />
            </div>
      </div>

      {loading ? (
        <div className="space-y-4">
             {[1,2,3,4].map(i => <MessageSkeleton key={i} darkMode={darkMode} />)}
        </div>
      ) : (
        <div className="space-y-4 max-w-5xl mx-auto lg:mx-0">
            <AnimatePresence>
                {filteredMessages.length === 0 && (
                    <div className={`p-8 rounded-2xl border text-center opacity-50 ${darkMode ? "border-white/10 bg-white/5" : "border-gray-100 bg-white"}`}>
                        <p>Xabarlar topilmadi</p>
                    </div>
                )}
                {filteredMessages.map((msg) => (
                    <motion.div
                        key={msg._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onClick={() => markAsRead(msg._id, msg.status)}
                        className={`group relative rounded-2xl border p-5 sm:p-6 transition-all duration-300 cursor-pointer
                            ${darkMode 
                                ? `bg-[#163201]/40 border-[#A3ED96]/10 hover:border-[#A3ED96]/30 ${msg.status === 'unread' ? "bg-white/5 border-l-4 border-l-[#A3ED96]" : ""}`
                                : `bg-white border-gray-100 hover:shadow-lg ${msg.status === 'unread' ? "bg-blue-50/30 border-l-4 border-l-[#163201]" : ""}`
                            }
                        `}
                    >
                         <div className="flex flex-col sm:flex-row gap-5">
                             {/* Icon Box */}
                             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm flex-shrink-0
                                ${darkMode ? "bg-[#A3ED96]/10" : "bg-gray-50"}
                             `}>
                                 {getTypeIcon(msg.type)}
                             </div>

                             {/* Content */}
                             <div className="flex-1">
                                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                     <div className="flex items-center gap-3">
                                         <h3 className={`text-lg font-black ${darkMode ? "text-white" : "text-[#163201]"}`}>
                                             {msg.name}
                                         </h3>
                                         <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider
                                            ${darkMode ? "bg-white/5 text-gray-400" : "bg-gray-100 text-gray-500"}
                                         `}>
                                             {getTypeLabel(msg.type)}
                                         </span>
                                         {getStatusLabel(msg.status)}
                                     </div>
                                     <div className={`flex items-center gap-2 text-xs font-bold ${darkMode ? "text-[#A3ED96]" : "text-gray-400"}`}>
                                         <FaClock /> {new Date(msg.createdAt).toLocaleString()}
                                     </div>
                                 </div>

                                 <h4 className={`font-bold mb-1 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                                     {msg.title || "Xabar"}
                                 </h4>
                                 <p className={`text-sm mb-4 leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                     {msg.message}
                                 </p>

                                 {/* Footer Info & Actions */}
                                 <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-dashed border-gray-200 dark:border-white/10">
                                     <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                                         <span className="flex items-center gap-1"><FaPhone /> {msg.phone}</span>
                                     </div>

                                     <div className="flex gap-2">
                                         <button 
                                             onClick={(e) => { e.stopPropagation(); openReplyModal(msg); }}
                                             className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors
                                             ${darkMode ? "bg-[#A3ED96]/20 text-[#A3ED96] hover:bg-[#A3ED96]/30" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}
                                         `}>
                                             <FaReply /> Javob
                                         </button>
                                         <button 
                                             onClick={(e) => { e.stopPropagation(); handleDelete(msg._id); }}
                                             className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors
                                             ${darkMode ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" : "bg-red-50 text-red-500 hover:bg-red-100"}
                                         `}>
                                             <FaTrash /> O&apos;chirish
                                         </button>
                                     </div>
                                 </div>
                             </div>
                         </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
      )}

      {/* --- REPLY MODAL --- */}
      <AnimatePresence>
        {replyModal.show && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className={`w-full max-w-lg rounded-2xl shadow-xl overflow-hidden
                        ${darkMode ? "bg-[#0f172a] border border-slate-700" : "bg-white"}
                    `}
                >
                    <div className="p-5 border-b flex justify-between items-center bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                        <h3 className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Javob yozish</h3>
                        <button onClick={() => setReplyModal({ ...replyModal, show: false })} className="text-gray-400 hover:text-red-500">
                            <FaTimes />
                        </button>
                    </div>
                    <div className="p-5">
                        <textarea 
                            rows={6}
                            value={replyModal.replyText}
                            onChange={(e) => setReplyModal({ ...replyModal, replyText: e.target.value })}
                            className={`w-full p-4 rounded-xl border outline-none font-medium
                                ${darkMode ? "bg-slate-900 border-slate-700 text-white focus:border-[#A3ED96]" : "bg-white border-gray-200 focus:border-blue-500"}
                            `}
                            placeholder="Javobingizni shu yerga yozing..."
                        />
                    </div>
                    <div className="p-5 border-t bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 flex justify-end gap-3">
                         <button onClick={() => setReplyModal({ ...replyModal, show: false })} className="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                            Bekor qilish
                         </button>
                         <button onClick={sendReply} className="px-5 py-2.5 rounded-xl font-bold bg-[#163201] text-white hover:bg-[#A3ED96] hover:text-[#163201] transition-colors flex items-center gap-2">
                            <FaReply /> Yuborish
                         </button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

    </div>
  );
}
