"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Sidebar from "./YonNavbar";
import TopNavbar from "./topNavbar";
import AdminContext from "./AdminContext";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [appearance, setAppearance] = useState("light");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--admin-font",
      fontFamily === "Inter"
        ? "'Inter', sans-serif"
        : fontFamily === "Outfit"
          ? "'Outfit', sans-serif"
          : fontFamily === "Montserrat"
            ? "'Montserrat', sans-serif"
            : "'UnifrakturMaguntia', cursive"
    );

    if (!document.getElementById("theme-fonts")) {
      const link = document.createElement("link");
      link.id = "theme-fonts";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Montserrat:wght@400;700;900&family=Outfit:wght@400;700;900&family=UnifrakturMaguntia&display=swap";
      document.head.appendChild(link);
    }
  }, [fontFamily]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const toggleSidebar = () => {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setDesktopCollapsed((value) => !value);
      setMobileOpen(false);
    } else {
      setMobileOpen((value) => !value);
    }
  };

  const value = {
    appearance,
    setAppearance,
    fontFamily,
    setFontFamily,
    sidebarOpen: mobileOpen,
    setSidebarOpen: setMobileOpen,
    darkMode: appearance === "dark",
    setDarkMode: (val) => setAppearance(val ? "dark" : "light"),
  };

  return (
    <AdminContext.Provider value={value}>
      <div
        className={`admin-shell ${appearance === "dark" ? "dark" : ""} ${appearance === "celery" ? "theme-celery" : ""}`}
        data-collapsed={desktopCollapsed ? "true" : "false"}
        data-mobile={mobileOpen ? "open" : "closed"}
        style={{ fontFamily: "var(--admin-font, 'Inter', sans-serif)" }}
      >
        <style jsx global>{`
          :root {
            --admin-font: "Inter", sans-serif;
          }
          .admin-shell {
            min-height: 100vh;
            background: #0b1220;
            color: #e8eef7;
          }
          .admin-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            z-index: 50;
            display: flex;
            width: 268px;
            flex-direction: column;
            transform: translateX(-100%);
            border-right: 1px solid rgba(255, 255, 255, 0.06);
            background: #0a101c;
            transition: transform 0.25s ease;
          }
          .admin-main {
            display: flex;
            min-height: 100vh;
            min-width: 0;
            flex: 1;
            flex-direction: column;
            margin-left: 0;
            transition: margin-left 0.25s ease;
          }
          .admin-topbar {
            position: sticky;
            top: 0;
            z-index: 30;
            height: 68px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            background: rgba(11, 18, 32, 0.94);
            backdrop-filter: blur(14px);
          }
          @media (min-width: 1024px) {
            .admin-shell:not([data-collapsed="true"]) .admin-sidebar {
              transform: translateX(0);
            }
            .admin-shell:not([data-collapsed="true"]) .admin-main {
              margin-left: 268px;
            }
          }
          @media (max-width: 1023px) {
            .admin-shell[data-mobile="open"] .admin-sidebar {
              transform: translateX(0);
            }
          }
          .theme-celery {
            --celery-main: #b1c44d;
            --celery-sky: #6ccff6;
            --celery-bg: #f9fdf2;
            --celery-sidebar: #2d3419;
            --celery-text: #2d3419;
            --celery-border: #e2ecc1;
          }
          .theme-celery .bg-\\[\\#163201\\] { background-color: var(--celery-sidebar) !important; }
          .theme-celery .text-\\[\\#A3ED96\\] { color: var(--celery-main) !important; }
          .theme-celery .bg-\\[\\#A3ED96\\] { background-color: var(--celery-main) !important; }
          .theme-celery .border-\\[\\#A3ED96\\]\\/10 { border-color: rgba(177, 196, 77, 0.2) !important; }
          body { font-family: var(--admin-font); }
        `}</style>

        <Sidebar onNavigate={() => setMobileOpen(false)} />

        {mobileOpen && (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            aria-label="Menyuni yopish"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <div className="admin-main">
          <TopNavbar onToggleSidebar={toggleSidebar} />
          <main className="flex-1">{children}</main>
          <footer className="flex flex-col gap-3 border-t border-white/10 px-5 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between lg:px-8">
            <p>Kitobdosh — Bilimli jamiyat sari</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/mainPage/AboutUs" className="hover:text-white">
                Maxfiylik siyosati
              </Link>
              <Link href="/mainPage/AboutUs" className="hover:text-white">
                Foydalanish shartlari
              </Link>
              <Link href="/mainPage/contactUs" className="hover:text-white">
                Yordam
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </AdminContext.Provider>
  );
}
