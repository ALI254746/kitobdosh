"use client";
import { useState } from "react";
import {
  FaMapMarkerAlt,
  FaCheck,
  FaBook,
  FaCar,
  FaPhone,
  FaCheckDouble,
  FaUser,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";
import Image from "next/image";

export default function OrdersPage() {
  const [orders, setOrders] = useState([
    {
      id: 1234,
      customer: "Javohir Usmonov",
      address: "Toshkent sh., Yunusobod t., 4-mavze, 105-uy",
      book: "Fizika 11-sinf",
      status: "Kutmoqda",
      author: "Abdulla Qahhor",
      phone: "93 270 22 74",
      image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=100&h=140&fit=crop"
    },
    {
      id: 1235,
      customer: "Malika Karimova",
      address: "Toshkent sh., Chilonzor t., 5-kvartal, 12-uy",
      book: "O'tkan kunlar",
      status: "Qabul qildim",
      author: "Abdulla Qodiriy",
      phone: "90 123 45 67",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=140&fit=crop"
    },
    {
        id: 1236,
        customer: "Sardor Alimov",
        address: "Toshkent sh., Mirzo Ulug'bek t., TTZ-2, 5-uy",
        book: "Sariq devni minib",
        status: "Yo'ldaman",
        author: "Xudoyberdi To'xtaboyev",
        phone: "99 876 54 32",
        image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=100&h=140&fit=crop"
      },
  ]);

  const updateOrderStatus = (id, newStatus) => {
    setOrders(prev => prev.map(order => order.id === id ? { ...order, status: newStatus } : order));
  };

  return (
    <div className="pb-24 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6 px-2">
            <h1 className="text-2xl font-bold text-gray-800">Buyurtmalarim</h1>
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">{orders.length} ta</span>
        </div>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus} />
        ))}
      </div>
    </div>
  );
}

function OrderCard({ order, onUpdateStatus }) {
    const [expanded, setExpanded] = useState(false);

    const statusColor = (status) => {
        switch (status) {
          case "Kutmoqda": return "bg-gray-100 text-gray-600";
          case "Qabul qildim": return "bg-blue-50 text-blue-600";
          case "Kitobni oldim": return "bg-purple-50 text-purple-600";
          case "Yo'ldaman": return "bg-yellow-50 text-yellow-600";
          case "Yetkazdim": return "bg-green-50 text-green-600";
          default: return "bg-gray-50 text-gray-500";
        }
      };

    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
            {/* Header: Status & ID */}
            <div className="flex justify-between items-start mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${statusColor(order.status)}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {order.status}
                </span>
                <span className="text-xs text-gray-400 font-mono">#{order.id}</span>
            </div>

            {/* Main Content */}
            <div className="flex gap-4">
                 <div className="w-20 h-28 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden relative">
                    <Image src={order.image} alt={order.book} fill className="object-cover" />
                 </div>
                 
                 <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{order.book}</h3>
                    <p className="text-xs text-gray-500 mb-2">{order.author}</p>
                    
                    <div className="space-y-1">
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                            <FaUser className="mt-1 text-gray-400 text-xs" />
                            <span className="truncate">{order.customer}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                             <FaMapMarkerAlt className="mt-1 text-red-400 text-xs" />
                             <span className="line-clamp-2 text-xs leading-tight">{order.address}</span>
                        </div>
                    </div>
                 </div>
            </div>

            {/* Actions / Expansion */}
            <div className="mt-4 pt-3 border-t border-gray-50">
                 <button 
                  onClick={() => setExpanded(!expanded)}
                  className="w-full flex items-center justify-center text-xs font-semibold text-gray-500 mb-3 hover:text-gray-800 transition-colors"
                 >
                    {expanded ? "Yashirish" : "Harakatlar va Tafsilotlar"} 
                    {expanded ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
                 </button>

                 {expanded && (
                    <div className="space-y-3 animate-fade-in-down">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                            <span className="text-gray-600 text-sm flex items-center gap-2">
                                <FaPhone className="text-green-500" /> Telefon:
                            </span>
                            <a href={`tel:${order.phone.replace(/\s/g, '')}`} className="font-bold text-gray-800 hover:text-blue-600">{order.phone}</a>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                             <StatusButton 
                               current={order.status} 
                               target="Qabul qildim" 
                               label="Qabul qilish" 
                               icon={<FaCheck />} 
                               color="blue" 
                               onClick={() => onUpdateStatus(order.id, "Qabul qildim")}
                             />
                             <StatusButton 
                               current={order.status} 
                               target="Kitobni oldim" 
                               label="Kitob oldim" 
                               icon={<FaBook />} 
                               color="purple" 
                               prevReq="Qabul qildim"
                               onClick={() => onUpdateStatus(order.id, "Kitobni oldim")}
                             />
                             <StatusButton 
                               current={order.status} 
                               target="Yo'ldaman" 
                               label="Yo'lga chiqdim" 
                               icon={<FaCar />} 
                               color="yellow" 
                               prevReq="Kitobni oldim"
                               onClick={() => onUpdateStatus(order.id, "Yo'ldaman")}
                             />
                             <StatusButton 
                               current={order.status} 
                               target="Yetkazdim" 
                               label="Yetkazib berdim" 
                               icon={<FaCheckDouble />} 
                               color="green" 
                               prevReq="Yo'ldaman"
                               onClick={() => onUpdateStatus(order.id, "Yetkazdim")}
                             />
                        </div>
                    </div>
                 )}
            </div>
        </div>
    )
}

