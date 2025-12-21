"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaCheckDouble, 
  FaCalendarAlt, 
  FaBook, 
  FaMapMarkerAlt, 
  FaChevronRight,
  FaSearch,
  FaFilter
} from "react-icons/fa";
import Image from "next/image";

import useSWR from 'swr';
import { OrderListSkeleton } from "../components/Skeleton";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: courierRes, isLoading } = useSWR('/api/courier', fetcher);

  const orders = (courierRes?.data || [])
    .filter(o => o.status === 'delivered')
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const filteredOrders = orders.filter(o => 
    o.book?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div className="h-24 w-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse mb-10" />
        <OrderListSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Buyurtmalar Tarixi</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Barcha yakunlangan topshiriqlar</p>
        </div>
        
        <div className="relative group">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#96C7B9] transition-colors" />
          <input 
            type="text" 
            placeholder="Qidiruv..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-72 pl-14 pr-6 py-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl outline-none focus:border-[#96C7B9] transition-all font-bold text-xs uppercase tracking-widest text-slate-900 dark:text-white shadow-sm"
          />
        </div>
      </div>

      {/* ORDERS LIST */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={order.id}
              className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 hover:border-[#96C7B9] transition-all group"
            >
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Book Image */}
                <div className="w-20 h-24 bg-slate-50 dark:bg-slate-700 rounded-2xl flex-shrink-0 relative overflow-hidden shadow-md">
                  {order.image ? (
                    <Image src={order.image} alt={order.book} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#96C7B9]"><FaBook size={24} /></div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-500 text-[9px] font-black uppercase tracking-widest rounded-full border border-green-100 dark:border-green-900/30">
                      Muvaffaqiyatli
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1">
                      <FaCalendarAlt /> {new Date(order.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white truncate uppercase tracking-tight">{order.book}</h3>
                  <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1 flex items-center justify-center sm:justify-start gap-1">
                    <FaMapMarkerAlt className="text-red-400" /> {order.address || "Manzil ko'rsatilmagan"}
                  </p>
                </div>

                {/* Customer Info */}
                <div className="hidden md:block text-right px-6 border-l border-slate-50 dark:border-slate-700">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Buyurtmachi</p>
                  <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm">{order.customer || "Mijoz"}</p>
                </div>

                {/* Arrow */}
                <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-300 dark:text-slate-600 group-hover:bg-slate-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-slate-900 transition-all">
                  <FaChevronRight size={14} />
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-800/50 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-700">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center text-slate-200 dark:text-slate-700 mx-auto mb-6">
              <FaCheckDouble size={32} />
            </div>
            <h3 className="font-black text-slate-900 dark:text-white text-xl mb-2">Tarix hozircha bo'sh</h3>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">Siz hali birorta ham topshiriqni yakunlamagansiz.</p>
          </div>
        )}
      </div>

    </div>
  );
}
