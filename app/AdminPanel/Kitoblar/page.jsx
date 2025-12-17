"use client";

import React from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
const books = [
  {
    id: 1,
    title: "Jinoyat va Jazo",
    author: "Fyodor Dostoyevskiy",
    genre: "Badiiy",
    usedCount: 20,
    duration: "30 kun",
    income: "150,000 so'm",
    quantity: 5,
    status: "Mavjud",
    cover:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=150&fit=crop",
    statusColor: "green",
    genreColor: "blue",
  },
  {
    id: 2,
    title: "O'tkan kunlar",
    author: "Abdulla Qodiriy",
    genre: "Tarixiy",
    usedCount: 15,
    duration: "25 kun",
    income: "120,000 so'm",
    quantity: 3,
    status: "Ijarada",
    cover:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=100&h=150&fit=crop",
    statusColor: "yellow",
    genreColor: "purple",
  },
  {
    id: 3,
    title: "Mehrobdan chayon",
    author: "Abdulla Qahhor",
    genre: "Badiiy",
    usedCount: 12,
    duration: "18 kun",
    income: "95,000 so'm",
    quantity: 4,
    status: "Mavjud",
    cover:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=150&fit=crop",
    statusColor: "green",
    genreColor: "blue",
  },
];

export default function BooksPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-5 sm:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-lg font-bold text-gray-900 mb-6">
            Kitoblar Boshqaruvi
          </h1>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Kitob nomi yoki muallifni qidirish"
                className="text-black font-extrabold w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <i className="fas fa-search absolute left-4 top-4 text-gray-400"></i>
            </div>

            <select className="px-6 text-black  py-3 border border-gray-300 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white hover:shadow-xl transition-all duration-200 cursor-pointer">
              <option>Barcha janrlar</option>
              <option>Badiiy adabiyot</option>
              <option>Ilmiy</option>
              <option>Tarixiy</option>
              <option>Bolalar adabiyoti</option>
            </select>

            <select className="px-6 text-black  py-3 border border-gray-300 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white hover:shadow-xl transition-all duration-200 cursor-pointer">
              <option>Narx bo'yicha</option>
              <option>Arzon → Qimmat</option>
              <option>Qimmat → Arzon</option>
            </select>

            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:shadow-2xl hover:bg-blue-700 transition-all duration-200 transform hover:-translate-y-0.5 font-medium whitespace-nowrap">
              <i className="fas fa-plus mr-2"></i>Kitob Qo'shish
            </button>
          </div>
        </div>

        {/* Books Table */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-900 font-bold text-sm">
                    Kitob
                  </th>
                  <th className="text-left py-4 px-6 text-gray-900 font-bold text-sm">
                    Muallif
                  </th>
                  <th className="text-left py-4 px-6 text-gray-900 font-bold text-sm">
                    Janr
                  </th>
                  <th className="text-left py-4 px-6 text-gray-900 font-bold text-sm">
                    Ishlatilgan
                  </th>
                  <th className="text-left py-4 px-6 text-gray-900 font-bold text-sm">
                    Muddat
                  </th>
                  <th className="text-left py-4 px-6 text-gray-900 font-bold text-sm">
                    Daromad
                  </th>
                  <th className="text-left py-4 px-6 text-gray-900 font-bold text-sm">
                    Soni
                  </th>
                  <th className="text-left py-4 px-6 text-gray-900 font-bold text-sm">
                    Holat
                  </th>
                  <th className="text-left py-4 px-6 text-gray-900 font-bold text-sm">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr
                    key={book.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-4">
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="w-14 h-20 rounded-lg shadow-lg object-cover"
                        />
                        <div>
                          <p className="font-bold text-gray-900">
                            {book.title}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            ISBN: 978-XXXX-XXXX
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 text-black px-6">{book.author}</td>
                    <td className="py-5 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium shadow-md ${
                          book.genreColor === "blue"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {book.genre}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-black font-semibold">
                      {book.usedCount} marta
                    </td>
                    <td className="py-5 text-black px-6">{book.duration}</td>
                    <td className="py-5 px-6 text-black font-bold">
                      {book.income}
                    </td>
                    <td className="py-5 px-6 text-black font-semibold">
                      {book.quantity} ta
                    </td>
                    <td className="py-5 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium shadow-md ${
                          book.statusColor === "green"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {book.status}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex space-x-2">
                        <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">
                          <FaEye />
                        </button>
                        <button className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">
                          <FaEdit />
                        </button>
                        <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
