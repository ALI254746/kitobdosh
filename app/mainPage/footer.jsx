import React from "react";
import { FaFacebookF, FaInstagram, FaTelegram } from "react-icons/fa";
function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-800 to-cyan-700 text-white py-16 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo va mission */}
          <div>
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="w-6 h-6 text-white"
                fill="currentColor"
              >
                <path d="M96 0C43 0 0 43 0 96V416c0 53 43 96 96 96H384h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V384c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H384 96zm0 384H352v64H96c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16zm16 48H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
              </svg>
              <span>Feruza Book</span>
            </div>
            <p className="text-blue-100">
              Bilimni har kim uchun qulay va arzon qilish
            </p>
          </div>

          {/* Sahifalar */}
          <div>
            <h4 className="font-semibold mb-4">Sahifalar</h4>
            <ul className="space-y-2 text-blue-100">
              {["Bosh sahifa", "Ijara", "Sotib olish", "Biz haqimizda"].map(
                (item, i) => (
                  <li key={i}>
                    <a href="#" className="hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Yordam */}
          <div>
            <h4 className="font-semibold mb-4">Yordam</h4>
            <ul className="space-y-2 text-blue-100">
              {["Bog'lanish", "Savol-javob", "Yetkazish", "Qaytarish"].map(
                (item, i) => (
                  <li key={i}>
                    <a href="#" className="hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Ijtimoiy tarmoqlar */}
          <div className="container mx-auto max-w-6xl">
            <h4 className="font-semibold mb-4">Ijtimoiy tarmoqlar</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <FaFacebookF className="text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <FaInstagram className="text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <FaTelegram className="text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 pt-8 text-center text-blue-100">
          <p>© 2025 Feruza Book. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
