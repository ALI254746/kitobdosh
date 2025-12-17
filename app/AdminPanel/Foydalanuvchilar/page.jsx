"use client";
import React from "react";
import {
  FaUsers,
  FaUserPlus,
  FaShoppingCart,
  FaBookReader,
} from "react-icons/fa";
import { FaEye, FaEnvelope } from "react-icons/fa";
// 10 ta foydalanuvchi ma'lumotlari
const users = [
  {
    id: 1,
    initials: "AK",
    name: "Alisher Karimov",
    email: "alisher.k@example.com",
    bought: 12,
    rented: 5,
    joined: "15 Yan, 2024",
  },
  {
    id: 2,
    initials: "DN",
    name: "Dilnoza Normatova",
    email: "dilnoza.n@example.com",
    bought: 8,
    rented: 3,
    joined: "12 Yan, 2024",
  },
  {
    id: 3,
    initials: "SO",
    name: "Sardor Olimov",
    email: "sardor.o@example.com",
    bought: 15,
    rented: 7,
    joined: "10 Yan, 2024",
  },
  {
    id: 4,
    initials: "MU",
    name: "Murod Usmonov",
    email: "murod.u@example.com",
    bought: 5,
    rented: 2,
    joined: "18 Yan, 2024",
  },
  {
    id: 5,
    initials: "NZ",
    name: "Nazira Zokirova",
    email: "nazira.z@example.com",
    bought: 9,
    rented: 4,
    joined: "20 Yan, 2024",
  },
  {
    id: 6,
    initials: "JB",
    name: "Jahongir Bozorov",
    email: "jahongir.b@example.com",
    bought: 11,
    rented: 6,
    joined: "22 Yan, 2024",
  },
  {
    id: 7,
    initials: "LT",
    name: "Lola Toirova",
    email: "lola.t@example.com",
    bought: 7,
    rented: 3,
    joined: "25 Yan, 2024",
  },
  {
    id: 8,
    initials: "FR",
    name: "Feruza Rasulova",
    email: "feruza.r@example.com",
    bought: 13,
    rented: 8,
    joined: "28 Yan, 2024",
  },
  {
    id: 9,
    initials: "SH",
    name: "Shoxruh Husanov",
    email: "shoxruh.h@example.com",
    bought: 6,
    rented: 2,
    joined: "30 Yan, 2024",
  },
  {
    id: 10,
    initials: "MD",
    name: "Madina Davronova",
    email: "madina.d@example.com",
    bought: 10,
    rented: 5,
    joined: "02 Fev, 2024",
  },
];
const statsData = [
  {
    id: 1,
    title: "Jami Foydalanuvchilar",
    value: "1,247",
    icon: <FaUsers className="text-2xl text-blue-600" />,
    color: "from-blue-100 to-blue-200 text-blue-800 text-blue-700",
    tag: "Jami",
    delay: 100,
  },
  {
    id: 2,
    title: "Yangi Foydalanuvchilar",
    value: "23",
    icon: <FaUserPlus className="text-2xl text-green-600" />,
    color: "from-green-100 to-green-200 text-green-800 text-green-700",
    tag: "Bugun",
    delay: 200,
  },
  {
    id: 3,
    title: "Kitoblar Sotildi",
    value: "3,456",
    icon: <FaShoppingCart className="text-2xl text-yellow-600" />,
    color: "from-yellow-100 to-yellow-200 text-yellow-800 text-yellow-700",
    tag: "Sotilgan",
    delay: 300,
  },
  {
    id: 4,
    title: "Kitoblar Ijaraga Berildi",
    value: "892",
    icon: <FaBookReader className="text-2xl text-pink-600" />,
    color: "from-pink-100 to-pink-200 text-pink-800 text-pink-700",
    tag: "Ijara",
    delay: 400,
  },
];

const UsersStats = () => {
  return (
    <div className="min-h-screen bg-gray-100 mt-2 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {statsData.map((stat) => (
          <div
            key={stat.id}
            className={`bg-gradient-to-br ${stat.color
              .split(" ")
              .slice(0, 2)
              .join(
                " "
              )} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer`}
            data-aos="fade-up"
            data-aos-delay={stat.delay}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white bg-opacity-50 rounded-full p-3">
                {stat.icon}
              </div>
              <span
                className={`text-xs font-semibold ${stat.color
                  .split(" ")
                  .slice(2)
                  .join(" ")} bg-white bg-opacity-50 px-3 py-1 rounded-full`}
              >
                {stat.tag}
              </span>
            </div>
            <h3
              className={`text-3xl sm:text-4xl font-bold ${stat.color
                .split(" ")
                .slice(2, 3)
                .join(" ")} mb-1`}
            >
              {stat.value}
            </h3>
            <p
              className={`text-sm ${stat.color
                .split(" ")
                .slice(3)
                .join(" ")} font-medium`}
            >
              {stat.title}
            </p>
          </div>
        ))}
      </div>
      <div className="min-h-screen bg-gray-100 text-gray-900 p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Foydalanuvchilar Ro'yxati
          </h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Qidirish..."
                className="w-full sm:w-64 pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>

            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2">
              <i className="fas fa-filter"></i>
              Filter
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="py-3 px-6">Ism</th>
                <th className="py-3 px-6">Email</th>
                <th className="py-3 px-6">Olingan kitoblar</th>
                <th className="py-3 px-6">Berilgan kitoblar</th>
                <th className="py-3 px-6">Qo‘shilgan sana</th>
                <th className="py-3 px-6">Harakatlar</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-100 hover:bg-blue-50 transition-all duration-200"
                >
                  <td className="py-4 px-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white font-semibold">
                      {user.initials}
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </td>
                  <td className="py-4 px-6">{user.email}</td>
                  <td className="py-4 px-6">
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                      {user.bought} kitob
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium">
                      {user.rented} kitob
                    </span>
                  </td>
                  <td className="py-4 px-6">{user.joined}</td>
                  <td className="py-4 px-6 flex gap-2">
                    <button className="flex items-center gap-2 bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 transition-colors">
                      <FaEye /> Ko‘rish
                    </button>
                    <button className="flex items-center gap-2 bg-green-100 text-green-600 p-2 rounded-lg hover:bg-green-200 transition-colors">
                      <FaEnvelope /> Xabar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersStats;
