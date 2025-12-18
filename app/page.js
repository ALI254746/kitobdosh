"use client";
import { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaBookOpen,
  FaGraduationCap,
  FaLightbulb,
  FaPenFancy,
  FaBookmark,
} from "react-icons/fa";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Login xatosi!");
        return;
      }

      toast.success("🎉 Login muvaffaqiyatli!");

      // 📱💻 DEVICE AUTO REDIRECT
      if (typeof window !== "undefined") {
        const isMobile = window.innerWidth < 728;
        
        console.log("Login response data:", data); // Debugging uchun
        const role = data.role ? data.role.toLowerCase().trim() : "";

        if (role === "admin") {
          router.push("/AdminPanel");
        } else if (role === "kurier") {
          router.push("/KurierPanel");
        } else if (role === "user") {
          // User uchun mobil yoki desktopga yo‘naltirish
          if (isMobile) router.push("/mobile");
          else router.push("/mainPage"); // desktop
        }
      }
    } catch (err) {
      toast.error("Server yoki internetda xato!");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("✅ Ro‘yxatdan o‘tish muvaffaqiyatli!");
        setIsRegister(false);
      } else {
        toast.error(data.message || "Ro‘yxatdan o‘tishda xatolik!");
      }
    } catch {
      toast.error("Tarmoqda xatolik yuz berdi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Blobs for specific premium feel */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-400/20 rounded-full blur-[120px] pointer-events-none"></div>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#fff",
            borderRadius: "16px",
            padding: "16px 24px",
            fontSize: "14px",
          },
        }}
      />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-xl w-full max-w-[420px] rounded-[32px] shadow-2xl p-6 md:p-10 border border-white/50 relative z-10"
      >
        {/* Header Logo Area */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-tr from-[#52C6DA] to-blue-500 rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-cyan-200 mb-6 transform rotate-3 hover:rotate-6 transition-all duration-300">
            <FaBookOpen className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">
            Kitobdosh
          </h1>
          <p className="text-slate-500 font-medium">
            Bilimlar olamiga xush kelibsiz
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex mb-8 relative">
          <motion.div
            className="absolute top-1.5 bottom-1.5 bg-white rounded-xl shadow-sm z-0"
            initial={false}
            animate={{
              left: isRegister ? "50%" : "4px",
              right: isRegister ? "4px" : "50%",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <button
            onClick={() => setIsRegister(false)}
            className={`flex-1 py-3 text-sm font-bold relative z-10 transition-colors ${
              !isRegister ? "text-slate-800" : "text-slate-500"
            }`}
          >
            Kirish
          </button>
          <button
            onClick={() => setIsRegister(true)}
            className={`flex-1 py-3 text-sm font-bold relative z-10 transition-colors ${
              isRegister ? "text-slate-800" : "text-slate-500"
            }`}
          >
            Ro‘yxatdan o‘tish
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={isRegister ? handleRegister : handleLogin}
          className="space-y-5"
        >
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">
              Elektron pochta
            </label>
            <div className="relative group">
              <div className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 group-focus-within:text-[#52C6DA] transition-colors">
                <FaEnvelope />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-800 font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#52C6DA] focus:bg-white transition-all duration-300"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">
              Parol
            </label>
            <div className="relative group">
              <div className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 group-focus-within:text-[#52C6DA] transition-colors">
                <FaLock />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-800 font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#52C6DA] focus:bg-white transition-all duration-300"
              />
            </div>
          </div>

          {!isRegister && (
            <div className="flex justify-end">
              <button
                type="button"
                className="text-xs font-bold text-[#52C6DA] hover:text-[#3aa8bc] transition-colors"
                onClick={() => toast("Hozircha faol emas", { icon: "🔧" })}
              >
                Parolni unutdingizmi?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg shadow-cyan-200/50 hover:shadow-cyan-300/60 active:scale-[0.98] transition-all bg-gradient-to-r from-[#52C6DA] to-blue-500 flex items-center justify-center gap-2 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : isRegister ? (
              <>
                <span>Ro‘yxatdan o‘tish</span>
                <FaPenFancy size={14} />
              </>
            ) : (
              <>
                <span>Kirish</span>
                <FaGraduationCap size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <span className="relative bg-white/80 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider backdrop-blur-xl">
            Yoki
          </span>
        </div>

        <div className="mt-6">
          <button
            onClick={() => signIn("google")}
            className="w-full py-3.5 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-[0.98]"
          >
            <FcGoogle size={22} />
            <span className="text-sm font-bold text-slate-600">
              Google orqali davom etish
            </span>
          </button>
        </div>
      </motion.div>

      {/* Footer Text */}
      <div className="absolute bottom-6 text-center w-full">
        <p className="text-xs text-slate-400 font-medium">
          &copy; 2025 Kitobdosh. Barcha huquqlar himoyalangan.
        </p>
      </div>
    </div>
  );
}
