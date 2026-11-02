"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ClipboardList, Home, Map, Settings } from "lucide-react";

const ITEMS = [
  { name: "Bosh sahifa", href: "/KurierPanel", icon: Home, exact: true },
  { name: "Topshiriqlar", href: "/KurierPanel/buyurtmalar", icon: ClipboardList },
  { name: "Xarita", href: "/KurierPanel/xarita", icon: Map },
  { name: "Statistika", href: "/KurierPanel/statistika", icon: BarChart3 },
  { name: "Sozlamalar", href: "/KurierPanel/sozlamalar", icon: Settings },
];

export function isNavActive(pathname, item) {
  if (item.exact) return pathname === item.href;
  if (item.href === "/KurierPanel/buyurtmalar") {
    return ["/KurierPanel/buyurtmalar", "/KurierPanel/faolTopshiriqlar", "/KurierPanel/yakunlanganlar"]
      .some((href) => pathname === href || pathname?.startsWith(`${href}/`));
  }
  return pathname === item.href || pathname?.startsWith(`${item.href}/`);
}

export const NAV_ITEMS = ITEMS;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#070E1C]/95 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-lg items-stretch justify-between px-1 pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1.5">
        {ITEMS.map((item) => {
          const active = isNavActive(pathname, item);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-0 flex-1 flex-col items-center gap-1 px-1 py-1 text-[10px] font-medium ${
                active ? "text-[#3B82F6]" : "text-[#64748B]"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
