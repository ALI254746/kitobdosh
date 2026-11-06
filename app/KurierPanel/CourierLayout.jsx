"use client";

import { useState } from "react";
import Sidebar from "./sidebar/page";
import TopNavbar from "./TopNavbar/page";
import BottomNav from "./components/BottomNav";
import { MainProvider } from "../mainPage/MainContext";

export default function CourierLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <MainProvider>
      <div className="min-h-screen bg-[#FDFBF7] dark:bg-slate-900 transition-colors duration-300 font-sans selection:bg-[#96C7B9]/20">
        <Sidebar
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <div className="lg:ml-64 pt-20 pb-32 lg:pb-12 min-h-screen relative">
          <TopNavbar
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
          />

          <main className="px-4 sm:px-8 py-8 max-w-7xl mx-auto">
              {children}
          </main>
        </div>
        
        {/* Mobile Bottom Navigation (Visible only on mobile) */}
        <div className="lg:hidden">
            <BottomNav />
        </div>
      </div>
    </MainProvider>
  );
}
