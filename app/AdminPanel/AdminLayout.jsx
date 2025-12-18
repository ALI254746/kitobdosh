"use client";

import { useState } from "react";
import Sidebar from "./YonNavbar";
import TopNavbar from "./topNavbar";

import AdminContext from "./AdminContext";

export default function AdminLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminContext.Provider value={{ darkMode, setDarkMode, sidebarOpen, setSidebarOpen }}>
      <div className={darkMode ? "dark" : ""}>
        <div className="flex min-h-screen text-gray-900 dark:text-white">
          {/* Sidebar */}
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          {/* Main content */}
          <div className="flex-1 flex flex-col min-h-screen lg:ml-[280px]">
            {/* Navbar */}
            <div className="fixed top-0 left-0 right-0 lg:left-[280px] z-30">
              <TopNavbar
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            </div>

            {/* Page content */}
            <main className="mt-[88px] p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </AdminContext.Provider>
  );
}
