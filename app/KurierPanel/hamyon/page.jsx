"use client";

import Link from "next/link";
import { DashboardSkeleton } from "../components/Skeleton";
import { useCourierOrders } from "../components/useCourierOrders";
import { DELIVERY_FEE, dayKey, deliveredStamp, shortId, startOfDay } from "../components/courierUtils";

export default function WalletPage() {
  const { groups, isLoading, error } = useCourierOrders();
  const completed = groups.yakunlangan;
  const todayKey = dayKey(startOfDay(new Date()));
  const weekStart = startOfDay(new Date());
  weekStart.setDate(weekStart.getDate() - 6);

  const today = completed.filter((order) => dayKey(deliveredStamp(order)) === todayKey);
  const weekly = completed.filter((order) => {
    const stamp = new Date(deliveredStamp(order));
    return !Number.isNaN(stamp.getTime()) && stamp >= weekStart;
  });
  const history = [...completed]
    .sort((a, b) => new Date(deliveredStamp(b)) - new Date(deliveredStamp(a)))
    .slice(0, 12);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Hamyon</h1>
        <p className="mt-1 text-sm text-[#8EA0B8]">
          Balans alohida saqlanmaydi. Hisob: har bir yetkazish × {DELIVERY_FEE.toLocaleString("uz-UZ")} so&apos;m.
        </p>
      </div>

      {error && (
        <p className="rounded-2xl border border-white/10 bg-[#10192C] px-4 py-3 text-sm text-[#8EA0B8]">
          Hamyon ma&apos;lumotlari yuklanmadi.
        </p>
      )}

      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#163056] to-[#10192C] p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[#7EB6FF]">Umumiy hisob</p>
        <p className="mt-2 text-4xl font-semibold">
          {(completed.length * DELIVERY_FEE).toLocaleString("uz-UZ")} <span className="text-lg text-[#7EB6FF]">so&apos;m</span>
        </p>
        <p className="mt-2 text-sm text-[#8EA0B8]">{completed.length} ta yetkazish</p>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <Mini label="Bugungi hisob" value={`${(today.length * DELIVERY_FEE).toLocaleString("uz-UZ")} so'm`} />
        <Mini label="Haftalik hisob" value={`${(weekly.length * DELIVERY_FEE).toLocaleString("uz-UZ")} so'm`} />
      </div>

      <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#10192C]">
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-sm font-semibold">Oxirgi yetkazishlar</h2>
          <Link href="/KurierPanel/statistika" className="text-xs text-[#7EB6FF]">Statistika</Link>
        </div>
        {history.length === 0 && (
          <p className="px-5 pb-8 text-sm text-[#8EA0B8]">Hozircha daromadlar yo&apos;q</p>
        )}
        {history.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-t border-white/5 px-5 py-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{item.book || `Buyurtma #${shortId(item.id)}`}</p>
              <p className="text-xs text-[#8EA0B8]">{formatStamp(deliveredStamp(item))}</p>
            </div>
            <p className="shrink-0 text-sm font-semibold text-emerald-300">+{DELIVERY_FEE.toLocaleString("uz-UZ")}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

function Mini({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#10192C] p-4">
      <p className="text-xs text-[#8EA0B8]">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}

function formatStamp(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("uz-UZ", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}
