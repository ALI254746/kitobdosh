"use client";

import React, { useState, useEffect } from "react";
import Image from "@/app/components/SafeImage";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaClock, FaCalendarAlt, FaUser, FaPhone, FaMapMarkerAlt, FaFileAlt } from "react-icons/fa";
import { useAdmin } from "../AdminContext";
import toast from "react-hot-toast";

const COLUMNS = {
    pending: { title: "Yangi So'rovlar", color: "bg-yellow-500", text: "text-yellow-500", bg: "bg-yellow-500/10" },
    approved: { title: "Jarayonda", color: "bg-blue-500", text: "text-blue-500", bg: "bg-blue-500/10" },
    returned: { title: "Yakunlangan", color: "bg-green-500", text: "text-green-500", bg: "bg-green-500/10" },
    rejected: { title: "Rad Etilgan", color: "bg-red-500", text: "text-red-500", bg: "bg-red-500/10" },
};

const RequestCard = ({ request, updateStatus, darkMode }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-2xl mb-4 border backdrop-blur-sm shadow-sm
                ${darkMode 
                    ? "bg-[#163201]/40 border-[#A3ED96]/20" 
                    : "bg-white border-gray-100 hover:shadow-lg"
                }
            `}
        >
            {/* Book Info */}
            <div className="flex gap-4 mb-3">
                 <div className="relative w-12 h-16 shrink-0 shadow-md">
                     <Image 
                        src={request.bookImage || "https://placehold.co/100x150"} 
                        alt={request.bookTitle || "Kitob muqovasi"} 
                        fill 
                        className="rounded-md object-cover" 
                     />
                 </div>
                 <div className="flex-1 overflow-hidden">
                     <h4 className={`font-bold text-sm truncate ${darkMode ? "text-white" : "text-gray-900"}`}>{request.bookTitle}</h4>
                     <p className={`text-xs truncate ${darkMode ? "text-[#A3ED96]/70" : "text-gray-500"}`}>Jami: {request.totalPrice?.toLocaleString()} so&apos;m</p>
                     
                     <div className="flex items-center gap-2 mt-2">
                        <FaUser className="text-gray-400 text-xs" />
                        <span className={`text-xs font-medium truncate ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{request.fullName}</span>
                     </div>
                 </div>
            </div>

            {/* User Details */}
            <div className={`space-y-1 text-xs mb-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                <div className="flex items-center gap-2">
                    <FaPhone className="text-green-500" /> {request.phone}
                </div>
                <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-blue-500" /> <span className="truncate">{request.address}</span>
                </div>
                <button disabled={request.hasDocument === false} className="flex items-center gap-2 text-blue-400 hover:underline disabled:text-slate-500 disabled:no-underline disabled:cursor-default" onClick={async () => {
                  const response = await fetch(`/api/rent/${request._id}/document`);
                  const data = await response.json();
                  if (response.ok && data.url) window.open(data.url, '_blank', 'noopener,noreferrer');
                  else toast.error("Hujjatni ochib bo‘lmadi. Eski hujjat uchun kirish siyosatini administrator tekshirsin.");
                }}>{request.hasDocument === false ? "Hujjat biriktirilmagan" : "Hujjatni ko‘rish"}</button>
            </div>

            {/* Footer Stats */}
            <div className={`flex items-center justify-between text-xs pt-3 border-t ${darkMode ? "border-white/10" : "border-gray-100"}`}>
                <div className="flex items-center gap-2">
                    <FaClock className={`${darkMode ? "text-[#A3ED96]" : "text-blue-500"}`} />
                    <span className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>{request.days} kun</span>
                </div>
                <span className={`font-bold text-[10px] uppercase px-2 py-0.5 rounded ${darkMode ? "bg-white/10" : "bg-gray-100"}`}>{request.paymentMethod}</span>
            </div>

            {/* Actions */}
            {request.status === 'pending' && (
                <div className="flex gap-2 mt-3">
                     <button 
                        onClick={() => updateStatus(request._id, 'approved')}
                        className="flex-1 py-1.5 rounded-lg bg-green-500/10 text-green-500 text-xs font-bold hover:bg-green-500/20 transition-colors"
                     >
                        Tasdiqlash
                     </button>
                     <button 
                        onClick={() => updateStatus(request._id, 'rejected')}
                        className="flex-1 py-1.5 rounded-lg bg-red-500/10 text-red-500 text-xs font-bold hover:bg-red-500/20 transition-colors"
                     >
                        Rad qilish
                     </button>
                </div>
            )}
            
            {['active', 'late', 'return_requested'].includes(request.status) && (
                <div className="mt-3">
                    <button 
                        onClick={() => updateStatus(request._id, 'returned')}
                        className="w-full py-1.5 rounded-lg bg-blue-500/10 text-blue-500 text-xs font-bold hover:bg-blue-500/20 transition-colors"
                     >
                        Yakunlash (Qaytarildi)
                     </button>
                </div>
            )}
        </motion.div>
    )
}

const KanbanColumn = ({ status, items, updateStatus, darkMode }) => {
    const config = COLUMNS[status];
    
    return (
        <div className="min-w-0">
             <div className={`flex items-center justify-between mb-4 p-3 rounded-xl ${darkMode ? "bg-white/5" : "bg-gray-50"}`}>
                 <div className="flex items-center gap-3">
                     <span className={`w-3 h-3 rounded-full ${config.color}`} />
                     <span className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{config.title}</span>
                 </div>
                 <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${config.bg} ${config.text}`}>
                     {items.length}
                 </span>
             </div>

             <div className="space-y-2">
                 {items.map(req => (
                     <RequestCard key={req._id} request={req} updateStatus={updateStatus} darkMode={darkMode} />
                 ))}
                 {items.length === 0 && (
                     <div className={`text-center py-4 text-xs italic ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                        Bo&apos;sh
                     </div>
                 )}
             </div>
        </div>
    )
}

// --- MAIN PAGE ---

export default function RentRequestsPage() {
  const { darkMode } = useAdmin();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [monthLabel, setMonthLabel] = useState("");
  
  const fetchRequests = async () => {
      try {
          setError("");
          const res = await fetch('/api/rent', {cache: 'no-store', signal: AbortSignal.timeout(15000)});
          const data = await res.json();
          if(!res.ok || !data.success) throw new Error(data.message || 'Ijaralarni yuklab bo‘lmadi');
          setRequests(data.data);
      } catch (error) {
          setError("Ijaralar yuklanmadi. Qayta urinib ko‘ring.");
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    setMonthLabel(new Date().toLocaleDateString("uz-UZ", { month: "long", year: "numeric", timeZone: "Asia/Tashkent" }));
    fetchRequests();
  }, []);

  const updateStatus = async (id, status) => {
      const toastId = toast.loading("Yangilanmoqda...");
      try {
          const res = await fetch('/api/rent', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id, status })
          });
          const data = await res.json();
          if(data.success) {
              toast.success("Holat o'zgartirildi", { id: toastId });
              fetchRequests(); // Refresh
          } else {
              toast.error(data.message, { id: toastId });
          }
      } catch (error) {
          toast.error("Xatolik", { id: toastId });
      }
  };

  return (
    <div className={`min-h-screen p-6 sm:p-8 transition-colors duration-300 ${darkMode ? "bg-[#0b1a00]" : "bg-[#f8fafc]"}`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className={`text-3xl font-black tracking-tight mb-2 ${darkMode ? "text-white" : "text-[#163201]"}`}>
                Ijara So&apos;rovlari
            </h1>
            <p className={`text-sm ${darkMode ? "text-[#A3ED96]/60" : "text-gray-500"}`}>
                Joriy va yakunlangan ijara holati
            </p>
          </div>
          
           {/* Quick Stats or Actions could go here */}
           <div className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold ${darkMode ? "bg-white/10 text-white" : "bg-white shadow text-gray-700"}`}>
                <FaCalendarAlt className="text-[#A3ED96]" />
                <span>{monthLabel}</span>
           </div>
      </div>

       {/* Kanban Board */}
       {error && <div role="alert" className="dash-error">{error} <button onClick={fetchRequests} className="dash-action">Qayta urinish</button></div>}
       {loading ? <div role="status" className="py-12 text-center text-slate-400">Ijaralar yuklanmoqda…</div> : <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-5 pb-8">
           {['pending', 'approved', 'returned', 'rejected'].map(status => (
                <KanbanColumn 
                    key={status} 
                    status={status} 
                    items={requests.filter(r => status === "approved" ? ["approved", "active", "late", "return_requested", "courier_assigned", "courier_picked_up"].includes(r.status) : r.status === status)}
                    updateStatus={updateStatus}
                    darkMode={darkMode}
                />
           ))}
       </div>}

    </div>
  );
}
