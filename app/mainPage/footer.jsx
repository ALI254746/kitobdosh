"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaTelegramPlane,
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaArrowRight
} from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#1F2937] text-white pt-24 pb-10 overflow-hidden font-sans rounded-t-[3rem]">
      
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#96C7B9] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#D1F0E0] opacity-5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
             <Link href="/mainPage" className="inline-block">
                <span className="text-3xl font-black tracking-tight text-white">
                  Kitob<span className="text-[#96C7B9]">dosh</span>
                </span>
             </Link>
             <p className="text-gray-400 leading-relaxed text-sm">
               Talabalar va kitobxonlar uchun eng zamonaviy ijara va savdo platformasi. Bilim olishni oson va qulay qilamiz.
             </p>
             <div className="flex gap-4">
                {[FaTelegramPlane, FaInstagram, FaFacebookF, FaYoutube].map((Icon, i) => (
                   <a 
                     key={i} 
                     href="#" 
                     className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#96C7B9] hover:text-[#1F2937] flex items-center justify-center transition-all duration-300"
                   >
                     <Icon />
                   </a>
                ))}
             </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Sahifalar</h3>
            <ul className="space-y-4">
               {[
                 { label: "Bosh Sahifa", href: "/mainPage" },
                 { label: "Sotib Olish", href: "/mainPage/sotibolish" },
                 { label: "Ijara", href: "/mainPage/ijarabook" },
                 { label: "Biz Haqimizda", href: "/mainPage/AboutUs" },
                 { label: "Aloqa", href: "/mainPage/contactUs" }
               ].map((link, i) => (
                 <li key={i}>
                    <Link href={link.href} className="text-gray-400 hover:text-[#96C7B9] transition-colors inline-flex items-center gap-2 group text-sm">
                       <span className="w-1.5 h-1.5 rounded-full bg-[#96C7B9] opacity-0 group-hover:opacity-100 transition-opacity" />
                       {link.label}
                    </Link>
                 </li>
               ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Kategoriyalar</h3>
            <ul className="space-y-4">
               {[
                 "Badiiy Adabiyotlar",
                 "Darsliklar va Qo'llanmalar",
                 "Bolalar Adabiyoti",
                 "Psixologiya va Biznes",
                 "Ilmiy Kitoblar"
               ].map((cat, i) => (
                 <li key={i}>
                    <a href="#" className="text-gray-400 hover:text-[#96C7B9] transition-colors text-sm">
                       {cat}
                    </a>
                 </li>
               ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Bog&apos;lanish</h3>
            <ul className="space-y-4">
               <li className="flex items-start gap-4">
                  <div className="mt-1 min-w-[20px] text-[#96C7B9]">
                     <FaMapMarkerAlt />
                  </div>
                  <span className="text-gray-400 text-sm">
                    Termiz shahri, Islom Karimov ko&apos;chasi, 54-uy
                  </span>
               </li>
               <li className="flex items-center gap-4">
                  <div className="text-[#96C7B9]">
                     <FaPhoneAlt />
                  </div>
                  <span className="text-gray-400 text-sm">
                    +998 90 123 45 67
                  </span>
               </li>
               <li className="flex items-center gap-4">
                  <div className="text-[#96C7B9]">
                     <FaEnvelope />
                  </div>
                  <span className="text-gray-400 text-sm">
                    info@kitobdosh.uz
                  </span>
               </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-8 bg-white/5 rounded-xl p-1 flex items-center border border-white/10 focus-within:border-[#96C7B9] transition-colors">
               <input 
                 type="email" 
                 placeholder="Email manzilingiz"
                 className="bg-transparent border-none outline-none text-white px-4 py-2 w-full text-sm placeholder-gray-500"
               />
               <button className="w-10 h-10 bg-[#96C7B9] hover:bg-white text-[#1F2937] rounded-lg flex items-center justify-center transition-colors">
                  <FaArrowRight />
               </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="text-gray-500 text-xs">
             &copy; {currentYear} Kitobdosh. Barcha huquqlar himoyalangan.
           </p>
           <div className="flex gap-6">
              <a href="#" className="text-gray-500 hover:text-white text-xs transition-colors">Maxfiylik siyosati</a>
              <a href="#" className="text-gray-500 hover:text-white text-xs transition-colors">Foydalanish shartlari</a>
           </div>
        </div>

      </div>
    </footer>
  );
}
