"use client";

import { useState, useEffect } from "react";
import Sidebar from "./YonNavbar";
import TopNavbar from "./topNavbar";
import AdminContext from "./AdminContext";

export default function AdminLayout({ children }) {
  const [appearance, setAppearance] = useState("light"); // light, dark, celery
  const [fontFamily, setFontFamily] = useState("Inter"); // Inter, Outfit, Montserrat, Fraktur
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Apply settings to document body or root
  useEffect(() => {
     // Apply Font
     document.documentElement.style.setProperty('--admin-font', 
        fontFamily === 'Inter' ? "'Inter', sans-serif" : 
        fontFamily === 'Outfit' ? "'Outfit', sans-serif" : 
        fontFamily === 'Montserrat' ? "'Montserrat', sans-serif" :
        "'UnifrakturMaguntia', cursive"
     );
     
     // Font Import via dynamic link if needed (Google Fonts)
     if (!document.getElementById('theme-fonts')) {
         const link = document.createElement('link');
         link.id = 'theme-fonts';
         link.rel = 'stylesheet';
         link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Montserrat:wght@400;700;900&family=Outfit:wght@400;700;900&family=UnifrakturMaguntia&display=swap';
         document.head.appendChild(link);
     }
  }, [fontFamily]);

  const value = {
      appearance,
      setAppearance,
      fontFamily,
      setFontFamily,
      sidebarOpen,
      setSidebarOpen,
      darkMode: appearance === 'dark',
      setDarkMode: (val) => setAppearance(val ? 'dark' : 'light')
  };

  return (
    <AdminContext.Provider value={value}>
      <div 
        className={`
            ${appearance === 'dark' ? 'dark' : ''} 
            ${appearance === 'celery' ? 'theme-celery' : ''}
        `}
        style={{ fontFamily: "var(--admin-font, 'Inter', sans-serif)" }}
      >
        <style jsx global>{`
          :root {
            --admin-font: 'Inter', sans-serif;
          }
          
          .theme-celery {
            --celery-main: #b1c44d;
            --celery-sky: #6CCFF6;
            --celery-bg: #f9fdf2;
            --celery-sidebar: #2d3419;
            --celery-text: #2d3419;
            --celery-border: #e2ecc1;
          }
          
          /* Celery theme overrides */
          .theme-celery body { background-color: var(--celery-bg); color: var(--celery-text); }
          
          /* Sidebar Overrides */
          .theme-celery .bg-\[\#163201\] { background-color: var(--celery-sidebar) !important; }
          .theme-celery .text-\[\#A3ED96\] { color: var(--celery-main) !important; }
          .theme-celery .bg-\[\#A3ED96\] { background-color: var(--celery-main) !important; }
          .theme-celery .from-\[\#A3ED96\] { --tw-gradient-from: var(--celery-sky) !important; }
          .theme-celery .to-\[\#76b86a\] { --tw-gradient-to: var(--celery-main) !important; }
          .theme-celery .border-\[\#A3ED96\]\/10 { border-color: rgba(177, 196, 77, 0.2) !important; }
          .theme-celery .shadow-\[\#A3ED96\]\/20 { box-shadow: 0 10px 15px -3px rgba(108, 207, 246, 0.3) !important; }
          
          /* TopNavbar Overrides */
          .theme-celery .bg-\[\#163201\]\/90 { background-color: rgba(45, 52, 25, 0.9) !important; }
          .theme-celery .border-\[\#A3ED96\]\/20 { border-color: var(--celery-border) !important; }
          
          /* Main Content Overrides */
          .theme-celery .bg-\[\#0b1a00\] { background-color: var(--celery-bg) !important; }
          .theme-celery .bg-white { background-color: white !important; }
          .theme-celery .text-white { color: var(--celery-text) !important; }
          .theme-celery .bg-\[\#96C7B9\] { background-color: var(--celery-main) !important; }
          .theme-celery .text-\[\#96C7B9\] { color: var(--celery-main) !important; }
          .theme-celery .border-\[\#D1F0E0\] { border-color: var(--celery-border) !important; }
          .theme-celery .bg-\[\#D1F0E0\] { background-color: #eef7d5 !important; }
          .theme-celery .shadow-\[\#D1F0E0\]\/30 { box-shadow: 0 25px 50px -12px rgba(177, 196, 77, 0.25) !important; }
          .theme-celery .text-\[\#1F2937\] { color: var(--celery-text) !important; }

          /* Font overrides */
          body { font-family: var(--admin-font); }
        `}</style>
        
        <div className={`flex min-h-screen ${appearance === 'dark' ? 'bg-[#0b1a00] text-white' : appearance === 'celery' ? 'bg-[#f9fdf2] text-[#2d3419]' : 'bg-white text-gray-900'} transition-all duration-300`}>
          {/* Sidebar */}
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          {/* Main content */}
          <div className="flex-1 flex flex-col min-h-screen lg:ml-[280px] min-w-0">
            {/* Navbar */}
            <div className="fixed top-0 left-0 right-0 lg:left-[280px] z-30">
              <TopNavbar
                darkMode={appearance === 'dark'}
                setDarkMode={(val) => setAppearance(val ? 'dark' : 'light')}
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
