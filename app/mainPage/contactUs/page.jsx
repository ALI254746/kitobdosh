"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  FaPaperPlane, 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaEnvelopeOpenText,
  FaTelegramPlane,
  FaInstagram,
  FaLinkedinIn,
  FaClock
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useMain } from "../MainContext";

export default function ContactUsPage() {
  const { darkMode } = useMain();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "", type: "general" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (!form.name || !form.phone || !form.message) {
          toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring!");
          return;
      }

      setLoading(true);
      const toastId = toast.loading("Yuborilmoqda...");

      try {
          const res = await fetch("/api/contact", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(form)
          });
          const data = await res.json();

          if (data.success) {
              toast.success("Xabaringiz qabul qilindi! Tez orada aloqaga chiqamiz.", { id: toastId });
              setForm({ name: "", phone: "", email: "", message: "", type: "general" });
          } else {
              toast.error(data.message || "Xatolik yuz berdi", { id: toastId });
          }
      } catch (error) {
          toast.error("Server bilan bog'lanishda xatolik", { id: toastId });
      } finally {
          setLoading(false);
      }
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0, scale: 0.95 },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 60, damping: 15 } 
    }
  };

  return (
    <div ref={containerRef} className={`min-h-screen font-sans overflow-hidden transition-colors duration-300 ${darkMode ? "bg-slate-900" : "bg-white"}`}>
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
         {/* Parallax Background Elements */}
         <motion.div style={{ y }} className={`absolute top-0 left-0 w-full h-full -z-10 ${darkMode ? "opacity-10" : "bg-white"}`}>
            <motion.div 
               animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
               transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
               className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-[#D1F0E0]/20 to-transparent rounded-full blur-3xl opacity-60"
            />
            <motion.div 
               animate={{ scale: [1, 1.1, 1], x: [0, -30, 0] }}
               transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
               className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-[#96C7B9]/20 to-transparent rounded-full blur-3xl opacity-50"
            />
         </motion.div>

         <div className="max-w-5xl mx-auto relative z-10">
            <motion.div
               initial={{ scale: 0, rotate: -45 }}
               animate={{ scale: 1, rotate: 0 }}
               transition={{ type: "spring", stiffness: 200, damping: 20 }}
               className={`inline-flex items-center justify-center w-24 h-24 rounded-[2rem] mb-8 shadow-2xl border ${darkMode ? "bg-slate-800 border-slate-700 shadow-slate-900/50" : "bg-gradient-to-br from-[#D1F0E0] to-white shadow-[#D1F0E0]/50 border-white"}`}
            >
               <FaPaperPlane className={`text-4xl ${darkMode ? "text-[#96C7B9]" : "text-[#1F2937]"}`} />
            </motion.div>

            <motion.h1 
               initial={{ y: 30, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               className={`text-6xl md:text-7xl font-black mb-6 tracking-tight leading-tight ${darkMode ? "text-white" : "text-[#1F2937]"}`}
            >
               Biz har doim <br/><span className={`text-transparent bg-clip-text bg-gradient-to-r ${darkMode ? "from-white to-[#96C7B9]" : "from-[#1F2937] to-[#96C7B9]"}`}>aloqadamiz</span>
            </motion.h1>
            
            <motion.p 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.2 }}
               className={`text-xl md:text-2xl max-w-3xl mx-auto font-medium ${darkMode ? "text-slate-400" : "text-slate-400"}`}
            >
               Savollaringiz bormi yoki hamkorlik qilmoqchimisiz? <br className="hidden md:block"/>
               Quyidagi forma orqali bizga xabar yo&apos;llang.
            </motion.p>
         </div>
      </section>

      {/* --- CONTENT GRID --- */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
         <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid lg:grid-cols-12 gap-12 items-start"
         >
            
            {/* LEFT: Contact Info (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
               
               
               {/* Info Cards */}
               <motion.div variants={itemVariants} className={`p-8 rounded-[2.5rem] border shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group ${darkMode ? "bg-slate-800 border-slate-700 shadow-slate-900/40" : "bg-white border-slate-100 shadow-slate-200/40"}`}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 transition-colors duration-300 ${darkMode ? "bg-slate-700 text-[#96C7B9] group-hover:bg-[#96C7B9] group-hover:text-slate-900" : "bg-slate-50 text-[#96C7B9] group-hover:bg-[#1F2937] group-hover:text-white"}`}>
                     <FaPhoneAlt />
                  </div>
                  <h3 className={`text-xl font-black mb-2 ${darkMode ? "text-white" : "text-[#1F2937]"}`}>Qo&apos;ng&apos;iroq qiling</h3>
                  <p className="text-slate-400 font-medium mb-4">Dushanba - Shanba, 9:00 - 18:00</p>
                  <a href="tel:+998901234567" className="text-2xl font-black text-[#96C7B9] group-hover:underline decoration-2 underline-offset-4">
                     +998 90 123 45 67
                  </a>
               </motion.div>

               <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[#96C7B9] text-2xl mb-6 group-hover:bg-[#1F2937] group-hover:text-white transition-colors duration-300">
                     <FaEnvelopeOpenText />
                  </div>
                  <h3 className={`text-xl font-black mb-2 ${darkMode ? "text-white" : "text-[#1F2937]"}`}>Email yuboring</h3>
                  <p className="text-slate-400 font-medium mb-4">Bizga istalgan vaqtda yozing</p>
                  <a href="mailto:info@kitobdosh.uz" className={`text-xl font-bold transition-colors ${darkMode ? "text-white group-hover:text-[#96C7B9]" : "text-[#1F2937] group-hover:text-[#96C7B9]"}`}>
                     info@kitobdosh.uz
                  </a>
               </motion.div>

               <motion.div variants={itemVariants} className={`p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group ${darkMode ? "bg-slate-800" : "bg-[#1F2937]"}`}>
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#96C7B9] opacity-10 rounded-bl-full transition-transform duration-700 group-hover:scale-150" />
                  <h3 className="text-2xl font-bold text-white mb-6 relative z-10">Bizni kuzating</h3>
                  <div className="flex gap-4 relative z-10">
                     {[FaTelegramPlane, FaInstagram, FaLinkedinIn].map((Icon, i) => (
                        <a key={i} href="#" className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-all hover:-translate-y-2 hover:shadow-lg ${darkMode ? "bg-slate-700 text-white hover:bg-[#96C7B9] hover:text-slate-900" : "bg-white/10 text-white hover:bg-[#96C7B9]"}`}>
                           <Icon />
                        </a>
                     ))}
                  </div>
               </motion.div>
            </div>

            {/* MIDDLE: Form (5 cols) */}
            <motion.div 
               variants={itemVariants} 
               className={`lg:col-span-5 p-8 md:p-10 rounded-[3rem] shadow-[0_20px_80px_-20px_rgba(0,0,0,0.1)] border relative overflow-hidden ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}
            >
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#D1F0E0] to-[#96C7B9]" />
               
               <h2 className={`text-3xl font-black mb-8 ${darkMode ? "text-white" : "text-[#1F2937]"}`}>Xabar qoldiring</h2>
               
               <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="group">
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-4 mb-2 block group-focus-within:text-[#96C7B9] transition-colors">To&apos;liq ism <span className="text-red-500">*</span></label>
                     <input 
                        type="text" 
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Ism sharifingiz"
                        className={`w-full h-16 px-6 rounded-2xl border-2 border-transparent outline-none transition-all font-bold placeholder-slate-300 ${darkMode ? "bg-slate-900 focus:bg-slate-700 focus:border-[#96C7B9] text-white" : "bg-slate-50 focus:bg-white focus:border-[#D1F0E0] text-[#1F2937]"}`}
                     />
                  </div>

                  <div className="group">
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-4 mb-2 block group-focus-within:text-[#96C7B9] transition-colors">Aloqa</label>
                     <div className="grid grid-cols-2 gap-4">
                        <input 
                           type="text" 
                           name="phone"
                           value={form.phone}
                           onChange={handleChange}
                           required

                           placeholder="+998 -- --- -- --"
                           className={`w-full h-16 px-6 rounded-2xl border-2 border-transparent outline-none transition-all font-bold placeholder-slate-300 ${darkMode ? "bg-slate-900 focus:bg-slate-700 focus:border-[#96C7B9] text-white" : "bg-slate-50 focus:bg-white focus:border-[#D1F0E0] text-[#1F2937]"}`}
                        />
                        <input 
                           type="email" 
                           name="email"
                           value={form.email}
                           onChange={handleChange}
                           placeholder="Email (ixtiyoriy)"
                           className={`w-full h-16 px-6 rounded-2xl border-2 border-transparent outline-none transition-all font-bold placeholder-slate-300 ${darkMode ? "bg-slate-900 focus:bg-slate-700 focus:border-[#96C7B9] text-white" : "bg-slate-50 focus:bg-white focus:border-[#D1F0E0] text-[#1F2937]"}`}
                        />
                     </div>
                  </div>

                 {/* New Type Selector Logic */}
                  <div className="group">
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-4 mb-2 block group-focus-within:text-[#96C7B9] transition-colors">Murojaat turi</label>
                     <div className="relative">
                        <select 
                           name="type"
                           value={form.type}

                           onChange={handleChange}
                           className={`w-full h-16 px-6 rounded-2xl border-2 border-transparent outline-none transition-all font-bold appearance-none ${darkMode ? "bg-slate-900 focus:bg-slate-700 focus:border-[#96C7B9] text-white" : "bg-slate-50 focus:bg-white focus:border-[#D1F0E0] text-[#1F2937]"}`}
                        >
                           <option value="general">Umumiy savol</option>
                           <option value="suggestion">Taklif</option>
                           <option value="complaint">Shikoyat</option>
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-sm">
                           ▼
                        </div>
                     </div>
                  </div>

                  <div className="group">
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-4 mb-2 block group-focus-within:text-[#96C7B9] transition-colors">Xabar <span className="text-red-500">*</span></label>
                     <textarea 
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        placeholder="Bizga nima demoqchisiz?..."
                        className={`w-full p-6 rounded-2xl border-2 border-transparent outline-none transition-all font-bold placeholder-slate-300 resize-none ${darkMode ? "bg-slate-900 focus:bg-slate-700 focus:border-[#96C7B9] text-white" : "bg-slate-50 focus:bg-white focus:border-[#D1F0E0] text-[#1F2937]"}`}
                     />
                  </div>

                  <button 
                    disabled={loading}
                    className={`w-full py-5 text-white rounded-2xl font-bold text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed ${darkMode ? "bg-slate-900 hover:bg-[#96C7B9] hover:text-slate-900 shadow-slate-900/50" : "bg-[#1F2937] shadow-slate-300 hover:bg-[#96C7B9] hover:shadow-[#96C7B9]/40"}`}
                  >
                     {loading ? "Yuborilmoqda..." : (
                        <>
                           <span className="group-hover:-translate-y-1 transition-transform">Yuborish</span> <FaPaperPlane className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                     )}
                  </button>
               </form>
            </motion.div>

            {/* RIGHT: Visual/Map (3 cols) */}
            <div className="lg:col-span-3 space-y-6">
                <motion.div variants={itemVariants} className={`h-full min-h-[400px] rounded-[2.5rem] relative overflow-hidden border-4 shadow-xl group cursor-pointer ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-100 border-white"}`}>
                  <Image 
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"
                    alt="Office Map"
                    fill
                    className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Overlay Content */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F2937]/80 via-transparent to-transparent flex flex-col justify-end p-8">
                      <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 mb-4 border border-white/20">
                          <div className="flex items-center gap-3 text-white mb-1">
                              <FaClock className="text-[#96C7B9]" /> <span className="font-bold text-sm">Ish vaqti</span>
                          </div>
                          <p className="text-white text-xs opacity-80">Har kuni 24/7 onlayn</p>
                      </div>
                      

                       
                       <button className={`w-full py-3 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-colors ${darkMode ? "bg-slate-800 text-white hover:bg-[#96C7B9] hover:text-slate-900" : "bg-white text-[#1F2937] hover:bg-[#96C7B9] hover:text-white"}`}>
                          <FaMapMarkerAlt /> Lokatsiyani ochish
                       </button>
                  </div>
                </motion.div>
            </div>

         </motion.div>
      </section>

    </div>
  );
}
