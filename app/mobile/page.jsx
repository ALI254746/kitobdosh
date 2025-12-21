"use client";

import Link from "next/link";
import {
  FaBookOpenReader,
  FaCartShopping,
  FaTruckFast,
  FaChevronRight,
} from "react-icons/fa6";
import { Star, Heart } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import SerachBar from "./components/search/page";
import LikeBook from "./components/likeBook/page";
import BeastBook from "./components/BestBook/page";
import BookCollections from "./components/bookCollection/page";
import PopularAuthorCard from "./components/PopularAuthors/page";
import HomeSkeleton from "./components/HomeSkeleton";
export default function DiscountCard() {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const res = await fetch("/api/mobile/home", { cache: 'no-store' });
        const data = await res.json();
        if (data.success) {
          setHomeData(data.data);
          console.log("HOME DEBUG - PROMOS:", data.data?.promos); // 👉 Buni tekshirish kerak
        }
      } catch (error) {
        console.error("Home Data Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHomeData();
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    if (!homeData?.promos || homeData.promos.length <= 1) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const nextIndex = (currentIndex + 1) % homeData.promos.length;
        const scrollAmount = scrollRef.current.offsetWidth * nextIndex;
        
        scrollRef.current.scrollTo({
          left: scrollAmount,
          behavior: "smooth"
        });
        setCurrentIndex(nextIndex);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [homeData?.promos, currentIndex]);

  if (loading) {
    return <HomeSkeleton />;
  }

  return (
    <div className="p-4 px-3">
      <SerachBar />
      {homeData?.promos?.length > 0 && (
        <div className="relative w-screen -ml-4 overflow-hidden">
          <div 
            ref={scrollRef}
            onScroll={(e) => {
              const scrollLeft = e.currentTarget.scrollLeft;
              const width = e.currentTarget.offsetWidth;
              const index = Math.round(scrollLeft / width);
              if (index !== currentIndex) setCurrentIndex(index);
            }}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
          >
            {homeData.promos.map((promo, idx) => (
              <div key={promo._id || idx} className="min-w-full flex justify-center snap-center px-2">
                <section 
                  className="relative w-full overflow-hidden rounded-3xl shadow-soft text-white p-6 min-h-[170px] flex flex-col justify-center"
                >
                  {/* Background Layer */}
                  <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-600 to-indigo-700">
                    {promo.image ? (
                      <>
                        <img 
                          src={promo.image} 
                          alt=""
                          className="w-full h-full object-cover opacity-90"
                          style={{ display: 'block' }}
                          loading="eager"
                        />
                        {/* Darker Overlay for readability */}
                        <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      </>
                    ) : (
                      <div className="w-full h-full relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                        <div className="absolute inset-0 bg-black/10"></div>
                      </div>
                    )}
                  </div>

                  <div className="relative z-10">
                    <span className="inline-block text-lg px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg font-semibold mb-2">
                      {promo.badge || "🔥 Bugungi chegirma"}
                    </span>

                    <p className="text-white text-sm font-bold mb-4 line-clamp-2 min-h-[40px] drop-shadow-2xl">
                      {promo.text}
                    </p>

                    <Link
                      href={promo.link || "/mobile/components/search?type=sale"}
                      className="px-6 py-2 bg-white text-blue-500 rounded-2xl text-sm font-black shadow-xl hover:scale-105 active:scale-95 transition-all inline-block uppercase tracking-wider"
                    >
                      Ko&apos;rish
                    </Link>
                  </div>
                </section>
              </div>
            ))}
          </div>
          
          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-2">
            {homeData.promos.map((_, idx) => (
              <div 
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? "w-6 bg-blue-500" : "w-1.5 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      )}

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
      <LikeBook data={homeData?.recommended} />
      <BeastBook data={homeData?.best} />
      <BookCollections data={homeData?.collections} />
      <PopularAuthorCard data={homeData?.authors} />
    </div>
  );
}
