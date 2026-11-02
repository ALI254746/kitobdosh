"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Tooltip,
} from "chart.js";
import { BookOpen, Coins, Eye, MoreHorizontal, Pencil, ShoppingCart, Truck, TrendingDown, TrendingUp } from "lucide-react";
import { formatMoney, formatSpace, IconButton, Page, Panel, Pill } from "./components/ui";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip);

const MONTHS = ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"];
const WEEKDAYS = ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];
const MONTHS_UZ = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"];

function fallbackSeries() {
  const start = new Date();
  start.setDate(1);
  start.setMonth(start.getMonth() - 11);
  return Array.from({ length: 12 }, (_, index) => {
    const date = new Date(start);
    date.setMonth(start.getMonth() + index);
    return { label: MONTHS[date.getMonth()], orders: 0, sales: 0, rents: 0, revenue: 0 };
  });
}

const EMPTY = {
  kpis: {
    totalOrders: { value: 0, trend: 0 },
    activeRents: { value: 0, trend: 0 },
    delivering: { value: 0, trend: 0 },
    monthlyRevenue: { value: 0, trend: 0 },
  },
  series: fallbackSeries(),
  recent: [],
};

function formatToday(date) {
  return `Bugun: ${date.getFullYear()}-yil ${date.getDate()}-${MONTHS_UZ[date.getMonth()]}, ${WEEKDAYS[date.getDay()]}`;
}

function Trend({ value }) {
  if (value === null || value === undefined) {
    return <p className="mt-4 text-sm text-slate-500">O&apos;tgan oyga nisbatan ma&apos;lumot yo&apos;q</p>;
  }
  const up = value >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <p className="mt-4 flex items-center gap-1.5 text-sm">
      <span className={`inline-flex items-center gap-1 font-semibold ${up ? "text-emerald-400" : "text-red-400"}`}>
        <Icon size={14} />
        {up ? "+" : ""}
        {value}%
      </span>
      <span className="text-slate-500">O&apos;tgan oyga nisbatan</span>
    </p>
  );
}

function KpiCard({ label, value, suffix, icon, iconClass, trend }) {
  const Icon = icon;
  return (
    <Panel className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-[28px] font-bold leading-none tracking-tight text-white">
            {value}
            {suffix && <span className="ml-1 text-base font-semibold text-slate-300">{suffix}</span>}
          </p>
        </div>
        <span className={`flex h-12 w-12 items-center justify-center rounded-xl text-white ${iconClass}`}>
          <Icon size={22} />
        </span>
      </div>
      <Trend value={trend} />
    </Panel>
  );
}

