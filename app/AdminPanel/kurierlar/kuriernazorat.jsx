"use client";

import React from "react";
import { FaBox, FaUndo, FaArrowRight, FaCircle } from "react-icons/fa";

const couriers = [
  {
    name: "Alisher Karimov",
    phone: "+998 90 123 45 67",
    online: true,
    todayDeliveries: 8,
    todayReturns: 3,
    status: "active",
  },
  {
    name: "Jasur Abdullayev",
    phone: "+998 91 234 56 78",
    online: false,
    todayDeliveries: 12,
    todayReturns: 5,
    status: "busy",
  },
  {
    name: "Davron Ergashev",
    phone: "+998 94 456 78 90",
    online: true,
    todayDeliveries: 10,
    todayReturns: 4,
    status: "active",
  },
  {
    name: "Shohruh Mirzayev",
    phone: "+998 93 345 67 89",
    online: false,
    todayDeliveries: 6,
    todayReturns: 2,
    status: "active",
  },
];

const CourierCard = ({ courier }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* HEADER */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {courier.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{courier.name}</h3>
            <p className="text-sm text-gray-500">{courier.phone}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="relative flex h-3 w-3">
            {courier.online && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-green-400"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${
                courier.online ? "bg-green-500" : "bg-gray-400"
              }`}
            ></span>
          </span>
          <span
            className={`text-xs font-medium ${
              courier.online ? "text-green-600" : "text-gray-500"
            }`}
          >
            {courier.online ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <FaBox className="text-blue-600 text-sm" />
            <p className="text-xs text-blue-600 font-medium">Yetkazish</p>
          </div>
          <p className="text-xl font-bold text-blue-900">
            {courier.todayDeliveries}
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <FaUndo className="text-purple-600 text-sm" />
            <p className="text-xs text-purple-600 font-medium">Qaytarish</p>
          </div>
          <p className="text-xl font-bold text-purple-900">
            {courier.todayReturns}
          </p>
        </div>
      </div>

      {/* STATUS & BUTTON */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            courier.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-orange-100 text-orange-800"
          }`}
        >
          <FaCircle
            className={`text-xs mr-1.5 ${
              courier.status === "active" ? "text-green-500" : "text-orange-500"
            }`}
          />
          <span>{courier.status === "active" ? "Faol" : "Band"}</span>
        </span>

        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1">
          <span>Tafsilotlar</span>
          <FaArrowRight className="text-xs" />
        </button>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-100 min-h-screen">
      {couriers.map((courier, i) => (
        <CourierCard key={i} courier={courier} />
      ))}
    </div>
  );
}
