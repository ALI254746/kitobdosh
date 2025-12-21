"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaLeaf,
  FaChartLine,
  FaBook,
  FaHandshake,
  FaShoppingCart,
  FaUsers,
  FaBell,
  FaCog,
  FaTimes,
  FaSignOutAlt,
  FaBullhorn,
  FaStore,
} from "react-icons/fa";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: <FaChartLine />, href: "/AdminPanel" },
    { name: "Kitoblar", icon: <FaBook />, href: "/AdminPanel/Kitoblar" },
    {
      name: "Ijara So'rovlari",
      icon: <FaHandshake />,
      href: "/AdminPanel/rentRequest",
    },
    {
      name: "Kurierlar",
      icon: <FaHandshake />,
      href: "/AdminPanel/kurierlar",
    },
    {
      name: "Sotuvdagi kitoblar",
      icon: <FaShoppingCart />,
      href: "/AdminPanel/sotuvdagiKitoblar",
    },
    {
      name: "Foydalanuvchilar",
      icon: <FaUsers />,
      href: "/AdminPanel/Foydalanuvchilar",
    },
    {
      name: "Bildirishnomalar",
      icon: <FaBell />,
      href: "/AdminPanel/BildirishNomalar",
      badge: 5,
    },
    {
      name: "Promo Bannerlar",
      icon: <FaBullhorn />,
      href: "/AdminPanel/promo",
    },
    {
      name: "Do'konlar",
      icon: <FaStore />,
      href: "/AdminPanel/stores",
    },
    { name: "Sozlamalar", icon: <FaCog />, href: "/AdminPanel/Sozlamalar" },
  ];

  return (
    <>
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        // Desktopda doim ko'rinishi uchun lg:translate-x-0 o'rniga responsiv variantlar kerak
        // Lekin 'animate' prop overriding qilib yuboradi. Shuning uchun CSS class orqali control qilamiz.
        // Yoki framer-motion varianti:
        variants={{
          closed: { x: "-100%" },
          open: { x: 0 },
        }}
        // Desktop breakpointni (1024px) hisobga olish kerak. Lekin eng oddiy yo'li: hidden vs block logic yoki fixed sidebar
        className={`fixed inset-y-0 left-0 w-[280px] bg-[#163201] text-white shadow-2xl z-50 transform lg:!transform-none lg:!translate-x-0 transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full border-r border-[#A3ED96]/20"
        }`}
      >
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-[#A3ED96]/10 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 bg-[#A3ED96]/5 rounded-full blur-[60px]"></div>
        </div>

        {/* Header */}
        <div className="relative p-8 flex items-center justify-between border-b border-[#A3ED96]/10">
          <Link href="/AdminPanel" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-[#A3ED96] to-[#76b86a] rounded-xl flex items-center justify-center shadow-lg shadow-[#A3ED96]/20 group-hover:scale-105 transition-transform duration-300">
              <FaLeaf className="text-[#163201] text-2xl" />
            </div>
            <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Kitobdosh</h1>
                <p className="text-xs text-[#A3ED96]/80 font-medium uppercase tracking-widest">Admin Panel</p>
            </div>
          </Link>
          <button
            className="lg:hidden text-[#A3ED96] hover:text-white transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="relative flex-1 px-4 py-6 space-y-2 overflow-y-auto h-[calc(100vh-180px)] scrollbar-hide">
          {menuItems.map((item, idx) => {
            const isActive = pathname === item.href;
            return (
              <Link prefetch={true} key={idx} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group overflow-hidden
                    ${
                      isActive
                        ? "bg-[#A3ED96] text-[#163201] shadow-lg shadow-[#A3ED96]/20"
                        : "hover:bg-white/5 text-slate-300 hover:text-white"
                    }
                  `}
                >
                    {/* Active Indicator Line */}
                    {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#163201] rounded-r-full"></div>
                    )}

                  <span className={`text-xl transition-colors duration-300 ${isActive ? "text-[#163201]" : "text-[#A3ED96] group-hover:text-[#A3ED96]"}`}>
                    {item.icon}
                  </span>
                  <span className={`font-bold tracking-wide ${isActive ? "text-[#163201]" : ""}`}>{item.name}</span>
                  
                  {item.badge && (
                    <span className={`ml-auto text-xs font-bold px-2.5 py-1 rounded-full shadow-sm
                        ${isActive ? "bg-[#163201] text-[#A3ED96]" : "bg-[#A3ED96] text-[#163201]"}
                    `}>
                      {item.badge}
                    </span>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Footer / User Profile */}
        <div className="absolute bottom-0 w-full p-4 border-t border-[#A3ED96]/10 bg-[#163201]/95 backdrop-blur-md">
            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center border-2 border-[#A3ED96]/30">
                    <span className="font-bold text-white">A</span>
                </div>
                <div className="text-left flex-1">
                    <p className="text-sm font-bold text-white">Admin User</p>
                    <p className="text-xs text-gray-400">admin@kitobdosh.uz</p>
                </div>
                <FaSignOutAlt className="text-gray-500 group-hover:text-red-400 transition-colors" />
            </button>
        </div>
      </motion.div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
