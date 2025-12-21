"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useInView,
  useMotionValue,
  useMotionTemplate
} from "framer-motion";
import {
  FaTelegram,
  FaInstagram,
  FaLinkedinIn,
  FaQuoteRight
} from "react-icons/fa";
import { useMain } from "../MainContext";

// --- COMPONENTS ---

// 1. MAGNETIC HERO TITLE
const HeroTitle = () => {
  const { darkMode } = useMain();
  return (
    <div className="relative z-10 text-center">
      <motion.div
         initial={{ scale: 0.8, opacity: 0 }}
         animate={{ scale: 1, opacity: 1 }}
         transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
         className="mb-4"
      >
         <span className={`inline-block px-6 py-2 rounded-full border font-bold tracking-[0.2em] text-sm uppercase backdrop-blur-sm ${darkMode ? "border-[#96C7B9] text-[#96C7B9] bg-white/5" : "border-[#96C7B9] text-[#96C7B9] bg-white/5"}`}>
            Bizning Tariximiz
         </span>
      </motion.div>
      
      <h1 className={`text-[12vw] leading-[0.85] font-black tracking-tighter mix-blend-multiply overflow-hidden ${darkMode ? "text-white mix-blend-normal" : "text-[#1F2937]"}`}>
        <motion.span 
          initial={{ y: "100%" }} 
          animate={{ y: 0 }} 
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="block"
        >
          KITOB
        </motion.span>
        <motion.span 
          initial={{ y: "100%" }} 
          animate={{ y: 0 }} 
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="block text-[#96C7B9]"
        >
          DOSH
        </motion.span>
      </h1>
    </div>
  );
};

// 2. SCROLL REVEAL TEXT (MANIFESTO)
const Manifesto = () => {
  const { darkMode } = useMain();
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.9", "start 0.25"]
  });

  const words = "Biz shunchaki kitob do'koni emasmiz. Biz — bilim ulashuvchi hamjamiyat, talabalar kelajagi uchun ko'prik va O'zbekistondagi eng yirik akademik ekotizimmiz.".split(" ");

  return (
    <p ref={container} className={`flex flex-wrap text-3xl md:text-5xl font-bold leading-tight max-w-5xl mx-auto px-6 ${darkMode ? "text-white/20" : "text-[#1F2937]/20"}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + (1 / words.length);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
        
        return (
          <span key={i} className="relative mr-3 mb-2 inline-block">
            <span className="absolute opacity-20">{word}</span>
            <motion.span style={{ opacity }} className={darkMode ? "text-white" : "text-[#1F2937]"}>
              {word}
            </motion.span>
          </span>
        )
      })}
    </p>
  );
};

// 3. STACKING CARDS (VALUES)
const Card = ({ i, title, desc, color }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start']
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -5]);

  return (
    <div ref={container} className="h-screen flex items-center justify-center sticky top-0">
       <motion.div 
         style={{ scale, rotate, top: `calc(-5vh + ${i * 25}px)` }} 
         className="relative flex flex-col items-center justify-center w-full max-w-3xl h-[500px] rounded-[3rem] bg-[#1F2937] text-white p-12 shadow-2xl origin-top"
       >
          <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${color} opacity-20 rounded-bl-full blur-3xl`} />
          <h2 className="text-5xl md:text-7xl font-black mb-8 text-center">{title}</h2>
          <p className="text-xl md:text-2xl text-gray-300 text-center max-w-xl leading-relaxed">{desc}</p>
       </motion.div>
    </div>
  );
};

// 4. FOUNDER SPOTLIGHT
const Founder = ({ name, role, img, align = "left" }) => {
  const { darkMode } = useMain();
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });

  return (
    <div ref={ref} className={`flex flex-col md:flex-row gap-12 items-center py-24 ${align === "right" ? "md:flex-row-reverse" : ""}`}>
       {/* Image */}
       <motion.div 
         initial={{ scale: 0.8, filter: "grayscale(100%)" }}
         animate={isInView ? { scale: 1, filter: "grayscale(0%)" } : {}}
         transition={{ duration: 0.8 }}
         className="w-full md:w-1/2 relative aspect-[3/4] rounded-[2rem] overflow-hidden group"
       >
          <Image src={img} alt={name} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
          <div className="absolute inset-0 bg-[#96C7B9] mix-blend-color opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
       </motion.div>

       {/* Text */}
       <motion.div 
         initial={{ opacity: 0, x: align === "left" ? 50 : -50 }}
         animate={isInView ? { opacity: 1, x: 0 } : {}}
         transition={{ duration: 0.8, delay: 0.2 }}
         className="w-full md:w-1/2 space-y-6"
       >
          <FaQuoteRight className="text-6xl text-[#D1F0E0]" />
          <h2 className={`text-6xl font-black leading-none ${darkMode ? "text-white" : "text-[#1F2937]"}`}>{name}</h2>
          <p className="text-[#96C7B9] text-xl font-bold tracking-widest uppercase">{role}</p>
          <p className={`text-lg leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
             Loyiha asoschisi sifatida, bizning maqsadimiz — har bir talabaga chegarasiz imkoniyatlar eshigini ochishdir.
          </p>
          <div className="flex gap-4 pt-4">
             <button className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors ${darkMode ? "border-gray-700 hover:bg-white hover:text-black text-white" : "border-gray-200 hover:bg-[#1F2937] hover:text-white"}`}><FaTelegram /></button>
             <button className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors ${darkMode ? "border-gray-700 hover:bg-white hover:text-black text-white" : "border-gray-200 hover:bg-[#1F2937] hover:text-white"}`}><FaInstagram /></button>
             <button className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors ${darkMode ? "border-gray-700 hover:bg-white hover:text-black text-white" : "border-gray-200 hover:bg-[#1F2937] hover:text-white"}`}><FaLinkedinIn /></button>
          </div>
       </motion.div>
    </div>
  );
};

