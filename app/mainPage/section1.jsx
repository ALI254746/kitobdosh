"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
function Section1() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // sahifa yuklanganda animatsiyani bir marta ishga tushiradi
    setAnimate(true);
  }, []);

  return (
    <main className="flex-grow overflow-y-auto">
      <section className="relative h-[709px] flex items-center justify-center overflow-hidden">
        {/* Orqa fon */}
        <div className="absolute inset-0">
          <Image
            src="https://storage.googleapis.com/uxpilot-auth.appspot.com/96b9c1e88a-2d76d33c71b808a40d69.png"
            alt="modern library with students reading books, warm lighting, educational atmosphere"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0  from-black/40 to-transparent"></div>
        </div>
        {/*sssrticlelar */}
        <div className="particle absolute top-20 left-20 w-4 h-4 bg-white/20 rounded-full animate-pulse-slow"></div>
        <div
          className="particle absolute top-40 right-32 w-3 h-3 bg-cyan-300/30 rounded-full animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="particle absolute bottom-32 left-1/4 w-5 h-5 bg-blue-300/25 rounded-full animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Matn va tugmalar */}
        <div
          className={`relative z-10 text-center max-w-4xl mx-auto px-6 transition-all duration-1000 ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            📖 Vaqtingizni tejang, bilimni oshiring.
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Sevimli kitoblaringizni istalgan vaqtda ijaraga oling yoki sotib
            oling.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4  from-blue-600/80 to-blue-700/80 text-white rounded-xl font-semibold hover:scale-105 transition-transform backdrop-blur-sm">
              📘 Kitob ijaraga olish
            </button>
            <button className="px-8 py-4 glass-morphism text-white rounded-xl font-semibold hover:scale-105 transition-transform backdrop-blur-sm">
              🛍️ Sotib olish
            </button>
          </div>
        </div>
      </section>

      {/* Qo'shimcha animatsiya uchun tailwind classlari */}
      <style jsx>{`
        .animate-pulse-slow {
          animation: pulse 6s infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.5);
          }
        }
      `}</style>
    </main>
  );
}

export default Section1;
