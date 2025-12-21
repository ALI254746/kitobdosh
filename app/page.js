"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  motion, 
  AnimatePresence, 
  useAnimation, 
  useMotionValue, 
  useTransform 
} from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";

// Icons
import { 
  FaEnvelope, 
  FaLock, 
  FaBookOpen, 
  FaGraduationCap, 
  FaArrowRight,
  FaGoogle,
  FaLightbulb,
  FaShapes,
  FaGlobeAmericas
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

// --- ANIMATION VARIANTS ---
const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const formVariants = {
  hidden: { x: 50, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 20, staggerChildren: 0.1 } 
  },
  exit: { x: -50, opacity: 0 }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const floatAnimation = {
  y: [10, -10, 10],
  rotate: [0, 5, -5, 0],
  transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
};

export default function AuthPage() {
  const { data: session, status } = useSession();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Mouse move effect for background (Parallax) - MOVED TO TOP to fix Hook Error
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [0, 1], [5, -5]);
  const rotateY = useTransform(x, [0, 1], [-5, 5]);

  // Redirect if already logged in (Critical for Google Login flow)
  useEffect(() => {
      if (status === "authenticated" && session?.user) {
          const role = session.user.role ? session.user.role.toLowerCase() : "user";
          const isMobile = window.innerWidth < 728;
          
          if (role === "admin") router.push("/AdminPanel");
          else if (role === "kurier" || role === "courier" || role === "kurer") router.push("/KurierPanel");
          else router.push(isMobile ? "/mobile" : "/mainPage");
      }
  }, [status, session, router]);

  // Loading State (Prevent Flash)
  if (status === "loading" || status === "authenticated") {
      return (
          <div className="min-h-screen flex items-center justify-center bg-white">
              <div className="w-12 h-12 border-4 border-[#96C7B9] border-t-transparent rounded-full animate-spin"></div>
          </div>
      );
  }

  function handleMouseMove(event) {
    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;
    x.set(clientX / innerWidth);
    y.set(clientY / innerHeight);
  }

  // --- HANDLERS ---
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isRegister) {
          if (!showOTP) {
              // 1-qadam: Registratsiya so'rovi (OTP yuborish)
              const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
              });
              const data = await res.json();
              
              if (!res.ok) {
                  toast.error(data.message || "Xatolik", { icon: "⚠️" });
                  setLoading(false);
                  return;
              }
              
              toast.success("Kod yuborildi! Emailingizni tekshiring.", { icon: "📩" });
              setShowOTP(true);
              setLoading(false);
              return;

          } else {
              // 2-qadam: KODNI TASDIQLASH
              const res = await fetch("/api/auth/verify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email, otp }),
              });
              const data = await res.json();

              if (!res.ok) {
                  toast.error(data.message || "Kod noto'g'ri", { icon: "❌" });
                  setLoading(false);
                  return;
              }

              toast.success("Muvaffaqiyatli ro'yxatdan o'tdingiz!", { icon: "🎉" });
              
              // Muvaffaqiyatli ro'yxatdan o'tgandan keyin kirish
              const signInRes = await signIn("credentials", {
                redirect: false,
                email,
                password,
              });
              
              if (signInRes?.ok) {
                  router.push(window.innerWidth < 728 ? "/mobile" : "/mainPage");
              }
              return;
          }
      }

      // LOGIN LOGIC (NextAuth Credentials)
      await new Promise(r => setTimeout(r, 500));
      
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        toast.error("Email yoki parol noto'g'ri", { icon: "⚠️" });
        setLoading(false);
        return;
      }

      toast.success("Xush kelibsiz!", { icon: "🎉" });
      
      // Manual Redirection after Login
      // We fetch the session manually to determine the role immediately
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();
      
      const role = sessionData?.user?.role ? sessionData.user.role.toLowerCase() : "user";
      const isMobile = window.innerWidth < 728;

      if (role === "admin") router.push("/AdminPanel");
      else if (role === "kurier" || role === "courier" || role === "kurer") router.push("/KurierPanel");
      else router.push(isMobile ? "/mobile" : "/mainPage");

    } catch (err) {
      console.error(err);
      toast.error("Tarmoq xatosi!");
    } finally {
      if(!showOTP || !isRegister) setLoading(false);
    }
  };

  return (
    <motion.div 
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      onMouseMove={handleMouseMove}
      className="min-h-screen flex bg-white font-sans overflow-hidden"
    >
      <Toaster position="top-center" toastOptions={{
        style: {
          background: '#1F2937',
          color: '#fff',
          borderRadius: '16px',
          fontWeight: 'bold',
        }
      }} />

      {/* --- LEFT SIDE: ARTWORK & SHOWCASE (Desktop) --- */}
      <div className="hidden lg:flex w-1/2 relative bg-[#1F2937] items-center justify-center p-12 overflow-hidden">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 z-0">
             <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#96C7B9] opacity-10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 animate-pulse" />
             <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#D1F0E0] opacity-5 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/3" />
        </div>

        <motion.div 
            style={{ rotateX, rotateY, perspective: 1000 }}
            className="relative z-10 w-full max-w-2xl"
        >
            {/* 3D Floating Elements Container */}
            <div className="relative h-[600px] w-full flex items-center justify-center">
                
                {/* Central Circle */}
                <motion.div 
                   animate={{ scale: [1, 1.05, 1], borderColor: ["rgba(150,199,185,0.2)", "rgba(150,199,185,0.4)", "rgba(150,199,185,0.2)"] }}
                   transition={{ duration: 4, repeat: Infinity }}
                   className="absolute w-96 h-96 rounded-full border-2 border-[#96C7B9]/20 flex items-center justify-center"
                >
                    <div className="w-64 h-64 rounded-full bg-gradient-to-br from-[#96C7B9]/20 to-transparent backdrop-blur-3xl" />
                </motion.div>

                {/* Floating Icons */}
                <motion.div animate={floatAnimation} className="absolute top-20 left-10 p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 shadow-xl">
                    <FaBookOpen className="text-4xl text-[#96C7B9]" />
                </motion.div>

                <motion.div animate={{ ...floatAnimation, transition: { duration: 7, repeat: Infinity, delay: 1 } }} className="absolute bottom-32 right-10 p-5 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 shadow-xl">
                    <FaGraduationCap className="text-4xl text-[#D1F0E0]" />
                </motion.div>

                <motion.div animate={{ ...floatAnimation, transition: { duration: 5, repeat: Infinity, delay: 0.5 } }} className="absolute top-40 right-20 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl">
                    <FaLightbulb className="text-3xl text-yellow-200/80" />
                </motion.div>
                
                <motion.div animate={{ ...floatAnimation, transition: { duration: 8, repeat: Infinity, delay: 2 } }} className="absolute bottom-20 left-20 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl">
                    <FaGlobeAmericas className="text-3xl text-blue-300/80" />
                </motion.div>

                {/* Hero Text */}
                <div className="text-center relative z-20 space-y-6">
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-6xl font-black text-white tracking-tight leading-tight"
                    >
                        Bilim — bu <br/> <span className="text-[#96C7B9]">super kuch.</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg text-gray-400 max-w-md mx-auto leading-relaxed"
                    >
                        Kitobdosh platformasi orqali minglab kitoblarga ega bo&apos;ling. 
                        O&apos;qing, o&apos;rganing va ulashing.
                    </motion.p>
                </div>
            </div>
        </motion.div>

        {/* Bottom Stats */}
        <div className="absolute bottom-10 left-10 flex gap-8 z-10">
            <div>
                <p className="text-2xl font-black text-white">5K+</p>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Foydalanuvchilar</p>
            </div>
            <div>
                <p className="text-2xl font-black text-white">10K+</p>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Kitoblar</p>
            </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: FORM (Desktop & Mobile) --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="absolute top-0 right-0 p-6 hidden lg:block">
            <span className="text-sm font-bold text-gray-400 mr-2">
                {isRegister ? "Allaqachon hisobingiz bormi?" : "Hali hisobingiz yo'qmi?"}
            </span>
            <button 
                onClick={() => { setIsRegister(!isRegister); setShowOTP(false); }}
                className="text-[#1F2937] font-black hover:text-[#96C7B9] transition-colors underline decoration-2 underline-offset-4"
            >
                {isRegister ? "Kirish" : "Ro'yxatdan o'tish"}
            </button>
        </div>

        <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="text-center lg:text-left space-y-2">
                <div className="inline-flex items-center gap-3 mb-4 lg:mb-0">
                    <div className="w-12 h-12 bg-[#1F2937] text-white rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-[#1F2937]/20">
                        <FaBookOpen />
                    </div>
                    <span className="text-2xl font-black text-[#1F2937] tracking-tight">Kitobdosh</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-[#1F2937]">
                    {showOTP ? "Tasdiqlash" : (isRegister ? "Xush kelibsiz!" : "Qaytganingizdan xursandmiz!")}
                </h2>
                <p className="text-gray-500 font-medium">
                    {showOTP 
                         ? "Emailingizga yuborilgan kodni kiriting"
                         : (isRegister 
                            ? "Boshlash uchun ma'lumotlaringizni kiriting" 
                            : "Davom etish uchun hisobingizga kiring")
                    }
                </p>
            </div>

            {/* Auth Form */}
            <AnimatePresence mode="wait">
                <motion.form 
                    key={showOTP ? "otp" : (isRegister ? "register" : "login")}
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onSubmit={handleAuth}
                    className="space-y-6"
                >
                    {!showOTP ? (
                        <>
                            <motion.div variants={itemVariants} className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email manzilingiz</label>
                                <div className="relative group">
                                    <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1F2937] transition-colors z-10" />
                                    <input 
                                        type="email" 
                                        required 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@company.com"
                                        className="w-full h-14 pl-12 pr-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#96C7B9] focus:shadow-[0_0_0_4px_rgba(150,199,185,0.2)] transition-all font-bold text-[#1F2937] placeholder-gray-400"
                                    />
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="space-y-2">
                                <div className="flex justify-between items-center ml-1 pr-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Parol</label>
                                    {!isRegister && (
                                        <button type="button" className="text-xs font-bold text-[#96C7B9] hover:text-[#1F2937] transition-colors">
                                            Parolni unutdingizmi?
                                        </button>
                                    )}
                                </div>
                                <div className="relative group">
                                    <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1F2937] transition-colors z-10" />
                                    <input 
                                        type="password" 
                                        required 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full h-14 pl-12 pr-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#96C7B9] focus:shadow-[0_0_0_4px_rgba(150,199,185,0.2)] transition-all font-bold text-[#1F2937] placeholder-gray-400"
                                    />
                                </div>
                            </motion.div>
                        </>
                    ) : (
                        /* OTP INPUT */
                         <motion.div variants={itemVariants} className="space-y-2">
                           <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Tasdiqlash kodi</label>
                            <div className="relative group">
                                <FaShapes className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1F2937] transition-colors z-10" />
                                <input 
                                    type="text" 
                                    required 
                                    value={otp}
                                    maxLength={6}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // only numbers
                                    placeholder="123456"
                                    className="w-full h-14 pl-12 pr-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#96C7B9] focus:shadow-[0_0_0_4px_rgba(150,199,185,0.2)] transition-all font-bold text-2xl tracking-[0.5em] text-[#1F2937] placeholder-gray-300 text-center"
                                />
                            </div>
                            <p className="text-xs text-center text-gray-400 font-medium">
                                Kod {email} manziliga yuborildi. <button type="button" onClick={() => setShowOTP(false)} className="text-[#96C7B9] hover:underline">O'zgartirish</button>
                            </p>
                        </motion.div>
                    )}

                    <motion.div variants={itemVariants} className="pt-2">
                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-[#1F2937] hover:bg-[#96C7B9] text-white rounded-2xl font-black text-lg shadow-xl shadow-[#1F2937]/20 hover:shadow-[#96C7B9]/40 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                                />
                            ) : (
                                <>
                                    {showOTP ? "Tasdiqlash" : (isRegister ? "Davom etish" : "Kirish")}
                                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </motion.div>

                    {!showOTP && (
                        <>
                            <motion.div variants={itemVariants} className="relative py-2">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-100"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-gray-400 font-bold tracking-wider">Yoki</span>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <button 
                                    type="button"
                                    onClick={() => signIn("google")}
                                    className="w-full h-14 bg-white border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-[#1F2937] rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                                >
                                    <FcGoogle className="text-2xl" />
                                    <span>Google orqali davom etish</span>
                                </button>
                            </motion.div>
                        </>
                    )}
                </motion.form>
            </AnimatePresence>

            {/* Mobile Switcher */}
            <div className="lg:hidden text-center mt-8">
                <p className="text-gray-500 font-medium text-sm">
                    {isRegister ? "Allaqachon hisobingiz bormi?" : "Hali hisobingiz yo'qmi?"} <br/>
                    <button 
                        onClick={() => { setIsRegister(!isRegister); setShowOTP(false); }}
                        className="text-[#1F2937] font-black mt-2 hover:text-[#96C7B9] transition-colors underline decoration-2 underline-offset-4"
                    >
                        {isRegister ? "Kirish" : "Ro'yxatdan o'tish"}
                    </button>
                </p>
            </div>
            
        </div>
        
        {/* Footer info */}
        <div className="absolute bottom-6 w-full text-center lg:text-left lg:pl-12">
             <p className="text-xs text-gray-300 font-bold">&copy; 2025 Kitobdosh Inc.</p>
        </div>
      </div>
    </motion.div>
  );
}
