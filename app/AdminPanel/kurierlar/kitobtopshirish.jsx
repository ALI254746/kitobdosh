"use client";
import React, { useState } from "react";
import Image from "next/image";

export default function ReturnBooksPage() {
  const [returnFilter, setReturnFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const returnBooks = [
    {
      id: 1,
      name: "Ikki eshik orasi",
      user: "Dilnoza Karimova",
      courier: "Abbos Jo‘rayev",
      status: "qaytarilgan",
      damage: "zararsiz",
      payment: "0 so‘m",
      images: [
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=140&fit=crop",
      ],
    },
    {
      id: 2,
      name: "Sariq devni minib",
      user: "Aziza To‘laganova",
      courier: "Bekzod Xoliqov",
      status: "tekshirilmoqda",
      damage: "yengil",
      payment: "15 000 so‘m",
      images: [
        "https://images.unsplash.com/photo-1589998059171-988d887df646?w=100&h=140&fit=crop",
      ],
    },
    {
      id: 3,
      name: "Kecha va kunduz",
      user: "Olim Saidov",
      courier: "Murod Rahimov",
      status: "topshirildi",
      damage: "ortacha",
      payment: "50 000 so‘m",
      images: [
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=100&h=140&fit=crop",
      ],
    },
  ];

  const filteredBooks = returnBooks.filter(
    (book) =>
      (returnFilter === "all" || book.status === returnFilter) &&
      (book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.user.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusClass = (status) => {
    switch (status) {
      case "qaytarilgan":
        return "bg-yellow-100 text-yellow-800";
      case "tekshirilmoqda":
        return "bg-blue-100 text-blue-800";
      case "topshirildi":
        return "bg-green-100 text-green-800";
      default:
        return "";
    }
  };

  const getDamageClass = (damage) => {
    switch (damage) {
      case "zararsiz":
        return "bg-green-100 text-green-800";
      case "yengil":
        return "bg-yellow-100 text-yellow-800";
      case "ortacha":
        return "bg-orange-100 text-orange-800";
      case "yaroqsiz":
        return "bg-red-100 text-red-800";
      default:
        return "";
    }
  };

  return (
    <div className="p-2">
      {/* FILTERLAR */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "Barchasi" },
            { id: "qaytarilgan", label: "Qaytarilgan" },
            { id: "tekshirilmoqda", label: "Tekshirilmoqda" },
            { id: "topshirildi", label: "Topshirildi" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setReturnFilter(f.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                returnFilter === f.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ism yoki kitob bo‘yicha qidirish"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full lg:w-80"
          />
          <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
      </div>

      {/* JADVAL */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kitob rasmlari
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kitob nomi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Foydalanuvchi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kuryer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Holat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Zarar holati
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                To‘lov
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amal
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBooks.map((book) => (
              <tr
                key={book.id}
                className="hover:bg-gray-50 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    {book.images.map((img, index) => (
                      <Image
                        key={index}
                        src={img}
                        alt="Book"
                        width={50}
                        height={70}
                        className="w-12 h-16 object-cover rounded shadow-sm cursor-pointer hover:scale-110 transition-transform"
                      />
                    ))}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {book.name}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-blue-600 hover:underline cursor-pointer">
                  {book.user}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                  {book.courier}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                      book.status
                    )}`}
                  >
                    {book.status === "qaytarilgan"
                      ? "Qaytarilgan"
                      : book.status === "tekshirilmoqda"
                      ? "Tekshirilmoqda"
                      : "Bazaga topshirildi"}
                  </span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getDamageClass(
                      book.damage
                    )}`}
                  >
                    {book.damage === "zararsiz"
                      ? "Zararsiz"
                      : book.damage === "yengil"
                      ? "Yengil zarar (10%)"
                      : book.damage === "ortacha"
                      ? "O‘rtacha zarar (30%)"
                      : "Yaroqsiz (100%)"}
                  </span>
                </td>
                <td
                  className={`px-3 py-2 whitespace-nowrap text-sm font-medium ${
                    book.payment === "0 so‘m"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {book.payment}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <button className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all">
                    qabul qildim
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
