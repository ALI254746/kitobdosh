"use client";

import { useMemo } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import Link from "next/link";
import { DashboardSkeleton } from "../components/Skeleton";
import { useCourierOrders } from "../components/useCourierOrders";
import {
  DELIVERY_FEE,
  WEEKDAYS,
  countByDay,
  dayKey,
  deliveredStamp,
  lastNDays,
  startOfDay,
} from "../components/courierUtils";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: "#9FB0C8", boxWidth: 12 } },
  },
  scales: {
    x: {
      ticks: { color: "#9FB0C8" },
      grid: { color: "rgba(255,255,255,0.05)" },
    },
    y: {
      beginAtZero: true,
      ticks: { color: "#9FB0C8", precision: 0 },
      grid: { color: "rgba(255,255,255,0.05)" },
    },
  },
};

export default function StatsPage() {
  const { groups, orders, isLoading, error } = useCourierOrders();
  const days = useMemo(() => lastNDays(7), []);
  const labels = days.map((d) => `${WEEKDAYS[d.getDay()]} ${d.getDate()}`);
  const delivered = groups.yakunlangan;
  const perDay = useMemo(() => countByDay(delivered, days), [delivered, days]);

  const todayKey = dayKey(startOfDay(new Date()));
  const todayCount = delivered.filter((order) => dayKey(deliveredStamp(order)) === todayKey).length;
  const weekCount = perDay.reduce((sum, n) => sum + n, 0);
  const earnings = delivered.length * DELIVERY_FEE;
  const weekEarnings = weekCount * DELIVERY_FEE;

  const barData = {
    labels,
    datasets: [
      {
        label: "Yetkazildi",
        data: perDay,
        backgroundColor: "#2F6BFF",
        borderRadius: 8,
      },
    ],
  };
  const lineData = {
    labels,
    datasets: [
      {
        label: "Hisoblangan daromad",
        data: perDay.map((n) => n * DELIVERY_FEE),
        borderColor: "#34D399",
        backgroundColor: "rgba(52,211,153,0.15)",
        tension: 0.35,
        fill: true,
        pointRadius: 3,
      },
    ],
  };

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Statistika</h1>
        <p className="mt-1 text-sm text-[#8EA0B8]">Yetkazishlar bo&apos;yicha haqiqiy hisob</p>
      </div>

      {error && (
        <p className="rounded-2xl border border-white/10 bg-[#10192C] px-4 py-3 text-sm text-[#8EA0B8]">
          Statistikani yuklab bo&apos;lmadi. Keyinroq qayta urinib ko&apos;ring.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Bugun yetkazildi" value={todayCount} />
        <Stat label="Shu hafta" value={weekCount} />
        <Stat label="Jami yetkazildi" value={delivered.length} />
        <Stat label="Navbatdagi" value={groups.yangi.length + groups.faol.length} />
      </div>

      <section className="rounded-3xl border border-white/10 bg-[#10192C] p-4 sm:p-5">
        <h2 className="text-sm font-semibold">So&apos;nggi 7 kun — yetkazildi</h2>
        <div className="mt-4 h-56">
          <Bar data={barData} options={chartOptions} />
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-[#10192C] p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold">Daromad</h2>
            <p className="mt-1 text-xs text-[#8EA0B8]">
              Alohida hamyon daftari yo&apos;q. Summa hamyon sahifasidagi hisob: har bir yetkazish × {DELIVERY_FEE.toLocaleString("uz-UZ")} so&apos;m.
            </p>
          </div>
          <Link href="/KurierPanel/hamyon" className="shrink-0 text-xs font-semibold text-[#7EB6FF]">
            Hamyon
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Stat label="Jami hisob" value={`${earnings.toLocaleString("uz-UZ")} so'm`} />
          <Stat label="Haftalik hisob" value={`${weekEarnings.toLocaleString("uz-UZ")} so'm`} />
        </div>
        <div className="mt-4 h-56">
          <Line data={lineData} options={chartOptions} />
        </div>
      </section>

      <p className="text-xs text-[#64748B]">
        Jami buyurtmalar ro&apos;yxatda: {orders.length}. Kunlar yetkazilgan vaqt bo&apos;yicha guruhlangan.
      </p>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#10192C] p-4">
      <p className="text-[11px] text-[#8EA0B8]">{label}</p>
      <p className="mt-1 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}
