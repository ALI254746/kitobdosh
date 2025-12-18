"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FaBook, 
  FaBell, 
  FaUser, 
  FaCog, 
  FaShoppingCart, 
  FaSun, 
  FaMoon 
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useMain } from "./MainContext";

export default function Navbar() {
  const pathname = usePathname();
  const { darkMode, setDarkMode } = useMain();

  const links = [
    { id: "mainPage", name: "Bosh sahifa", path: "/mainPage" },
    { id: "sotib-olish", name: "Sotib olish", path: "/mainPage/sotibolish" },
    { id: "ijarabook", name: "Ijara", path: "/mainPage/ijarabook" },
    { id: "biz-haqimizda", name: "Biz haqimizda", path: "/mainPage/AboutUs" },
    { id: "boglanish", name: "Bog‘lanish", path: "/mainPage/contactUs" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      <div className={`backdrop-blur-xl border-b transition-colors duration-300 
        ${darkMode 
            ? "bg-[#0f172a]/80 border-slate-700/50 shadow-lg shadow-black/10" 
            : "bg-white/80 border-gray-200/50 shadow-sm"
        }
      `}>
        <nav className="max-full mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo Section */}
          <Link href="/mainPage" className="flex items-center space-x-3 group min-w-max">
            <div className={`p-2 rounded-xl transition-colors duration-300 
                ${darkMode ? "bg-blue-600/20 text-blue-400" : "bg-[#D1F0E0] text-[#96C7B9]"}
            `}>
                <FaBook className="text-2xl group-hover:scale-110 transition-transform" />
            </div>
            <span className={`text-2xl font-black tracking-tight transition-colors duration-300
                ${darkMode ? "text-white" : "text-slate-800"}
            `}>
              Kitob<span className="text-[#96C7B9]">Dosh</span>
            </span>
          </Link>

          {/* Desktop/Tablet Navigation Links */}
          <div className="hidden md:flex items-center justify-center flex-1 px-8 gap-1">
            {links.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link key={link.id} href={link.path}>
                  <div className={`relative px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 group
                    ${isActive 
                        ? (darkMode ? "text-white" : "text-[#5a8a7d]")  
                        : (darkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900")
                    }
                  `}>
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className={`absolute inset-0 rounded-xl -z-10
                            ${darkMode ? "bg-slate-700/50" : "bg-[#D1F0E0]"}
                        `}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    {link.name}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Right Actions Section */}
          <div className="flex items-center gap-3 min-w-max">
             {/* Theme Toggle */}
             <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2.5 rounded-full transition-all duration-300 active:scale-95
                    ${darkMode 
                        ? "bg-slate-700 hover:bg-slate-600 text-yellow-400" 
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                    }
                `}
                aria-label="Toggle Dark Mode"
             >
                {darkMode ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
             </button>

             {/* Notifications */}
             <button className={`p-2.5 rounded-full transition-all duration-300 relative
                ${darkMode 
                    ? "hover:bg-slate-700 text-slate-300 hover:text-white" 
                    : "hover:bg-slate-100 text-slate-500 hover:text-slate-800"
                }
             `}>
                <FaBell className="text-lg" />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-[#0f172a]"></span>
             </button>

             {/* Cart */}
             <Link href="/mainPage/savatcha">
                <button className={`p-2.5 rounded-full transition-all duration-300
                    ${pathname === "/mainPage/savatcha"
                        ? (darkMode ? "bg-blue-600 text-white" : "bg-[#D1F0E0] text-[#96C7B9]")
                        : (darkMode ? "hover:bg-slate-700 text-slate-300 hover:text-white" : "hover:bg-slate-100 text-slate-500 hover:text-slate-800")
                    }
                `}>
                    <FaShoppingCart className="text-lg" />
                </button>
             </Link>

             {/* Profile / Settings */}
             <div className={`h-8 w-[1px] mx-2 ${darkMode ? "bg-slate-700" : "bg-slate-200"}`}></div>

             <div className="flex items-center gap-2">
                 <Link href="/mainPage/profile">
                    <button className={`flex items-center gap-3 pl-1 pr-3 py-1 rounded-full transition-all duration-300
                        ${pathname === "/mainPage/profile"
                            ? (darkMode ? "bg-slate-700 border-slate-600" : "bg-white border-gray-200 shadow-sm")
                            : (darkMode ? "hover:bg-slate-800" : "hover:bg-slate-50")
                        }
                    `}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                            ${darkMode ? "bg-blue-900 text-blue-200" : "bg-[#D1F0E0] text-[#96C7B9]"}
                        `}>
                            <FaUser />
                        </div>
                        <span className={`text-sm font-bold hidden xl:block ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
                            Profil
                        </span>
                    </button>
                 </Link>
                 
                 <Link href="/mainPage/sozlamalar">
                     <button className={`p-2.5 rounded-full transition-all duration-300
                         ${pathname === "/mainPage/sozlamalar"
                             ? (darkMode ? "text-blue-400" : "text-[#96C7B9]")
                            : (darkMode ? "text-slate-400 hover:text-white" : "text-slate-400 hover:text-slate-600")
                         }
                     `}>
                         <FaCog className="text-lg" />
                     </button>
                 </Link>
             </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
