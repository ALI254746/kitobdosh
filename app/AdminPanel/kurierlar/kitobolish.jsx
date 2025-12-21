"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaSearch, FaSync, FaEnvelope, FaUser } from "react-icons/fa";
import toast from "react-hot-toast";

// Skeleton Component
const TableSkeleton = ({ darkMode }) => (
  <div className="w-full animate-pulse">
    {[1, 2, 3, 4, 5].map((i) => (
      <div 
        key={i} 
        className={`flex items-center space-x-4 p-4 border-b last:border-0
          ${darkMode ? "border-white/5" : "border-gray-100"}
        `}
      >
        <div className={`w-12 h-16 rounded ${darkMode ? "bg-white/5" : "bg-gray-200"}`} />
        <div className="flex-1 space-y-2">
            <div className={`h-4 w-1/3 rounded ${darkMode ? "bg-white/5" : "bg-gray-200"}`} />
            <div className={`h-3 w-1/4 rounded ${darkMode ? "bg-white/5" : "bg-gray-200"}`} />
        </div>
        <div className={`w-24 h-8 rounded-full ${darkMode ? "bg-white/5" : "bg-gray-200"}`} />
        <div className={`w-20 h-8 rounded-lg ${darkMode ? "bg-white/5" : "bg-gray-200"}`} />
      </div>
    ))}
  </div>
);

