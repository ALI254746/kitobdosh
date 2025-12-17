"use client";
import React from "react";
import { FaEnvelope } from "react-icons/fa";
import { TypeAnimation } from "react-type-animation";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { FaTelegram, FaLocationDot } from "react-icons/fa6";

// Material Icons dan email
function Page() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in-visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    const elements = sectionRef.current.querySelectorAll(".fade-in");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <div className="bg-white h-[400] flex items-center justify-center">
        <div className="max-w-3xl text-center px-6 py-12">
          {/* Typing Animation Title */}
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            <TypeAnimation
              sequence={[
                "Aloqada bo'lamiz...", // yoziladigan matn
                1500, // kutish (ms)
              ]}
              wrapper="span"
              speed={20}
              repeat={false}
              style={{ display: "inline-block" }}
            />
          </h1>

          {/* Subtext */}
          <p className="text-xl text-gray-600 mb-8 fade-in">
            Feruza Book haqida savolingiz bormi? Sizdan eshitishni juda
            xohlaymiz.
          </p>

          {/* Icon with animation */}
          <div className="flex justify-center">
            <FaEnvelope className="text-5xl text-blue-600 animate-bounce" />
          </div>
        </div>
      </div>
      <section
        id="contact-form-section"
        className="py-2 bg-white overflow-hidden"
      >
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Chap taraf (rasm + matn) */}
            <div id="contact-image" className="space-y-6 fade-in">
              <div className="h-160 overflow-hidden rounded-2xl">
                <Image
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/c52f5e0a2c-7cfec64aa824ee1b542b.png"
                  alt="Talaba laptopda yozayotgan holatda, zamonaviy kutubxona"
                  width={800}
                  height={900}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <p className="text-lg text-gray-600 font-medium">
                  Sizning savollaringiz biz uchun muhim
                </p>
              </div>
            </div>

            {/* O‘ng taraf (forma) */}
            <div
              id="contact-form-card"
              className="glassmorphic rounded-2xl p-8 shadow-xl fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Bizga xabar yuboring
              </h2>
              <form id="contact-form" className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To‘liq ism
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email manzil
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mavzu
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xabar
                  </label>
                  <textarea
                    rows="5"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition resize-none"
                  ></textarea>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition glow-effect"
                  >
                    Xabar yuborish
                  </button>
                  <button
                    type="reset"
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-blue-500 hover:text-blue-600 transition"
                  >
                    Tozalash
                  </button>
                </div>

                <p className="text-sm text-gray-500 text-center">
                  Odatda 24 soat ichida javob beramiz.
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Fade-in animatsiya */}
        <style jsx>{`
          .fade-in {
            opacity: 0;
            transform: translateY(30px);
            animation: fadeInUp 1.2s ease-out forwards;
          }

          @keyframes fadeInUp {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .glassmorphic {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.3);
          }

          .glow-effect {
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.6);
          }
        `}</style>
      </section>
      <section
        id="alternative-contact"
        className="py-20 bg-gray-50"
        ref={sectionRef}
      >
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-16 fade-in">
            Biz bilan bog‘lanishning boshqa usullari
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Telegram */}
            <div className="gradient-border glow-effect fade-in">
              <div className="gradient-border-inner text-center p-8">
                <FaTelegram className="text-4xl text-blue-500 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Telegram
                </h3>
                <p className="text-gray-600 mb-4">Tez javob olish uchun</p>
                <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">
                  Telegramda yozish
                </button>
              </div>
            </div>

            {/* Email */}
            <div className="gradient-border glow-effect fade-in">
              <div className="gradient-border-inner text-center p-8">
                <FaEnvelope className="text-4xl text-yellow-500 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Email
                </h3>
                <p className="text-gray-600 mb-4">contact@feruzabook.uz</p>
                <button className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition">
                  Email yuborish
                </button>
              </div>
            </div>

            {/* Manzil */}
            <div className="gradient-border glow-effect fade-in">
              <div className="gradient-border-inner text-center p-8">
                <FaLocationDot className="text-4xl text-green-500 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Manzil
                </h3>
                <p className="text-gray-600 mb-4">Termiz, O‘zbekiston</p>
                <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition">
                  Xaritada ko‘rish
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stil va animatsiya */}
        <style jsx>{`
          .gradient-border {
            border-radius: 1rem;
            padding: 2px;
            background: linear-gradient(
              135deg,
              rgba(59, 130, 246, 0.8),
              rgba(147, 51, 234, 0.8)
            );
          }

          .gradient-border-inner {
            border-radius: 1rem;
            background: white;
          }

          .glow-effect {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .glow-effect:hover {
            transform: translateY(-6px);
            box-shadow: 0 10px 25px rgba(59, 130, 246, 0.2);
          }

          /* Scroll paytida chiqadigan animatsiya */
          .fade-in {
            opacity: 0;
            transform: translateY(30px);
            transition: all 1s ease-out;
          }
          .fade-in-visible {
            opacity: 1;
            transform: translateY(0);
          }
        `}</style>
      </section>
    </div>
  );
}

export default Page;
