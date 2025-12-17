"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
function CollectionSkeleton() {
  return (
    <div className="min-w-[260px] rounded-2xl p-4 bg-gray-100 animate-pulse flex-shrink-0">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-gray-300" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-3/4 bg-gray-300 rounded" />
          <div className="h-2 w-1/2 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Description */}
      <div className="h-2 w-full bg-gray-200 rounded mb-2" />
      <div className="h-2 w-4/5 bg-gray-200 rounded mb-4" />

      {/* Button */}
      <div className="h-8 w-full bg-gray-300 rounded-xl" />
    </div>
  );
}

export default function BookCollections() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // backend kelguncha fake delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  const collections = [
    {
      title: "Talabalar uchun",
      count: "24 ta kitob",
      desc: "Universitet talabalari uchun eng zarur kitoblar",
      color: "from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40",
      btn: "bg-blue-500",
      icon: "🎓",
    },
    {
      title: "Fan kitoblari",
      count: "18 ta kitob",
      desc: "Fizika, kimyo, biologiya bo'yicha eng yaxshi kitoblar",
      color: "from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-800/40",
      btn: "bg-purple-500",
      icon: "🔬",
    },
    {
      title: "Adabiyot klasikalari",
      count: "32 ta kitob",
      desc: "Jahon va o'zbek adabiyotining eng yaxshi asarlari",
      color: "from-pink-50 to-pink-100 dark:from-pink-900/40 dark:to-pink-800/40",
      btn: "bg-pink-500",
      icon: "📖",
    },
    {
      title: "O‘z-o‘zini rivojlantirish",
      count: "15 ta kitob",
      desc: "Shaxsiy rivojlanish va motivatsiya kitoblari",
      color: "from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-800/40",
      btn: "bg-green-500",
      icon: "🧠",
    },
  ];

  return (
    <section className="mb-6 overflow-hidden">
      {/* Header */}
      <div className="px-5 mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
          Kitoblar to‘plamlari
        </h2>
        <span className="text-xs text-gray-400">
          {loading ? "Yuklanmoqda..." : "Barchasi"}
        </span>
      </div>

      {/* CONTENT */}
      {loading ? (
        /* Skeleton scroll */
        <div className="flex gap-4 px-5 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <CollectionSkeleton key={i} />
          ))}
        </div>
      ) : (
        /* Infinite scroll */
        <motion.div
          className="flex gap-4 px-5 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 25,
          }}
        >
          {[...collections, ...collections].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className={`min-w-[260px] rounded-2xl p-4 shadow-sm flex-shrink-0
              bg-gradient-to-br ${item.color}`}
            >
                <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-xl shadow-sm">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white text-sm">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-slate-300">{item.count}</p>
                </div>
              </div>

              <p className="text-xs text-gray-600 dark:text-slate-300 mb-3">{item.desc}</p>

              <button
                className={`w-full ${item.btn} text-white py-2 rounded-xl 
                text-xs font-semibold hover:opacity-90 transition`}
              >
                Ko‘rish
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
