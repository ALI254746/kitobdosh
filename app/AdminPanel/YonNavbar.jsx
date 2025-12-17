"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaChartLine,
  FaBook,
  FaHandshake,
  FaShoppingCart,
  FaUsers,
  FaBell,
  FaCog,
  FaTimes,
} from "react-icons/fa";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const pathname = usePathname(); // hozirgi sahifa yo'lini olish

  const menuItems = [
    { name: "Dashboard", icon: <FaChartLine />, href: "/AdminPanel" },
    { name: "Kitoblar", icon: <FaBook />, href: "/AdminPanel/Kitoblar" },
    {
      name: "Ijara So'rovlari",
      icon: <FaHandshake />,
      href: "/AdminPanel/rentRequest",
    },
    {
      name: "Kurierlar",
      icon: <FaHandshake />,
      href: "/AdminPanel/kurierlar",
    },
    {
      name: "Sotuvdagi kitoblar",
      icon: <FaShoppingCart />,
      href: "/AdminPanel/sotuvdagiKitoblar",
    },
    {
      name: "Foydalanuvchilar",
      icon: <FaUsers />,
      href: "/AdminPanel/Foydalanuvchilar",
    },
    {
      name: "Bildirishnomalar",
      icon: <FaBell />,
      href: "/AdminPanel/BildirishNomalar",
      badge: 5,
    },
    { name: "Sozlamalar", icon: <FaCog />, href: "/admin/settings" },
  ];

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white shadow-lg transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Header */}
        <div className="p-6 border-b border-blue-500 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg text-blue-600">
              <FaBook className="text-xl" />
            </div>
            <h1 className="text-xl font-bold">Kitob Admin</h1>
          </div>
          <button
            className="lg:hidden text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, idx) => {
            const isActive = pathname === item.href; // hozirgi sahifa bilan solishtirish
            return (
              <Link prefetch={true} key={idx} href={item.href}>
                <div
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 shadow-md transform hover:-translate-y-0.5
                    ${
                      isActive
                        ? "bg-white/40 text-white font-bold"
                        : "bg-white/20 hover:bg-white/30"
                    }
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
}
