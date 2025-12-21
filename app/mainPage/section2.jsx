"use client";
import React, { useEffect, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { 
  FaClock, 
  FaShippingFast, 
  FaBookOpen, 
  FaDna, 
  FaFlask, 
  FaAtom, 
  FaFeatherAlt,
  FaArrowRight
} from "react-icons/fa";
import { useMain } from "./MainContext";

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 80, damping: 15 }
  }
};

// --- COUNT UP COMPONENT ---
const CountUp = ({ to }) => {
  const [count, setCount] = useState(0);
  const controls = useAnimation();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(to.replace(/,/g, ""), 10);
      const duration = 2000;
      const incrementTime = 20; // ms
      const step = end / (duration / incrementTime);
      
      const timer = setInterval(() => {
        start += step;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.ceil(start));
        }
      }, incrementTime);
      return () => clearInterval(timer);
    }
  }, [isInView, to]);

  return <span ref={ref}>{count.toLocaleString()}+</span>;
};

// --- MAIN COMPONENT ---
function Section2() {
  const { darkMode } = useMain();

  return (
    <section className={`overflow-hidden font-sans transition-colors duration-300 ${darkMode ? "bg-slate-900" : "bg-white"}`}>
      
      {/* 1. FEATURES SECTION */}
      <div className="container mx-auto max-w-7xl px-6 py-2">
        <motion.div
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: "-100px" }}
           variants={containerVariants}
           className="text-center mb-20"
        >
          <motion.div variants={itemVariants} className="inline-block mb-4">
             <span className={`px-4 py-1.5 rounded-full border font-bold text-sm uppercase tracking-wider
                ${darkMode ? "bg-blue-900/30 border-blue-500/30 text-blue-400" : "bg-[#D1F0E0]/30 border-[#D1F0E0] text-[#96C7B9]"}
             `}>
               Nega aynan biz?
             </span>
          </motion.div>
          
          <motion.h2 
            variants={itemVariants}
            className={`text-4xl md:text-5xl font-black mb-6 tracking-tight ${darkMode ? "text-white" : "text-slate-800"}`}
          >
            Kitob<span className="text-[#96C7B9]">Dosh</span> — <span className="text-gray-400">Afzalliklari</span>
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className={`text-lg max-w-2xl mx-auto leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-500"}`}
          >
            Talabalar uchun maxsus yaratilgan platforma: kitoblarni ijaraga oling, 
            soting va bilim almashing. Barchasi oson, tez va qulay.
          </motion.p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="grid md:grid-cols-3 gap-8"
        >
          {/* Card 1 */}
          <motion.div variants={itemVariants} className={`group p-8 rounded-[2.5rem] border hover:shadow-[0_20px_40px_-15px_rgba(209,240,224,0.6)] transition-all duration-500 text-center relative overflow-hidden
             ${darkMode 
                ? "bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-blue-500 hover:shadow-blue-900/20" 
                : "bg-slate-50 border-transparent hover:border-[#D1F0E0] hover:bg-white"
             }
          `}>
             <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700
                ${darkMode ? "bg-gradient-to-br from-blue-900/20 to-transparent" : "bg-gradient-to-br from-[#D1F0E0]/20 to-transparent"}
             `} />
             
            <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300 relative z-10
                ${darkMode ? "bg-slate-700 text-blue-400" : "bg-white text-[#96C7B9]"}
            `}>
               <FaClock className="text-3xl" />
            </div>
            <h3 className={`text-2xl font-black mb-3 group-hover:text-[#96C7B9] transition-colors relative z-10 ${darkMode ? "text-white" : "text-slate-800"}`}>Vaqtni Tejaydi</h3>
            <p className={`leading-relaxed relative z-10 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Kitoblarni qidirishga vaqt sarflamang. Bir necha tugma orqali kerakli adabiyotni toping va buyurtma bering.</p>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={itemVariants} className={`group p-8 rounded-[2.5rem] border hover:shadow-[0_20px_40px_-15px_rgba(209,240,224,0.6)] transition-all duration-500 text-center relative overflow-hidden
             ${darkMode 
                ? "bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-blue-500 hover:shadow-blue-900/20" 
                : "bg-slate-50 border-transparent hover:border-[#D1F0E0] hover:bg-white"
             }
          `}>
             <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700
                ${darkMode ? "bg-gradient-to-br from-blue-900/20 to-transparent" : "bg-gradient-to-br from-[#D1F0E0]/20 to-transparent"}
             `} />
             
            <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300 relative z-10
                ${darkMode ? "bg-slate-700 text-blue-400" : "bg-white text-[#96C7B9]"}
            `}>
               <FaShippingFast className="text-3xl" />
            </div>
            <h3 className={`text-2xl font-black mb-3 group-hover:text-[#96C7B9] transition-colors relative z-10 ${darkMode ? "text-white" : "text-slate-800"}`}>Tez Yetkazish</h3>
            <p className={`leading-relaxed relative z-10 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Buyurtmangiz 24 soat ichida talabalar turar joyiga yoki uyingizga yetkazib beriladi.</p>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={itemVariants} className={`group p-8 rounded-[2.5rem] border hover:shadow-[0_20px_40px_-15px_rgba(209,240,224,0.6)] transition-all duration-500 text-center relative overflow-hidden
             ${darkMode 
                ? "bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-blue-500 hover:shadow-blue-900/20" 
                : "bg-slate-50 border-transparent hover:border-[#D1F0E0] hover:bg-white"
             }
          `}>
             <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700
                ${darkMode ? "bg-gradient-to-br from-blue-900/20 to-transparent" : "bg-gradient-to-br from-[#D1F0E0]/20 to-transparent"}
             `} />
             
            <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300 relative z-10
                ${darkMode ? "bg-slate-700 text-blue-400" : "bg-white text-[#96C7B9]"}
            `}>
               <FaBookOpen className="text-3xl" />
            </div>
            <h3 className={`text-2xl font-black mb-3 group-hover:text-[#96C7B9] transition-colors relative z-10 ${darkMode ? "text-white" : "text-slate-800"}`}>Keng Tanlov</h3>
            <p className={`leading-relaxed relative z-10 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Barcha fanlar bo‘yicha minglab kitoblar: darsliklardan tortib badiiy asarlargacha.</p>
          </motion.div>
        </motion.div>
      </div>

      {/* 2. STATS SECTION */}
      <div className={`py-24 relative overflow-hidden ${darkMode ? "bg-slate-800/50" : "bg-slate-50"}`}>
        {/* Decorative Elements */}
        <div className={`absolute top-0 right-0 w-96 h-96 opacity-30 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3
            ${darkMode ? "bg-blue-600" : "bg-[#D1F0E0]"}
        `} />
        <div className={`absolute bottom-0 left-0 w-96 h-96 opacity-10 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3
            ${darkMode ? "bg-[#A3ED96]" : "bg-[#96C7B9]"}
        `} />
        
        <div className="container mx-auto max-w-7xl px-6 relative z-10">
           <motion.div 
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true }}
             variants={containerVariants}
             className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center"
           >
              {[
                { label: "Mavjud Kitoblar", val: "904" },
                { label: "Faol Foydalanuvchilar", val: "1200" },
                { label: "Fan Yo'nalishlari", val: "15" },
                { label: "Qo'llab Quvvatlash", val: "24", suffix: "/7" }
              ].map((stat, i) => (
                <motion.div key={i} variants={itemVariants} className="space-y-3">
                   <div className="text-4xl md:text-6xl font-black text-[#96C7B9] flex justify-center items-center gap-1">
                     {stat.label === "Qo'llab Quvvatlash" ? (
                       <span>24/7</span>
                     ) : (
                       <CountUp to={stat.val} />
                     )}
                   </div>
                   <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                </motion.div>
              ))}
           </motion.div>
        </div>
      </div>

      {/* 3. CATEGORIES SECTION */}
      <div className="container mx-auto max-w-7xl px-6 py-24">
        <motion.div
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true }}
           variants={containerVariants}
        >
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <motion.div variants={itemVariants} className="max-w-2xl">
               <h3 className={`text-3xl md:text-4xl font-black mb-4 ${darkMode ? "text-white" : "text-slate-800"}`}>
                 Kategoriya bo‘yicha izlash
               </h3>
               <p className={`text-lg ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                 O‘qishingiz uchun ideal akademik resurslarni yo&apos;nalishlar bo&apos;yicha saralab oling.
               </p>
            </motion.div>
            <motion.button 
              variants={itemVariants}
              className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all duration-300
                ${darkMode 
                    ? "bg-slate-800 text-blue-400 hover:bg-blue-600 hover:text-white" 
                    : "bg-[#D1F0E0]/20 text-[#96C7B9] hover:bg-[#96C7B9] hover:text-white"
                }
              `}
            >
              Barchasini ko&apos;rish <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>

          <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Biologiya", count: "247", icon: FaDna, desc: "Genetika, anatomiya" },
              { title: "Kimyo", count: "189", icon: FaFlask, desc: "Organik, noorganik" },
              { title: "Fizika", count: "156", icon: FaAtom, desc: "Mexanika, termodinamika" },
              { title: "Adabiyot", count: "312", icon: FaFeatherAlt, desc: "Klassik va zamonaviy" }
            ].map((cat, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className={`p-8 rounded-[2rem] border transition-all duration-300 cursor-pointer group
                    ${darkMode 
                        ? "bg-slate-800 border-slate-700 hover:border-blue-500 hover:shadow-blue-900/20" 
                        : "bg-white border-slate-100 hover:border-[#96C7B9] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)]"
                    }
                `}
              >
                 <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-6 transition-colors duration-300
                    ${darkMode 
                        ? "bg-slate-700 text-blue-400 group-hover:bg-blue-600 group-hover:text-white" 
                        : "bg-[#D1F0E0]/30 text-[#96C7B9] group-hover:bg-[#96C7B9] group-hover:text-white"
                    }
                 `}>
                    <cat.icon />
                 </div>
                 <h4 className={`text-xl font-bold mb-2 ${darkMode ? "text-white" : "text-slate-800"}`}>{cat.title}</h4>
                 <p className={`text-sm mb-6 font-medium leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-400"}`}>{cat.desc}</p>
                 <div className={`flex items-center gap-2 text-xs font-bold py-2.5 px-4 rounded-xl w-fit transition-colors
                    ${darkMode ? "bg-slate-700 text-blue-400 group-hover:bg-blue-900/50" : "bg-slate-50 text-[#96C7B9] group-hover:bg-[#D1F0E0]/40"}
                 `}>
                    {cat.count} ta kitob
                 </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
}

export default Section2;
