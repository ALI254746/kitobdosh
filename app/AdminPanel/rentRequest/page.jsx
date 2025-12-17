"use client";

import Image from "next/image";

export default function RentRequests() {
  const rentData = [
    {
      user: {
        name: "Malika Karimova",
        email: "malika@email.com",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      },
      book: {
        title: "O'tkan kunlar",
        author: "Abdulla Qodiriy",
        cover:
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=150&fit=crop",
      },
      duration: "14 kun",
      price: "25,000 so'm",
      status: "Kutayotgan",
    },
    {
      user: {
        name: "Sardor Aliyev",
        email: "sardor@email.com",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      },
      book: {
        title: "Mehrobdan chayon",
        author: "Abdulla Qahhor",
        cover:
          "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=100&h=150&fit=crop",
      },
      duration: "7 kun",
      price: "15,000 so'm",
      status: "Tasdiqlangan",
    },
    {
      user: {
        name: "Nilufar Rahimova",
        email: "nilufar@email.com",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      },
      book: {
        title: "Ufq",
        author: "Said Ahmad",
        cover:
          "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=150&fit=crop",
      },
      duration: "21 kun",
      price: "35,000 so'm",
      status: "Rad etilgan",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-neutral-50  rounded-xl p-6 shadow-2xl mb-8 transition-colors duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
          <h3 className="text-lg font-bold text-gray-900 ">Ijara So&apos;rovlari</h3>
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:-translate-y-0.5">
              <i className="fas fa-filter mr-2"></i>Filtrlash
            </button>
            <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Barcha holatlar</option>
              <option>Tasdiqlangan</option>
              <option>Kutayotgan</option>
              <option>Rad etilgan</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-black font-semibold text-sm">
                  Foydalanuvchi
                </th>
                <th className="text-left py-3 px-4 text-black  font-semibold text-sm">
                  Kitob
                </th>
                <th className="text-left py-3 px-4 text-black font-semibold text-sm">
                  Muddat
                </th>
                <th className="text-left py-3 px-4 text-black font-semibold text-sm">
                  Narx
                </th>
                <th className="text-left py-3 px-4 text-black font-semibold text-sm">
                  Holat
                </th>
                <th className="text-left py-3 px-4 text-black font-semibold text-sm">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody>
              {rentData.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100  hover:bg-gray-50 dark:hover:bg-neutral-200/50 transition-colors duration-150"
                >
                  {/* User */}
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-10 h-10">
                        <Image
                          src={item.user.avatar}
                          alt="User"
                          fill
                          className="rounded-full shadow-md object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-black">
                          {item.user.name}
                        </p>
                        <p className="text-sm text-black">{item.user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Book */}
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-12 h-16">
                        <Image
                          src={item.book.cover}
                          alt="Book"
                          fill
                          className="rounded shadow-md object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 ">
                          {item.book.title}
                        </p>
                        <p className="text-sm text-gray-500 ">
                          {item.book.author}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Duration */}
                  <td className="py-4 px-4 font-semibold text-gray-900 ">
                    {item.duration}
                  </td>

                  {/* Price */}
                  <td className="py-4 px-4 text-gray-900  font-semibold">
                    {item.price}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium shadow-md ${
                        item.status === "Tasdiqlangan"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 "
                          : item.status === "Kutayotgan"
                          ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 "
                          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                        <i className="fas fa-check"></i>
                      </button>
                      <button className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                        <i className="fas fa-times"></i>
                      </button>
                      <button className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                        <i className="fas fa-eye"></i>
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
