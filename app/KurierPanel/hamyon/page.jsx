"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaWallet, 
  FaArrowUp, 
  FaArrowDown, 
  FaHistory, 
  FaChartBar,
  FaChevronRight,
  FaCheckDouble,
  FaMoneyBillWave
} from "react-icons/fa";

import useSWR from 'swr';
import { DashboardSkeleton } from "../components/Skeleton";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function WalletPage() {
  const DELIVERY_FEE = 15000;

  const { data: courierRes, isLoading } = useSWR('/api/courier', fetcher);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <DashboardSkeleton />
      </div>
    );
  }

  const allOrders = courierRes?.data || [];
  const completed = allOrders.filter(o => o.status === 'delivered');
  
  const now = new Date();
  const startOfToday = new Date(now.setHours(0,0,0,0));
  const startOfSevenDaysAgo = new Date();
  startOfSevenDaysAgo.setDate(now.getDate() - 7);

  const today = completed.filter(o => new Date(o.updatedAt) >= startOfToday);
  const weekly = completed.filter(o => new Date(o.updatedAt) >= startOfSevenDaysAgo);

  const stats = {
    totalBalance: completed.length * DELIVERY_FEE,
    todayEarnings: today.length * DELIVERY_FEE,
    weeklyEarnings: weekly.length * DELIVERY_FEE,
    deliveredCount: completed.length
  };

  const history = completed.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 10);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* HEADER */}
      <div className="px-1">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Mening Hamyonim</h1>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Balans va daromadlar nazorati</p>
      </div>

      {/* BALANCE CARD */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 dark:bg-white p-10 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden group text-center md:text-left"
      >
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#96C7B9] mb-4">Umumiy Balans</p>
                <h2 className="text-5xl md:text-6xl font-black text-white dark:text-slate-900 tracking-tighter leading-none mb-4">
                  {stats.totalBalance.toLocaleString()} <span className="text-2xl text-[#96C7B9]">UZS</span>
                </h2>
                <div className="flex items-center justify-center md:justify-start gap-4">
                    <span className="flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-slate-900/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#96C7B9] border border-white/5">
                        <FaArrowUp /> +12% bugun
                    </span>
                    <span className="text-white/40 dark:text-slate-400 text-xs font-bold">{stats.deliveredCount} yetkazma</span>
                </div>
            </div>
            
            <button className="px-10 py-5 bg-[#96C7B9] text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-[#96C7B9]/30 hover:scale-105 active:scale-95 transition-all">
                Yechib olish
            </button>
        </div>

        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#96C7B9]/20 to-transparent rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
      </motion.div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between group">
              <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Bugungi daromad</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{stats.todayEarnings.toLocaleString()} UZS</p>
              </div>
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-2xl flex items-center justify-center text-xl group-hover:rotate-12 transition-transform">
                  <FaChartBar />
              </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between group">
              <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Haftalik daromad</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{stats.weeklyEarnings.toLocaleString()} UZS</p>
              </div>
              <div className="w-14 h-14 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-2xl flex items-center justify-center text-xl group-hover:rotate-12 transition-transform">
                  <FaMoneyBillWave />
              </div>
          </div>
      </div>

      {/* RECENT TRANSACTIONS */}
      <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
              <h3 className="font-black text-slate-900 dark:text-white text-xl uppercase tracking-tighter">Oxirgi daromadlar</h3>
              <FaHistory className="text-slate-300" />
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
              {history.length > 0 ? (
                history.map((item, idx) => (
                    <div key={item.id} className="flex items-center justify-between p-6 border-b border-slate-50 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-all group">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-[#96C7B9]/10 group-hover:text-[#96C7B9] transition-all">
                                <FaCheckDouble />
                            </div>
                            <div>
                                <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm truncate max-w-[150px] sm:max-w-xs">{item.book}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(item.updatedAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-black text-green-500 text-sm">+{DELIVERY_FEE.toLocaleString()} UZS</p>
                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Tasdiqlangan</p>
                        </div>
                    </div>
                ))
              ) : (
                <div className="p-20 text-center flex flex-col items-center">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Hozircha daromadlar yo'q</p>
                </div>
              )}
          </div>
      </div>

    </div>
  );
}
