"use client";

import { useState } from "react";
import Sidebar from "./saidebar/page";
import TopNavbar from "./TopNavbar/page";
import BottomNav from "./components/BottomNav";

export default function AdminLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <Sidebar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <div className="lg:ml-64">
        <TopNavbar
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <main className="p-4 sm:p-6">{children}</main>
      </div>
      
      <BottomNav />
    </div>
  );
}