// --- MAIN PAGE ---
export default function AboutUsPage() {
  const { darkMode } = useMain();
  const containerRef = useRef(null);

  const values = [
    { title: "INNOVATSIYA", desc: "Biz eski tizimlarni buzib, yangi, raqamli va qulay kelajakni quramiz.", color: "from-blue-400 to-purple-500" },
    { title: "HAMJAMIYAT", desc: "Har bir talaba, har bir o'qituvchi — bir oila. Biz birga kuchlimiz.", color: "from-green-400 to-emerald-500" },
    { title: "KELAJAK", desc: "Kitoblar orqali ertangi kun liderlarini tarbiyalaymiz.", color: "from-orange-400 to-red-500" }
  ];

  return (
    <div ref={containerRef} className={`min-h-screen font-sans overflow-x-hidden transition-colors duration-300 ${darkMode ? "bg-slate-900" : "bg-white"}`}>
      
      {/* 1. HERO */}
      <section className="h-screen flex items-center justify-center relative overflow-hidden">
         {/* Background Blobs */}
         <motion.div 
           animate={{ rotate: 360, scale: [1, 1.2, 1] }}
           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
           className="absolute -top-[20%] -right-[20%] w-[80vw] h-[80vw] bg-[#D1F0E0] rounded-full blur-[100px] opacity-40 mix-blend-multiply pointer-events-none"
         />
         <motion.div 
           animate={{ rotate: -360, scale: [1, 1.5, 1] }}
           transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
           className="absolute -bottom-[20%] -left-[20%] w-[70vw] h-[70vw] bg-[#96C7B9] rounded-full blur-[100px] opacity-40 mix-blend-multiply pointer-events-none"
         />
         
         <HeroTitle />
      </section>

      {/* 2. MANIFESTO */}
      <section className={`py-32 relative z-10 ${darkMode ? "bg-slate-900" : "bg-white"}`}>
         <Manifesto />
      </section>

      {/* 3. STACKING CARDS */}
      <section className={`mb-20 ${darkMode ? "bg-slate-900" : "bg-gray-50"}`}>
         {values.map((v, i) => (
            <Card key={i} i={i} {...v} />
         ))}
      </section>

      {/* 4. FOUNDERS */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
         <div className="mb-20 text-center">
            <h2 className={`text-4xl font-bold ${darkMode ? "text-white" : "text-[#1F2937]"}`}>Jamoa Bilan Tanishing</h2>
         </div>
         
         <Founder 
           name="Feruza" 
           role="Founder & Visionary" 
           img="https://storage.googleapis.com/uxpilot-auth.appspot.com/88316ff290-aaea57af544ba8742ef3.png"
           align="left"
         />
         <Founder 
           name="Hojiakbar" 
           role="Lead Software Engineer" 
           img="https://storage.googleapis.com/uxpilot-auth.appspot.com/de146046ef-b51f77662f9a361f95f7.png"
           align="right"
         />
      </section>

      {/* 5. BIG FOOTER TEXT */}
      <section className="py-40 bg-[#1F2937] text-white overflow-hidden relative">
         <div className="absolute inset-0 flex items-center opacity-10 whitespace-nowrap overflow-hidden">
             <motion.h1 
               animate={{ x: ["0%", "-50%"] }} 
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="text-[20vw] font-black leading-none"
             >
               KITOBDOSH KITOBDOSH KITOBDOSH KITOBDOSH
             </motion.h1>
         </div>
         
         <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">Biz bilan o&apos;zgarishga tayyormisiz?</h2>
            <button className="px-10 py-5 bg-[#96C7B9] text-[#1F2937] rounded-full font-black text-xl hover:scale-110 transition-transform shadow-[0_0_40px_rgba(150,199,185,0.4)]">
               HOZIROQ BOSHLANG
            </button>
         </div>
      </section>

    </div>
  );
}