function StatusButton({ current, target, label, icon, color, onClick, prevReq }) {
    // Simple logic: Can only move forward step by step
    const steps = ["Kutmoqda", "Qabul qildim", "Kitobni oldim", "Yo'ldaman", "Yetkazdim"];
    const currentIndex = steps.indexOf(current);
    const targetIndex = steps.indexOf(target);
    
    // Allow clicking if it is the next step OR if it is already completed (to signify state, though usually disabled)
    // Here: simplistic approach -> allow next step only.
    const isNext = targetIndex === currentIndex + 1;
    const isCompleted = targetIndex <= currentIndex;
    
    const colors = {
        blue: "bg-blue-500 hover:bg-blue-600",
        purple: "bg-purple-500 hover:bg-purple-600",
        yellow: "bg-yellow-500 hover:bg-yellow-600",
        green: "bg-green-500 hover:bg-green-600",
    }
    
    // If completed: show solid. If next: show outline or solid. If locked: gray.
    
    if (isCompleted && current === target) {
         // Current active state
         return (
            <button disabled className={`flex flex-col items-center justify-center p-2 rounded-xl text-white opacity-100 ${colors[color]}`}>
                 <span className="text-lg mb-1">{icon}</span>
                 <span className="text-[10px] font-bold uppercase">{label}</span>
            </button>
         )
    } 
    
    if (isCompleted && current !== target) {
        // Past state
        return (
            <button disabled className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-100 text-gray-400 opacity-50">
                 <span className="text-lg mb-1">{icon}</span>
                 <span className="text-[10px] font-bold uppercase">{label}</span>
            </button>
         )
    }

    if (isNext) {
        return (
            <button onClick={onClick} className={`flex flex-col items-center justify-center p-2 rounded-xl text-white shadow-md transition-transform active:scale-95 ${colors[color]}`}>
                 <span className="text-lg mb-1">{icon}</span>
                 <span className="text-[10px] font-bold uppercase">{label}</span>
            </button>
         )
    }

    // Locked
    return (
        <button disabled className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-100 text-gray-300 cursor-not-allowed">
             <span className="text-lg mb-1">{icon}</span>
             <span className="text-[10px] font-bold uppercase">{label}</span>
        </button>
     )

}
