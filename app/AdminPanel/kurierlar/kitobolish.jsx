"use client";

import { useState } from "react";
import Image from "next/image";

export default function PickupTab({ books }) {
  const [activeTab, setActiveTab] = useState("pickup");
  const [pickupFilter, setPickupFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  // boshida bo'sh array
  const [bookList, setBookList] = useState([
    {
      id: "K001",
      name: "Sariq devni minib",
      user: "Ali Karimov",
      courier: "Jasur Tursunov",
      status: "kutmoqda",
      image: "https://picsum.photos/100/150?random=1",
    },
    {
      id: "K002",
      name: "O‘tkan kunlar",
      user: "Dilnoza Sodiqova",
      courier: "Bahrom Yuldashev",
      status: "yoldaman",
      image: "https://picsum.photos/100/150?random=2",
    },
    {
      id: "K003",
      name: "Jimjitlik",
      user: "Rustam Qodirov",
      courier: "Ulug‘bek Raxmonov",
      status: "olib_boldi",
      image: "https://picsum.photos/100/150?random=3",
    },
  ]);
  const filteredBooks = (bookList || []).filter(
    (book) =>
      (pickupFilter === "all" || book.status === pickupFilter) &&
      (book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.user.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (activeTab !== "pickup") return null;

  return (
    <div className="p-2">
      {/* Filter & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {["all", "kutmoqda", "yoldaman", "olib_boldi"].map((status) => {
            const labels = {
              all: "Barchasi",
              kutmoqda: "Kutmoqda",
              yoldaman: "Yo'ldaman",
              olib_boldi: "Olib bo'ldi",
            };
            return (
              <button
                key={status}
                onClick={() => setPickupFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pickupFilter === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {labels[status]}
              </button>
            );
          })}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Ism yoki kitob bo'yicha qidirish"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full lg:w-80"
          />
          <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kitob rasmi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kitob nomi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Foydalanuvchi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kitob ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Holati
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kuryer ismi
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
                className="hover:bg-gray-50 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="relative w-16 h-24">
                    <Image
                      src={book.image}
                      alt={book.name}
                      fill
                      className="rounded shadow-sm cursor-pointer object-cover"
                      onClick={() => setSelectedBook(book)}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="text-sm font-medium text-gray-900">
                    {book.name}
                  </p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <p
                    className="text-sm text-blue-600 hover:underline cursor-pointer"
                    onClick={() => setSelectedUser(book.user)}
                  >
                    {book.user}
                  </p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="text-sm text-gray-900">{book.id}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      book.status === "kutmoqda"
                        ? "bg-yellow-100 text-yellow-800"
                        : book.status === "qabul_qildi"
                        ? "bg-green-100 text-green-800"
                        : book.status === "yoldaman"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {book.status === "kutmoqda"
                      ? "Kutmoqda"
                      : book.status === "qabul_qildi"
                      ? "Qabul qildi"
                      : book.status === "yoldaman"
                      ? "Yo'ldaman"
                      : "Olib bo'ldi"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="text-sm text-gray-900">{book.courier}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all">
                    Kitobni berdim kuryerga
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
