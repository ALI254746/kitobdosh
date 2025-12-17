"use client";
import React from "react";
import {
  FaSearch,
  FaFilter,
  FaDownload,
  FaUser,
  FaIdCard,
  FaPhone,
  FaClock,
  FaEye,
  FaReply,
  FaToggleOn,
  FaToggleOff,
  FaTrash,
  FaLightbulb,
  FaExclamationCircle,
  FaComment,
} from "react-icons/fa";

const messages = [
  {
    id: 1,
    name: "Alisher Karimov",
    phone: "+998 90 123 45 67",
    userId: "#12345",
    date: "2024-01-15, 14:30",
    status: "O'qilmagan",
    type: "Talab / Taklif",
    active: true,
    title: "Yangi funksiya qo'shish taklifi",
    text: "Assalomu alaykum! Tizimga yangi funksiya qo'shish bo'yicha taklifim bor. Foydalanuvchilar uchun statistika bo'limini qo'shsak yaxshi bo'lardi...",
    icon: <FaLightbulb className="text-yellow-600 text-2xl" />,
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    id: 2,
    name: "Dilshod Rahimov",
    phone: "+998 91 234 56 78",
    userId: "#12346",
    date: "2024-01-15, 10:15",
    status: "O'qilgan",
    type: "Muammo / Shikoyat",
    active: true,
    title: "Tizimda xatolik mavjud",
    text: "Salom! Tizimga kirganimda xatolik yuz berdi. Sahifa to'g'ri yuklanmayapti va ma'lumotlar ko'rinmayapti. Iltimos, tekshirib ko'ring...",
    icon: <FaExclamationCircle className="text-red-600 text-2xl" />,
    bg: "bg-white",
    border: "border-gray-200",
  },
  {
    id: 3,
    name: "Nodira Toshmatova",
    phone: "+998 93 345 67 89",
    userId: "#12347",
    date: "2024-01-14, 16:45",
    status: "O'qilmagan",
    type: "Xabar / Umumiy",
    active: true,
    title: "Umumiy savol",
    text: "Assalomu alaykum! Tizimdan qanday foydalanish kerakligi haqida batafsil ma'lumot olsam bo'ladimi? Yangi foydalanuvchiman...",
    icon: <FaComment className="text-blue-600 text-2xl" />,
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
];

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-100 p-6">
      {/* Qidiruv va filtr */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Ism, telefon yoki xabar matni bo'yicha qidirish..."
              className="w-full pl-12 pr-4 py-3 rounded-lg outline-none border border-gray-700 bg-white text-black font-extrabold focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
            <FaFilter className="mr-2" /> Filtr
          </button>
          <button className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg font-medium hover:bg-gray-600 transition">
            <FaDownload className="mr-2" /> Eksport
          </button>
        </div>
      </div>

      {/* Tablar */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
          <FaLightbulb className="mr-2" /> Barchasi (24)
        </button>
        <button className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-600 transition">
          <FaLightbulb className="mr-2" /> Talab / Taklif (8)
        </button>
        <button className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-600 transition">
          <FaExclamationCircle className="mr-2" /> Muammo / Shikoyat (10)
        </button>
        <button className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-600 transition">
          <FaComment className="mr-2" /> Xabar / Umumiy (6)
        </button>
      </div>

      {/* Xabarlar */}
      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`border ${msg.border} rounded-xl p-4 sm:p-5 ${msg.bg} hover:shadow-lg transition`}
          >
            <div className="flex flex-col lg:flex-row lg:items-start gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-700">
                  {msg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                      {msg.status}
                    </span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                      {msg.type}
                    </span>
                    {msg.active && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        <FaToggleOn className="mr-1 inline" /> Faol
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-black text-lg mb-2">
                    {msg.title}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-black text-sm">
                    <p>
                      <FaUser className="mr-2 text-blue-400 inline" />{" "}
                      {msg.name}
                    </p>
                    <p>
                      <FaIdCard className="mr-2 text-blue-400 inline" />{" "}
                      {msg.userId}
                    </p>
                    <p>
                      <FaPhone className="mr-2 text-blue-400 inline" />{" "}
                      {msg.phone}
                    </p>
                    <p>
                      <FaClock className="mr-2 text-blue-400 inline" />{" "}
                      {msg.date}
                    </p>
                  </div>
                  <p className="text-black text-sm line-clamp-2">{msg.text}</p>
                </div>
              </div>
              <div className="flex flex-wrap lg:flex-col gap-2 lg:w-40">
                <button className="flex-1 lg:w-full px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition font-medium">
                  <FaReply className="mr-2 inline" /> Javob
                </button>

                <button className="flex-1 lg:w-full px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition font-medium">
                  <FaTrash className="mr-2 inline" /> O'chirish
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
