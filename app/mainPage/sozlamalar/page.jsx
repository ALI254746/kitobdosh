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

function SettingItem({ icon, title, description, enabled, onToggle }) {
  return (
    <div className="pb-6 border-b border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          {icon}
          <div>
            <p className="font-medium text-gray-900">{title}</p>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
            enabled ? "bg-blue-500" : "bg-gray-300"
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
    <div className="bg-gray-50 py-15 min-h-screen font-sans">
      {/* Header */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Sozlamalar
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Hisobingizni va afzalliklaringizni boshqaring
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <nav className="bg-white rounded-lg shadow-sm p-2 space-y-1">
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
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
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
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    Hisob sozlamalari
                  </h3>
                  <FaInfoCircle className="text-gray-400 cursor-help" />
                </div>

                {/* Profile Picture */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Profil rasmi
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      AK
                    </div>
                    <div className="flex gap-3">
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium flex items-center">
                        <FaUpload className="mr-2" /> Yangi rasm yuklash
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center">
                        <FaTrash className="mr-2" /> O‘chirish
                      </button>
                    </div>
                  </div>
                </div>

                {/* Name, Email, Password */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      To‘liq ism
                    </label>
                    <input
                      type="text"
                      defaultValue="Alisher Karimov"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Elektron pochta
                    </label>
                    <input
                      type="email"
                      defaultValue="alisher.karimov@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parol
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="password"
                        value="••••••••"
                        readOnly
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center">
                        <FaKey className="mr-2" /> Parolni o‘zgartirish
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center shadow-sm">
                    <FaSave className="mr-2" /> O‘zgarishlarni saqlash
                  </button>
                </div>
              </div>
            )}
            {activeTab === "rental" && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">
                  Ijara afzalliklari
                </h3>

                {/* Kutubxona joyi */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Standart kutubxona joyi
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                    <option>Toshkent, Chilonzor filiali</option>
                    <option>Toshkent, Yunusobod filiali</option>
                    <option>Samarqand, Markaz filiali</option>
                    <option>Buxoro, Sharq filiali</option>
                  </select>
                </div>

                {/* Bildirishnoma usullari */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <label className="block text-sm font-medium text-gray-900 mb-4">
                    Bildirishnoma usullari
                  </label>

                  <div className="space-y-4">
                    {/* Email */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FaEnvelope className="text-blue-500" />
                        <span className="text-sm text-gray-700">
                          Email orqali
                        </span>
                      </div>
                      <button
                        onClick={() => setEmailNotif(!emailNotif)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          emailNotif ? "bg-blue-500" : "bg-gray-300"
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
                        <FaSms className="text-blue-500" />
                        <span className="text-sm text-gray-700">
                          SMS orqali
                        </span>
                      </div>
                      <button
                        onClick={() => setSmsNotif(!smsNotif)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          smsNotif ? "bg-blue-500" : "bg-gray-300"
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
                  <label className="block text-sm font-medium text-gray-900 mb-3">
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
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {genre.icon} {genre.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Saqlash tugmasi */}
                <div className="flex justify-end">
                  <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm flex items-center gap-2">
                    <FaSave /> Saqlash
                  </button>
                </div>
              </div>
            )}
            {activeTab === "payment" && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                {/* Sarlavha va tugma */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    To‘lov usullari
                  </h3>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center">
                    <FaPlus className="mr-2" /> Yangi qo‘shish
                  </button>
                </div>

                {/* Kartalar */}
                <div className="space-y-4">
                  {/* Karta 1 */}
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
                          <FaCreditCard className="text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            •••• •••• •••• 4532
                          </p>
                          <p className="text-sm text-gray-500">
                            Amal qilish: 12/25
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          Asosiy
                        </span>
                        <button className="text-gray-400 hover:text-red-500 transition-colors">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Karta 2 */}
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-8 bg-gradient-to-r from-purple-600 to-purple-400 rounded flex items-center justify-center">
                          <FaCreditCard className="text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            •••• •••• •••• 8721
                          </p>
                          <p className="text-sm text-gray-500">
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
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                    Tranzaksiya tarixi
                  </h3>

                  {/* Har bir tranzaksiya uchun ro‘yxat */}
                  <div className="space-y-3">
                    {transactions.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <FaCheck className="text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm sm:text-base">
                              {item.title}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              {item.date}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-gray-900 text-sm sm:text-base">
                          {item.amount}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Barchasini ko‘rish tugmasi */}
                  <button className="w-full mt-4 px-4 py-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2">
                    Barchasini ko‘rish <FaArrowRight />
                  </button>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                    Avtomatik yangilash
                  </h3>

                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    {/* Chap tomondagi matn va icon */}
                    <div className="flex items-center space-x-3">
                      <FaSyncAlt className="text-blue-500 text-xl" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Obunani avtomatik yangilash
                        </p>
                        <p className="text-sm text-gray-600">
                          Har oyda avtomatik to‘lov
                        </p>
                      </div>
                    </div>

                    {/* Toggle tugmasi */}
                    <button
                      onClick={() => setAutoRenewal(!autoRenewal)}
                      className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                        autoRenewal ? "bg-blue-500" : "bg-gray-300"
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
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 ">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">
                    Bildirishnoma sozlamalari
                  </h3>

                  <div className="space-y-6">
                    {/* Muddat eslatmalari */}
                    <SettingItem
                      icon={
                        <FaCalendarCheck className="text-blue-500 text-xl" />
                      }
                      title="Muddat eslatmalari"
                      description="Kitob qaytarish muddati yaqinlashganda xabar berish"
                      enabled={dueDateReminders}
                      onToggle={() => setDueDateReminders(!dueDateReminders)}
                    />

                    {/* Aksiyalar va chegirmalar */}
                    <SettingItem
                      icon={<FaTag className="text-blue-500 text-xl" />}
                      title="Aksiyalar va chegirmalar"
                      description="Maxsus takliflar haqida xabardor bo‘lish"
                      enabled={promotions}
                      onToggle={() => setPromotions(!promotions)}
                    />

                    {/* Yangi kitoblar */}
                    <SettingItem
                      icon={<FaBook className="text-blue-500 text-xl" />}
                      title="Yangi kitoblar"
                      description="Sevimli janrlaringizda yangi kitoblar qo‘shilganda"
                      enabled={newBooks}
                      onToggle={() => setNewBooks(!newBooks)}
                    />

                    {/* Tavsiyalar */}
                    <SettingItem
                      icon={<FaStar className="text-blue-500 text-xl" />}
                      title="Tavsiyalar"
                      description="Sizga mos kitoblar tavsiya qilish"
                      enabled={recommendations}
                      onToggle={() => setRecommendations(!recommendations)}
                    />

                    {/* Haftalik xabarlar */}
                    <SettingItem
                      icon={
                        <FaEnvelopeOpenText className="text-blue-500 text-xl" />
                      }
                      title="Haftalik xabarlar"
                      description="Haftalik yangiliklar va tavsiyalar"
                      enabled={newsletter}
                      onToggle={() => setNewsletter(!newsletter)}
                    />
                  </div>

                  {/* Saqlash tugmasi */}
                  <div className="flex justify-end mt-6">
                    <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm flex items-center">
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
