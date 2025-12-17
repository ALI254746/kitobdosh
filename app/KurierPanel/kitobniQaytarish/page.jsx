"use client";
import { useState } from "react";
import {
  FaIdBadge,
  FaUser,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
} from "react-icons/fa";
import { FaCheck, FaCar, FaBook, FaCheckCircle, FaTruck } from "react-icons/fa";
export default function BookReturn() {
  const [currentStep, setCurrentStep] = useState(0);
  const [bookCondition, setBookCondition] = useState("");
  const [bookComment, setBookComment] = useState("");

  const returnSteps = [
    { label: "Qabul qildim", icon: FaCheck },
    { label: "Yo'ldaman", icon: FaCar },
    { label: "Kitobni oldim", icon: FaBook },
    { label: "Qaytarib oldim", icon: FaCheckCircle },
    { label: "Adminga topshirdim", icon: FaTruck },
  ];

  const bookData = {
    id: "B123",
    title: "JavaScript Asoslari",
    image:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=500&q=60",
    borrower: "Dilshod Karimov",
    location: "Toshkent sh., Chilonzor tumani, 12-mavze, 45-uy",
    daysUsed: 7,
    fee: 5000,
  };

  const getConditionText = (value) => {
    switch (value) {
      case "perfect":
        return "To'liq yaxshi";
      case "10":
        return "10% zarar";
      case "30":
        return "30% zarar";
      case "60":
        return "60% zarar";
      case "100":
        return "100% yaroqsiz";
      default:
        return "";
    }
  };

  const resetReturn = () => {
    setCurrentStep(0);
    setBookCondition("");
    setBookComment("");
  };

  return (
    <div className="max-w-3xl mt-15 mx-auto">
      {/* Progress Steps */}

      {/* Single Card for Book Info & Steps */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {/* Book Information (always visible) */}
        <div className=" flex flex-col sm:flex-row items-center gap-6">
          {/* Kitob rasmi */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <FaBook
              className="text-blue-500 transition-transform duration-300 hover:scale-125 hover:text-blue-600"
              size={32}
            />
            {bookData.title}
          </h2>
          <img
            src={bookData.image}
            alt={bookData.title}
            className="w-80 h-44 object-cover rounded-lg shadow-md"
          />

          {/* Kitob ma'lumotlari */}
          <div className="flex-1 space-y-4">
            <p className="text-gray-700 flex items-center gap-3">
              <FaIdBadge
                className="text-gray-500 transition-transform duration-300 hover:scale-125 hover:text-gray-700"
                size={24}
              />
              <strong>ID:</strong> {bookData.id}
            </p>

            <p className="text-gray-700 flex items-center gap-3">
              <FaUser
                className="text-purple-500 transition-transform duration-300 hover:scale-125 hover:text-purple-600"
                size={24}
              />
              <strong>Mijoz:</strong> {bookData.borrower}
            </p>

            <p className="text-gray-700 flex items-center gap-3">
              <FaMapMarkerAlt
                className="text-red-500 transition-transform duration-300 hover:scale-125 hover:text-red-600"
                size={24}
              />
              <strong>Manzil:</strong> {bookData.location}
            </p>

            <p className="text-gray-700 flex items-center gap-3">
              <FaCalendarAlt
                className="text-green-500 transition-transform duration-300 hover:scale-125 hover:text-green-600"
                size={24}
              />
              <strong>Necha kun ishlatildi:</strong> {bookData.daysUsed} kun
            </p>

            <p className="text-gray-700 font-semibold flex items-center gap-3 mt-2">
              <FaMoneyBillWave
                className="text-yellow-500 transition-transform duration-300 hover:scale-125 hover:text-yellow-600"
                size={28}
              />
              <strong>To‘langan summa:</strong> {bookData.fee} so‘m
            </p>
          </div>
        </div>
        <div className=" p-6 ">
          <div className="relative">
            <div className="flex justify-between mb-2">
              {returnSteps.map((step, index) => {
                const Icon = step.icon; // icon komponenti
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold mb-2 transition-all ${
                        index <= currentStep
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      <Icon
                        size={24} // icon o'lchami
                        color={index <= currentStep ? "#fff" : "#9CA3AF"} // rang
                      />
                    </div>
                    <p
                      className={`text-xs text-center hidden sm:block ${
                        index <= currentStep
                          ? "text-blue-600 font-medium"
                          : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
            {/* progress bar */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
              <div
                style={{
                  width: `${(currentStep / (returnSteps.length - 1)) * 100}%`,
                }}
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
              ></div>
            </div>
          </div>
        </div>
        {/* Step-specific Content */}
        {currentStep === 0 && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              So'rovni qabul qilish
            </h3>
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-gray-700">
                Kitobni qaytarib olish so'rovi keldi. Davom etish uchun qabul
                qiling.
              </p>
            </div>
            <button
              onClick={() => setCurrentStep(1)}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all hover:shadow-md"
            >
              <i className="fas fa-check mr-2"></i>Qabul qildim
            </button>
          </div>
        )}

        {currentStep === 1 && (
          <button
            onClick={() => setCurrentStep(2)}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all hover:shadow-md mb-4"
          >
            <i className="fas fa-car mr-2"></i>Yo'ldaman
          </button>
        )}

        {currentStep === 2 && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Kitobni oldim va tekshirish
            </h3>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kitob holati
              </label>
              <select
                value={bookCondition}
                onChange={(e) => setBookCondition(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Holatni tanlang</option>
                <option value="perfect">To'liq yaxshi</option>
                <option value="10">10% zarar</option>
                <option value="30">30% zarar</option>
                <option value="60">60% zarar</option>
                <option value="100">100% yaroqsiz</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Izoh
              </label>
              <textarea
                value={bookComment}
                onChange={(e) => setBookComment(e.target.value)}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Kitob holati haqida qo'shimcha ma'lumot..."
              ></textarea>
            </div>

            {currentStep === 2 && (
              <button
                onClick={() => setCurrentStep(3)}
                disabled={!bookCondition}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fas fa-check mr-2"></i>Holatni tasdiqlash
              </button>
            )}
          </div>
        )}

        {currentStep >= 3 && (
          <div className="bg-green-50 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <i className="fas fa-check-circle text-green-600 text-2xl"></i>
              <div>
                <p className="text-gray-700 font-medium mb-2">
                  Kitob muvaffaqiyatli qaytarib olindi!
                </p>
                <p className="text-sm text-gray-600">
                  Holat: {getConditionText(bookCondition)}
                </p>
                {bookComment && (
                  <p className="text-sm text-gray-600">Izoh: {bookComment}</p>
                )}
              </div>
            </div>
            {currentStep === 3 && (
              <button
                onClick={() => setCurrentStep(4)}
                className="w-full mt-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all hover:shadow-md"
              >
                <i className="fas fa-truck mr-2"></i>Adminga topshirdim
              </button>
            )}
          </div>
        )}

        {currentStep === 4 && (
          <div className="text-center py-8">
            <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-check text-green-600 text-3xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Jarayon yakunlandi!
            </h3>
            <p className="text-gray-600 mb-6">
              Kitob adminga muvaffaqiyatli topshirildi.
            </p>
            <button
              onClick={resetReturn}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all hover:shadow-md"
            >
              <i className="fas fa-redo mr-2"></i>Yangi qaytarish
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
