"use client";
import React, { useState } from "react";
import {
  FaBook,
  FaShoppingBag,
  FaTruck,
  FaCog,
  FaBell,
  FaEdit,
  FaSignOutAlt,
  FaClock,
  FaUndo,
} from "react-icons/fa";
import {
  FaPhone,
  FaMapMarkerAlt,
  FaMap,
  FaHome,
  FaDownload,
  FaCheck,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { FaStar, FaGift, FaCheckDouble } from "react-icons/fa";
const rentalsData = [
  {
    id: 1,
    title: "Al-Kimyogar",
    author: "Paulo Coelho",
    dailyPayment: "5,000 so'm",
    duration: "15 kun",
    remaining: "3 kun",
    progress: 80,
    status: "Faol",
    img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    dailyPayment: "4,500 so'm",
    duration: "10 kun",
    remaining: "7 kun",
    progress: 30,
    status: "Faol",
    img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Ikki shahar qissasi",
    author: "Charles Dickens",
    dailyPayment: "6,000 so'm",
    duration: "20 kun",
    remaining: "0 kun",
    progress: 100,
    status: "Muddati o'tgan",
    img: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop",
  },
];
const initialNotifications = [
  {
    id: 1,
    title: "Ijara muddati tugayapti",
    description: `"Al-Kimyogar" kitobining ijara muddati ertaga tugaydi. Iltimos, kitobni qaytaring yoki muddatni uzaytiring.`,
    time: "2 soat oldin",
    icon: <FaClock />,
    bg: "bg-blue-50",
    border: "border-blue-600",
  },
  {
    id: 2,
    title: "To'lov muvaffaqiyatli amalga oshirildi",
    description: `Payme orqali 55,000 so'mlik to'lovingiz qabul qilindi. Buyurtma raqami: #12345`,
    time: "5 soat oldin",
    icon: <FaCheck />,
    bg: "bg-green-50",
    border: "border-green-600",
  },
  {
    id: 3,
    title: "Kuryer yo'lga chiqdi",
    description: `"Fikrlash, tez va sekin" kitobingiz yetkazib berilmoqda. Taxminiy yetib borish vaqti: 2 soat.`,
    time: "1 kun oldin",
    icon: <FaTruck className="text-red-500" />,
    bg: "bg-green-50",
    border: "border-red-600",
  },
  {
    id: 4,
    title: "Yangi kitoblar qo'shildi",
    description:
      "Sizning sevimli janringizda 15 ta yangi kitob mavjud. Hoziroq ko'rib chiqing!",
    time: "2 kun oldin",
    icon: <FaStar className="text-amber-500" />,
    bg: "bg-gray-50",
    border: "border-black",
  },
  {
    id: 5,
    title: "Maxsus chegirma!",
    description:
      "Keyingi xaridingizda 20% chegirma olish imkoniyati. Promo kod: BOOK20",
    time: "3 kun oldin",
    icon: <FaGift />,
    bg: "bg-gray-50",
    border: "border-blue-300",
  },
];
const tabs = [
  { id: "rentals", label: "Mening ijaralarim", icon: <FaBook /> },
  { id: "purchases", label: "Xaridlar tarixi", icon: <FaShoppingBag /> },
  { id: "deliveries", label: "Yetkazib berish", icon: <FaTruck /> },

  { id: "notifications", label: "Bildirishnomalar", icon: <FaBell /> },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("rentals");
  const [notifications, setNotifications] = useState(initialNotifications);
  const [read, setRead] = useState([]);

  const markAllRead = () => {
    setRead(notifications.map((n) => n.id));
  };
  const cards = [
    {
      title: "Fikrlash, tez va sekin",
      location: "Toshkent shahar kutubxonasi",
      status: "Yo'lda",
      steps: [
        {
          label: "Buyurtma qabul qilindi",
          time: "20 Fevral, 10:30",
          color: "green",
        },
        {
          label: "Yetkazib berilmoqda",
          time: "Taxminiy: 2 soat",
          color: "blue",
        },
        { label: "Yetkazildi", time: "Kutilmoqda", color: "gray" },
      ],
      actions: [
        {
          label: "Kuryer bilan bog'lanish",
          icon: "fas fa-phone",
          gradient: true,
        },
        { label: "Xaritada ko'rish", icon: "fas fa-map" },
      ],
    },
    {
      title: "Atom odatlari",
      location: "Chilonzor kutubxonasi",
      status: "Yetkazildi",
      steps: [
        {
          label: "Buyurtma qabul qilindi",
          time: "15 Fevral, 09:00",
          color: "green",
        },
        { label: "Yetkazib berildi", time: "15 Fevral, 14:30", color: "green" },
        { label: "Qabul qilindi", time: "15 Fevral, 14:45", color: "green" },
      ],
      actions: [
        { label: "Baholash", icon: "fas fa-star", gradient: true },
        { label: "Kvitansiya", icon: "fas fa-download" },
      ],
    },
    {
      title: "3-tab kitob",
      location: "Yunusobod kutubxonasi",
      status: "Kutilmoqda",
      steps: [
        {
          label: "Buyurtma qabul qilindi",
          time: "25 Fevral, 12:00",
          color: "green",
        },
        {
          label: "Yetkazib berilmoqda",
          time: "Taxminiy: 3 soat",
          color: "blue",
        },
        { label: "Yetkazildi", time: "Kutilmoqda", color: "gray" },
      ],
      actions: [
        {
          label: "Kuryer bilan bog'lanish",
          icon: "fas fa-phone",
          gradient: true,
        },
        { label: "Xaritada ko'rish", icon: "fas fa-map" },
      ],
    },
  ];

  return (
    // ---------------- Whole Page Background ----------------
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-200 pt-20 pb-20">
      <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ---------------- Profile Header ---------------- */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-300 to-black rounded-3xl p-6 sm:p-8 lg:p-12 shadow-black mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 bg-black/20 rounded-full -ml-24 -mb-24"></div>

          <div className="relative flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-8">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-white to-blue-100 flex items-center justify-center text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-600 shadow-blue">
                HM
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-blue opacity-0 group-hover:opacity-100 transition-opacity">
                <i className="fas fa-camera text-blue-600 text-xs sm:text-sm"></i>
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 text-shadow-black">
                Hojiakbar Mamanosirov
              </h1>
              <p className="text-blue-100 mb-1 text-sm sm:text-base">
                <i className="far fa-envelope mr-2"></i>hojiakbar@gmail.com
              </p>
              <p className="text-blue-200 text-xs sm:text-sm">
                <i className="far fa-calendar mr-2"></i>A&apos;zo bo&apos;lgan sana:
                Fevral 2025
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 mt-4 sm:mt-6">
                <button className="px-4 sm:px-6 py-2 sm:py-2.5 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-blue text-sm sm:text-base flex items-center">
                  <FaEdit className="mr-2" /> Profilni tahrirlash
                </button>
                <button className="px-4 sm:px-6 py-2 sm:py-2.5 bg-black/30 text-white rounded-xl font-semibold hover:bg-black/40 transition-all backdrop-blur-sm text-sm sm:text-base flex items-center">
                  <FaSignOutAlt className="mr-2" /> Chiqish
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full sm:w-auto">
              <StatCard value="3" label="Faol ijaralar" />
              <StatCard value="12" label="Xaridlar" />
              <StatCard value="4.8" label="Reyting" />
            </div>
          </div>
        </div>

        {/* ---------------- Tabs (pastga tushurilgan) ---------------- */}
        <div className="bg-white rounded-2xl shadow-blue mb-6 sm:mb-8 overflow-x-auto relative -mt-6 z-10">
          <div className="flex items-center min-w-max sm:min-w-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 font-semibold transition-all rounded-2xl m-2 text-sm sm:text-base whitespace-nowrap flex items-center justify-center ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-600 to-black text-white shadow-blue"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ---------------- Tab Contents ---------------- */}
        <div className="space-y-4 sm:space-y-6">
          {activeTab === "rentals" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {rentalsData.map((rental) => (
                <RentalCard key={rental.id} rental={rental} />
              ))}
            </div>
          )}
          {/* // ------------------- Xaridlar Tab Content ------------------- */}
          {activeTab === "purchases" && (
            <div className="bg-white rounded-2xl shadow-blue p-4 sm:p-6 lg:p-8">
              {/* Header: Title + Total Amount */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Xaridlar tarixi
                </h2>
                <div className="bg-gradient-to-r from-blue-600 to-black text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-blue">
                  <span className="text-xs sm:text-sm font-medium">
                    Jami sarflangan:
                  </span>
                  <span className="text-lg sm:text-xl font-bold ml-2">
                    120,000 so&apos;m
                  </span>
                </div>
              </div>

              {/* Purchase Items */}
              <div className="space-y-4">
                {/* Purchase Item 1 */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border-2 border-gray-100 rounded-2xl hover:border-blue-200 hover:shadow-blue transition-all">
                  <img
                    src="https://images.unsplash.com/photo-1589998059171-988d887df646?w=200&h=280&fit=crop"
                    alt="Kitob"
                    className="w-full sm:w-20 h-32 sm:h-28 object-cover rounded-xl"
                  />
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                          Atom odatlari
                        </h3>
                        <p className="text-sm text-gray-600">James Clear</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-semibold w-fit">
                        Yetkazildi
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600">
                      <span>
                        <i className="far fa-calendar mr-1 text-blue-600"></i>15
                        Fevral 2025
                      </span>
                      <span>
                        <i className="fas fa-money-bill mr-1 text-blue-600"></i>
                        45,000 so&apos;m
                      </span>
                      <button className="text-blue-600 hover:text-black font-semibold transition-colors">
                        <i className="fas fa-eye mr-1"></i>Batafsil
                      </button>
                    </div>
                  </div>
                </div>

                {/* Purchase Item 2 */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border-2 border-gray-100 rounded-2xl hover:border-blue-200 hover:shadow-blue transition-all">
                  <img
                    src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=200&h=280&fit=crop"
                    alt="Kitob"
                    className="w-full sm:w-20 h-32 sm:h-28 object-cover rounded-xl"
                  />
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                          Fikrlash, tez va sekin
                        </h3>
                        <p className="text-sm text-gray-600">Daniel Kahneman</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold w-fit">
                        Yo&apos;lda
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600">
                      <span>
                        <i className="far fa-calendar mr-1 text-blue-600"></i>20
                        Fevral 2025
                      </span>
                      <span>
                        <i className="fas fa-money-bill mr-1 text-blue-600"></i>
                        55,000 so&apos;m
                      </span>
                      <button className="text-blue-600 hover:text-black font-semibold transition-colors">
                        <i className="fas fa-eye mr-1"></i>Batafsil
                      </button>
                    </div>
                  </div>
                </div>

                {/* Purchase Item 3 */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border-2 border-gray-100 rounded-2xl hover:border-blue-200 hover:shadow-blue transition-all">
                  <img
                    src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=200&h=280&fit=crop"
                    alt="Kitob"
                    className="w-full sm:w-20 h-32 sm:h-28 object-cover rounded-xl"
                  />
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                          Sapiens
                        </h3>
                        <p className="text-sm text-gray-600">
                          Yuval Noah Harari
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-semibold w-fit">
                        Yetkazildi
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600">
                      <span>
                        <i className="far fa-calendar mr-1 text-blue-600"></i>10
                        Fevral 2025
                      </span>
                      <span>
                        <i className="fas fa-money-bill mr-1 text-blue-600"></i>
                        65,000 so&apos;m
                      </span>
                      <button className="text-blue-600 hover:text-black font-semibold transition-colors">
                        <i className="fas fa-eye mr-1"></i>Batafsil
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "deliveries" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Delivery Card 1 */}
              <div className="bg-white rounded-2xl shadow-blue p-4 sm:p-6">
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 text-base sm:text-lg">
                      Fikrlash, tez va sekin
                    </h3>
                    <p className="text-sm text-gray-600">
                      <FaMapMarkerAlt className="text-blue-600 mr-2 inline" />
                      Toshkent shahar kutubxonasi
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold whitespace-nowrap">
                    Yo&apos;lda
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white mr-3 flex-shrink-0">
                      <FaCheck className="text-sm" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">
                        Buyurtma qabul qilindi
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        20 Fevral, 10:30
                      </p>
                    </div>
                  </div>

                  <div className="ml-4 border-l-2 border-blue-600 h-8"></div>

                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white mr-3 flex-shrink-0 animate-pulse">
                      <FaTruck className="text-sm" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">
                        Yetkazib berilmoqda
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Taxminiy: 2 soat
                      </p>
                    </div>
                  </div>

                  <div className="ml-4 border-l-2 border-gray-300 h-8"></div>

                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white mr-3 flex-shrink-0">
                      <FaHome className="text-sm" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-400 text-sm sm:text-base">
                        Yetkazildi
                      </p>
                      <p className="text-xs sm:text-sm text-gray-400">
                        Kutilmoqda
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-black text-white rounded-xl font-semibold hover:shadow-blue transition-all text-sm">
                    <FaPhone className="mr-2 inline" /> Kuryer bilan bog&apos;lanish
                  </button>
                  <button className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all text-sm">
                    <FaMap className="mr-2 inline" /> Xaritada ko&apos;rish
                  </button>
                </div>
              </div>

              {/* Delivery Card 2 */}
              <div className="bg-white rounded-2xl shadow-blue p-4 sm:p-6">
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 text-base sm:text-lg">
                      Atom odatlari
                    </h3>
                    <p className="text-sm text-gray-600">
                      <FaMapMarkerAlt className="text-blue-600 mr-2 inline" />{" "}
                      Chilonzor kutubxonasi
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-semibold whitespace-nowrap">
                    Yetkazildi
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white mr-3 flex-shrink-0">
                      <FaCheck className="text-sm" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">
                        Buyurtma qabul qilindi
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        15 Fevral, 09:00
                      </p>
                    </div>
                  </div>

                  <div className="ml-4 border-l-2 border-green-500 h-8"></div>

                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white mr-3 flex-shrink-0">
                      <FaTruck className="text-sm" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">
                        Yetkazib berildi
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        15 Fevral, 14:30
                      </p>
                    </div>
                  </div>

                  <div className="ml-4 border-l-2 border-green-500 h-8"></div>

                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white mr-3 flex-shrink-0">
                      <FaHome className="text-sm" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">
                        Qabul qilindi
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        15 Fevral, 14:45
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-black text-white rounded-xl font-semibold hover:shadow-blue transition-all text-sm">
                    <FaStar className="mr-2 inline" /> Baholash
                  </button>
                  <button className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all text-sm">
                    <FaDownload className="mr-2 inline" /> Kvitansiya
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white rounded-2xl shadow-blue p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Bildirishnomalar
                </h2>
                <button
                  onClick={markAllRead}
                  className="px-4 py-2 text-blue-600 hover:text-black font-semibold transition-colors text-sm flex items-center gap-2"
                >
                  <FaCheckDouble /> Hammasini o&apos;qilgan deb belgilash
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {notifications.map((n) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-start gap-3 sm:gap-4 p-4 ${
                      n.bg
                    } border-l-4 ${
                      n.border
                    } rounded-xl hover:shadow-lg transition-all ${
                      read.includes(n.id) ? "opacity-50" : "opacity-100"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-black flex items-center justify-center flex-shrink-0 text-white">
                      {n.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                        {n.title}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        {n.description}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <FaClock /> {n.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// -------------------- Stat Card Component --------------------
function StatCard({ value, label }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 text-center">
      <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
        {value}
      </div>
      <div className="text-xs sm:text-sm text-blue-100 mt-1">{label}</div>
    </div>
  );
}

// -------------------- Rental Card Component --------------------
function RentalCard({ rental }) {
  return (
    <div className="bg-white rounded-2xl shadow-blue overflow-hidden hover:shadow-black transition-all">
      <div className="flex flex-col sm:flex-row">
        <img
          src={rental.img}
          alt={rental.title}
          className="w-full sm:w-32 h-48 sm:h-auto object-cover"
        />
        <div className="p-4 sm:p-5 flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-bold text-gray-900 mb-1 text-base sm:text-lg">
                {rental.title}
              </h3>
              <p className="text-sm text-gray-600">{rental.author}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                rental.status === "Faol"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {rental.status}
            </span>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Kunlik to&apos;lov:</span>
              <span className="font-semibold text-gray-900">
                {rental.dailyPayment}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Muddat:</span>
              <span className="font-semibold text-gray-900">
                {rental.duration}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Qolgan:</span>
              <span className="font-semibold text-blue-600">
                {rental.remaining}
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-gradient-to-r from-blue-600 to-black h-2 rounded-full"
              style={{ width: `${rental.progress}%` }}
            ></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-black text-white rounded-xl font-semibold hover:shadow-blue transition-all text-sm flex items-center justify-center">
              <FaClock className="mr-2" /> Uzaytirish
            </button>
            <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all text-sm flex items-center justify-center">
              <FaUndo className="mr-2" /> Qaytarish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
