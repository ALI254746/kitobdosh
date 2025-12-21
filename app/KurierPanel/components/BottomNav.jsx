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
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 px-6 py-3 lg:hidden z-50 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] transition-colors duration-300">
      <div className="flex justify-between items-center max-w-sm mx-auto relative px-2">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;
          
          if (item.isSpecial) {
             return (
                 <div key={item.href} className="relative -top-8">
                    <Link href={item.href} prefetch={true}>
                        <motion.div 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          animate={{ 
                               boxShadow: ["0px 10px 20px rgba(150, 199, 185, 0.3)", "0px 15px 30px rgba(150, 199, 185, 0.5)", "0px 10px 20px rgba(150, 199, 185, 0.3)"],
                          }}
                          transition={{ 
                               repeat: Infinity, 
                               duration: 3,
                               ease: "easeInOut"
                          }}
                          className="w-16 h-16 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-slate-900 border-4 border-white dark:border-slate-900 shadow-2xl transition-transform"
                        >
                            <FaUndo className="text-xl" />
                        </motion.div>
                    </Link>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 absolute -bottom-6 w-full text-center left-0 whitespace-nowrap">
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
              className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative py-1 ${
                isActive ? "text-[#96C7B9]" : "text-slate-300 dark:text-slate-600 hover:text-slate-400"
              }`}
            >
              <motion.div
                whileTap={{ scale: 0.8 }}
                className="text-xl relative"
              >
                {item.icon}
                {isActive && (
                    <motion.div 
                        layoutId="bottomNavDot"
                        className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#96C7B9] rounded-full"
                    />
                )}
              </motion.div>
              <span className={`text-[9px] font-black uppercase tracking-tighter transition-all ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-50 h-0"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
