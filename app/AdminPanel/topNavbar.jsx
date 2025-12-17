"use client";

import { FaBars, FaMoon, FaSun, FaBell } from "react-icons/fa";

export default function TopNavbar({
  darkMode,
  setDarkMode,
  sidebarOpen,
  setSidebarOpen,
}) {
  return (
    <div
      className={`px-4 sm:px-6 lg:px-8 py-4 ${
        darkMode ? "bg-gray-800" : "bg-white"
      } transition-colors duration-300 shadow-md`}
    >
      <div className="flex items-center justify-between">
        {/* Sidebar toggle button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
        >
          <FaBars className="text-xl" />
        </button>

        {/* Right side buttons */}
        <div className="flex items-center space-x-4">
          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition shadow-md hover:shadow-lg"
          >
            {darkMode ? (
              <FaSun className="text-yellow-400" />
            ) : (
              <FaMoon className="text-gray-600" />
            )}
          </button>

          {/* Notification bell */}
          <button className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition shadow-md hover:shadow-lg">
            <FaBell className="text-gray-600 dark:text-gray-300" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </div>
  );
}
