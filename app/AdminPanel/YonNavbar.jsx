"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  ShoppingBag,
  BookMarked,
  Users,
  Truck,
  Image as ImageIcon,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

const menuItems = [
  { name: "Boshqaruv paneli", icon: LayoutDashboard, href: "/AdminPanel" },
  { name: "Kitoblar", icon: BookOpen, href: "/AdminPanel/Kitoblar" },
  { name: "Buyurtmalar", icon: ShoppingBag, href: "/AdminPanel/sotuvdagiKitoblar" },
  { name: "Ijaralar", icon: BookMarked, href: "/AdminPanel/rentRequest" },
  { name: "Foydalanuvchilar", icon: Users, href: "/AdminPanel/Foydalanuvchilar" },
  { name: "Kuryerlar", icon: Truck, href: "/AdminPanel/kurierlar" },
  { name: "Bannerlar", icon: ImageIcon, href: "/AdminPanel/promo" },
  { name: "Hisobotlar", icon: BarChart3, href: "/AdminPanel/hisobotlar" },
  { name: "Audit", icon: ShieldCheck, href: "/AdminPanel/audit" },
];

export default function Sidebar({ onNavigate }) {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <Link href="/AdminPanel" onClick={onNavigate} className="flex items-center gap-3 px-5 pt-6 pb-5">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2563eb] text-white shadow-lg shadow-blue-900/40">
          <BookOpen size={22} strokeWidth={2.2} />
        </span>
        <span className="min-w-0">
          <span className="block text-[17px] font-bold leading-tight tracking-tight text-white">Kitobdosh</span>
          <span className="mt-0.5 block text-[11px] leading-snug text-slate-400">Bilim har doim yoningizda</span>
        </span>
      </Link>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === "/AdminPanel" ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition-colors ${
                isActive
                  ? "bg-[#2563eb] text-white shadow-md shadow-blue-950/30"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-4">
        <div className="rounded-2xl border border-white/10 bg-[#121a2f] p-4">
          <div className="flex gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#2563eb]/15 text-[#60a5fa]">
              <BookOpen size={16} />
            </span>
            <div>
              <p className="text-[13px] font-medium leading-snug text-slate-100">&quot;Yaxshi kitob — yangi imkoniyat.&quot;</p>
              <p className="mt-2 text-xs text-slate-500">Kitobdosh</p>
            </div>
          </div>
        </div>
        <p className="px-2 pt-3 text-xs text-slate-500">v1.0.0</p>
      </div>
    </aside>
  );
}
