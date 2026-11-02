"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  BookOpen,
  User,
  Truck,
  ShoppingCart,
  Settings,
  Store,
  LogOut,
  Inbox,
} from "lucide-react";

function initialsFrom(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "AD";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export default function TopNavbar({ onToggleSidebar }) {
  const router = useRouter();
  const { data: session } = useSession();
  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const inputRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    fetchNotifications();
    fetchProfile();

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) setShowResults(false);
      if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfile(false);
    };
    const handleShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleShortcut);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleShortcut);
    };
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/admin/settings/profile");
      const data = await res.json();
      if (data.success && data.data?.fullName) setAdminName(data.data.fullName);
    } catch {
      /* profil ixtiyoriy */
    }
  };

  const fetchNotifications = async () => {
    try {
      const [resNotif, resContact] = await Promise.all([fetch("/api/notifications"), fetch("/api/contact")]);
      const dataNotif = await resNotif.json();
      const dataContact = await resContact.json();

      let combined = [];
      let totalUnread = 0;

      if (dataNotif.success) {
        combined = [...dataNotif.data.map((n) => ({ ...n, source: "system" }))];
        totalUnread += dataNotif.unread || 0;
      }

      if (dataContact.success && Array.isArray(dataContact.data)) {
        const contacts = dataContact.data.map((c) => ({
          _id: c._id,
          title: `Xabar: ${c.name}`,
          message: c.message,
          type: c.type === "complaint" ? "error" : c.type === "suggestion" ? "warning" : "info",
          isRead: c.status !== "unread",
          createdAt: c.createdAt,
          source: "contact",
        }));
        combined = [...combined, ...contacts];
        totalUnread += dataContact.data.filter((m) => m.status === "unread").length;
      }

      combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(combined.slice(0, 15));
      setUnreadCount(totalUnread);
    } catch (error) {
      console.error("Fetch Notif Error:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", { method: "PUT", body: JSON.stringify({}) });
      const unreadContacts = notifications.filter((n) => n.source === "contact" && !n.isRead);
      await Promise.all(
        unreadContacts.map((c) =>
          fetch("/api/contact", {
            method: "PUT",
            body: JSON.stringify({ id: c._id, updates: { status: "read" } }),
          })
        )
      );
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("Barcha xabarlar o'qildi");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          const res = await fetch(`/api/admin/search?q=${encodeURIComponent(searchQuery)}`);
          const data = await res.json();
          if (data.success) {
            setSearchResults(data.results);
            setShowResults(true);
          }
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults(null);
        setShowResults(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleResultClick = (href) => {
    router.push(href);
    setShowResults(false);
    setShowNotifications(false);
    setShowProfile(false);
    setSearchQuery("");
  };

  const displayName = adminName || session?.user?.name || "Administrator";
  const initials = initialsFrom(displayName);

  return (
    <header className="admin-topbar">
      <div className="flex h-full items-center gap-3 px-4 lg:px-6">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-300 transition hover:bg-white/5 hover:text-white"
          aria-label="Menyuni ochish yoki yopish"
        >
          <Menu size={20} />
        </button>

        <div className="relative min-w-0 flex-1" ref={searchRef}>
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
            placeholder="Kitob, mijoz yoki buyurtma bo'yicha qidirish..."
            className="h-11 w-full rounded-xl border border-white/10 bg-[#0e1728] pl-11 pr-20 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-[#2563eb]/70"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 sm:inline-flex">
            Ctrl K
          </kbd>

          {showResults && (
            <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-[460px] overflow-y-auto rounded-2xl border border-white/10 bg-[#121a2f] shadow-2xl">
              {isSearching && <div className="p-4 text-center text-sm text-slate-400">Qidirilmoqda...</div>}
              {!isSearching && searchResults && (
                <div className="space-y-3 p-2">
                  {searchResults.books?.length > 0 && (
                    <div>
                      <h3 className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">Kitoblar</h3>
                      {searchResults.books.map((book) => (
                        <button
                          key={book._id}
                          type="button"
                          onClick={() => handleResultClick("/AdminPanel/Kitoblar")}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-white/5"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563eb]/15 text-[#60a5fa]">
                            <BookOpen size={14} />
                          </span>
                          <span>
                            <span className="block text-sm font-medium text-white">{book.title}</span>
                            <span className="block text-[11px] text-slate-400">{book.author}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                  {searchResults.users?.length > 0 && (
                    <div>
                      <h3 className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">Mijozlar</h3>
                      {searchResults.users.map((user) => (
                        <button
                          key={user._id}
                          type="button"
                          onClick={() => handleResultClick("/AdminPanel/Foydalanuvchilar")}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-white/5"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/15 text-sky-300">
                            <User size={14} />
                          </span>
                          <span>
                            <span className="block text-sm font-medium text-white">{user.fullName || user.email}</span>
                            <span className="block text-[11px] text-slate-400">{user.email}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                  {searchResults.couriers?.length > 0 && (
                    <div>
                      <h3 className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">Kuryerlar</h3>
                      {searchResults.couriers.map((courier) => (
                        <button
                          key={courier._id}
                          type="button"
                          onClick={() => handleResultClick("/AdminPanel/kurierlar")}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-white/5"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
                            <Truck size={14} />
                          </span>
                          <span className="text-sm font-medium text-white">{courier.fullName || courier.email}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {searchResults.orders?.length > 0 && (
                    <div>
                      <h3 className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">Buyurtma va ijara</h3>
                      {searchResults.orders.map((order, index) => (
                        <button
                          key={`${order._id || index}`}
                          type="button"
                          onClick={() =>
                            handleResultClick(order.type === "order" ? "/AdminPanel/sotuvdagiKitoblar" : "/AdminPanel/rentRequest")
                          }
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-white/5"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/15 text-orange-300">
                            <ShoppingCart size={14} />
                          </span>
                          <span>
                            <span className="block text-sm font-medium text-white">{order.customer?.name || order.fullName || "Noma'lum"}</span>
                            <span className="block text-[11px] text-slate-400">
                              {(order.totalPrice || 0).toLocaleString("uz-UZ")} so&apos;m · {order.status}
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                  {Object.values(searchResults).every((arr) => !arr?.length) && (
                    <div className="px-3 py-8 text-center text-sm text-slate-400">Natija topilmadi</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative shrink-0" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              setShowNotifications((v) => !v);
              setShowProfile(false);
            }}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-300 transition hover:bg-white/5 hover:text-white"
            aria-label="Bildirishnomalar"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 z-40 mt-2 w-[min(92vw,22rem)] overflow-hidden rounded-2xl border border-white/10 bg-[#121a2f] shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <h3 className="text-sm font-semibold text-white">Bildirishnomalar</h3>
                {unreadCount > 0 && (
                  <button type="button" onClick={markAllAsRead} className="text-[11px] font-semibold text-[#60a5fa] hover:underline">
                    Hammasini o&apos;qildi
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div key={`${notif.source}-${notif._id}`} className={`border-b border-white/5 px-4 py-3 ${notif.isRead ? "" : "bg-[#2563eb]/5"}`}>
                      <p className="text-sm font-medium text-white">{notif.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-slate-400">{notif.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="px-4 py-8 text-center text-sm text-slate-400">Hozircha bildirishnomalar yo&apos;q</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleResultClick("/AdminPanel/BildirishNomalar")}
                className="block w-full px-4 py-3 text-center text-xs font-semibold text-[#60a5fa] hover:bg-white/5"
              >
                Barchasini ko&apos;rish
              </button>
            </div>
          )}
        </div>

        <div className="relative shrink-0" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setShowProfile((v) => !v);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 rounded-xl py-1 pl-1 pr-2 text-left transition hover:bg-white/5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563eb] text-xs font-bold text-white">
              {initials}
            </span>
            <span className="hidden leading-tight md:block">
              <span className="block text-sm font-semibold text-white">{displayName}</span>
              <span className="block text-[11px] text-slate-400">Tizim administratori</span>
            </span>
            <ChevronDown size={16} className="hidden text-slate-400 md:block" />
          </button>
          {showProfile && (
            <div className="absolute right-0 z-40 mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#121a2f] py-1 shadow-2xl">
              <button type="button" onClick={() => handleResultClick("/AdminPanel/Sozlamalar")} className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-slate-200 hover:bg-white/5">
                <Settings size={15} /> Sozlamalar
              </button>
              <button type="button" onClick={() => handleResultClick("/AdminPanel/BildirishNomalar")} className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-slate-200 hover:bg-white/5">
                <Inbox size={15} /> Bildirishnomalar
              </button>
              <button type="button" onClick={() => handleResultClick("/AdminPanel/stores")} className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-slate-200 hover:bg-white/5">
                <Store size={15} /> Do&apos;konlar
              </button>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-red-300 hover:bg-white/5"
              >
                <LogOut size={15} /> Chiqish
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
