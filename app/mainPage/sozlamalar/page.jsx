"use client";
import React, { useState } from "react";
import {
  FaBookOpen,
  FaTimes,
  FaUser,
  FaBook,
  FaCreditCard,
  FaBell,
  FaInfoCircle,
  FaUpload,
  FaTrash,
  FaKey,
  FaSave,
  FaEnvelope,
  FaSms,
  FaFlask,
  FaLandmark,
  FaBriefcase,
  FaChild,
  FaFeather,
  FaPlus,
  FaSyncAlt,
  FaCheck,
  FaTag,
  FaStar,
  FaArrowRight,
  FaCalendarCheck,
  FaEnvelopeOpenText,
} from "react-icons/fa";

import { useMain } from "../MainContext";

function SettingItem({ icon, title, description, enabled, onToggle, darkMode }) {
  return (
    <div className="pb-6 border-b border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          {icon}
          <div>
            <p className={`font-medium ${darkMode ? "text-white" : "text-[#2d4a42]"}`}>{title}</p>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-[#4a7a6d]"}`}>{description}</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
            enabled ? "bg-[#96C7B9]" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-md transition-transform ${
              enabled ? "translate-x-6" : "translate-x-1"
            }`}
          ></span>
        </button>
      </div>
    </div>
  );
}
export default function SettingsPage() {
  const { darkMode } = useMain();
  const [activeTab, setActiveTab] = useState("account");
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [genres, setGenres] = useState(["fiction"]);
  const [autoRenewal, setAutoRenewal] = useState(true);
  const [dueDateReminders, setDueDateReminders] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [newBooks, setNewBooks] = useState(true);
  const [recommendations, setRecommendations] = useState(true);
  const [newsletter, setNewsletter] = useState(true);
  const transactions = [
    {
      id: 1,
      title: "Oylik obuna to‘lovi",
      date: "15 Dekabr 2024",
      amount: "50,000 so‘m",
    },
    {
      id: 2,
      title: `Kitob ijarasi - "O‘tkan kunlar"`,
      date: "8 Dekabr 2024",
      amount: "15,000 so‘m",
    },
    {
      id: 3,
      title: "Oylik obuna to‘lovi",
      date: "15 Noyabr 2024",
      amount: "50,000 so‘m",
    },
  ];
  const toggleGenre = (genre) => {
    setGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  return (
    <div className={`py-15 min-h-screen font-sans transition-colors duration-300 ${darkMode ? "bg-slate-900" : "bg-gray-50"}`}>
      {/* Header */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-[#2d4a42]"}`}>
            Sozlamalar
          </h2>
          <p className={`text-sm sm:text-base ${darkMode ? "text-gray-400" : "text-[#4a7a6d]"}`}>
            Hisobingizni va afzalliklaringizni boshqaring
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <nav className={`rounded-lg shadow-sm p-2 space-y-1 ${darkMode ? "bg-slate-800" : "bg-white"}`}>
              {[
                { id: "account", icon: <FaUser />, name: "Hisob" },
                { id: "rental", icon: <FaBook />, name: "Ijara" },
                { id: "payment", icon: <FaCreditCard />, name: "To‘lov" },
                {
                  id: "notifications",
                  icon: <FaBell />,
                  name: "Bildirishnomalar",
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? (darkMode ? "bg-blue-600 text-white" : "bg-[#D1F0E0] text-[#96C7B9]")
                      : (darkMode ? "text-gray-400 hover:bg-slate-700 hover:text-white" : "text-[#4a7a6d] hover:bg-[#F8FDFA]")
                  }`}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Account Settings */}
            {activeTab === "account" && (
              <div className={`rounded-lg shadow-sm p-4 sm:p-6 ${darkMode ? "bg-slate-800" : "bg-white"}`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-lg sm:text-xl font-bold ${darkMode ? "text-white" : "text-[#2d4a42]"}`}>
                    Hisob sozlamalari
                  </h3>
                  <FaInfoCircle className="text-gray-400 cursor-help" />
                </div>

                {/* Profile Picture */}
                <div className={`mb-6 pb-6 border-b ${darkMode ? "border-slate-700" : "border-gray-200"}`}>
                  <label className={`block text-sm font-medium mb-3 ${darkMode ? "text-gray-400" : "text-[#4a7a6d]"}`}>
                    Profil rasmi
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#96C7B9] to-[#86b5a8] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      AK
                    </div>
                      <div className="flex gap-3">
                        <button className={`px-4 py-2 text-white rounded-lg text-sm font-medium flex items-center shadow-md ${darkMode ? "bg-blue-600 hover:bg-blue-500" : "bg-[#96C7B9] hover:bg-[#86b5a8]"}`}>
                          <FaUpload className="mr-2" /> Yangi rasm yuklash
                        </button>
                        <button className={`px-4 py-2 border rounded-lg text-sm font-medium flex items-center ${darkMode ? "border-slate-600 text-gray-400 hover:bg-slate-700" : "border-gray-300 text-[#4a7a6d] hover:bg-gray-50"}`}>
                          <FaTrash className="mr-2" /> O‘chirish
                        </button>
                      </div>
                  </div>
                </div>

                {/* Name, Email, Password */}
                <div className="space-y-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-400" : "text-[#4a7a6d]"}`}>
                      To‘liq ism
                    </label>
                    <input
                      type="text"
                      defaultValue="Alisher Karimov"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#96C7B9] outline-none ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300"}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-400" : "text-[#4a7a6d]"}`}>
                      Elektron pochta
                    </label>
                    <input
                      type="email"
                      defaultValue="alisher.karimov@example.com"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#96C7B9] outline-none ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300"}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-400" : "text-[#4a7a6d]"}`}>
                      Parol
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="password"
                        value="••••••••"
                        readOnly
                        className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#96C7B9] outline-none ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300"}`}
                      />
                      <button className={`px-4 py-3 rounded-lg flex items-center ${darkMode ? "bg-slate-700 text-gray-300 hover:bg-slate-600" : "bg-gray-100 text-[#4a7a6d] hover:bg-gray-200"}`}>
                        <FaKey className="mr-2" /> Parolni o‘zgartirish
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button className={`px-6 py-3 text-white rounded-lg flex items-center shadow-md transition-colors ${darkMode ? "bg-blue-600 hover:bg-blue-500" : "bg-[#96C7B9] hover:bg-[#86b5a8]"}`}>
                    <FaSave className="mr-2" /> O‘zgarishlarni saqlash
                  </button>
                </div>
              </div>
            )}
            {activeTab === "rental" && (
              <div className={`rounded-lg shadow-sm p-4 sm:p-6 ${darkMode ? "bg-slate-800" : "bg-white"}`}>
                <h3 className={`text-lg sm:text-xl font-bold mb-6 ${darkMode ? "text-white" : "text-[#2d4a42]"}`}>
                  Ijara afzalliklari
                </h3>

                {/* Kutubxona joyi */}
                <div className={`mb-6 pb-6 border-b ${darkMode ? "border-slate-700" : "border-gray-200"}`}>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-400" : "text-[#4a7a6d]"}`}>
                    Standart kutubxona joyi
                  </label>
                  <select className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#96C7B9] focus:border-transparent transition-all outline-none ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300"}`}>
                    <option>Toshkent, Chilonzor filiali</option>
                    <option>Toshkent, Yunusobod filiali</option>
                    <option>Samarqand, Markaz filiali</option>
                    <option>Buxoro, Sharq filiali</option>
                  </select>
                </div>

                {/* Bildirishnoma usullari */}
                <div className={`mb-6 pb-6 border-b ${darkMode ? "border-slate-700" : "border-gray-200"}`}>
                  <label className={`block text-sm font-medium mb-4 ${darkMode ? "text-white" : "text-[#2d4a42]"}`}>
                    Bildirishnoma usullari
                  </label>

                  <div className="space-y-4">
                    {/* Email */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FaEnvelope className="text-[#96C7B9]" />
                        <span className={`text-sm ${darkMode ? "text-gray-400" : "text-[#4a7a6d]"}`}>
                          Email orqali
                        </span>
                      </div>
                      <button
                        onClick={() => setEmailNotif(!emailNotif)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          emailNotif ? "bg-[#96C7B9]" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-md transition-transform ${
                            emailNotif ? "translate-x-6" : "translate-x-1"
                          }`}
                        ></span>
                      </button>
                    </div>

                    {/* SMS */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FaSms className="text-[#96C7B9]" />
                        <span className={`text-sm ${darkMode ? "text-gray-400" : "text-[#4a7a6d]"}`}>
                          SMS orqali
                        </span>
                      </div>
                      <button
                        onClick={() => setSmsNotif(!smsNotif)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          smsNotif ? "bg-[#96C7B9]" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-md transition-transform ${
                            smsNotif ? "translate-x-6" : "translate-x-1"
                          }`}
                        ></span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sevimli janrlar */}
                <div className="mb-6">
                  <label className={`block text-sm font-medium mb-3 ${darkMode ? "text-white" : "text-[#2d4a42]"}`}>
                    Sevimli janrlar
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { id: "fiction", icon: <FaBookOpen />, name: "Badiiy" },
                      { id: "science", icon: <FaFlask />, name: "Ilmiy" },
                      { id: "history", icon: <FaLandmark />, name: "Tarix" },
                      { id: "business", icon: <FaBriefcase />, name: "Biznes" },
                      { id: "children", icon: <FaChild />, name: "Bolalar" },
                      { id: "poetry", icon: <FaFeather />, name: "She’riyat" },
                    ].map((genre) => (
                      <button
                        key={genre.id}
                        onClick={() => toggleGenre(genre.id)}
                        className={`px-4 py-2 rounded-lg hover:shadow-md transition-all text-sm font-medium flex items-center justify-center gap-2 ${
                          genres.includes(genre.id)
                            ? (darkMode ? "bg-blue-600 text-white shadow-md" : "bg-[#96C7B9] text-white shadow-md")
                            : (darkMode ? "bg-slate-700 text-gray-400" : "bg-gray-100 text-[#4a7a6d]")
                        }`}
                      >
                        {genre.icon} {genre.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Saqlash tugmasi */}
                <div className="flex justify-end">
                  <button className={`px-6 py-3 text-white rounded-lg hover:bg-[#86b5a8] transition-colors font-medium shadow-md flex items-center gap-2 ${darkMode ? "bg-blue-600 hover:bg-blue-500" : "bg-[#96C7B9] hover:bg-[#86b5a8]"}`}>
                    <FaSave /> Saqlash
                  </button>
                </div>
              </div>
            )}
            {activeTab === "payment" && (
              <div className={`rounded-lg shadow-sm p-4 sm:p-6 ${darkMode ? "bg-slate-800" : "bg-white"}`}>
                {/* Sarlavha va tugma */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-lg sm:text-xl font-bold ${darkMode ? "text-white" : "text-[#2d4a42]"}`}>
                    To‘lov usullari
                  </h3>
                  <button className={`px-4 py-2 text-white rounded-lg transition-colors text-sm font-medium flex items-center shadow-md ${darkMode ? "bg-blue-600 hover:bg-blue-500" : "bg-[#96C7B9] hover:bg-[#86b5a8]"}`}>
                    <FaPlus className="mr-2" /> Yangi qo‘shish
                  </button>
                </div>

                {/* Kartalar */}
                <div className="space-y-4">
                  {/* Karta 1 */}
                  <div className={`border rounded-lg p-4 transition-colors ${darkMode ? "border-slate-700 hover:border-blue-500" : "border-gray-200 hover:border-[#96C7B9]"}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-8 bg-gradient-to-r from-[#96C7B9] to-[#86b5a8] rounded flex items-center justify-center">
                          <FaCreditCard className="text-white" />
                        </div>
                        <div>
                          <p className={`font-medium ${darkMode ? "text-white" : "text-[#2d4a42]"}`}>
                            •••• •••• •••• 4532
                          </p>
                          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-[#6EA092]"}`}>
                            Amal qilish: 12/25
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-[#D1F0E0] text-[#96C7B9] text-xs font-medium rounded-full">
                          Asosiy
                        </span>
                        <button className="text-gray-400 hover:text-red-500 transition-colors">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Karta 2 */}
                  <div className={`border rounded-lg p-4 transition-colors ${darkMode ? "border-slate-700 hover:border-blue-500" : "border-gray-200 hover:border-[#96C7B9]"}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-8 bg-gradient-to-r from-purple-600 to-purple-400 rounded flex items-center justify-center">
                          <FaCreditCard className="text-white" />
                        </div>
                        <div>
                          <p className={`font-medium ${darkMode ? "text-white" : "text-[#2d4a42]"}`}>
                            •••• •••• •••• 8721
                          </p>
                          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-[#6EA092]"}`}>
                            Amal qilish: 08/26
                          </p>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-red-500 transition-colors">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
                <div className={`rounded-lg shadow-sm p-4 sm:p-6 mt-6 ${darkMode ? "bg-slate-800" : "bg-white"}`}>
                  <h3 className={`text-lg sm:text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-[#2d4a42]"}`}>
                    Tranzaksiya tarixi
                  </h3>

                  {/* Har bir tranzaksiya uchun ro‘yxat */}
                  <div className="space-y-3">
                    {transactions.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between p-3 border-b transition-colors ${darkMode ? "border-slate-700 hover:bg-slate-700" : "border-gray-100 hover:bg-gray-50"}`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? "bg-slate-700 text-[#96C7B9]" : "bg-[#D1F0E0] text-[#96C7B9]"}`}>
                            <FaCheck />
                          </div>
                          <div>
                            <p className={`font-medium text-sm sm:text-base ${darkMode ? "text-white" : "text-[#2d4a42]"}`}>
                              {item.title}
                            </p>
                            <p className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-[#6EA092]"}`}>
                              {item.date}
                            </p>
                          </div>
                        </div>
                        <span className={`font-bold text-sm sm:text-base ${darkMode ? "text-white" : "text-[#2d4a42]"}`}>
                          {item.amount}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Barchasini ko‘rish tugmasi */}
                  <button className={`w-full mt-4 px-4 py-2 rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2 ${darkMode ? "text-blue-400 hover:bg-slate-700" : "text-[#96C7B9] hover:bg-[#D1F0E0]"}`}>
                    Barchasini ko‘rish <FaArrowRight />
                  </button>
                </div>
                <div className={`rounded-lg shadow-sm p-4 sm:p-6 mt-6 ${darkMode ? "bg-slate-800" : "bg-white"}`}>
                  <h3 className={`text-lg sm:text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-[#2d4a42]"}`}>
                    Avtomatik yangilash
                  </h3>

                  <div className={`flex items-center justify-between p-4 rounded-lg ${darkMode ? "bg-slate-700" : "bg-[#D1F0E0]"}`}>
                    {/* Chap tomondagi matn va icon */}
                    <div className="flex items-center space-x-3">
                      <FaSyncAlt className={`text-xl ${darkMode ? "text-blue-400" : "text-[#96C7B9]"}`} />
                      <div>
                        <p className={`font-medium ${darkMode ? "text-white" : "text-[#2d4a42]"}`}>
                          Obunani avtomatik yangilash
                        </p>
                        <p className={`text-sm ${darkMode ? "text-gray-300" : "text-[#4a7a6d]"}`}>
                          Har oyda avtomatik to‘lov
                        </p>
                      </div>
                    </div>

                    {/* Toggle tugmasi */}
                    <button
                      onClick={() => setAutoRenewal(!autoRenewal)}
                      className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                        autoRenewal ? (darkMode ? "bg-blue-600" : "bg-[#96C7B9]") : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-[4px] left-[4px] w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                          autoRenewal ? "translate-x-7" : "translate-x-1"
                        }`}
                      ></span>
                    </button>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "notifications" && (
              <>
                <div className={`rounded-lg shadow-sm p-4 sm:p-6 ${darkMode ? "bg-slate-800" : "bg-white"}`}>
                  <h3 className={`text-lg sm:text-xl font-bold mb-6 ${darkMode ? "text-white" : "text-[#2d4a42]"}`}>
                    Bildirishnoma sozlamalari
                  </h3>

                  <div className="space-y-6">
                    {/* Muddat eslatmalari */}
                    <SettingItem
                      icon={
                        <FaCalendarCheck className="text-[#96C7B9] text-xl" />
                      }
                      title="Muddat eslatmalari"
                      description="Kitob qaytarish muddati yaqinlashganda xabar berish"
                      enabled={dueDateReminders}
                      onToggle={() => setDueDateReminders(!dueDateReminders)}
                      darkMode={darkMode}
                    />

                    {/* Aksiyalar va chegirmalar */}
                    <SettingItem
                      icon={<FaTag className="text-[#96C7B9] text-xl" />}
                      title="Aksiyalar va chegirmalar"
                      description="Maxsus takliflar haqida xabardor bo‘lish"
                      enabled={promotions}
                      onToggle={() => setPromotions(!promotions)}
                      darkMode={darkMode}
                    />

                    {/* Yangi kitoblar */}
                    <SettingItem
                      icon={<FaBook className="text-[#96C7B9] text-xl" />}
                      title="Yangi kitoblar"
                      description="Sevimli janrlaringizda yangi kitoblar qo‘shilganda"
                      enabled={newBooks}
                      onToggle={() => setNewBooks(!newBooks)}
                      darkMode={darkMode}
                    />

                    {/* Tavsiyalar */}
                    <SettingItem
                      icon={<FaStar className="text-[#96C7B9] text-xl" />}
                      title="Tavsiyalar"
                      description="Sizga mos kitoblar tavsiya qilish"
                      enabled={recommendations}
                      onToggle={() => setRecommendations(!recommendations)}
                      darkMode={darkMode}
                    />

                    {/* Haftalik xabarlar */}
                    <SettingItem
                      icon={
                        <FaEnvelopeOpenText className="text-[#96C7B9] text-xl" />
                      }
                      title="Haftalik xabarlar"
                      description="Haftalik yangiliklar va tavsiyalar"
                      enabled={newsletter}
                      onToggle={() => setNewsletter(!newsletter)}
                      darkMode={darkMode}
                    />
                  </div>

                  {/* Saqlash tugmasi */}
                  <div className="flex justify-end mt-6">
                    <button className={`px-6 py-3 text-white rounded-lg transition-colors font-medium shadow-md flex items-center ${darkMode ? "bg-blue-600 hover:bg-blue-500" : "bg-[#96C7B9] hover:bg-[#86b5a8]"}`}>
                      <FaSave className="mr-2" /> Saqlash
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Boshqa tablar (Ijara, To‘lov, Bildirishnoma) ham xuddi shunday davom etadi */}
          </div>
        </div>
      </main>
    </div>
  );
}
