"use client";

import React from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import { MainProvider } from "./MainContext";

function Layout({ children }) {
  return (
    <MainProvider>
      <div className="flex flex-col min-h-screen transition-colors duration-300 dark:bg-[#0f172a]">
        {/* Navbar har doim yuqorida */}
        <Navbar />

        {/* Asosiy kontent */}
        <main className="flex-grow">{children}</main>

        {/* Footer har doim pastda */}
        <Footer />
      </div>
    </MainProvider>
  );
}

export default Layout;
