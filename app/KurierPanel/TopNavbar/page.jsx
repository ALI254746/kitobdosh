"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, ChevronDown, LogOut, Settings, Undo2, User, Wallet } from "lucide-react";
import useSWR, { mutate } from "swr";
import Pusher from "pusher-js";
import { signOut } from "next-auth/react";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function TopNavbar() {
  const pathname = usePathname();
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const notifRef = useRef(null);
  const menuRef = useRef(null);
  const isHome = pathname === "/KurierPanel";

  const { data: notifRes } = useSWR("/api/notifications", fetcher);
  const { data: profileRes } = useSWR("/api/user/profile", fetcher);
  const user = profileRes?.data?.user;
  const notifications = Array.isArray(notifRes?.data) ? notifRes.data : [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const name = user?.fullName || "Kuryer";

  useEffect(() => {
    const close = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) setNotifOpen(false);
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    if (!user?._id || !process.env.NEXT_PUBLIC_PUSHER_KEY) return;
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });
    const channel = pusher.subscribe(`user-${user._id}`);
    channel.bind("notification-new", () => {
      const audio = new Audio("/sounds/notification.mp3");
      audio.play().catch(() => {});
      mutate("/api/notifications");
    });
    return () => {
      pusher.unsubscribe(`user-${user._id}`);
      pusher.disconnect();
    };
  }, [user?._id]);

  const markAll = async () => {
    await fetch("/api/notifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    mutate("/api/notifications");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#070E1C]/90 px-4 py-3 backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold tracking-tight text-white sm:text-2xl">
            {isHome ? "Kuryer paneli" : pageTitle(pathname)}
          </h1>
          <p className="text-xs leading-snug text-[#8EA0B8] sm:text-sm">
            {isHome ? "Bugun ham birga, bilim yaqinroq!" : "Kuryer paneli"}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              aria-label="Bildirishnomalar"
              onClick={() => {
                setNotifOpen((v) => !v);
                setMenuOpen(false);
              }}
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#121A2F] text-white"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-white/10 bg-[#10192C] shadow-2xl"
                >
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                    <p className="text-sm font-semibold">Bildirishnomalar</p>
                    <span className="rounded-full bg-[#2F6BFF] px-2 py-0.5 text-[10px] font-semibold">{notifications.length}</span>
                  </div>
                  <div className="max-h-72 space-y-1 overflow-y-auto p-2">
                    {notifications.length === 0 && (
                      <p className="px-2 py-8 text-center text-sm text-[#8EA0B8]">Xabarlar yo&apos;q</p>
                    )}
                    {notifications.slice(0, 8).map((note) => (
                      <div key={note._id} className="rounded-xl px-3 py-2 hover:bg-white/5">
                        <p className="text-sm font-medium text-white">{note.title || "-"}</p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-[#8EA0B8]">{note.message || "-"}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex border-t border-white/10">
                    <button type="button" onClick={markAll} className="flex-1 px-3 py-3 text-xs text-[#8EA0B8] hover:text-white">
                      Barchasini o&apos;qilgan
                    </button>
                    <Link href="/KurierPanel/bildirishnomalar" onClick={() => setNotifOpen(false)} className="flex-1 px-3 py-3 text-center text-xs text-[#7EB6FF]">
                      Hammasini ko&apos;rish
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => {
                setMenuOpen((v) => !v);
                setNotifOpen(false);
              }}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-[#121A2F] py-1 pl-1 pr-2"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1D4ED8] text-sm font-semibold">
                  {name.slice(0, 1).toUpperCase()}
                </span>
              )}
              <span className="hidden min-[380px]:block text-left">
                <span className="block max-w-[8rem] truncate text-xs font-semibold leading-tight">{name}</span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Onlayn
                </span>
              </span>
              <ChevronDown size={14} className="text-[#8EA0B8]" />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#10192C] p-1 shadow-2xl"
                >
                  <MenuLink href="/KurierPanel/profile" icon={<User size={16} />} onClick={() => setMenuOpen(false)}>Profil</MenuLink>
                  <MenuLink href="/KurierPanel/hamyon" icon={<Wallet size={16} />} onClick={() => setMenuOpen(false)}>Hamyon</MenuLink>
                  <MenuLink href="/KurierPanel/bildirishnomalar" icon={<Bell size={16} />} onClick={() => setMenuOpen(false)}>Bildirishnomalar</MenuLink>
                  <MenuLink href="/KurierPanel/kitobniQaytarish" icon={<Undo2 size={16} />} onClick={() => setMenuOpen(false)}>Kitobni qaytarish</MenuLink>
                  <MenuLink href="/KurierPanel/sozlamalar" icon={<Settings size={16} />} onClick={() => setMenuOpen(false)}>Sozlamalar</MenuLink>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-rose-300 hover:bg-rose-500/10"
                  >
                    <LogOut size={16} />
                    Chiqish
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

function MenuLink({ href, icon, children, onClick }) {
  return (
    <Link href={href} onClick={onClick} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-100 hover:bg-white/5">
      {icon}
      {children}
    </Link>
  );
}

function pageTitle(pathname) {
  const titles = {
    "/KurierPanel/buyurtmalar": "Topshiriqlar",
    "/KurierPanel/faolTopshiriqlar": "Faol topshiriqlar",
    "/KurierPanel/yakunlanganlar": "Yakunlanganlar",
    "/KurierPanel/xarita": "Xarita",
    "/KurierPanel/statistika": "Statistika",
    "/KurierPanel/sozlamalar": "Sozlamalar",
    "/KurierPanel/hamyon": "Hamyon",
    "/KurierPanel/bildirishnomalar": "Bildirishnomalar",
    "/KurierPanel/profile": "Profil",
    "/KurierPanel/kitobniQaytarish": "Kitobni qaytarish",
  };
  return titles[pathname] || "Kuryer paneli";
}
