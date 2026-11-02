"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, BookOpen, Undo2, User, Wallet } from "lucide-react";
import { NAV_ITEMS, isNavActive } from "../components/BottomNav";

const MORE = [
  { name: "Hamyon", href: "/KurierPanel/hamyon", icon: Wallet },
  { name: "Kitobni qaytarish", href: "/KurierPanel/kitobniQaytarish", icon: Undo2 },
  { name: "Bildirishnomalar", href: "/KurierPanel/bildirishnomalar", icon: Bell },
  { name: "Profil", href: "/KurierPanel/profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col border-r border-white/10 bg-[#0B1426] p-5 lg:flex">
      <div className="mb-8 flex items-center gap-3 px-1">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2F6BFF] text-white">
          <BookOpen size={18} />
        </span>
        <div>
          <p className="text-sm font-semibold leading-none text-white">Kuryer paneli</p>
          <p className="mt-1 text-[11px] text-[#8EA0B8]">Bugun ham birga</p>
        </div>
      </div>

      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = isNavActive(pathname, item);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium ${
                active ? "bg-[#2F6BFF] text-white" : "text-[#8EA0B8] hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="my-4 h-px bg-white/10" />

      <nav className="space-y-1">
        {MORE.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium ${
                active ? "bg-white/10 text-white" : "text-[#8EA0B8] hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
