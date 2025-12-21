"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBasket, Bookmark, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/app/CartContext";

export default function MobileFooter() {
  const pathname = usePathname();
  const { cartItems } = useCart();

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
    <footer className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-100/50 dark:border-slate-800/50 z-50 pb-safe shadow-[0_-8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-all duration-500">
      <div className="flex justify-around items-end h-18 px-2 pb-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isFloating) {
            return (
              <div key={item.id} className="relative -top-6">
                <Link href={item.href} prefetch={true}>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.05 }}
                    whileTap={{ scale: 0.9, y: 0 }}
                    className="w-16 h-16 rounded-3xl shadow-2xl flex items-center justify-center relative transition-all"
                    style={{
                      background: "linear-gradient(135deg, #52C6DA 0%, #3A7BD5 100%)",
                      boxShadow: "0 10px 25px rgba(82, 198, 218, 0.5)",
                    }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                    <AnimatePresence>
                        {cartItems.length > 0 && (
                        <motion.span 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 text-[10px] font-black text-white flex items-center justify-center shadow-md"
                        >
                            {cartItems.length}
                        </motion.span>
                        )}
                    </AnimatePresence>
                  </motion.div>
                </Link>
              </div>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              prefetch={true}
              className="group flex flex-col items-center justify-center w-16 h-full relative"
            >
              <div className="relative p-2">
                <AnimatePresence>
                    {isActive && (
                        <motion.div
                            layoutId="active-nav-glow"
                            className="absolute inset-0 bg-[#52C6DA]/15 dark:bg-[#52C6DA]/25 rounded-2xl blur-sm"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                        />
                    )}
                </AnimatePresence>
                <motion.div
                  animate={{
                    scale: isActive ? 1.15 : 1,
                    y: isActive ? -3 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Icon
                    className={`w-6 h-6 mb-1 transition-all duration-300 ${
                      isActive ? "text-[#52C6DA] drop-shadow-[0_0_8px_rgba(82,198,218,0.5)]" : "text-slate-400 dark:text-slate-500"
                    }`}
                    strokeWidth={isActive ? 3 : 2}
                  />
                </motion.div>
              </div>
              
              <span
                className={`text-[9px] uppercase tracking-tighter font-black transition-all duration-300 ${
                  isActive
                    ? "text-[#52C6DA] scale-110"
                    : "text-slate-400 dark:text-slate-500"
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
