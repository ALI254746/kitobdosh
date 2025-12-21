"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaBook,
  FaCheck,
  FaCar,
  FaCheckDouble,
  FaPhoneAlt,
  FaLocationArrow,
  FaChevronRight,
  FaTimes,
  FaBox,
  FaArrowRight,
  FaHistory
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

export default function ActiveOrder() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchActiveOrder = async () => {
      try {
          const res = await fetch('/api/courier');
          const data = await res.json();
          if(data.success && data.data) {
              const active = data.data.find(o => ['on_way', 'picked_up', 'accepted'].includes(o.status));
              
              if(active) {
                 const map = {
                    "accepted": "Qabul qildim",
                    "picked_up": "Kitobni oldim",
                    "on_way": "Yo'ldaman",
                    "delivered": "Yetkazdim"
                 };

                 setOrder({
                     id: active._id,
                     type: active.type,
                     customer: active.userName || active.customer,
                     phone: active.userPhone || active.phone,
                     address: active.address || "Toshkent shahar",
                     book: active.bookTitle || active.book,
                     image: active.bookImage,
                     status: map[active.status] || "Qabul qildim",
                     apiStatus: active.status,
                     lat: active.lat,
                     lng: active.lng
                 });
              } else {
                  setOrder(null);
              }
          }
      } catch (e) {
          console.error(e);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchActiveOrder();
  }, []);

  const steps = ["Qabul qildim", "Kitobni oldim", "Yo'ldaman", "Yetkazdim"];
  
  const mapStatusToKey = (uiStatus) => {
      const map = {
          "Qabul qildim": "accepted",
          "Kitobni oldim": "picked_up",
          "Yo'ldaman": "on_way",
          "Yetkazdim": "delivered"
      };
      return map[uiStatus];
  };

  const handleNextStep = async () => {
     if(!order) return;
     if(order.apiStatus === 'accepted') return; 

     const currentIndex = steps.indexOf(order.status);
     if(currentIndex < steps.length - 1) {
         const nextStatusUI = steps[currentIndex + 1];
         const nextStatusKey = mapStatusToKey(nextStatusUI);
         
         try {
            const res = await fetch('/api/courier', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: order.id, type: order.type, status: nextStatusKey })
            });
            const d = await res.json();
            if(d.success) {
                setOrder(prev => ({ ...prev, status: nextStatusUI, apiStatus: nextStatusKey }));
                if(nextStatusKey === 'delivered') {
                    setTimeout(() => setOrder(null), 2000);
                }
            }
         } catch(e) {
             console.error(e);
         }
     }
  };

  if (loading) return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="w-12 h-12 border-4 border-[#96C7B9]/20 border-t-[#96C7B9] rounded-full animate-spin mb-4" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Yuklanmoqda...</p>
      </div>
  );

  if (!order) return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6"
      >
          <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center text-slate-200 dark:text-slate-700 mb-8 shadow-sm">
              <FaCheckDouble size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Faol topshiriq yo'q</h2>
          <p className="text-slate-400 dark:text-slate-500 mb-10 max-w-xs mx-auto text-xs font-bold uppercase tracking-widest leading-relaxed">Hozirda barcha topshiriqlar bajarilgan yoki yangi buyurtma kutilmoqda.</p>
          <Link href="/KurierPanel/buyurtmalar" className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-200 dark:shadow-none hover:scale-105 active:scale-95 transition-all">
              Yangi buyurtma olish
          </Link>
      </motion.div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between px-2">
         <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Faol Topshiriq</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Hozirgi bajarilayotga jarayon</p>
         </div>
         <span className="px-4 py-1.5 bg-[#96C7B9] text-white text-[10px] font-black uppercase tracking-widest rounded-full animate-pulse shadow-lg shadow-[#96C7B9]/20">Aktiv</span>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-hidden group">
         {/* Map Placeholder */}
         <div className="h-56 bg-slate-100 dark:bg-slate-700 relative cursor-pointer overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10"></div>
            <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center grayscale group-hover:scale-110 transition-transform duration-[2000ms]"></div>
            
            <div className="absolute inset-0 flex items-center justify-center z-20">
               <span className="flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md bg-white/10 px-6 py-3 rounded-2xl border border-white/20">
                   <FaLocationArrow className="animate-bounce" /> Xarita Tayyorlanmoqda
               </span>
            </div>
            
            <div className="absolute bottom-6 right-6 z-20">
                 <button 
                    disabled={!order.lat || !order.lng}
                    onClick={() => {
                        if (order.lat && order.lng) {
                            window.open(`https://www.google.com/maps?q=${order.lat},${order.lng}`, '_blank');
                        }
                    }}
                    className="bg-white text-slate-900 px-6 py-3 rounded-2xl shadow-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-[#96C7B9] hover:text-white transition-all active:scale-95 transform disabled:opacity-50"
                 >
                    <FaLocationArrow /> Navigatsiya
                 </button>
            </div>
         </div>

         <div className="p-8 sm:p-10">
            {/* Customer & Book */}
            <div className="flex flex-col md:flex-row justify-between gap-8 mb-10">
               <div className="flex-1 space-y-4">
                  <div>
                      <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-none mb-2">{order.customer}</h2>
                      <p className="text-slate-400 dark:text-slate-500 text-xs font-bold flex items-start gap-2 uppercase tracking-tight">
                          <FaMapMarkerAlt className="shrink-0 mt-0.5 text-red-400" />
                          {order.address}
                      </p>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-[2rem] p-5 flex items-center gap-5 border border-slate-100 dark:border-slate-600/50">
                     <div className="w-16 h-20 bg-white dark:bg-slate-700 rounded-2xl flex-shrink-0 relative shadow-md overflow-hidden">
                        {order.image ? (
                            <Image src={order.image} alt="Book" fill className="object-cover" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-[#96C7B9]"><FaBook size={24} /></div>
                        )}
                     </div>
                     <div className="min-w-0">
                        <p className="text-[9px] text-[#96C7B9] font-black uppercase tracking-widest mb-1">Kitobni topshiring</p>
                        <p className="font-black text-slate-900 dark:text-white text-lg leading-tight truncate">{order.book}</p>
                     </div>
                  </div>
               </div>

               <div className="flex flex-row md:flex-col gap-3 shrink-0">
                  <a href={`tel:${order.phone.replace(/\s/g, '')}`} className="w-14 h-14 bg-[#F0FDF8] dark:bg-[#F0FDF8]/5 text-green-500 rounded-2xl flex items-center justify-center hover:bg-green-500 hover:text-white transition-all shadow-sm border border-[#D1F0E0] dark:border-transparent active:scale-90">
                     <FaPhoneAlt size={20} />
                  </a>
                  <button className="w-14 h-14 bg-slate-50 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all shadow-sm border border-slate-100 dark:border-transparent active:scale-90">
                     <FaTimes size={20} />
                  </button>
               </div>
            </div>

            {/* Stepper */}
            <div className="relative pl-8 space-y-10 mb-10">
               <div className="absolute left-[31px] top-4 bottom-8 w-1 bg-slate-50 dark:bg-slate-700/50 rounded-full -z-10"></div>
               
               {steps.map((step, i) => {
                   const currentIndex = steps.indexOf(order.status);
                   const isCompleted = i <= currentIndex;
                   const isCurrent = i === currentIndex;
                   
                   return (
                       <motion.div 
                        initial={false}
                        animate={{ x: isCurrent ? 10 : 0, opacity: isCurrent ? 1 : isCompleted ? 0.6 : 0.3 }}
                        key={i} 
                        className="flex items-center gap-6"
                       >
                           <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 z-10 
                                ${isCurrent 
                                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl scale-125 rotate-6" 
                                    : isCompleted 
                                        ? "bg-[#96C7B9] text-white" 
                                        : "bg-slate-100 dark:bg-slate-700 text-slate-300 dark:text-slate-600"
                                }`}>
                               {i === 0 && <FaCheck size={14}/>}
                               {i === 1 && <FaBook size={14}/>}
                               {i === 2 && <FaCar size={14}/>}
                               {i === 3 && <FaCheckDouble size={14}/>}
                           </div>
                           <div>
                               <p className={`font-black text-xs uppercase tracking-widest transition-all duration-300 ${isCurrent ? "text-slate-900 dark:text-white text-sm" : isCompleted ? "text-[#96C7B9]" : "text-slate-300 dark:text-slate-600"}`}>
                                   {step}
                               </p>
                               {isCurrent && <span className="text-[9px] text-[#96C7B9] font-black uppercase tracking-[0.2em] animate-pulse mt-0.5 block">Hozirgi Bosqich</span>}
                           </div>
                       </motion.div>
                   )
               })}
            </div>
            
            {/* Action Button */}
            <div className="pt-4">
               <button 
                 onClick={handleNextStep}
                 disabled={order.status === "Yetkazdim" || order.apiStatus === 'accepted'}
                 className={`w-full py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 group overflow-hidden relative
                   ${(order.status === "Yetkazdim" || order.apiStatus === 'accepted')
                     ? "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-default shadow-none" 
                     : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-[#96C7B9] dark:hover:bg-[#96C7B9] dark:hover:text-white shadow-slate-200 dark:shadow-none"}`}
               >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                      {order.status === "Yetkazdim" ? (
                          <>
                            <FaCheckDouble size={16}/> Topshiriq Yakunlandi
                          </>
                      ) : order.apiStatus === 'accepted' ? (
                          <>
                            <FaBook size={16}/> Kitob Olinishini Kuting
                          </>
                      ) : (
                          <>
                            Keyingi Bosqich <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-500" />
                          </>
                      )}
                  </span>
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
