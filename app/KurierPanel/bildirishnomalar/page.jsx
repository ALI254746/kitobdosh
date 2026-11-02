"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCircle2, Info, Trash2, TriangleAlert } from "lucide-react";
import useSWR, { mutate } from "swr";
import Pusher from "pusher-js";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function NotificationsPage() {
  const { data: profileRes } = useSWR("/api/user/profile", fetcher);
  const { data: notifRes, isLoading, error } = useSWR("/api/notifications", fetcher);
  const user = profileRes?.data?.user;
  const notifications = Array.isArray(notifRes?.data) ? notifRes.data : [];

  useEffect(() => {
    if (!user?._id || !process.env.NEXT_PUBLIC_PUSHER_KEY) return;
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });
    const channel = pusher.subscribe(`user-${user._id}`);
    channel.bind("notification-new", () => mutate("/api/notifications"));
    return () => {
      pusher.unsubscribe(`user-${user._id}`);
      pusher.disconnect();
    };
  }, [user?._id]);

  const markAsRead = async (id) => {
    await fetch("/api/notifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    mutate("/api/notifications");
  };

  const deleteNotification = async (id) => {
    await fetch(`/api/notifications?id=${id}`, { method: "DELETE" });
    mutate("/api/notifications");
  };

  if (isLoading) {
    return <p className="py-20 text-center text-sm text-[#8EA0B8]">Yuklanmoqda...</p>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Bildirishnomalar</h1>
          <p className="mt-1 text-sm text-[#8EA0B8]">Muhim xabarlar va yangilanishlar</p>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#10192C] text-[#7EB6FF]">
          <Bell size={18} />
        </span>
      </div>

      {error && <p className="text-sm text-rose-200">Xabarlarni yuklab bo&apos;lmadi.</p>}

      <div className="space-y-3">
        {notifications.length === 0 && (
          <div className="rounded-3xl border border-dashed border-white/10 bg-[#10192C] px-6 py-16 text-center">
            <Bell className="mx-auto text-[#334155]" />
            <p className="mt-3 font-medium">Xabarlar yo&apos;q</p>
            <p className="text-sm text-[#8EA0B8]">Sizda hozircha bildirishnomalar mavjud emas.</p>
          </div>
        )}
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.article
              layout
              key={notif._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onClick={() => !notif.isRead && markAsRead(notif._id)}
              className={`flex items-start gap-3 rounded-3xl border p-4 ${
                notif.isRead ? "border-white/5 bg-[#10192C]/70" : "border-[#2F6BFF]/40 bg-[#10192C]"
              }`}
            >
              <span className="mt-0.5 text-[#7EB6FF]">
                {notif.type === "success" ? <CheckCircle2 size={18} /> : notif.type === "warning" ? <TriangleAlert size={18} /> : <Info size={18} />}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold">{notif.title || "-"}</h2>
                <p className="mt-1 text-sm text-[#C5D0E0]">{notif.message || "-"}</p>
                <p className="mt-2 text-[11px] text-[#8EA0B8]">{formatStamp(notif.createdAt)}</p>
              </div>
              <button
                type="button"
                aria-label="O'chirish"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(notif._id);
                }}
                className="rounded-xl p-2 text-[#64748B] hover:bg-rose-500/10 hover:text-rose-300"
              >
                <Trash2 size={16} />
              </button>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function formatStamp(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("uz-UZ", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}
