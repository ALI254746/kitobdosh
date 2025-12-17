"use client";
import { useState } from "react";
import { FaBook, FaPlus } from "react-icons/fa";
import { FaShoppingCart, FaStore, FaChartLine } from "react-icons/fa";
import { FaEdit, FaTrash } from "react-icons/fa";

const books = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100&h=150&fit=crop",
    name: "O'tkan kunlar",
    author: "Abdulla Qodiriy",
    price: 45000,
    category: "Badiiy",
    status: "Mavjud",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=100&h=150&fit=crop",
    name: "Mehrobdan chayon",
    author: "Abdulla Qahhor",
    price: 38000,
    category: "Badiiy",
    status: "Mavjud",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=150&fit=crop",
    name: "Sariq devni minib",
    author: "Xudoyberdi To'xtaboyev",
    price: 52000,
    category: "Bolalar",
    status: "Sotilgan",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=100&h=150&fit=crop",
    name: "Ikki eshik orasi",
    author: "O'tkir Hoshimov",
    price: 42000,
    category: "Badiiy",
    status: "Mavjud",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=100&h=150&fit=crop",
    name: "Dunyoning ishlari",
    author: "O'tkir Hoshimov",
    price: 40000,
    category: "Badiiy",
    status: "Mavjud",
  },
];
export default function SotuvdagiKitoblarHeader() {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  return (
    <div className="min-h-screen py-10 p-6 bg-gray-50">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        {/* Sarlavha */}
        <h2
          className="text-3xl font-bold text-gray-800 flex items-center relative"
          style={{
            textShadow: `
      2px 2px 6px rgba(0, 0, 0, 0.2),
      -2px -2px 6px rgba(37, 99, 235, 0.5)
    `,
          }}
        >
          <FaBook className="text-blue-600 dark:text-blue-400 mr-2" />
          Sotuvdagi kitoblar
        </h2>

        {/* Yangi kitob qo'shish tugmasi */}
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
        >
          <FaPlus className="mr-2" />
          Yangi kitob qo'shish
        </button>

        {/* Modal (yangi kitob qo'shish oynasi) */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 ">
                Yangi kitob qo‘shish
              </h3>

              <form className="space-y-3">
                <input
                  type="text"
                  placeholder="Kitob nomi"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Muallif"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Narxi (so‘m)"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="file"
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <textarea
                  placeholder="Kitob tavsifi"
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                ></textarea>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Saqlash
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Jami kitoblar */}
        <div className="bg-gradient-to-br from-green-50 to-cyan-400 rounded-2xl p-6 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900 font-extrabold  text-sm mb-1">
                Jami kitoblar
              </p>
              <h3 className="text-3xl font-bold text-gray-800">256</h3>
            </div>
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
              <FaBook className="text-2xl text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Sotilgan kitoblar */}
        <div className="bg-gradient-to-br from-blue-400 mask-l-to-lime-500  rounded-2xl p-6 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900 font-extrabold text-sm mb-1">
                Sotilgan kitoblar
              </p>
              <h3 className="text-3xl font-bold text-gray-800 ">142</h3>
            </div>
            <div className="w-14 h-14 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
              <FaShoppingCart className="text-2xl text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Sotuvda mavjud */}
        <div className="bg-gradient-to-br from-amber-100  to-gray-400 rounded-2xl p-6 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-950 font-extrabold text-sm mb-1">
                Sotuvda mavjud
              </p>
              <h3 className="text-3xl font-bold text-gray-800 ">114</h3>
            </div>
            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
              <FaStore className="text-2xl text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        {/* Yangi qo‘shilganlar */}
        <div className="bg-gradient-to-br from-emerald-100  to-cyan-300 rounded-2xl p-6 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900  font-extrabold text-sm mb-1">
                Yangi qo‘shilganlar
              </p>
              <h3 className="text-3xl font-bold text-gray-800 ">18</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Oxirgi 7 kun
              </p>
            </div>
            <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center">
              <FaChartLine className="text-2xl text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-emerald-100  to-cyan-300  rounded-2xl p-4 shadow-md mt-4 mb-6 border border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Qidiruv */}
          <div>
            <label className="block text-sm font-semibold text-black  mb-2">
              Qidiruv
            </label>
            <div className="relative">
              <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Kitob nomi yoki muallif bo'yicha qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white text-black font-semibold border border-gray-300  rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent   transition-all"
              />
            </div>
          </div>

          {/* Kategoriya */}
          <div>
            <label className="block text-sm font-semibold text-black  mb-2">
              Kategoriya
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-3 text-black font-semibold bg-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent  transition-all"
            >
              <option className="font-extrabold" value="all">
                Barcha kategoriyalar
              </option>
              <option value="Badiiy">Badiiy</option>
              <option value="Bolalar">Bolalar</option>
              <option value="Ilmiy">Ilmiy</option>
            </select>
          </div>

          {/* Holat */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Holat
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 border font-semibold border-gray-300 text-black dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white  transition-all"
            >
              <option value="all">Barcha holatlar</option>
              <option value="Mavjud">Mavjud</option>
              <option value="Sotilgan">Sotilgan</option>
            </select>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-black font-extrabold border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-4 text-left text-xs text-black  font-semibold   uppercase tracking-wider">
                  Rasm
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-black  uppercase tracking-wider">
                  Kitob nomi
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-black  uppercase tracking-wider">
                  Muallif
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">
                  Narx
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">
                  Kategoriya
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">
                  Holat
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">
                  Amal
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 ">
              {books.map((book) => (
                <tr
                  key={book.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-200 transition-all duration-200 hover:shadow-md"
                >
                  <td className="px-6 py-4">
                    <img
                      src={book.image}
                      alt={book.name}
                      className="w-12 h-16 object-cover rounded-lg shadow-sm"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-800 ">
                      {book.name}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 font-semibold">
                      {book.author}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-800">
                      {book.price.toLocaleString()} so'm
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                      {book.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        book.status === "Mavjud"
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {book.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-all">
                        <FaEdit />
                      </button>
                      <button className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-all">
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
  );
}
