"use client";
import { useState } from "react";
import Sidebar from "./YonNavbar";
import TopNavbar from "./topNavbar";
import AdminContext from "./AdminContext";
import "./admin-theme.css";

export default function AdminLayout({ children }) {
  const [appearance, setAppearance] = useState("dark");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const darkMode = appearance === "dark";
  return (
    <AdminContext.Provider value={{ appearance, setAppearance, fontFamily, setFontFamily, sidebarOpen, setSidebarOpen, darkMode, setDarkMode: value => setAppearance(value ? "dark" : "light") }}>
      <div className={"admin-shell " + (darkMode ? "dark" : "admin-light")} style={{ fontFamily: fontFamily + ", sans-serif" }}>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="admin-workspace">
          <TopNavbar darkMode={darkMode} setDarkMode={value => setAppearance(value ? "dark" : "light")} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="admin-content">{children}</main>
          <footer className="admin-footer"><span>Kitobdosh — Bilimli jamiyat sari</span><span>Boshqaruv tizimi · v1.0</span></footer>
        </div>
      </div>
    </AdminContext.Provider>
  );
}
