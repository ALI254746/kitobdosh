"use client";

import { usePathname } from "next/navigation";
import { FaBars, FaBell } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";

export default function TopNavbar({ mobileMenuOpen, setMobileMenuOpen }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const popoverRef = useRef(null);

  // Tashqariga bosilganda popoverni yopish
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, text: "Yangi buyurtma keldi", time: "2 daqiqa oldin" },
    { id: 2, text: "Kitob yetkazib berildi", time: "1 soat oldin" },
    { id: 3, text: "Yangi mijoz qo'shildi", time: "3 soat oldin" },
  ];
  const titles = {
    "/KurierPanel/buyurtmalar": "Buyurtmalar",
    "/KurierPanel/faolTopshiriqlar": "Faol topshiriqlar",
    "/admin/completed": "Yakunlanganlar",
    "/KurierPanel/kitobniQaytarish": "Kitobni qaytarish",
    "/KurierPanel/profile": "Profil",
  };

  const title = titles[pathname] || "Kurier panel";

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-white shadow flex items-center justify-between px-6 z-40">
      {/* Menu bar chap tomonga chiqarildi */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="lg:hidden text-gray-600"
      >
        <FaBars className="text-xl" />
      </button>

      <h1 className="text-lg text-black font-extrabold">{title}</h1>

      <div className="relative" ref={popoverRef}>
        {/* Bell Button */}
        <button
          onClick={() => setOpen(!open)}
          className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FaBell className="text-2xl" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </button>

        {/* Popover */}
        {open && (
          <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg z-50 animate-fade-in">
            <h4 className="font-semibold text-gray-800 px-4 py-2 border-b border-gray-100">
              Xabarlar
            </h4>
            <div className="flex flex-col max-h-64 overflow-y-auto">
              {notifications.map((note) => (
                <div
                  key={note.id}
                  className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <p className="text-gray-700 text-sm">{note.text}</p>
                  <span className="text-gray-400 text-xs">{note.time}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-full text-center py-2 text-blue-600 font-medium hover:bg-gray-50 border-t border-gray-100 transition-colors rounded-b-xl"
            >
              Barchasini o‘qildi deb belgilash
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