function chartScale(values) {
  const peak = Math.max(0, ...values);
  return {
    x: { grid: { display: false }, ticks: { color: "#94a3b8" }, border: { display: false } },
    y: {
      beginAtZero: true,
      suggestedMax: peak === 0 ? 4 : undefined,
      ticks: { color: "#94a3b8", precision: 0 },
      grid: { color: "rgba(148,163,184,0.08)" },
      border: { display: false },
    },
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [today, setToday] = useState("");
  const [orderRange, setOrderRange] = useState("12");
  const [compareRange, setCompareRange] = useState("6");
  const [menuId, setMenuId] = useState(null);

  useEffect(() => {
    setToday(formatToday(new Date()));
    const load = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        if (data.success && data.dashboard) {
          setDashboard({
            ...data.dashboard,
            series: data.dashboard.series?.length ? data.dashboard.series : fallbackSeries(),
          });
          setError("");
        } else {
          setError("Ma'lumotlar bazasiga ulanib bo'lmadi");
        }
      } catch (err) {
        setError("Ma'lumotlarni yuklab bo'lmadi");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const orderSeries = useMemo(() => dashboard.series.slice(-Number(orderRange)), [dashboard.series, orderRange]);
  const compareSeries = useMemo(() => dashboard.series.slice(-Number(compareRange)), [dashboard.series, compareRange]);

  const lineData = {
    labels: orderSeries.map((row) => row.label),
    datasets: [
      {
        label: "Buyurtmalar",
        data: orderSeries.map((row) => row.orders || 0),
        borderColor: "#3b82f6",
        backgroundColor: (context) => {
          const { chart } = context;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "rgba(37,99,235,0.25)";
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(37,99,235,0.45)");
          gradient.addColorStop(1, "rgba(37,99,235,0.02)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: "#60a5fa",
        pointBorderColor: "#0b1220",
        pointBorderWidth: 2,
      },
    ],
  };

  const barData = {
    labels: compareSeries.map((row) => row.label),
    datasets: [
      {
        label: "Sotuvlar",
        data: compareSeries.map((row) => row.sales || 0),
        backgroundColor: "#3b82f6",
        borderRadius: 6,
        maxBarThickness: 22,
      },
      {
        label: "Ijaralar",
        data: compareSeries.map((row) => row.rents || 0),
        backgroundColor: "#22c55e",
        borderRadius: 6,
        maxBarThickness: 22,
      },
    ],
  };

  const kpis = dashboard.kpis;

  return (
    <Page>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Boshqaruv paneli</h1>
          <p className="mt-1 text-sm text-slate-400">Kitobdosh platformasining umumiy holati va asosiy ko&apos;rsatkichlari</p>
        </div>
        <p className="text-sm text-slate-300">{today}</p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {error}. Ko&apos;rsatkichlar 0 sifatida ko&apos;rsatilmoqda.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Jami buyurtmalar" value={loading ? "—" : formatSpace(kpis.totalOrders.value)} icon={ShoppingCart} iconClass="bg-[#2563eb]" trend={kpis.totalOrders.trend} />
        <KpiCard label="Faol ijaralar" value={loading ? "—" : formatSpace(kpis.activeRents.value)} icon={BookOpen} iconClass="bg-emerald-500" trend={kpis.activeRents.trend} />
        <KpiCard label="Yetkazilmoqda" value={loading ? "—" : formatSpace(kpis.delivering.value)} icon={Truck} iconClass="bg-orange-500" trend={kpis.delivering.trend} />
        <KpiCard label="Oylik tushum" value={loading ? "—" : formatSpace(kpis.monthlyRevenue.value)} suffix="so'm" icon={Coins} iconClass="bg-violet-500" trend={kpis.monthlyRevenue.trend} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Panel className="p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-white">Buyurtmalar dinamikasi</h2>
            <select
              value={orderRange}
              onChange={(event) => setOrderRange(event.target.value)}
              className="h-9 rounded-lg border border-white/10 bg-[#0e1728] px-3 text-xs text-slate-200 outline-none"
            >
              <option value="12">So&apos;nggi 12 oy</option>
              <option value="6">So&apos;nggi 6 oy</option>
            </select>
          </div>
          <div className="h-[280px]">
            <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: chartScale(orderSeries.map((row) => row.orders || 0)) }} />
          </div>
        </Panel>

        <Panel className="p-5">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <h2 className="text-base font-semibold text-white">Sotuv va ijara</h2>
            <div className="flex flex-col items-end gap-2">
              <select
                value={compareRange}
                onChange={(event) => setCompareRange(event.target.value)}
                className="h-9 rounded-lg border border-white/10 bg-[#0e1728] px-3 text-xs text-slate-200 outline-none"
              >
                <option value="6">So&apos;nggi 6 oy</option>
                <option value="12">So&apos;nggi 12 oy</option>
              </select>
              <div className="flex gap-3 text-xs text-slate-300">
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#3b82f6]" /> Sotuvlar</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#22c55e]" /> Ijaralar</span>
              </div>
            </div>
          </div>
          <div className="h-[260px]">
            <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: chartScale(compareSeries.flatMap((row) => [row.sales || 0, row.rents || 0])) }} />
          </div>
        </Panel>
      </div>

      <Panel className="mt-4 overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <h2 className="text-base font-semibold text-white">So&apos;nggi buyurtmalar</h2>
          <Link href="/AdminPanel/sotuvdagiKitoblar" className="text-sm font-semibold text-[#60a5fa] hover:underline">
            Barchasini ko&apos;rish →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead>
              <tr className="border-y border-white/5 text-left text-xs uppercase tracking-wide text-slate-400">
                {["ID", "Mijoz", "Turi", "Summa", "Holat", "Kuryer", "Amal"].map((head) => (
                  <th key={head} className="px-4 py-3 font-semibold">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dashboard.recent.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-400">
                    Hozircha buyurtmalar yo&apos;q
                  </td>
                </tr>
              )}
              {dashboard.recent.map((row) => (
                <tr key={row.id} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">{row.code}</td>
                  <td className="px-4 py-3 text-sm text-white">{row.customer}</td>
                  <td className="px-4 py-3">
                    <Pill tone={row.kind === "rent" ? "green" : "blue"}>{row.kind === "rent" ? "Ijara" : "Sotuv"}</Pill>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-200">{formatMoney(row.amount)}</td>
                  <td className="px-4 py-3"><Pill tone={row.status?.tone}>{row.status?.label}</Pill></td>
                  <td className="px-4 py-3 text-sm text-slate-300">{row.courier || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="relative flex items-center gap-1.5">
                      <IconButton label="Ko'rish" onClick={() => router.push(row.href)}><Eye size={14} /></IconButton>
                      <IconButton label="Tahrirlash" onClick={() => router.push(row.href)}><Pencil size={14} /></IconButton>
                      <IconButton label="Yana" onClick={() => setMenuId(menuId === row.id ? null : row.id)}><MoreHorizontal size={14} /></IconButton>
                      {menuId === row.id && (
                        <div className="absolute right-0 top-9 z-10 w-40 rounded-xl border border-white/10 bg-[#0e1728] py-1 shadow-xl">
                          <button type="button" className="block w-full px-3 py-2 text-left text-sm text-slate-200 hover:bg-white/5" onClick={() => router.push(row.href)}>
                            Sahifasiga o&apos;tish
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </Page>
  );
}
