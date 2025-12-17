"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FaBookOpenReader,
  FaCartShopping,
  FaTruckFast,
  FaChevronRight,
} from "react-icons/fa6";
import { Star, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import SerachBar from "./components/search/page";
import LikeBook from "./components/likeBook/page";
import BeastBook from "./components/BestBook/page";
import BookCollections from "./components/bookCollection/page";
import PopularAuthorCard from "./components/PopularAuthors/page";
export default function DiscountCard() {
  return (
    <div className="p-4">
      <SerachBar />
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-500 to-[#6DD5FA] shadow-soft text-white p-6">
        {/* Dekorativ blur doiralar */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>

        <div className="relative z-10 flex justify-between items-center">
          {/* Matn qismi */}
          <div className="w-full">
            <span className="inline-block text-xl px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg  font-semibold mb-2">
              🔥 Bugungi chegirma
            </span>

            <p className="text-white/80 text-sm mb-4">
              Barcha bestsellerlarga 20% chegirma
            </p>

            {/* Sahifaga o'tish (Link) */}
            <Link
              href="/books" // 👉 redirect qilinadigan sahifa
              className="px-5 py-2 bg-white text-blue-400 rounded-2xl text-sm font-bold shadow-lg hover:bg-gray-50 transition-colors inline-block"
            >
              Ko'rish
            </Link>
          </div>

          {/* Rasm qismi */}
        </div>
      </section>

      <section className="grid pt-4 grid-cols-2 gap-4">
        {/* Rent */}

        {/* Track Order (Full Width) */}
        {/* Track Order (Full Width) */}
        <Link
          href="/mobile/components/actions"
          className="col-span-2 p-5 bg-purple-50 dark:bg-slate-800 rounded-3xl flex items-center justify-between hover:shadow-lg dark:hover:shadow-slate-700 transition-all group relative overflow-hidden border border-transparent dark:border-slate-700"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-sm group-hover:scale-110 transition-transform">
              <FaTruckFast className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-800 dark:text-white">Buyurtmani kuzatish</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                Yetkazib berish holati
              </p>
            </div>
          </div>
          <div className="w-8 h-8 bg-white/50 dark:bg-slate-700/50 rounded-full flex items-center justify-center">
            <FaChevronRight className="text-gray-400 dark:text-slate-500 text-sm" />
          </div>
        </Link>
      </section>
      <LikeBook />
      <BeastBook />
      <BookCollections />
      <PopularAuthorCard />
    </div>
  );
}
