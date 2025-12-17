"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBook, FaBell, FaUser, FaCog } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
export default function Navbar() {
  const pathname = usePathname(); // hozirgi URL
  const isActive = pathname === "/mainPage/savatcha";
  const isActive1 = pathname === "/mainPage/profile";
  const isActive2 = pathname === "/mainPage/sozlamalar";
  const links = [
    { id: "mainPage", name: "Bosh sahifa", path: "/mainPage" },
    { id: "sotib-olish", name: "Sotib olish", path: "/mainPage/sotibolish" },
    { id: "ijarabook", name: "Ijara", path: "/mainPage/ijarabook" },
    { id: "biz-haqimizda", name: "Biz haqimizda", path: "/mainPage/AboutUs" },
    { id: "boglanish", name: "Bog‘lanish", path: "/mainPage/contactUs" },
  ];

  return (
    <header className="fixed top-0 w-full z-50">
      <div className="w-full glass-morphism backdrop-blur-xl bg-amber-100 ">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between rounded-b-xl">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <FaBook className="text-2xl text-blue-600" />
            <span className="text-2xl font-bold text-gray-800">
              Feruza Book
            </span>
          </div>

          {/* O‘rta qism — sahifa tugmalari */}
          <div className="flex gap-3 sm:gap-5">
            {links.map((link) => (
              <Link prefetch={true} key={link.id} href={link.path}>
                <button
                  className={`relative overflow-hidden px-4 py-2 sm:px-6 sm:py-3 font-semibold rounded-xl transition-all duration-300 ease-in-out
                    ${
                      pathname === link.path
                        ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-300 scale-105"
                        : "bg-white/40 text-gray-800 hover:bg-gradient-to-r hover:from-blue-200 hover:to-cyan-100 hover:scale-105 hover:shadow-md"
                    }`}
                >
                  <span
                    className={`absolute inset-0 rounded-xl transition-all duration-500 ${
                      pathname === link.path
                        ? "bg-white/20 blur-md opacity-100"
                        : "opacity-0"
                    }`}
                  ></span>
                  <span className="relative z-10">{link.name}</span>
                </button>
              </Link>
            ))}
          </div>

          {/* O‘ng tomonda iconlar */}
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-full cursor-pointer hover:scale-110 transition-transform bg-gray-100">
              <FaBell className="text-gray-600 text-xl" />
            </div>

            <Link
              prefetch={true}
              href="/mainPage/profile"
              className={`p-2 rounded-full cursor-pointer transition-transform hover:scale-110 ${
                isActive1
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <FaUser className="text-xl" />
            </Link>
            <Link
              prefetch={true}
              href="/mainPage/savatcha"
              className={`p-2 rounded-full cursor-pointer transition-transform hover:scale-110 ${
                isActive
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <FaShoppingCart className="text-xl" />
            </Link>
            <Link
              prefetch={true}
              href="/mainPage/sozlamalar"
              className={`p-2 rounded-full cursor-pointer transition-transform hover:scale-110 ${
                isActive2
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <FaCog className="text-xl" />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
