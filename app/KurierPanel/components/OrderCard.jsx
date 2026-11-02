"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import {
  Box,
  ChevronDown,
  Copy,
  MapPin,
  Navigation,
  Phone,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  STATUS_OPTIONS,
  formatRoute,
  formatTime,
  formatUzDate,
  mapsUrl,
  maskPhone,
  paymentLabel,
  primaryAction,
  shortId,
  statusLabel,
  stepperIndex,
  typeLabel,
} from "./courierUtils";

const RouteMap = dynamic(() => import("./RouteMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-[#0b1220]" />,
});

const STEPS = [
  { key: "assigned", label: "Biriktirildi" },
  { key: "accepted", label: "Qabul qilindi" },
  { key: "onway", label: "Yo'lda" },
  { key: "delivered", label: "Yetkazildi" },
];

function stepTime(order, index, current) {
  if (index === 0) return formatTime(order.createdAt);
  if (index === current && current > 0) return formatTime(order.updatedAt);
  if (index === 3 && order.status === "delivered") return formatTime(order.updatedAt);
  return null;
}

export default function OrderCard({ order, origin, onStatus, busy, expanded = true, onToggle }) {
  const [mapsOpen, setMapsOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const mapsRef = useRef(null);
  const statusRef = useRef(null);
  const pay = paymentLabel(order.paymentStatus);
  const action = primaryAction(order.status);
  const route = formatRoute(origin, order);
  const current = stepperIndex(order.status);
  const google = mapsUrl("google", order);
  const yandex = mapsUrl("yandex", order);

  useEffect(() => {
    const close = (event) => {
      if (mapsRef.current && !mapsRef.current.contains(event.target)) setMapsOpen(false);
      if (statusRef.current && !statusRef.current.contains(event.target)) setStatusOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const copyPhone = async () => {
    if (!order.phone) return;
    try {
      await navigator.clipboard.writeText(String(order.phone));
      toast.success("Raqam nusxalandi");
    } catch {
      toast.error("Nusxalab bo'lmadi");
    }
  };

  const openMap = (url) => {
    if (!url) {
      toast.error("Manzil yo'q");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
    setMapsOpen(false);
  };

  const runStatus = async (status) => {
    setStatusOpen(false);
    try {
      await onStatus(order, status);
      toast.success("Holat yangilandi");
    } catch (error) {
      toast.error(error.message || "Holat yangilanmadi");
    }
  };

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 rounded-3xl border border-white/10 bg-[#10192C] px-4 py-4 text-left"
      >
        <span>
          <span className="block text-sm font-semibold text-white">Buyurtma #{shortId(order.id)}</span>
          <span className="mt-0.5 block truncate text-xs text-[#8EA0B8]">{order.customer || "-"} • {order.address || "-"}</span>
        </span>
        <span className="shrink-0 rounded-full bg-[#2563EB] px-3 py-1 text-xs font-semibold text-white">{statusLabel(order.status)}</span>
      </button>
    );
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/10 bg-[#10192C] p-4 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.8)] sm:p-5"
    >
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#1A2744] text-[#7EB6FF]">
            <Box size={18} />
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-white sm:text-lg">
              Buyurtma #{shortId(order.id)}
            </h2>
            <p className="text-xs text-[#8EA0B8]">{formatUzDate(order.createdAt)}</p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-[#2563EB] px-3 py-1 text-xs font-semibold text-white">
          {statusLabel(order.status)}
        </span>
      </header>

      <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2">
        <div className="space-y-3">
          <InfoRow icon={<User size={14} />} label="Mijoz" value={order.customer || "-"} />
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 text-[#7EB6FF]"><Phone size={14} /></span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-[#8EA0B8]">Telefon</p>
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium text-white">{maskPhone(order.phone)}</p>
                <button
                  type="button"
                  onClick={copyPhone}
                  disabled={!order.phone}
                  aria-label="Telefon raqamini nusxalash"
                  className="rounded-lg p-1 text-[#8EA0B8] hover:bg-white/5 hover:text-white disabled:opacity-40"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-[#7EB6FF]"><Box size={14} /></span>
            <div>
              <p className="text-[11px] text-[#8EA0B8]">Buyurtma turi</p>
              <span className="mt-0.5 inline-flex rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-slate-100">
                {typeLabel(order.type)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-[#7EB6FF]"><Box size={14} /></span>
            <div>
              <p className="text-[11px] text-[#8EA0B8]">To&apos;lov holati</p>
              <span className={`mt-0.5 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                pay.tone === "ok"
                  ? "bg-emerald-500/15 text-emerald-300"
                  : pay.tone === "bad"
                    ? "bg-rose-500/15 text-rose-300"
                    : pay.tone === "wait"
                      ? "bg-amber-500/15 text-amber-200"
                      : "bg-white/5 text-[#8EA0B8]"
              }`}>
                {pay.text}
              </span>
            </div>
          </div>
          <div>
            <p className="text-[11px] text-[#8EA0B8]">Kitob</p>
            <p className="text-sm text-white">{order.book || "-"}</p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 text-rose-400"><MapPin size={14} /></span>
            <div>
              <p className="text-[11px] text-[#8EA0B8]">Manzil</p>
              <p className="text-sm leading-snug text-white">{order.address || "-"}</p>
              <p className="text-xs text-[#8EA0B8]">(Orientir: {order.landmark || "-"})</p>
            </div>
          </div>
        </div>

        <div className="relative h-52 overflow-hidden rounded-2xl border border-white/10 bg-[#0b1220] min-[420px]:h-auto min-[420px]:min-h-[220px]">
          <RouteMap
            origin={origin}
            destination={Number.isFinite(order.lat) ? { lat: order.lat, lng: order.lng } : null}
            className="h-full min-h-[220px] w-full"
          />
          <div className="pointer-events-none absolute bottom-3 left-3 z-[500] rounded-full border border-white/10 bg-[#070E1C]/90 px-3 py-1 text-xs font-semibold text-white">
            {route?.label || "- • -"}
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        <button
          type="button"
          disabled={!action || busy}
          onClick={() => action && runStatus(action.status)}
          className="w-full rounded-2xl bg-[#2F6BFF] py-3.5 text-sm font-semibold text-white transition hover:bg-[#3B78FF] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-[#8EA0B8]"
        >
          {busy ? "Yangilanmoqda..." : action?.label || "Yetkazildi"}
        </button>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="relative" ref={mapsRef}>
            <button
              type="button"
              onClick={() => setMapsOpen((v) => !v)}
              disabled={!google && !yandex}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#0C1424] py-3 text-sm font-medium text-slate-100 hover:bg-white/5 disabled:opacity-40"
            >
              <Navigation size={16} />
              Yo&apos;lni ochish
            </button>
            <AnimatePresence>
              {mapsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute bottom-full left-0 z-20 mb-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0C1424] shadow-xl"
                >
                  <button type="button" onClick={() => openMap(google)} className="block w-full px-3 py-2.5 text-left text-sm hover:bg-white/5">Google xarita</button>
                  <button type="button" onClick={() => openMap(yandex)} className="block w-full px-3 py-2.5 text-left text-sm hover:bg-white/5">Yandex xarita</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="relative" ref={statusRef}>
            <button
              type="button"
              onClick={() => setStatusOpen((v) => !v)}
              disabled={busy || order.status === "delivered"}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#0C1424] py-3 text-sm font-medium text-slate-100 hover:bg-white/5 disabled:opacity-40"
            >
              Holatni yangilash
              <ChevronDown size={16} />
            </button>
            <AnimatePresence>
              {statusOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute bottom-full right-0 z-20 mb-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0C1424] shadow-xl"
                >
                  {STATUS_OPTIONS.map((item) => (
                    <button
                      key={item.status}
                      type="button"
                      disabled={item.status === order.status}
                      onClick={() => runStatus(item.status)}
                      className="block w-full px-3 py-2.5 text-left text-sm hover:bg-white/5 disabled:text-[#8EA0B8]"
                    >
                      {item.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <ol className="relative mt-5 grid grid-cols-4 gap-1">
        <span className="absolute left-[12%] right-[12%] top-2 h-px bg-white/10" />
        {STEPS.map((step, index) => {
          const done = index <= current;
          const time = stepTime(order, index, current);
          return (
            <li key={step.key} className="relative z-[1] flex flex-col items-center text-center">
              <span className={`h-4 w-4 rounded-full border-2 ${done ? "border-[#2F6BFF] bg-[#2F6BFF]" : "border-[#334155] bg-[#10192C]"}`} />
              <span className={`mt-2 text-[10px] font-medium leading-tight sm:text-xs ${done ? "text-white" : "text-[#64748B]"}`}>
                {step.label}
              </span>
              <span className="mt-0.5 text-[10px] text-[#8EA0B8]">{time || ""}</span>
            </li>
          );
        })}
      </ol>
    </motion.article>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-[#7EB6FF]">{icon}</span>
      <div className="min-w-0">
        <p className="text-[11px] text-[#8EA0B8]">{label}</p>
        <p className="truncate text-sm font-medium text-white">{value}</p>
      </div>
    </div>
  );
}
