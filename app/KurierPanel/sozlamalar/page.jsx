"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  FaCog, 
  FaMoon, 
  FaSun, 
  FaGlobe, 
  FaBell, 
  FaLock, 
  FaFingerprint,
  FaChevronRight,
  FaFileAlt
} from "react-icons/fa";
import { useMain } from "../../mainPage/MainContext";

export default function SettingsPage() {
  const { darkMode, setDarkMode } = useMain();

  const settingsGroups = [
    {
      title: "Interfeys",
      items: [
        { 
          label: "Tungi rejim", 
          icon: darkMode ? <FaMoon className="text-blue-400" /> : <FaSun className="text-yellow-400" />,
          desc: "Ko'zlarni charchashidan himoya qilish",
          action: (
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${darkMode ? 'bg-[#96C7B9]' : 'bg-slate-200'}`}
            >
              <motion.div 
                animate={{ x: darkMode ? 24 : 0 }}
                className="w-6 h-6 bg-white rounded-full shadow-sm"
              />
            </button>
          )
        },
        { 
          label: "Tilni tanlash", 
          icon: <FaGlobe className="text-purple-400" />,
          desc: "O'zbekcha (Default)",
          action: <FaChevronRight className="text-slate-300" />
        }
      ]
    },
    {
      title: "Xavfsizlik",
      items: [
        { 
          label: "Parolni o'zgartirish", 
          icon: <FaLock className="text-red-400" />,
          desc: "Oxirgi marta 3 oy oldin o'zgartirilgan",
          action: <FaChevronRight className="text-slate-300" />
        },
        { 
          label: "Biometrik kirish", 
          icon: <FaFingerprint className="text-green-400" />,
          desc: "Face ID yoki Barmoq izi",
          action: (
            <div className="w-14 h-8 bg-slate-100 dark:bg-slate-700 rounded-full p-1 opacity-50 cursor-not-allowed">
              <div className="w-6 h-6 bg-white rounded-full shadow-sm" />
            </div>
          )
        }
      ]
    },
    {
      title: "Ma'lumotlar",
      items: [
        { 
          label: "Xizmat ko'rsatish shartlari", 
          icon: <FaFileAlt className="text-slate-400" />,
          desc: "Loyiha reglamenti bilan tanishish",
          action: <FaChevronRight className="text-slate-300" />
        }
      ]
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-12">
      
      {/* HEADER */}
      <div className="px-1">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Sozlamalar</h1>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Sizning shaxsiy tanlovlaringiz</p>
      </div>

      {/* SETTINGS GROUPS */}
      <div className="space-y-10">
        {settingsGroups.map((group, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{group.title}</h3>
            <div className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
              {group.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-6 border-b border-slate-50 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-slate-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-xl transition-transform group-hover:scale-110">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm leading-none mb-1.5">{item.label}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">{item.desc}</p>
                    </div>
                  </div>
                  <div>
                    {item.action}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center space-y-2 opacity-30 pt-10">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Kitobdosh Delivery Settings</p>
          <p className="text-[8px] font-bold text-slate-300">Version 2.0.0 • All rights reserved</p>
      </div>

    </div>
  );
}
