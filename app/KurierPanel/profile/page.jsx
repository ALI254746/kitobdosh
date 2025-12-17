"use client";

import {
  FaPhone,
  FaEnvelope,
  FaBox,
  FaCheckCircle,
  FaStar,
  FaClock,
} from "react-icons/fa";
import Image from "next/image";

export default function Dashboard() {
  return (
    <div className="max-w-4xl mt-10 mx-auto p-4 space-y-6">
      {/* Profil kartasi */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-24 h-24">
            <Image
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
              alt="Profil"
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-2xl font-bold text-gray-800">Aziz Rahimov</h3>
            <p className="text-gray-600 mt-1 flex items-center justify-center sm:justify-start gap-2">
              <FaPhone /> +998 90 123 45 67
            </p>
            <p className="text-gray-600 mt-1 flex items-center justify-center sm:justify-start gap-2">
              <FaEnvelope /> aziz.rahimov@mail.uz
            </p>
          </div>
        </div>
      </div>

      {/* Statistika kartalari */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
          <div className="bg-blue-100 rounded-full p-3">
            <FaBox className="text-blue-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Bugungi yetkazilgan</p>
            <p className="text-2xl font-bold text-gray-800">12</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
          <div className="bg-green-100 rounded-full p-3">
            <FaCheckCircle className="text-green-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Jami yetkazilgan</p>
            <p className="text-2xl font-bold text-gray-800">487</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
          <div className="bg-yellow-100 rounded-full p-3">
            <FaStar className="text-yellow-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Reyting</p>
            <p className="text-2xl font-bold text-gray-800">4.9</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
          <div className="bg-white p-4 rounded-xl shadow-md flex items-center gap-4">
            <FaClock className="text-blue-500 text-3xl" />
            <div>
              <p className="text-gray-600 text-sm">O&apos;z vaqtida</p>
              <h3 className="text-xl font-bold text-gray-800">95%</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Progress statistikasi */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Statistika</h3>
        {/* Statistika ro'yxati */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center hover:bg-gray-50 transition">
            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-green-500 text-xl" />
              <span className="text-gray-600">O&apos;z vaqtida yetkazilgan</span>
            </div>
            <span className="font-bold text-gray-800">120</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full"
              style={{ width: "95%" }}
            ></div>
          </div>

          {/* Progress 2 */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Mijozlar qoniqishi</span>
              <span className="font-semibold text-gray-800">98%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                style={{ width: "98%" }}
              ></div>
            </div>
          </div>

          {/* Progress 3 */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Muvaffaqiyatli yetkazilgan</span>
              <span className="font-semibold text-gray-800">97%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full"
                style={{ width: "97%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
