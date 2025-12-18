"use client";

import { useState } from "react";
import {
  FaMapMarkerAlt,
  FaBook,
  FaCheck,
  FaCar,
  FaCheckDouble,
  FaPhoneAlt,
  FaLocationArrow,
  FaChevronRight
} from "react-icons/fa";

export default function ActiveOrder() {
  const [order, setOrder] = useState({
    customer: "Javohir Usmonov",
    phone: "+998 93 270 22 74",
    address: "Toshkent sh., Shayxontohur tumani, 15-mavze, 33-uy",
    book: "Fizika 11-sinf",
    status: "Yo'ldaman", 
  });

  const steps = ["Qabul qildim", "Kitobni oldim", "Yo'ldaman", "Yetkazdim"];
  
  const handleNextStep = () => {
     const currentIndex = steps.indexOf(order.status);
     if(currentIndex < steps.length - 1) {
         setOrder({...order, status: steps[currentIndex + 1]});
     }
  };

  return (
    <div className="pb-24 max-w-lg mx-auto">
      <h1 className="text-xl font-bold text-gray-800 mb-4 px-2">Faol topshiriq</h1>

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
         {/* Map Placeholder / Header */}
         <div className="h-40 bg-gray-200 relative group cursor-pointer">
            <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
               <span className="flex items-center gap-2 text-gray-600 font-medium"><FaLocationArrow /> Xarita yuklanmoqda...</span>
            </div>
            {/* Real app would have Google Maps/Yandex Maps here */}
            <div className="absolute bottom-4 right-4">
                 <button className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow-lg font-semibold flex items-center gap-2 text-sm hover:bg-blue-700 transition">
                    <FaLocationArrow /> Navigatsiya
                 </button>
            </div>
         </div>

         <div className="p-6">
            {/* Customer Info */}
            <div className="flex justify-between items-start mb-6">
               <div>
                  <h2 className="text-xl font-bold text-gray-900">{order.customer}</h2>
                  <p className="text-gray-500 text-sm mt-1">{order.address}</p>
               </div>
               <a href={`tel:${order.phone.replace(/\s/g, '')}`} className="bg-green-100 text-green-600 p-3 rounded-full hover:bg-green-200 transition">
                  <FaPhoneAlt />
               </a>
            </div>

            {/* Book Info */}
            <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-4 mb-6">
               <div className="w-12 h-16 bg-blue-200 rounded-lg flex-shrink-0 flex items-center justify-center text-blue-400">
                  <FaBook className="text-xl" />
               </div>
               <div>
                  <p className="text-xs text-blue-600 font-bold uppercase tracking-wide">Yetkazish kerak</p>
                  <p className="font-bold text-gray-800">{order.book}</p>
               </div>
            </div>

            {/* Stepper (Vertical for better mobile context or large horizontal) */}
            <div className="relative pl-4 space-y-6">
               {/* Line */}
               <div className="absolute left-[27px] top-2 bottom-4 w-1 bg-gray-100 -z-10"></div>
               
               {steps.map((step, i) => {
                   const currentIndex = steps.indexOf(order.status);
                   const isCompleted = i <= currentIndex;
                   const isCurrent = i === currentIndex;
                   
                   let icon = <div className="w-2 h-2 rounded-full bg-gray-300"></div>;
                   if (isCompleted) icon = <FaCheck className="text-white text-xs" />;
                   if (isCurrent) icon = <div className="w-3 h-3 rounded-full bg-white"></div>;
                   
                   let bgClass = "bg-gray-100 text-gray-400";
                   if (isCompleted) bgClass = "bg-green-500 text-white shadow-green-200 shadow-md";
                   if (isCurrent) bgClass = "bg-blue-600 text-white ring-4 ring-blue-100 shadow-blue-300 shadow-lg";

                   return (
                       <div key={i} className={`flex items-center gap-4 transition-all duration-300 ${isCurrent ? "scale-105 origin-left" : "opacity-80"}`}>
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300 z-10 ${bgClass}`}>
                               {i === 0 && <FaCheck />}
                               {i === 1 && <FaBook />}
                               {i === 2 && <FaCar />}
                               {i === 3 && <FaCheckDouble />}
                           </div>
                           <div>
                               <p className={`font-semibold text-sm ${isCurrent ? "text-blue-700" : isCompleted ? "text-green-600" : "text-gray-400"}`}>{step}</p>
                               {isCurrent && <p className="text-xs text-blue-400 animate-pulse">Hozirgi holat</p>}
                           </div>
                       </div>
                   )
               })}
            </div>
            
            {/* Big Action Button */}
            <div className="mt-8">
               <button 
                 onClick={handleNextStep}
                 disabled={order.status === "Yetkazdim"}
                 className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95
                   ${order.status === "Yetkazdim" 
                     ? "bg-green-100 text-green-600 cursor-default" 
                     : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-300"}`}
               >
                  {order.status === "Yetkazdim" ? (
                      <>
                        <FaCheckDouble /> Vazifa yakunlandi
                      </>
                  ) : (
                      <>
                        Keyingi bosqich <FaChevronRight />
                      </>
                  )}
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
