"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaIdBadge,
  FaUser,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaCheck,
  FaCar,
  FaBook,
  FaCheckCircle,
  FaTruck,
  FaUndo,
  FaCamera,
  FaClipboardList,
  FaChevronRight,
  FaChevronLeft
} from "react-icons/fa";
import Image from "next/image";

export default function BookReturn() {
  const [currentStep, setCurrentStep] = useState(0);
  const [bookCondition, setBookCondition] = useState("");
  const [bookComment, setBookComment] = useState("");

  const steps = [
    { title: "So'rov", icon: <FaUndo /> },
    { title: "Yo'l", icon: <FaCar /> },
    { title: "Tekshiruv", icon: <FaClipboardList /> },
    { title: "Adminga", icon: <FaTruck /> },
  ];

  const bookData = {
    id: "B123",
    title: "JavaScript Asoslari",
    image:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=500&q=60",
    borrower: "Dilshod Karimov",
    location: "Toshkent sh., Chilonzor tumani, 12-mavze, 45-uy",
    daysUsed: 7,
    fee: 5000,
  };

  const getConditionText = (value) => {
    switch (value) {
      case "perfect": return "A'lo darajada";
      case "10": return "Yengil zararlangan (10%)";
      case "30": return "O'rtacha zararlangan (30%)";
      case "60": return "Jiddiy zararlangan (60%)";
      case "100": return "Yaroqsiz (100%)";
      default: return "-";
    }
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const resetReturn = () => {
    setCurrentStep(0);
    setBookCondition("");
    setBookComment("");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="max-w-2xl mx-auto pb-24 px-4 sm:px-0 pt-24">
       
       {/* Header */}
       <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <FaUndo className="text-blue-600" /> Kitobni Qaytarish
          </h1>
          <p className="text-gray-500 text-sm mt-1">Bosqichma-bosqich jarayonni kuzating</p>
       </div>

       {/* Stepper */}
       <div className="flex justify-between items-center mb-10 relative">
          <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
          <motion.div 
             className="absolute left-0 top-1/2 h-1 bg-blue-600 -z-10 rounded-full"
             initial={{ width: "0%" }}
             animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
             transition={{ duration: 0.5 }}
          ></motion.div>
          {steps.map((step, idx) => {
             const isCompleted = idx <= currentStep;
             const isCurrent = idx === currentStep;
             return (
                 <div key={idx} className="flex flex-col items-center gap-2 bg-white/50 backdrop-blur-sm p-1 rounded-full">
                     <motion.div 
                       className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 ${isCompleted ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-300 text-gray-400"}`}
                       animate={{ scale: isCurrent ? 1.1 : 1 }}
                     >
                         {isCompleted ? <FaCheck /> : step.icon}
                     </motion.div>
                     <span className={`text-[10px] font-bold uppercase hidden sm:block ${isCompleted ? "text-blue-600" : "text-gray-400"}`}>{step.title}</span>
                 </div>
             )
          })}
       </div>

       {/* BOOK INFO CARD (Always Visible Summary) */}
       <motion.div 
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex gap-4 items-center"
       >
           <div className="relative w-20 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
               <Image src={bookData.image} alt={bookData.title} fill className="object-cover" />
           </div>
           <div>
               <h3 className="font-bold text-gray-800 text-lg">{bookData.title}</h3>
               <p className="text-sm text-gray-500 mb-1">ID: <span className="font-mono text-gray-700">{bookData.id}</span></p>
               <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-lg w-fit">
                   <FaUser size={12} /> {bookData.borrower}
               </div>
           </div>
       </motion.div>

       {/* DYNAMIC CONTENT AREA */}
       <AnimatePresence mode="wait">
          {currentStep === 0 && (
             <motion.div key="step0" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl animate-pulse">
                        <FaUndo />
                    </div>
                    <h2 className="text-xl font-bold">Qaytarish So&apos;rovi</h2>
                    <p className="text-gray-600">
                       Mijoz <strong>{bookData.borrower}</strong> kitobni qaytarmoqchi. Manzil:
                       <br/><span className="text-gray-800 font-medium">{bookData.location}</span>
                    </p>
                    <button onClick={nextStep} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-2">
                        Qabul Qilish <FaChevronRight />
                    </button>
                </div>
             </motion.div>
          )}

          {currentStep === 1 && (
             <motion.div key="step1" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex flex-col items-center text-center space-y-6">
                    <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-4xl">
                        <FaCar />
                    </div>
                    
                    <div className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 text-left space-y-2">
                        <div className="flex items-center gap-3">
                            <FaMapMarkerAlt className="text-red-500" />
                            <span className="text-sm font-medium">{bookData.location}</span>
                        </div>
                        <div className="flex items-center gap-3">
                             <FaUser className="text-purple-500" />
                             <span className="text-sm font-medium">{bookData.borrower}</span>
                        </div>
                    </div>

                    <div className="w-full grid grid-cols-2 gap-3">
                         <button onClick={() => window.open(`https://maps.google.com/?q=${bookData.location}`)} className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-colors">
                             Xarita
                         </button>
                         <button onClick={nextStep} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all">
                             Yetib Bordim <FaChevronRight />
                         </button>
                    </div>
                </div>
             </motion.div>
          )}

          {currentStep === 2 && (
             <motion.div key="step2" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FaClipboardList className="text-purple-600" /> Kitob Holatini Baholash
                </h2>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Holat</label>
                        <div className="grid grid-cols-2 gap-2">
                            {["perfect", "10", "30", "60", "100"].map((val) => (
                                <button
                                  key={val}
                                  onClick={() => setBookCondition(val)}
                                  className={`py-2 px-3 rounded-lg text-sm font-medium border-2 transition-all ${
                                      bookCondition === val 
                                      ? "border-blue-500 bg-blue-50 text-blue-700" 
                                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                                  }`}
                                >
                                    {getConditionText(val)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                         <label className="block text-sm font-bold text-gray-700 mb-2">Izoh (ixtiyoriy)</label>
                         <textarea 
                           className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-blue-500 transition-colors"
                           placeholder="Qirilgan, yirtilgan yoki boshqa nuqsonlar..."
                           rows={3}
                           value={bookComment}
                           onChange={(e) => setBookComment(e.target.value)}
                         />
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button onClick={prevStep} className="px-4 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200">
                        Orqaga
                    </button>
                    <button 
                      onClick={nextStep} 
                      disabled={!bookCondition}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl shadow-lg shadow-green-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        Tasdiqlash <FaCheckCircle />
                    </button>
                </div>
             </motion.div>
          )}

          {currentStep === 3 && (
             <motion.div key="step3" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center">
                 <motion.div 
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   transition={{ type: "spring", stiffness: 200, damping: 10 }}
                   className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-6"
                 >
                     <FaCheck />
                 </motion.div>
                 
                 <h2 className="text-2xl font-bold text-gray-900 mb-2">Muvaffaqiyatli!</h2>
                 <p className="text-gray-600 mb-8">
                     Kitob qabul qilindi va holati tizimga kiritildi. Endi uni omborga/adminga topshiring.
                 </p>

                 <div className="bg-gray-50 p-4 rounded-xl mb-6 text-left text-sm space-y-1">
                     <p className="flex justify-between"><span>Kitob:</span> <span className="font-bold">{bookData.title}</span></p>
                     <p className="flex justify-between"><span>Holat:</span> <span className="font-bold text-orange-600">{getConditionText(bookCondition)}</span></p>
                     <p className="flex justify-between"><span>Izoh:</span> <span className="italic">{bookComment || "-"}</span></p>
                 </div>

                 <button onClick={resetReturn} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-all">
                     Yangi Qaytarish
                 </button>
             </motion.div>
          )}
       </AnimatePresence>

    </div>
  );
}
