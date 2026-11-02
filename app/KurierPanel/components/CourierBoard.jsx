"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ClipboardList, Truck } from "lucide-react";
import OrderCard from "./OrderCard";
import { DashboardSkeleton } from "./Skeleton";
import { useCourierLocation, useCourierOrders } from "./useCourierOrders";

const TABS = [
  { id: "yangi", label: "Yangi" },
  { id: "faol", label: "Faol" },
  { id: "yakunlangan", label: "Yakunlangan" },
];

export default function CourierBoard({
  showKpi = false,
  lockedTab = null,
  searchable = false,
  heading = null,
  subheading = null,
}) {
  const { groups, isLoading, error, updateStatus } = useCourierOrders();
  const { pos } = useCourierLocation();
  const [tab, setTab] = useState(lockedTab || "yangi");
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [openId, setOpenId] = useState(null);
  const activeTab = lockedTab || tab;

  const counts = {
    yangi: groups.yangi.length,
    faol: groups.faol.length,
    yakunlangan: groups.yakunlangan.length,
  };

  const visible = useMemo(() => {
    const source = groups[activeTab] || [];
    const q = query.trim().toLowerCase();
    if (!q) return source;
    return source.filter((order) =>
      [order.customer, order.phone, order.address, order.book, order.id]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q))
    );
  }, [groups, activeTab, query]);

  const firstId = visible[0]?.id || null;
  useEffect(() => {
    setOpenId(firstId);
  }, [activeTab, firstId]);

  const onStatus = async (order, status) => {
    setBusyId(order.id);
    try {
      await updateStatus(order, status);
    } finally {
      setBusyId(null);
    }
  };

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-4">
      {heading && (
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">{heading}</h1>
          {subheading && <p className="mt-1 text-sm text-[#8EA0B8]">{subheading}</p>}
        </div>
      )}

      {showKpi && (
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <Kpi
            icon={<ClipboardList size={18} />}
            iconClass="bg-[#1D4ED8] text-white"
            value={counts.yangi}
            title="Bugungi topshiriqlar"
            caption="Jami buyurtmalar"
            onClick={() => setTab("yangi")}
          />
          <Kpi
            icon={<Truck size={18} />}
            iconClass="bg-[#2563EB] text-white"
            value={counts.faol}
            title="Yo'lda"
            caption="Bajarilmoqda"
            onClick={() => setTab("faol")}
          />
          <Kpi
            icon={<CheckCircle2 size={18} />}
            iconClass="bg-emerald-500 text-white"
            value={counts.yakunlangan}
            title="Yetkazildi"
            caption="Muvaffaqiyatli"
            onClick={() => setTab("yakunlangan")}
          />
        </div>
      )}

      {!lockedTab && (
        <div className="grid grid-cols-3 rounded-2xl bg-[#0C1424] p-1">
          {TABS.map((item) => {
            const selected = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`relative rounded-xl px-2 py-2.5 text-xs font-semibold sm:text-sm ${
                  selected ? "text-white" : "text-[#8EA0B8]"
                }`}
              >
                {selected && (
                  <motion.span
                    layoutId="courier-tab"
                    className="absolute inset-0 rounded-xl bg-[#2F6BFF]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">
                  {item.label} ({counts[item.id]})
                </span>
              </button>
            );
          })}
        </div>
      )}

      {searchable && (
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Mijoz, kitob yoki ID..."
          className="w-full rounded-2xl border border-white/10 bg-[#10192C] px-4 py-3 text-sm text-white outline-none placeholder:text-[#64748B] focus:border-[#2F6BFF]"
        />
      )}

      {error ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-[#10192C] px-6 py-16 text-center">
          <p className="text-base font-semibold text-white">Ma&apos;lumotlarni yuklab bo&apos;lmadi</p>
          <p className="mt-1 text-sm text-[#8EA0B8]">Keyinroq qayta urinib ko&apos;ring.</p>
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-[#10192C] px-6 py-16 text-center">
          <p className="text-base font-semibold text-white">
            {activeTab === "yangi" && "Yangi topshiriqlar yo'q"}
            {activeTab === "faol" && "Faol topshiriqlar yo'q"}
            {activeTab === "yakunlangan" && "Yakunlangan topshiriqlar yo'q"}
          </p>
          <p className="mt-1 text-sm text-[#8EA0B8]">Bu bo&apos;lim hozircha bo&apos;sh.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              origin={pos}
              busy={busyId === order.id}
              expanded={openId === order.id}
              onToggle={() => setOpenId(openId === order.id ? null : order.id)}
              onStatus={onStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Kpi({ icon, iconClass, value, title, caption, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border border-white/10 bg-[#10192C] p-3 text-left sm:p-4"
    >
      <span className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${iconClass}`}>
        {icon}
      </span>
      <p className="text-2xl font-semibold leading-none text-white sm:text-3xl">{value}</p>
      <p className="mt-2 text-[11px] font-medium leading-tight text-white sm:text-sm">{title}</p>
      <p className="mt-0.5 text-[10px] text-[#8EA0B8] sm:text-xs">{caption}</p>
    </button>
  );
}
