"use client";
import React, { useState } from "react";
import {
  FaMotorcycle,
  FaCircle,
  FaBox,
  FaUndo,
  FaSearch,
} from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import PickupTab from "./kitobolish";
import ReturnTab from "./kitobtopshirish";
import KurierControl from "./kuriernazorat";
export default function CourierStats() {
  const [searchQuery, setSearchQuery] = useState("");
  const [onlineFilter, setOnlineFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("kuriernazorat");

  return (
    <div className="min-h-screen bg-white p-10">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
        {/* Kuryer statistikasi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* 1. Jami kurierlar */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium mb-1">
                  Jami kurierlar
                </p>
                <p className="text-2xl font-bold text-blue-900">6</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <FaMotorcycle className="text-white text-xl" />
              </div>
            </div>
          </div>

          {/* 2. Online kurierlar */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium mb-1">
                  Online kurierlar
                </p>
                <p className="text-2xl font-bold text-green-900">4</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <FaCircle className="text-white text-xl" />
              </div>
            </div>
          </div>

          {/* 3. Bugungi yetkazishlar */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium mb-1">
                  Bugungi yetkazishlar
                </p>
                <p className="text-2xl font-bold text-orange-900">52</p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <FaBox className="text-white text-xl" />
              </div>
            </div>
          </div>

          {/* 4. Bugungi qaytarishlar */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium mb-1">
                  Bugungi qaytarishlar
                </p>
                <p className="text-2xl font-bold text-purple-900">21</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <FaUndo className="text-white text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Qidiruv va filtrlar */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Qidiruv input */}
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Kurier ismi yoki telefon raqami..."
                className="w-full pl-10 pr-4 py-2.5 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtrlar */}
          <div className="flex gap-2">
            <select
              value={onlineFilter}
              onChange={(e) => setOnlineFilter(e.target.value)}
              className="px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Barcha holat</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Barcha status</option>
              <option value="active">Faol</option>
              <option value="busy">Band</option>
            </select>
          </div>
        </div>
      </div>
      <div className="min-h-screen bg-gray-50 p-4 ">
        {/* Navbar (Tablar) */}
        <div className="flex space-x-8 border-b border-gray-300">
          <button
            onClick={() => setActiveTab("kuriernazorat")}
            className={`py-4 px-2 font-medium text-sm transition-colors relative ${
              activeTab === "kuriernazorat"
                ? "text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Asosiy oyna
            {activeTab === "kuriernazorat" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("kitobolish")}
            className={`py-4 px-2 font-medium text-sm transition-colors relative ${
              activeTab === "kitobolish"
                ? "text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Kitobni olish jarayoni
            {activeTab === "kitobolish" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("kitobtopshirish")}
            className={`py-4 px-2 font-medium text-sm transition-colors relative ${
              activeTab === "kitobtopshirish"
                ? "text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Kitobni bazaga topshirish jarayoni
            {activeTab === "kitobtopshirish" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
            )}
          </button>
          <button
            className={`
        hidden sm:flex items-center 
        px-8  bg-blue-600 text-white rounded-lg 
        hover:bg-blue-700 transition-colors font-medium
        
      `}
          >
            <FaPlus className="w-4 h-4" />
            Yangi kurier
          </button>
        </div>

        {/* Tab mazmuni */}
        <div className="mt-6">
          {activeTab === "kitobolish" && <PickupTab />}
          {activeTab === "kitobtopshirish" && <ReturnTab />}
          {activeTab === "kuriernazorat" && <KurierControl />}
        </div>
      </div>
    </div>
  );
}
