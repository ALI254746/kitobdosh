"use client";

import { useState } from "react";
import Sidebar from "./YonNavbar";
import TopNavbar from "./topNavbar";

export default function AdminLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
          {/* Navbar */}
          <div className="fixed top-0 left-0 right-0 lg:left-64 z-30">
            <TopNavbar
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          </div>

          {/* Page content */}
          <main className="mt-12 ">
            {typeof children === "function" ? children(darkMode) : children}
          </main>
        </div>
      </div>
    </div>
  );
}
