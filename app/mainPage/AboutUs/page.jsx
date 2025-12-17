"use client";

import React from "react";
import {
  FaTelegram,
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaNodeJs,
  FaReact,
  FaJs,
  FaHtml5,
  FaCss3Alt,
} from "react-icons/fa";
import {
  FaGraduationCap,
  FaUserGraduate,
  FaTrophy,
  FaLaptopCode,
} from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { SiMongodb, SiTailwindcss } from "react-icons/si";

function Page() {
  const [visible, setVisible] = useState([]);
  const refs = useRef([]);
  const [visible1, setVisible1] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible1(true);
        }
      },
      { threshold: 0.3 }
    );

    const section = sectionRef.current;
    if (section) observer.observe(section);
    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  const achievements = [
    {
      icon: <FaGraduationCap className="text-5xl text-blue-600 mb-6 mx-auto" />,
      number: "1000+",
      title: "Kitoblar mavjud",
      gradient: "from-blue-50 to-blue-100",
      delay: "0s",
    },
    {
      icon: <FaUserGraduate className="text-5xl text-green-600 mb-6 mx-auto" />,
      number: "500+",
      title: "Foydalanuvchi talabalar",
      gradient: "from-green-50 to-green-100",
      delay: "0.2s",
    },
    {
      icon: <FaTrophy className="text-5xl text-yellow-600 mb-6 mx-auto" />,
      number: "Bir nechta",
      title: "Sertifikat va mukofotlar",
      gradient: "from-yellow-50 to-yellow-100",
      delay: "0.4s",
    },
    {
      icon: <FaLaptopCode className="text-5xl text-purple-600 mb-6 mx-auto" />,
      number: "Zamonaviy",
      title: "Full-Stack texnologiyalar",
      gradient: "from-purple-50 to-purple-100",
      delay: "0.6s",
    },
  ];

  useEffect(() => {
    refs.current.forEach((el, idx) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible((prev) => [...prev, idx]);
            observer.unobserve(el);
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(el);
    });
  }, []);
  const typingRef = useRef(null);
  const [startTyping, setStartTyping] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStartTyping(true);
            observer.unobserve(entry.target); // faqat bir marta ishga tushadi
          }
        });
      },
      { threshold: 0.5 } // sectionning yarmi ko‘ringanida ishga tushadi
    );

    if (typingRef.current) observer.observe(typingRef.current);

    return () => {
      if (typingRef.current) observer.unobserve(typingRef.current);
    };
  }, []);
  useEffect(() => {
    const elements = document.querySelectorAll(".fade-in");

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

    elements.forEach((el) => observer.observe(el));
  }, []);
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(ref.current); // bir martalik animatsiya uchun
        }
      },
      { threshold: 0.3 } // ekranga 30% kirganda ishlaydi
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);
  const [isVisible1, setIsVisible1] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible1(true);
          }
        });
      },
      { threshold: 0.3 } // 30% qismi ko‘ringanda animatsiya boshlanadi
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);
  return (
    <main className="flex-grow overflow-y-auto">
      {/* HERO SECTION */}
      <section className="bg-white h-[709px] flex items-center justify-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-6xl font-bold text-gray-800 mb-6 glow-text fade-in">
            Feruza Book Orqasidagi
            <span className="text-blue-600"> Vizionerlar bilan tanishing</span>
          </h1>
          <p
            className="text-xl text-gray-600 max-w-3xl mx-auto fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            Texnologiya va ta’lim birlashib, har bir talabaga bilimga erishish
            imkoniyatini yaratadi.
          </p>
          <div
            className="mt-8 w-32 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto rounded-full fade-in"
            style={{ animationDelay: "0.6s" }}
          ></div>
        </div>

        <style jsx>{`
          /* Glow effect */
          .glow-text {
            text-shadow: 0 0 10px rgba(59, 130, 246, 0.7),
              0 0 20px rgba(59, 130, 246, 0.5);
          }

          /* Fade-in effect */
          .fade-in {
            opacity: 0;
            transform: translateY(20px);
            animation: fadeInUp 1s forwards;
          }
          .fade-in:nth-child(2) {
            animation-delay: 0.3s;
          }
          .fade-in:nth-child(3) {
            animation-delay: 0.6s;
          }

          @keyframes fadeInUp {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </section>

      {/* FOUNDER SECTIONS */}
      <section className="py-20 bg-white overflow-hidden">
        {/* Floating icons */}
        <div className="absolute inset-0 opacity-5">
          <i className="fas fa-book absolute top-20 left-20 text-6xl text-blue-600 floating-animation"></i>
          <i
            className="fas fa-graduation-cap absolute bottom-20 right-20 text-4xl text-blue-500 floating-animation"
            style={{ animationDelay: "-3s" }}
          ></i>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <img
            className="w-full h-[500px] rounded-3xl shadow-2xl object-cover fade-in"
            src="https://storage.googleapis.com/uxpilot-auth.appspot.com/88316ff290-aaea57af544ba8742ef3.png"
            alt="Feruza"
          />

          <div className="fade-in" style={{ animationDelay: "0.6s" }}>
            <h2 className="text-6xl font-bold text-gray-800 mb-6 glow-text">
              <span
                className="fade-in text-gray-800 block"
                style={{ animationDelay: "0.6s" }}
              >
                Feruza – asoschi
              </span>
              <span
                className="fade-in text-blue-600 block"
                style={{ animationDelay: "0.9s" }}
              >
                va loyiha vizioneri
              </span>
            </h2>

            <p
              className="text-xl text-gray-600 max-w-3xl mx-auto fade-in"
              style={{ animationDelay: "1.2s" }}
            >
              Texnologiya va ta’lim birlashib, har bir talabaga bilimga erishish
              imkoniyatini yaratadi.
            </p>

            <p
              className="text-xl text-gray-600 max-w-3xl mx-auto fade-in"
              style={{ animationDelay: "1.6s" }}
            >
              Feruza Termiz Davlat Pedagogika Universiteti 3-kurs talabasidir,
              Surxondaryodan. U “Feruza Book” loyihasining asoschisi va ijodiy
              ruhidir, talabalarga kitoblar va zamonaviy o‘quv resurslariga
              erishishni yaxshilashga intiladi.
            </p>

            {/* Social buttons */}
            <div
              className="flex space-x-4 mt-6 fade-in"
              style={{ animationDelay: "2s" }}
            >
              <a
                href="https://t.me/yourusername"
                target="_blank"
                className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition-transform hover:scale-110"
              >
                <FaTelegram size={20} />
              </a>
              <a
                href="https://www.instagram.com/yourusername"
                target="_blank"
                className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-full transition-transform hover:scale-110"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://www.facebook.com/yourusername"
                target="_blank"
                className="bg-blue-700 hover:bg-blue-800 text-white p-3 rounded-full transition-transform hover:scale-110"
              >
                <FaFacebookF size={20} />
              </a>
              <a
                href="https://twitter.com/yourusername"
                target="_blank"
                className="bg-blue-400 hover:bg-blue-500 text-white p-3 rounded-full transition-transform hover:scale-110"
              >
                <FaTwitter size={20} />
              </a>
            </div>
          </div>
        </div>

        <style jsx>{`
          /* Glow effect */
          .glow-text {
            text-shadow: 0 0 10px rgba(59, 130, 246, 0.7),
              0 0 20px rgba(59, 130, 246, 0.5);
          }

          /* Fade-in (scroll trigger) */
          .fade-in {
            opacity: 0;
            transform: translateY(20px);
            transition: all 1s ease;
          }

          .fade-in-visible {
            opacity: 1;
            transform: translateY(0);
          }

          /* Floating icons */
          @keyframes float {
            0% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
            100% {
              transform: translateY(0);
            }
          }

          .floating-animation {
            animation: float 6s ease-in-out infinite;
          }
        `}</style>
      </section>

      {/* HOJIAKBAR SECTION */}
      <section className="py-20 bg-gradient-to-l from-gray-50 to-white relative overflow-hidden">
        {/* Floating icons */}
        <div className="absolute inset-0 opacity-5">
          <i className="fas fa-code absolute top-20 right-20 text-6xl text-blue-600 floating-animation"></i>
          <i
            className="fas fa-laptop-code absolute bottom-20 left-20 text-4xl text-blue-500 floating-animation"
            style={{ animationDelay: "-2s" }}
          ></i>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <img
            className="w-full h-[500px] rounded-3xl shadow-2xl object-cover fade-in lg:order-2"
            src="https://storage.googleapis.com/uxpilot-auth.appspot.com/de146046ef-b51f77662f9a361f95f7.png"
            alt="Hojiakbar"
          />
          <div
            className="fade-in lg:order-1"
            style={{ animationDelay: "0.3s" }}
          >
            {/* Title with typing animation */}
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              <span
                ref={typingRef}
                className={`border-r-4 border-blue-600 pr-2 text-blue-600 ${
                  startTyping ? "animate-typing" : ""
                }`}
              >
                Hojiakbar – Software Engineer
              </span>
            </h2>

            {/* Quote */}
            <p className="text-xl italic text-gray-600 mb-8 border-l-4 border-blue-600 pl-6">
              &quot;Texnologiya – bu taraqqiyotning tili.&quot;
            </p>

            {/* About text */}
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Hojiakbar Toshkent Axborot Texnologiyalari Universiteti 4-kurs
              talabasidir, Andijondan. U “Feruza Book”ning asosiy dasturchisi
              bo‘lib, xavfsiz, zamonaviy va samarali raqamli platformani
              yaratish bilan shug‘ullanadi. Uning tajribasi <b>full-stack</b>{" "}
              texnologiyalarni qamrab oladi: React, Next.js, Node.js, MongoDB,
              JavaScript, HTML, CSS va Tailwind CSS.
            </p>

            {/* Technology icons */}
            <div className="flex flex-wrap gap-4 mb-6">
              <FaNodeJs size={30} className="text-green-600" />
              <SiMongodb size={30} className="text-green-500" />
              <FaJs size={30} className="text-yellow-400" />
              <FaReact size={30} className="text-blue-400" />
              <FaHtml5 size={30} className="text-orange-500" />
              <FaCss3Alt size={30} className="text-blue-600" />
              <SiTailwindcss size={30} className="text-blue-400" />
            </div>

            {/* Social buttons */}
            <div className="flex space-x-4">
              <a
                href="https://t.me/yourusername"
                target="_blank"
                className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition-transform hover:scale-110"
              >
                <FaTelegram size={20} />
              </a>
              <a
                href="https://www.instagram.com/yourusername"
                target="_blank"
                className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-full transition-transform hover:scale-110"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://www.facebook.com/yourusername"
                target="_blank"
                className="bg-blue-700 hover:bg-blue-800 text-white p-3 rounded-full transition-transform hover:scale-110"
              >
                <FaFacebookF size={20} />
              </a>
              <a
                href="https://twitter.com/yourusername"
                target="_blank"
                className="bg-blue-400 hover:bg-blue-500 text-white p-3 rounded-full transition-transform hover:scale-110"
              >
                <FaTwitter size={20} />
              </a>
            </div>
          </div>
        </div>

        <style jsx>{`
          /* Floating animation */
          .floating-animation {
            animation: float 6s ease-in-out infinite;
          }
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }

          /* Fade-in effect */
          .fade-in {
            opacity: 0;
            transform: translateY(20px);
            animation: fadeInUp 1s forwards;
          }
          @keyframes fadeInUp {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Typing animation (1 martalik) */
          .animate-typing {
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            animation: typing 3s steps(40, end) forwards,
              blink 0.7s step-end infinite alternate;
            border-right: 4px solid #2563eb;
          }
          @keyframes typing {
            from {
              width: 0;
            }
            to {
              width: 100%;
            }
          }
          @keyframes blink {
            50% {
              border-color: transparent;
            }
          }
        `}</style>
      </section>
      <section className="bg-white h-[209px] flex items-center justify-center relative overflow-hidden">
        <div
          ref={ref}
          className={`max-w-7xl mx-auto px-6 text-center relative z-10 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1
            className={`text-5xl font-bold text-gray-800 mb-6 glow-text transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            Bizning Maqsadimiz -
            <span className="text-blue-600"> Bulardan iborat</span>
          </h1>
          <p
            className={`text-2xl text-gray-600 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            Har bir talaba uchun o‘qishni soddalashtirish, zamonaviy va qulay
            shaklga keltirish.
          </p>
        </div>

        <style jsx>{`
          .glow-text {
            text-shadow: 0 0 10px rgba(59, 130, 246, 0.7),
              0 0 20px rgba(59, 130, 246, 0.5);
          }
        `}</style>
      </section>
      <section
        ref={sectionRef}
        id="achievements"
        className="py-10 bg-white relative overflow-hidden"
      >
        {/* Floating shakllar */}
        <div className="absolute inset-0 opacity-10">
          <div className="floating-animation absolute top-20 left-20 w-24 h-24 border border-blue-500 rounded-lg rotate-12"></div>
          <div
            className="floating-animation absolute bottom-20 right-20 w-16 h-16 border border-blue-400 rounded-full"
            style={{ animationDelay: "-3s" }}
          ></div>
        </div>

        {/* Matn */}

        {/* Statistikalar */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {achievements.map((item, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${
                item.gradient
              } p-8 rounded-2xl text-center shadow-md transition-all duration-700 ${
                visible1
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: item.delay }}
            >
              {item.icon}
              <h3 className="text-3xl font-bold text-gray-800 mb-2">
                {item.number}
              </h3>
              <p className="text-gray-600 font-medium">{item.title}</p>
            </div>
          ))}
        </div>

        <style jsx>{`
          .floating-animation {
            animation: float 6s ease-in-out infinite;
          }
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }
        `}</style>
      </section>
    </main>
  );
}

export default Page;
