"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { BookOpen, LayoutDashboard, BookMarked, ShoppingBag, Users, Truck, Megaphone, Store, Settings, Bell, X, LogOut } from "lucide-react";
const menu = [
  ["Boshqaruv paneli", "/AdminPanel", LayoutDashboard],
  ["Kitoblar", "/AdminPanel/Kitoblar", BookMarked],
  ["Buyurtmalar", "/AdminPanel/sotuvdagiKitoblar", ShoppingBag],
  ["Ijaralar", "/AdminPanel/rentRequest", BookOpen],
  ["Foydalanuvchilar", "/AdminPanel/Foydalanuvchilar", Users],
  ["Kuryerlar", "/AdminPanel/kurierlar", Truck],
  ["Bannerlar", "/AdminPanel/promo", Megaphone],
  ["Do‘konlar", "/AdminPanel/stores", Store],
  ["Bildirishnomalar", "/AdminPanel/BildirishNomalar", Bell],
  ["Sozlamalar", "/AdminPanel/Sozlamalar", Settings],
];
export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const pathname = usePathname();
  return <>
    {sidebarOpen && <button aria-label="Menyuni yopish" className="admin-overlay" onClick={() => setSidebarOpen(false)} />}
    <aside className={"admin-sidebar " + (sidebarOpen ? "is-open" : "")}>
      <Link href="/AdminPanel" className="admin-brand" onClick={() => setSidebarOpen(false)}>
        <BookOpen size={38} strokeWidth={1.7} />
        <span><strong>Kitobdosh</strong><small>Bilim har doim yoningizda</small></span>
      </Link>
      <button className="admin-mobile-close" aria-label="Menyuni yopish" onClick={() => setSidebarOpen(false)}><X size={20}/></button>
      <nav aria-label="Admin menyusi" className="admin-menu">
        {menu.map(([label, href, Icon]) => <Link key={href} href={href} onClick={() => setSidebarOpen(false)} aria-current={(pathname === href || (href !== "/AdminPanel" && pathname.startsWith(href + "/"))) ? "page" : undefined} className={(pathname === href || (href !== "/AdminPanel" && pathname.startsWith(href + "/"))) ? "active" : ""}><Icon size={18}/><span>{label}</span></Link>)}
      </nav>
      <div className="admin-sidebar-bottom">
        <div className="admin-quote"><BookOpen size={23}/><p>“Yaxshi kitob<br/>— yangi imkoniyat.”</p><small>Kitobdosh</small></div>
        <button onClick={() => signOut({callbackUrl:"/"})} className="admin-signout"><LogOut size={16}/> Tizimdan chiqish</button>
      </div>
    </aside>
  </>;
}
