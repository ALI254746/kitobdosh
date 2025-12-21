"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function CollectionSkeleton() {
  return (
    <div className="min-w-[260px] rounded-2xl p-4 bg-gray-100 dark:bg-slate-800 animate-pulse flex-shrink-0">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-slate-700" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-3/4 bg-gray-200 dark:bg-slate-700 rounded" />
          <div className="h-2 w-1/2 bg-gray-200 dark:bg-slate-700 rounded" />
        </div>
      </div>
      <div className="h-2 w-full bg-gray-200 dark:bg-slate-700 rounded mb-2" />
      <div className="h-2 w-4/5 bg-gray-200 dark:bg-slate-700 rounded mb-4" />
      <div className="h-8 w-full bg-gray-200 dark:bg-slate-700 rounded-xl" />
    </div>
  );
}

export default function BookCollections({ data }) {
  const [collections, setCollections] = useState(data || []);
  const [loading, setLoading] = useState(!data);

  useEffect(() => {
    if (data) return; 
    async function fetchCollections() {
        try {
            const res = await fetch('/api/books/collections');
            const data = await res.json();
            if (data.success) {
                setCollections(data.collections);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    fetchCollections();
  }, []);

  return (
    <section className="mb-6 overflow-hidden">
      <div className="px-5 mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
          Kitoblar to‘plamlari
        </h2>
        <span className="text-xs text-gray-400">
          {loading ? "Yuklanmoqda..." : "Barchasi"}
        </span>
      </div>

      {loading ? (
        <div className="flex gap-4 px-5 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <CollectionSkeleton key={i} />
          ))}
        </div>
      ) : (
        <motion.div
          className="flex gap-4 px-5 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 25,
          }}
        >
          {Array.isArray(collections) && [...collections, ...collections].map((item, i) => (
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

              <p className="text-xs text-gray-600 dark:text-slate-300 mb-3 line-clamp-2">{item.desc}</p>

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
