"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaBox,
  FaClock,
  FaCheckCircle,
  FaUndo,
  FaUser,
  FaBookOpen,
  FaWallet,
  FaBell,
  FaCog,
  FaCheckDouble
} from "react-icons/fa";

import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Sidebar({ mobileMenuOpen, setMobileMenuOpen }) {
  const pathname = usePathname();
  
  const { data: profileRes } = useSWR('/api/user/profile', fetcher);
  const { data: configRes } = useSWR('/api/config', fetcher);

  const userData = profileRes?.data?.user;
  const config = configRes?.data;

  const menu = [
    { name: "Bosh sahifa", href: "/KurierPanel", icon: <FaBox /> },
    { name: "Buyurtmalar", href: "/KurierPanel/buyurtmalar", icon: <FaBox /> },
    {
      name: "Yetkazmalarim",
      href: "/KurierPanel/faolTopshiriqlar",
      icon: <FaClock />,
    },
    {
      name: "Tarix",
      href: "/KurierPanel/yakunlanganlar",
      icon: <FaCheckDouble />,
    },
    {
      name: "Kitobni qaytarish",
      href: "/KurierPanel/kitobniQaytarish",
      icon: <FaUndo />,
    },
    { name: "Hamyon", href: "/KurierPanel/hamyon", icon: <FaWallet /> },
    { name: "Bildirishnomalar", href: "/KurierPanel/bildirishnomalar", icon: <FaBell /> },
    { name: "Profil", href: "/KurierPanel/profile", icon: <FaUser /> },
    { name: "Sozlamalar", href: "/KurierPanel/sozlamalar", icon: <FaCog /> },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 p-6 z-50 transition-colors duration-300">
        
        {/* Brand */}
        <div className="mb-10 flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-2xl bg-[#1F2937] dark:bg-white flex items-center justify-center text-white dark:text-slate-900 text-lg shadow-lg shadow-slate-200 dark:shadow-none transition-transform hover:rotate-6">
                <FaBookOpen />
            </div>
            <div>
                <h1 className="text-xl font-black text-[#1F2937] dark:text-white tracking-tight leading-none">Kitobdosh<span className="text-[#96C7B9]">.</span></h1>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1 block">Kurier Hub</span>
            </div>
        </div>

        {/* Profile Card Summary */}
        <Link href="/KurierPanel/profile">
          <div className="flex items-center gap-3 p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 mb-8 hover:border-[#96C7B9] transition-all cursor-pointer group shadow-sm">
            <div className="relative w-10 h-10 shrink-0">
              {userData?.avatar ? (
                <Image
                  src={userData.avatar}
                  alt="Profil"
                  fill
                  className="rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-sm group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full rounded-2xl bg-[#96C7B9]/20 flex items-center justify-center text-[#96C7B9] font-black uppercase text-xs border-2 border-white dark:border-slate-700">
                  {userData?.fullName?.[0] || 'K'}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm"></div>
            </div>

            <div className="overflow-hidden">
              <p className="font-bold text-sm text-[#1F2937] dark:text-white truncate group-hover:text-[#96C7B9] transition-colors uppercase tracking-tight">
                {userData?.fullName?.split(' ')[0] || "Kuryer"}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest truncate">
                {userData?.email || "Yuklanmoqda..."}
              </p>
            </div>
          </div>
        </Link>

        {/* Menu */}
        <nav className="space-y-2 overflow-y-auto custom-scrollbar no-scrollbar pr-1">
          {menu.map((item, i) => {
            const active = pathname === item.href;
            return (
              <Link
                key={i}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold relative group
                  ${
                    active
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl shadow-slate-200 dark:shadow-none"
                      : "text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
              >
                <span className={`text-lg z-10 transition-colors ${active ? "text-[#96C7B9]" : "text-slate-300 dark:text-slate-600 group-hover:text-[#96C7B9]"}`}>{item.icon}</span>
                <span className="z-10 text-xs uppercase tracking-widest leading-none">{item.name}</span>
                
                {/* Active Indicator Bar */}
                {active && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute inset-0 bg-slate-900 dark:bg-white rounded-2xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6">
          <div className="p-5 rounded-[2rem] bg-gradient-to-br from-[#1F2937] to-slate-800 text-center relative overflow-hidden group shadow-lg">
              <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#96C7B9] mb-1">Texnik yordam</p>
                  <p className="text-xs text-white/70 mb-4 font-medium leading-relaxed">Admin bilan savol-javob markazi</p>
                  <a 
                    href={config?.contactInfo?.adminTelegram 
                      ? (config.contactInfo.adminTelegram.startsWith('h') 
                          ? config.contactInfo.adminTelegram 
                          : `https://t.me/${config.contactInfo.adminTelegram.replace('@', '')}`)
                      : "https://t.me/kitobdosh_admin"
                    } 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full py-2.5 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#96C7B9] hover:text-white transition-all active:scale-95 shadow-sm"
                  >
                    Chatni boshlash
                  </a>
              </div>
              {/* Decor */}
              <div className="absolute h-20 w-20 bg-white/5 rounded-full -top-10 -right-10 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          </div>
        </div>

      </aside>
    </>
  );
}
