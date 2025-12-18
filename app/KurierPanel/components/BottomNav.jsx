"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBox, FaClock, FaUser, FaHome, FaUndo } from "react-icons/fa";
import { motion } from "framer-motion";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Asosiy", href: "/KurierPanel", icon: <FaHome /> },
    { name: "Buyurtmalar", href: "/KurierPanel/buyurtmalar", icon: <FaBox /> },
    // Center button placeholder
    { name: "Qaytarish", href: "/KurierPanel/kitobniQaytarish", icon: <FaUndo />, isSpecial: true },
    { name: "Faol", href: "/KurierPanel/faolTopshiriqlar", icon: <FaClock /> },
    { name: "Profil", href: "/KurierPanel/profile", icon: <FaUser /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 lg:hidden z-50 rounded-t-2xl shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)]">
      <div className="flex justify-between items-end max-w-sm mx-auto relative">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;
          
          if (item.isSpecial) {
             return (
                 <div key={item.href} className="relative -top-5">
                    <Link href={item.href} prefetch={true}>
                        <motion.div 
                          animate={{ 
                              boxShadow: ["0px 0px 0px rgba(59, 130, 246, 0.5)", "0px 0px 20px rgba(59, 130, 246, 0.5)", "0px 0px 0px rgba(59, 130, 246, 0.5)"],
                              scale: [1, 1.05, 1]
                          }}
                          transition={{ 
                              repeat: Infinity, 
                              duration: 2,
                              ease: "easeInOut"
                          }}
                          className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white border-4 border-white shadow-lg"
                        >
                            <FaUndo className="text-xl" />
                        </motion.div>
                    </Link>
                    <span className="text-[10px] font-medium text-blue-600 absolute -bottom-5 w-full text-center left-0 whitespace-nowrap">
                        Qaytarish
                    </span>
                 </div>
             )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={`flex flex-col items-center gap-1 transition-all duration-300 pb-2 ${
                isActive ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <div
                className={`text-2xl transition-transform ${
                  isActive ? "-translate-y-1" : ""
                }`}
              >
                {item.icon}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? "opacity-100" : "opacity-0 h-0"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
