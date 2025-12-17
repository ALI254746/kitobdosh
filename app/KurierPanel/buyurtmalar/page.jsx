"use client";
import { useState } from "react";
import {
  FaMapMarkerAlt,
  FaCheck,
  FaBook,
  FaCar,
  FaPhone,
  FaCheckDouble,
  FaUser,
} from "react-icons/fa";

export default function Page() {
  const [order, setOrder] = useState({
    id: 1234,
    customer: "Javohir Usmonov",
    address: "Toshkent shaxri, Yunusobod tumani, 4-dom, 105-uy",
    book: "Fizika 11-sinf",
    status: "Kutmoqda",
    author: "Abdulla Qahhor",
    phone: "932702274",
  });

  const statusColor = (status) => {
    switch (status) {
      case "Kutmoqda":
        return "bg-gray-300 text-black";
      case "Qabul qildim":
        return "bg-green-100 text-green-600";
      case "Kitobni oldim":
        return "bg-blue-100 text-blue-600";
      case "Yo'ldaman":
        return "bg-yellow-100 text-yellow-600";
      case "Yetkazdim":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const updateOrderStatus = (newStatus) => {
    setOrder((prev) => ({ ...prev, status: newStatus }));
  };

  return (
    <div className="mt-12 bg-gray-100 flex justify-center sm:p-2">
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 w-full max-w-md sm:max-w-lg">
        {/* Customer va Status */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-4 sm:gap-0">
          <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
            <FaUser className="text-blue-500 text-xl transition-transform duration-300 hover:scale-125" />
            {order.customer}
          </h3>

          <span
            className={`px-3 py-1 rounded-full font-extrabold text-sm sm:text-base ${statusColor(
              order.status
            )} transition-all duration-300`}
          >
            {order.status}
          </span>
        </div>

        {/* Kitob ma'lumotlari */}
        <div className="bg-blue-50 rounded-xl p-5 mb-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-lg transition-shadow duration-300">
          <FaBook className="text-blue-500 text-5xl flex-shrink-0 transition-transform duration-300 hover:scale-125" />

          <div className="flex-1">
            <p className="text-sm text-blue-600 font-medium mb-1">
              Kitob nomi:
            </p>
            <h4 className="text-gray-800 font-semibold mb-2">{order.book}</h4>

            <p className="text-sm text-gray-600 mb-1">
              <strong>ID:</strong> {order.id}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Kim yozgani:</strong> {order.author}
            </p>
            <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
              <FaUser className="text-blue-400" /> {order.customer}
            </p>
            <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
              <FaPhone className="text-green-500" /> {order.phone}
            </p>
            <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-500" /> {order.address}
            </p>
          </div>
        </div>

        {/* Status tugmalari */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateOrderStatus("Qabul qildim")}
            disabled={order.status !== "Kutmoqda"}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg font-medium transition-all hover:shadow-md ${
              order.status === "Kutmoqda"
                ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            <FaCheck className="text-lg" /> Qabul qildim
          </button>

          <button
            onClick={() => updateOrderStatus("Kitobni oldim")}
            disabled={order.status !== "Qabul qildim"}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg font-medium transition-all hover:shadow-md ${
              order.status === "Qabul qildim"
                ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            <FaBook className="text-lg" /> Kitobni oldim
          </button>

          <button
            onClick={() => updateOrderStatus("Yo'ldaman")}
            disabled={order.status !== "Kitobni oldim"}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg font-medium transition-all hover:shadow-md ${
              order.status === "Kitobni oldim"
                ? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            <FaCar className="text-lg" /> Yo&apos;ldaman
          </button>

          <button
            onClick={() => updateOrderStatus("Yetkazdim")}
            disabled={order.status !== "Yo'ldaman"}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg font-medium transition-all hover:shadow-md ${
              order.status === "Yo'ldaman"
                ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            <FaCheckDouble className="text-lg" /> Yetkazdim
          </button>
        </div>
      </div>
    </div>
  );
}
