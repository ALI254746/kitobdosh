"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaIdBadge, FaUser, FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave,
  FaCheck, FaCar, FaBook, FaCheckCircle, FaTruck, FaUndo, FaCamera,
  FaClipboardList, FaChevronRight, FaChevronLeft, FaSpinner,
  FaArrowRight, FaPhoneAlt, FaCheckDouble
} from "react-icons/fa";
import Image from "next/image";
import toast, { Toaster } from 'react-hot-toast';
import { uploadToCloudinary } from "../../../lib/cloudinary";

export default function BookReturn() {
  const [currentStep, setCurrentStep] = useState(0);
  const [bookCondition, setBookCondition] = useState("");
  const [bookComment, setBookComment] = useState("");
  const [returnPhoto, setReturnPhoto] = useState({ url: "", publicId: "" });
  const [returnsList, setReturnsList] = useState([]);
  const [activeReturn, setActiveReturn] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReturns();
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
    if (pusherKey) {
        import("pusher-js").then(({ default: Pusher }) => {
            const pusher = new Pusher(pusherKey, { cluster: pusherCluster });
            const channel = pusher.subscribe("courier-channel");
            channel.bind("new-job", () => {
                 fetchReturns();
                 toast.success('Yangi qaytarish so\'rovi keldi!', { icon: '🔄' });
            });
        });
    }
  }, []);

  const fetchReturns = async () => {
      try {
          const res = await fetch('/api/courier/returns');
          const data = await res.json();
          if(data.success) setReturnsList(data.data);
      } catch (err) {
          console.error(err);
      } finally {
          setLoading(false);
      }
  };

  const handleSelectReturn = (item) => {
      setActiveReturn(item);
      setCurrentStep(item.status === 'courier_picked_up' ? 2 : item.status === 'courier_assigned' ? 1 : 0);
  };

  const handleAccept = async () => {
      try {
          const res = await fetch('/api/courier/returns', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ rentId: activeReturn._id, action: 'accept' })
          });
          const data = await res.json();
          if (data.success) {
              toast.success("Topshiriq qabul qilindi!");
              nextStep();
          }
      } catch (e) { toast.error("Xatolik"); }
  };

  const handlePickup = async () => {
      try {
          const res = await fetch('/api/courier/returns', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ rentId: activeReturn._id, action: 'pickup' })
          });
          const data = await res.json();
          if (data.success) {
              toast.success("Kitob qabul qilindi!");
              nextStep();
          }
      } catch (e) { toast.error("Xatolik"); }
  };

  const handleComplete = async () => {
      try {
          await fetch('/api/courier/returns', {
              method: 'PUT',
              body: JSON.stringify({ 
                  rentId: activeReturn._id, action: 'complete',
                  condition: bookCondition, comment: bookComment,
                  returnPhoto: returnPhoto.url, returnPhotoCloudinaryId: returnPhoto.publicId
              })
          });
          nextStep();
      } catch (e) { toast.error("Xatolik"); }
  };

  const steps = [
    { title: "So'rov", icon: <FaUndo /> },
    { title: "Yo'l", icon: <FaCar /> },
    { title: "Sifat", icon: <FaClipboardList /> },
    { title: "Yakun", icon: <FaCheckDouble /> },
  ];

  const getConditionText = (value) => {
    switch (value) {
      case "perfect": return "A'lo";
      case "10": return "10% zarar";
      case "30": return "30% zarar";
      case "60": return "60% zarar";
      case "100": return "Yaroqsiz";
      default: return "-";
    }
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const resetReturn = () => {
    setActiveReturn(null);
    setCurrentStep(0);
    setBookCondition("");
    setBookComment("");
    setReturnPhoto({ url: "", publicId: "" });
    fetchReturns();
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } },
  };

  if (!activeReturn) {
      return (
          <div className="max-w-2xl mx-auto space-y-8">
              <Toaster />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
                  <div>
                      <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Kitob Qaytarish</h1>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Foydalanuvchilardan ijarani yig'ish</p>
                  </div>
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm self-start">
                      <FaUndo className="text-[#96C7B9]" />
                      <span className="text-xs font-black text-slate-900 dark:text-white uppercase">{returnsList.length} ta so'rov</span>
                  </div>
              </div>

              {loading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                       <div className="w-12 h-12 border-4 border-[#96C7B9]/20 border-t-[#96C7B9] rounded-full animate-spin mb-4" />
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Yuklanmoqda...</p>
                  </div>
              ) : (
                  <div className="grid gap-6">
                      <AnimatePresence mode="popLayout">
                          {returnsList.map(item => (
                              <motion.div 
                                  key={item._id}
                                  layout
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, x: 20 }}
                                  onClick={() => handleSelectReturn(item)}
                                  className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl cursor-pointer transition-all group overflow-hidden relative"
                              >
                                  <div className="flex gap-6">
                                      <div className="w-24 h-32 sm:w-28 sm:h-36 bg-slate-50 dark:bg-slate-700 rounded-3xl overflow-hidden shrink-0 relative shadow-md group-hover:scale-105 transition-transform duration-500">
                                           <Image src={item.bookImage || "https://placehold.co/100x150"} alt="Book" fill className="object-cover" />
                                      </div>
                                      <div className="flex-1 space-y-4">
                                          <div>
                                              <div className="flex items-center gap-2 mb-2">
                                                   <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                       item.status === 'return_requested' ? 'bg-orange-50 text-orange-500 dark:bg-orange-900/20' : 'bg-blue-50 text-blue-500 dark:bg-blue-900/20'
                                                   }`}>
                                                       {item.status === 'return_requested' ? 'Yangi So\'rov' : 'Jarayonda'}
                                                   </span>
                                                   <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600">ID: #{item._id.slice(-5).toUpperCase()}</span>
                                              </div>
                                              <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight mb-1">{item.bookTitle}</h3>
                                              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{item.bookAuthor || "Noma'lum"}</p>
                                          </div>
                                          
                                          <div className="grid grid-cols-1 gap-2">
                                              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-600/50">
                                                  <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-red-400 shadow-sm"><FaMapMarkerAlt size={12} /></div>
                                                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{item.userAddress || "Manzil yo'q"}</p>
                                              </div>
                                              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-600/50">
                                                  <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-[#96C7B9] shadow-sm"><FaUser size={12} /></div>
                                                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{item.userName}</p>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </motion.div>
                          ))}
                      </AnimatePresence>
                      {returnsList.length === 0 && (
                          <div className="text-center py-20 bg-white dark:bg-slate-800/50 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-700">
                              <FaUndo className="mx-auto text-slate-200 dark:text-slate-700 mb-4" size={40} />
                              <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Hozircha qaytarish so'rovlari yo'q</p>
                          </div>
                      )}
                  </div>
              )}
          </div>
      );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
       <Toaster />
       
       <div className="flex items-center justify-between px-2">
          <button onClick={() => setActiveReturn(null)} className="p-4 bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-all">
              <FaChevronLeft />
          </button>
          <div className="text-right">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">Qaytarish</h1>
            <p className="text-[10px] text-[#96C7B9] font-black uppercase tracking-[0.2em] mt-1">Ish tartibi</p>
          </div>
       </div>

       {/* Stepper */}
       <div className="relative px-6 py-8 bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm flex justify-between items-center group">
          <div className="absolute left-16 right-16 top-1/2 -translate-y-1/2 h-1 bg-slate-50 dark:bg-slate-700 rounded-full">
              <motion.div animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }} className="h-full bg-[#96C7B9] rounded-full shadow-[0_0_15px_rgba(150,199,185,0.5)]" />
          </div>
          {steps.map((step, idx) => {
             const isCompleted = idx <= currentStep;
             const isCurrent = idx === currentStep;
             return (
                 <div key={idx} className="relative z-10 flex flex-col items-center gap-3">
                     <motion.div 
                        initial={false}
                        animate={{ 
                            scale: isCurrent ? 1.3 : 1,
                            backgroundColor: isCompleted ? (isCurrent ? "#1F2937" : "#96C7B9") : "#F8FAFC"
                        }}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg shadow-xl transition-all border-4 border-white dark:border-slate-800
                            ${isCompleted ? "text-white" : "text-slate-300 dark:bg-slate-700 dark:border-slate-700"}`}
                     >
                         {isCompleted && !isCurrent ? <FaCheck size={14}/> : step.icon}
                     </motion.div>
                     <span className={`text-[9px] font-black uppercase tracking-widest ${isCompleted ? "text-[#96C7B9]" : "text-slate-300"} hidden sm:block`}>{step.title}</span>
                 </div>
             )
          })}
       </div>

       <AnimatePresence mode="wait">
          {currentStep === 0 && (
             <motion.div key="step0" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-700 shadow-2xl shadow-slate-200 dark:shadow-none text-center space-y-8">
                <div className="w-24 h-24 bg-[#F0FDF8] dark:bg-[#96C7B9]/10 text-[#96C7B9] rounded-[2.5rem] flex items-center justify-center text-4xl mx-auto shadow-inner animate-bounce">
                    <FaUndo />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">So'rovni Tasdiqlang</h2>
                    <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed max-w-sm mx-auto">
                       Mijoz kitobni topshirishga tayyor. Siz ushbu topshiriqni qabul qilib, manzilga yo'l olishingiz kerak.
                    </p>
                </div>
                <button onClick={handleAccept} className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl text-sm font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-[#96C7B9] dark:hover:bg-[#96C7B9] dark:hover:text-white transition-all active:scale-95 flex items-center justify-center gap-4 group">
                    Qabul Qilish <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                </button>
             </motion.div>
          )}

          {currentStep === 1 && (
             <motion.div key="step1" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-8">
                <div className="flex flex-col items-center text-center space-y-6">
                    <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-[2.5rem] flex items-center justify-center text-4xl shadow-inner">
                        <FaCar />
                    </div>
                    
                    <div className="w-full grid gap-4">
                        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-700/50 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-600">
                            <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-red-400 shadow-sm"><FaMapMarkerAlt /></div>
                            <div className="text-left font-bold text-xs text-slate-700 dark:text-slate-200 uppercase tracking-tight">{activeReturn.userAddress}</div>
                        </div>
                        <div className="flex items-center gap-4 bg-[#F0FDF8] dark:bg-green-900/10 p-5 rounded-[2rem] border border-[#D1F0E0] dark:border-green-900/20">
                            <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-green-500 shadow-sm"><FaPhoneAlt /></div>
                            <div className="text-left font-black text-xs text-slate-900 dark:text-white">{activeReturn.userPhone || "Raqam yo'q"}</div>
                        </div>
                    </div>

                    <div className="w-full grid grid-cols-2 gap-4">
                         <button onClick={() => window.open(`https://maps.google.com/?q=${activeReturn.userAddress}`)} className="py-5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">
                             Xaritani ochish
                         </button>
                         <button onClick={handlePickup} className="py-5 bg-[#96C7B9] text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#96C7B9]/30 active:scale-95 transition-all">
                             Yetib bordim
                         </button>
                    </div>
                </div>
             </motion.div>
          )}

          {currentStep === 2 && (
             <motion.div key="step2" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-700 shadow-2xl space-y-6">
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                    <FaClipboardList className="text-[#96C7B9]" /> Sifat Nazorati
                </h2>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Kitob holati</label>
                        <div className="grid grid-cols-2 gap-3">
                            {["perfect", "10", "30", "60", "100"].map((val) => (
                                <button key={val} onClick={() => setBookCondition(val)} className={`py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${bookCondition === val ? "border-[#96C7B9] bg-[#96C7B9]/10 text-[#96C7B9]" : "border-slate-100 dark:border-slate-700 text-slate-400 dark:bg-slate-800"}`}>
                                    {getConditionText(val)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                         <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Qo'shimcha izoh</label>
                         <textarea className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-[2rem] p-5 text-sm font-medium focus:ring-4 ring-[#96C7B9]/10 transition-all outline-none dark:text-white" placeholder="Nuqsonlar bormi?..." rows={3} value={bookComment} onChange={(e) => setBookComment(e.target.value)} />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Isbot (Rasm)</label>
                        <div className="flex gap-4 items-center">
                            <label className="flex-1 flex flex-col items-center justify-center py-8 border-4 border-dashed border-slate-100 dark:border-slate-700 rounded-[2rem] cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all group">
                                <FaCamera className="text-3xl text-slate-300 group-hover:text-[#96C7B9] transition-colors mb-2" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rasm yuklash</span>
                                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if(!file) return;
                                    const tId = toast.loading("Yuklanmoqda...");
                                    const res = await uploadToCloudinary(file, 'returns');
                                    setReturnPhoto({ url: res.url, publicId: res.publicId });
                                    toast.success("Tayyor!", { id: tId });
                                }} />
                            </label>
                            {returnPhoto.url && (
                                <div className="w-28 h-28 rounded-[2rem] overflow-hidden shadow-2xl shrink-0 border-4 border-white dark:border-slate-600 transform rotate-3">
                                    <img src={returnPhoto.url} alt="Return" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <button onClick={prevStep} className="px-8 py-5 bg-slate-100 dark:bg-slate-700 text-slate-400 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">Orqaga</button>
                    <button onClick={handleComplete} disabled={!bookCondition} className="flex-1 py-5 bg-[#96C7B9] text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl disabled:opacity-50 active:scale-95 transition-all">Tasdiqlash</button>
                </div>
             </motion.div>
          )}

          {currentStep === 3 && (
             <motion.div key="step3" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="bg-white dark:bg-slate-800 rounded-[3rem] p-12 border border-slate-100 dark:border-slate-700 shadow-2xl text-center space-y-8">
                 <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: [0, 10, 0] }} className="w-28 h-28 bg-[#96C7B9] text-white rounded-[3rem] flex items-center justify-center text-5xl mx-auto shadow-2xl shadow-[#96C7B9]/40">
                     <FaCheck />
                 </motion.div>
                 
                 <div>
                     <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Muvaffaqiyatli!</h2>
                     <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
                         Kitob qabul qilindi. Sizning ishingiz tizimda qayd etildi.
                     </p>
                 </div>

                 <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-[2rem] text-left space-y-3">
                     <div className="flex justify-between items-center"><span className="text-[10px] font-black text-slate-400 uppercase">Kitob:</span> <span className="text-xs font-black text-slate-900 dark:text-white">{activeReturn.bookTitle}</span></div>
                     <div className="flex justify-between items-center"><span className="text-[10px] font-black text-slate-400 uppercase">Holat:</span> <span className="text-xs font-black text-orange-500">{getConditionText(bookCondition)}</span></div>
                 </div>

                 <button onClick={resetReturn} className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl text-sm font-black uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all">
                     Bosh Sahifaga Qaytis
                 </button>
             </motion.div>
          )}
       </AnimatePresence>

    </div>
  );
}
