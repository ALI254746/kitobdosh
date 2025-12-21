"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaBell, 
  FaCheckCircle, 
  FaInfoCircle, 
  FaExclamationTriangle,
  FaChevronRight,
  FaTrashAlt,
  FaCircle
} from "react-icons/fa";

import useSWR, { mutate } from 'swr';
import Pusher from "pusher-js";

export const dynamic = 'force-dynamic';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function NotificationsPage() {
  const { data: profileRes } = useSWR('/api/user/profile', fetcher);
  const { data: notifRes, isLoading } = useSWR('/api/notifications', fetcher);

  const userData = profileRes?.data?.user;
  const notifications = notifRes?.data || [];

  useEffect(() => {
    if (!userData?._id) return;

    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (pusherKey) {
        const pusher = new Pusher(pusherKey, { cluster: pusherCluster });
        const channel = pusher.subscribe(`user-${userData._id}`);
        
        channel.bind("notification-new", (data) => {
             mutate('/api/notifications');
        });

        return () => pusher.unsubscribe(`user-${userData._id}`);
    }
  }, [userData?._id]);

  const markAsRead = async (id) => {
    try {
      await fetch(`/api/notifications?id=${id}`, { method: 'PUT' });
      mutate('/api/notifications');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await fetch(`/api/notifications?id=${id}`, { method: 'DELETE' });
      mutate('/api/notifications');
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-[#96C7B9]/20 border-t-[#96C7B9] rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      
      {/* HEADER */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Bildirishnomalar</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Muhim xabarlar va yangilanishlar</p>
        </div>
        <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-[#96C7B9] shadow-sm border border-slate-100 dark:border-slate-700">
          <FaBell />
        </div>
      </div>

      {/* NOTIFICATIONS LIST */}
      <div className="space-y-4">
        {notifications.length > 0 ? (
          <AnimatePresence>
            {notifications.map((notif, idx) => (
              <motion.div 
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                key={notif._id}
                className={`p-6 rounded-[2.5rem] shadow-sm border transition-all group flex items-start gap-5
                  ${notif.isRead 
                    ? "bg-white/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700/50" 
                    : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 shadow-md ring-1 ring-[#96C7B9]/20"}`}
                onClick={() => !notif.isRead && markAsRead(notif._id)}
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0
                  ${notif.type === 'success' ? 'bg-green-50 text-green-500' : 
                    notif.type === 'warning' ? 'bg-orange-50 text-orange-500' : 
                    'bg-blue-50 text-blue-500'}`}>
                  {notif.type === 'success' ? <FaCheckCircle /> : 
                   notif.type === 'warning' ? <FaExclamationTriangle /> : 
                   <FaInfoCircle />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {!notif.isRead && <FaCircle className="text-[#96C7B9] text-[6px] animate-pulse" />}
                    <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm leading-none">{notif.title}</h3>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-medium">{notif.message}</p>
                  <span className="text-[9px] text-slate-300 dark:text-slate-600 font-bold uppercase tracking-widest mt-3 block">
                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Actions */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notif._id);
                  }}
                  className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center text-slate-200 dark:text-slate-600 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100"
                >
                  <FaTrashAlt size={12} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-center py-24 bg-white dark:bg-slate-800/50 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-700">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center text-slate-200 dark:text-slate-700 mx-auto mb-6">
              <FaBell size={32} />
            </div>
            <h3 className="font-black text-slate-900 dark:text-white text-xl mb-2 tracking-tight uppercase">Xabarlar yo'q</h3>
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest">Sizda hozircha bildirishnomalar mavjud emas.</p>
          </div>
        )}
      </div>

    </div>
  );
}
