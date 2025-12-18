"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaSearch, FaArrowRight, FaPlay, FaBookReader } from "react-icons/fa";

// --- ANIMATION CONFIG ---
const floatAnimation = {
  hidden: { y: 20 },
  visible: {
    y: [20, -20, 20],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const textReveal = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const HeroImage = () => {
    return (
        <div className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center">
            {/* Background Blobs */}
            <motion.div 
               animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
               transition={{ duration: 20, repeat: Infinity }}
               className="absolute top-10 right-10 w-64 h-64 bg-[#D1F0E0] rounded-full blur-[80px] opacity-60 mix-blend-multiply"
            />
            <motion.div 
               animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
               transition={{ duration: 15, repeat: Infinity, delay: 2 }}
               className="absolute -bottom-10 left-10 w-72 h-72 bg-[#96C7B9] rounded-full blur-[80px] opacity-40 mix-blend-multiply"
            />

            {/* 3D Book Representation (CSS Only) */}
            <motion.div 
                variants={floatAnimation}
                initial="hidden"
                animate="visible"
                className="relative z-10 w-64 h-80 md:w-80 md:h-96 perspective-1000"
            >
                {/* Back Cover */}
                <div className="absolute inset-0 bg-[#96C7B9] rounded-r-2xl shadow-2xl transform translate-x-4 translate-y-4" />
                
                {/* Pages */}
                <div className="absolute inset-y-2 right-2 left-6 bg-white rounded-r-xl shadow-inner border-r border-gray-200 transform translate-x-2 translate-y-2" />
                <div className="absolute inset-y-2 right-2 left-6 bg-white rounded-r-xl shadow-inner border-r border-gray-200 transform translate-x-1 translate-y-1" />
                
                {/* Front Cover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#96C7B9] to-[#8ebfaf] rounded-r-2xl shadow-xl flex flex-col items-center justify-center p-8 border-l-8 border-[#7f9c93]">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm mb-6">
                        <FaBookReader className="text-4xl text-white" />
                    </div>
                    <h3 className="text-3xl font-black text-white text-center tracking-widest uppercase">Kitob<br/>Dosh</h3>
                    <div className="mt-8 w-full h-1 bg-white/30 rounded-full" />
                    <div className="mt-2 w-2/3 h-1 bg-white/20 rounded-full" />
                </div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div 
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute top-20 left-0 md:left-20 bg-white p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#D1F0E0] hidden md:block"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#D1F0E0] flex items-center justify-center text-[#96C7B9]">
                        <span className="font-bold">5k</span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Foydalanuvchi</p>
                        <p className="text-sm font-bold text-gray-800">Faol Talabalar</p>
                    </div>
                </div>
            </motion.div>

             <motion.div 
                animate={{ y: [15, -15, 15] }}
                transition={{ duration: 5, repeat: Infinity, delay: 2 }}
                className="absolute bottom-32 -right-4 bg-white p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#D1F0E0] hidden md:block"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#96C7B9] flex items-center justify-center text-white">
                        <span className="font-bold">★</span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Reyting</p>
                        <p className="text-sm font-bold text-gray-800">4.9/5 Ball</p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

function Section1() {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <main ref={containerRef} className="relative w-full min-h-screen bg-white overflow-hidden flex flex-col justify-center">
      
      {/* Navbar Placeholder Height if needed, can adjust */}
      <div className="absolute top-0 left-0 w-full h-10" />

      <div className="container mx-auto px-6 py-10 md:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="space-y-8 text-center lg:text-left">
                <motion.div 
                    initial="hidden"
                    animate="visible"
                    transition={{ staggerChildren: 0.1 }}
                >
                    <motion.div variants={textReveal} className="inline-block mb-4 px-4 py-1.5 rounded-full bg-[#D1F0E0]/50 border border-[#D1F0E0] text-[#7f9c93] font-bold text-sm uppercase tracking-wider">
                        ✨ Yangi davr kutubxonasi
                    </motion.div>
                    
                    <motion.h1 
                        variants={textReveal}
                        className="text-5xl lg:text-7xl font-black text-[#1F2937] leading-[1.1] mb-6"
                    >
                        Bilim olishning <br/>
                        <span className="relative inline-block text-[#96C7B9]">
                            zamonaviy
                            <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#D1F0E0]" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5 L 100 8 Q 50 12 0 8 Z" fill="currentColor" />
                            </svg>
                        </span> usuli.
                    </motion.h1>

                    <motion.p 
                        variants={textReveal}
                        className="text-lg md:text-xl text-gray-500 max-w-lg mx-auto lg:mx-0 leading-relaxed"
                    >
                        Talabalar uchun maxsus platforma. Kitoblarni ijaraga oling, soting 
                        yoki bepul almashing. Barchasi bitta qulay ilovada.
                    </motion.p>
                </motion.div>

                <motion.div 
                    variants={textReveal}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                    <Link href="/books" className="group relative px-8 py-4 bg-[#96C7B9] text-white font-bold rounded-2xl overflow-hidden shadow-lg shadow-[#96C7B9]/40 transition-all hover:shadow-xl hover:-translate-y-1">
                        <div className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <span className="relative flex items-center gap-2">
                           Kitoblarni Ko&apos;rish <FaArrowRight />
                        </span>
                    </Link>
                    
                    <button className="px-8 py-4 bg-white text-[#1F2937] border-2 border-gray-100 font-bold rounded-2xl hover:border-[#96C7B9] hover:text-[#96C7B9] transition-all flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#D1F0E0] transition-colors">
                            <FaPlay className="text-xs ml-1" />
                        </div>
                        Video Qo&apos;llanma
                    </button>
                </motion.div>

                {/* Search Box Preview */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 p-3 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/50 max-w-md mx-auto lg:mx-0 flex items-center gap-3"
                >
                    <FaSearch className="text-gray-400 ml-3" />
                    <input 
                        type="text" 
                        placeholder="Kitob nomi yoki muallifni qidiring..." 
                        className="flex-1 outline-none text-gray-600 placeholder-gray-400 font-medium"
                    />
                    <button className="bg-[#1F2937] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#96C7B9] transition-colors">
                        Izlash
                    </button>
                </motion.div>

                 {/* Trust Badges */}
                <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: 1 }}
                   className="pt-8 flex items-center gap-6 justify-center lg:justify-start grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                >
                   {/* Placeholders for partner logos or trust stats */}
                   <span className="font-bold text-xl text-gray-300 flex items-center gap-2"><div className="w-6 h-6 bg-gray-200 rounded-full"/> University</span>
                   <span className="font-bold text-xl text-gray-300 flex items-center gap-2"><div className="w-6 h-6 bg-gray-200 rounded-full"/> KitobMarket</span>
                </motion.div>
            </div>

            {/* Right Content - Visual */}
            <div className="relative">
                <HeroImage />
            </div>
        </div>
      </div>
    </main>
  );
}

export default Section1;
