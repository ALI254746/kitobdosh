"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBasket, Bookmark, User } from "lucide-react";
import { motion } from "framer-motion";

export default function MobileFooter() {
  const pathname = usePathname();

  const navItems = [
    {
      id: "home",
      label: "Asosiy",
      icon: Home,
      href: "/mobile",
    },
    {
      id: "market",
      label: "Market",
      icon: Search,
      href: "/mobile/components/marketbooks",
    },
    {
      id: "cart",
      label: "Savatcha",
      icon: ShoppingBasket,
      href: "/mobile/components/Savatcha",
      isFloating: true,
    },
    {
      id: "my-books",
      label: "Kitoblarim",
      icon: Bookmark,
      href: "/mobile/components/my-books",
    },
    {
      id: "profile",
      label: "Profil",
      icon: User,
      href: "/mobile/components/mobileprofile",
    },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 z-50 pb-safe transition-colors duration-300">
      <div className="flex justify-around items-end h-16 px-2 pb-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isFloating) {
            return (
              <div key={item.id} className="relative -top-5">
                <Link href={item.href}>
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center relative"
                    style={{
                      backgroundColor: "#52C6DA", // Brand Turquoise
                      boxShadow: "0 8px 20px rgba(82, 198, 218, 0.4)",
                    }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 text-[10px] font-bold text-white flex items-center justify-center">
                      2
                    </span>
                  </motion.div>
                </Link>
              </div>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              className="group flex flex-col items-center justify-center w-16 h-full relative"
            >
              <div className="relative p-1">
                {isActive && (
                    <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 bg-[#52C6DA]/10 dark:bg-[#52C6DA]/20 rounded-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                )}
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    y: isActive ? -2 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Icon
                    className={`w-6 h-6 mb-1 transition-colors duration-300 ${
                      isActive ? "text-[#52C6DA]" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-400"
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </motion.div>
              </div>
              
              <span
                className={`text-xs transition-all duration-300 ${
                  isActive
                    ? "font-extrabold text-[#52C6DA]"
                    : "font-bold text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-400"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </footer>
  );
}