export default function PickupTab({ darkMode }) {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  // Removed subTabs as per user request to simplify interfaces
  
  const fetchOrders = async () => {
      setLoading(true);
      try {
          const res = await fetch('/api/courier', { cache: 'no-store' });
          const data = await res.json();
          if(data.success) {
              setOrders(data.data);
          }
      } catch (e) {
          console.error(e);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleGiveBook = async (orderId, type) => {
      const toastId = toast.loading("Yangilanmoqda...");
      try {
          const res = await fetch('/api/courier', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: orderId, type, status: 'picked_up' })
          });
          const data = await res.json();
          if(data.success) {
              toast.success("Kitob berildi (Status yangilandi)", { id: toastId });
              fetchOrders(); 
          } else {
              toast.error("Xatolik: " + data.message, { id: toastId });
          }
      } catch (e) {
          toast.error("Tarmoq xatosi", { id: toastId });
      }
  };

  const currentList = orders.filter(
    (order) =>
      (order.book?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (order.customer?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );


  const getStatusBadge = (status) => {
      const map = {
          'accepted': { text: 'Kuryer Kelmoqda', color: 'blue' },
          'picked_up': { text: 'Olib Ketildi', color: 'orange' },
          'on_way': { text: "Yo'lda", color: 'yellow' },
          'delivered': { text: 'Yetkazildi', color: 'green' },
          'new': { text: 'Kutmoqda', color: 'gray' }
      };
      
      const conf = map[status] || map['new'];
      
      const colors = {
          blue: darkMode ? "bg-blue-500/10 text-blue-400" : "bg-blue-100 text-blue-800",
          orange: darkMode ? "bg-orange-500/10 text-orange-400" : "bg-orange-100 text-orange-800",
          yellow: darkMode ? "bg-yellow-500/10 text-yellow-400" : "bg-yellow-100 text-yellow-800",
          green: darkMode ? "bg-green-500/10 text-green-400" : "bg-green-100 text-green-800",
          gray: darkMode ? "bg-gray-500/10 text-gray-400" : "bg-gray-100 text-gray-800",
      };

      return (
          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${colors[conf.color]}`}>
              {conf.text}
          </span>
      );
  };

  const [msgModal, setMsgModal] = useState({ open: false, targetId: null, targetName: '', role: 'user' });
  const [msgText, setMsgText] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);

  const openMsgModal = (id, name, role = 'user') => {
      setMsgModal({ open: true, targetId: id, targetName: name, role });
      setMsgText("");
  };

  /* Recipient Selection Logic */
  const [selectModal, setSelectModal] = useState({ open: false, order: null });

  const handleMessageClick = (order) => {
      // If both exist, ask who to message
      if (order.userId && order.courierId) {
          setSelectModal({ open: true, order });
      } 
      // If only User
      else if (order.userId) {
          openMsgModal(order.userId, order.customer || "Mijoz", 'user');
      }
      // If only Courier
      else if (order.courierId) {
          openMsgModal(order.courierId, "Kurier", 'courier');
      }
  };

  const handleSelectRecipient = (target) => {
      const { order } = selectModal;
      setSelectModal({ open: false, order: null });
      if (target === 'user') {
          openMsgModal(order.userId, order.customer || "Mijoz", 'user');
      } else {
          openMsgModal(order.courierId, "Kurier", 'courier');
      }
  };

  const handleSendMessage = async () => {
      if(!msgText.trim()) return;
      setSendingMsg(true);
      try {
          const res = await fetch('/api/notifications', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  userId: msgModal.targetId,
                  title: msgModal.role === 'courier' ? "Admin (Kuryerga)" : "Admin Xabari",
                  message: msgText,
                  type: msgModal.role === 'courier' ? 'courier_message' : 'user_message'
              })
          });
          const data = await res.json();
          if(data.success) {
              toast.success("Xabar yuborildi");
              setMsgModal({ open: false, targetId: null, targetName: '' });
          } else {
              toast.error("Xatolik: " + data.message);
          }
      } catch (e) {
          toast.error("Tarmoq xatosi");
      } finally {
          setSendingMsg(false);
      }
  };

  return (
    <div className="space-y-6 relative">
      {/* Filter & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div>
                    <h3 className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                        Jarayon Nazorati
                    </h3>
                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Jami {currentList.length} ta buyurtma
                    </p>
                </div>
                <button 
                    onClick={fetchOrders}
                    disabled={loading}
                    className={`p-2 rounded-lg transition-all ${
                        darkMode 
                            ? "bg-white/5 hover:bg-white/10 text-[#A3ED96]" 
                            : "bg-gray-100 hover:bg-gray-200 text-[#163201]"
                    }`}
                    title="Yangilash"
                >
                    <FaSync className={loading ? "animate-spin" : ""} />
                </button>
            </div>

        <div className="relative w-full lg:w-80">
          <input
            type="text"
            placeholder="Qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl font-medium outline-none border transition-all
                ${darkMode 
                    ? "bg-white/5 border-white/10 text-white focus:border-[#A3ED96]" 
                    : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#163201]"
                }
            `}
          />
          <FaSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-[#A3ED96]/50" : "text-gray-400"}`} />
        </div>
      </div>

      {/* Table Content */}
      <div className={`rounded-2xl border overflow-hidden min-h-[400px]
          ${darkMode ? "border-[#A3ED96]/10" : "border-gray-200"}
      `}>
         {loading ? (
             <TableSkeleton darkMode={darkMode} />
         ) : (
            <div className="overflow-x-auto">
                <table className="w-full">
                <thead className={`${darkMode ? "bg-white/5" : "bg-gray-50 border-b border-gray-200"}`}>
                    <tr>
                    {["Rasm", "Kitob Nomi", "Mijoz", "ID", "Kuryer Holati", "Amal"].map((head) => (
                        <th key={head} className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider
                            ${darkMode ? "text-[#A3ED96]/70" : "text-gray-500"}
                        `}>
                            {head}
                        </th>
                    ))}
                    </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? "divide-white/5" : "divide-gray-100"}`}>
                    {currentList.length === 0 && (
                        <tr>
                            <td colSpan="6" className={`px-6 py-12 text-center flex flex-col items-center justify-center ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                                <p className="mb-2 text-lg font-bold">Ma'lumot topilmadi</p>
                                <p className="text-sm">Ushbu bo'limda buyurtmalar mavjud emas</p>
                            </td>
                        </tr>
                    )}
                    {currentList.map((order) => (
                    <tr
                        key={order.id}
                        className={`group transition-colors
                            ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}
                        `}
                    >
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="relative w-12 h-16 shadow-md rounded overflow-hidden bg-gray-200">
                                <Image
                                    src={order.image}
                                    alt={order.book}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <p className={`text-sm font-bold ${darkMode ? "text-white" : "text-gray-900"} max-w-[200px] truncate`}>
                                {order.book}
                            </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold
                                    ${darkMode ? "bg-[#A3ED96]/20 text-[#A3ED96]" : "bg-blue-100 text-blue-600"}
                                `}>
                                    {order.customer.charAt(0)}
                                </span>
                                <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                    {order.customer}
                                </p>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-xs font-mono px-2 py-1 rounded
                                ${darkMode ? "bg-white/10 text-gray-400" : "bg-gray-100 text-gray-600"}
                            `}>
                                {order.id.toString().slice(-4)}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(order.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                                {order.status === 'accepted' && (
                                    <button 
                                        onClick={() => handleGiveBook(order.id, order.type)}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all
                                        ${darkMode 
                                            ? "bg-[#A3ED96] text-[#163201] hover:shadow-[0_0_15px_rgba(163,237,150,0.3)]" 
                                            : "bg-[#163201] text-white hover:bg-[#2a5c02] hover:shadow-lg"
                                        }
                                    `}>
                                        Kitobni berish
                                    </button>
                                )}
                                
                                {(order.userId || order.courierId) && (
                                    <button 
                                        onClick={() => handleMessageClick(order)}
                                        className={`p-2 rounded-lg transition-all
                                            ${darkMode ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30" : "bg-blue-100 text-blue-600 hover:bg-blue-200"}
                                        `}
                                        title="Xabar yuborish"
                                    >
                                        <FaEnvelope />
                                    </button>
                                )}
                            </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
         )}
      </div>

      {/* Message Modal */}
      {msgModal.open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className={`w-full max-w-md p-6 rounded-2xl shadow-xl transform transition-all ${darkMode ? "bg-[#1e293b]" : "bg-white"}`}>
                    <h3 className={`text-lg font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                        Xabar yozish: {msgModal.targetName}
                    </h3>
                    <textarea 
                        className={`w-full p-3 rounded-xl min-h-[100px] outline-none border transition-all mb-4
                            ${darkMode ? "bg-black/20 border-white/10 text-white focus:border-[#A3ED96]" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500"}
                        `}
                        placeholder="Xabarni kiriting..."
                        value={msgText}
                        onChange={(e) => setMsgText(e.target.value)}
                    />
                    <div className="flex justify-end gap-3">
                        <button 
                            onClick={() => setMsgModal({ ...msgModal, open: false })}
                            className={`px-4 py-2 rounded-xl text-sm font-bold ${darkMode ? "text-gray-400 hover:bg-white/5" : "text-gray-500 hover:bg-gray-100"}`}
                        >
                            Bekor qilish
                        </button>
                        <button 
                            onClick={handleSendMessage}
                            disabled={sendingMsg || !msgText.trim()}
                            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2
                                ${darkMode ? "bg-[#A3ED96] text-[#163201]" : "bg-[#163201] text-white"}
                                ${(sendingMsg || !msgText.trim()) ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"}
                            `}
                        >
                            {sendingMsg ? "Yuborilmoqda..." : "Yuborish"}
                        </button>
                    </div>
                </div>
            </div>
      )}

      {/* Selection Modal */}
      {selectModal.open && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className={`w-full max-w-sm p-6 rounded-2xl shadow-xl transform transition-all ${darkMode ? "bg-[#1e293b]" : "bg-white"}`}>
                  <h3 className={`text-lg font-bold mb-6 text-center ${darkMode ? "text-white" : "text-gray-900"}`}>
                      Kimga xabar yubormoqchisiz?
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                      <button 
                          onClick={() => handleSelectRecipient('user')}
                          className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all hover:scale-105 active:scale-95
                              ${darkMode 
                                  ? "border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400" 
                                  : "border-blue-100 bg-blue-50 hover:bg-blue-100 text-blue-600"
                              }
                          `}
                      >
                          <FaUser className="text-3xl" />
                          <span className="font-bold text-sm">Mijoz</span>
                          <span className="text-[10px] opacity-70 truncate max-w-full">{selectModal.order?.customer}</span>
                          <span className="text-[8px] opacity-50 font-mono">ID: {selectModal.order?.userId?.slice(-4)}</span>
                      </button>

                      <button 
                          onClick={() => handleSelectRecipient('courier')}
                          className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all hover:scale-105 active:scale-95
                              ${darkMode 
                                  ? "border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400" 
                                  : "border-yellow-100 bg-yellow-50 hover:bg-yellow-100 text-yellow-600"
                              }
                          `}
                      >
                          <span className="text-3xl font-black">K</span>
                          <span className="font-bold text-sm">Kurier</span>
                          <span className="text-[10px] opacity-70">Yetkazib beruvchi</span>
                          <span className="text-[8px] opacity-50 font-mono">ID: {selectModal.order?.courierId?.slice(-4)}</span>
                      </button>
                  </div>
                  <button 
                      onClick={() => setSelectModal({ open: false, order: null })}
                      className="w-full mt-6 py-3 rounded-xl font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-100 text-sm transition-colors"
                  >
                      Bekor qilish
                  </button>
              </div>
           </div>
      )}
    </div>
  );
}
