"use client";

import { useEffect, useMemo, useState } from "react";
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
import { EmptyState, Page, PageHeader, Panel, SelectField, TableWrap, Td, Th, formatMoney, formatSpace } from "../components/ui";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip);

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

export default function ReportsPage() {
  const [series, setSeries] = useState([]);
  const [range, setRange] = useState("12");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        if (data.success) setSeries(data.dashboard?.series || []);
        else setError("Ma'lumotlar bazasiga ulanib bo'lmadi");
      } catch (err) {
        setError("Hisobotni yuklab bo'lmadi");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const rows = useMemo(() => series.slice(-Number(range)), [series, range]);
  const totals = rows.reduce(
    (acc, row) => ({
      orders: acc.orders + (row.orders || 0),
      sales: acc.sales + (row.sales || 0),
      rents: acc.rents + (row.rents || 0),
      revenue: acc.revenue + (row.revenue || 0),
    }),
    { orders: 0, sales: 0, rents: 0, revenue: 0 }
  );

  const revenueData = {
    labels: rows.map((row) => row.label),
    datasets: [
      {
        label: "Tushum",
        data: rows.map((row) => row.revenue || 0),
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139,92,246,0.25)",
        fill: true,
        tension: 0.35,
        pointRadius: 3,
      },
    ],
  };

  const volumeData = {
    labels: rows.map((row) => row.label),
    datasets: [
      { label: "Buyurtmalar", data: rows.map((row) => row.orders || 0), backgroundColor: "#3b82f6", borderRadius: 6, maxBarThickness: 18 },
      { label: "Sotuvlar", data: rows.map((row) => row.sales || 0), backgroundColor: "#60a5fa", borderRadius: 6, maxBarThickness: 18 },
      { label: "Ijaralar", data: rows.map((row) => row.rents || 0), backgroundColor: "#22c55e", borderRadius: 6, maxBarThickness: 18 },
    ],
  };

  return (
    <Page>
      <PageHeader title="Hisobotlar" subtitle="Buyurtma, sotuv, ijara va tushum oylar kesimida. Bekor qilingan buyurtma va rad etilgan ijara hisobga olinmaydi.">
        <SelectField value={range} onChange={setRange}>
          <option value="12">So&apos;nggi 12 oy</option>
          <option value="6">So&apos;nggi 6 oy</option>
          <option value="3">So&apos;nggi 3 oy</option>
        </SelectField>
      </PageHeader>

      {error && <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">{error}</div>}

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Buyurtmalar", formatSpace(totals.orders)],
          ["Sotuvlar", formatSpace(totals.sales)],
          ["Ijaralar", formatSpace(totals.rents)],
          ["Tushum", formatMoney(totals.revenue)],
        ].map(([label, value]) => (
          <Panel key={label} className="px-4 py-3">
            <p className="text-xs text-slate-400">{label}</p>
            <p className="mt-1 text-xl font-bold text-white">{loading ? "—" : value}</p>
          </Panel>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Panel className="p-5">
          <h2 className="mb-4 text-base font-semibold text-white">Tushum dinamikasi</h2>
          <div className="h-[280px]">
            {rows.length === 0 ? <EmptyState title="Ma'lumot yo'q" /> : (
              <Line data={revenueData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: chartScale(rows.map((row) => row.revenue || 0)) }} />
            )}
          </div>
        </Panel>
        <Panel className="p-5">
          <h2 className="mb-4 text-base font-semibold text-white">Buyurtma, sotuv va ijara</h2>
          <div className="h-[280px]">
            {rows.length === 0 ? <EmptyState title="Ma'lumot yo'q" /> : (
              <Bar data={volumeData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: "#cbd5e1" } } }, scales: chartScale(rows.flatMap((row) => [row.orders || 0, row.sales || 0, row.rents || 0])) }} />
            )}
          </div>
        </Panel>
      </div>

      <div className="mt-4">
        <TableWrap>
          <table className="w-full min-w-[640px]">
            <thead className="border-b border-white/5">
              <tr>
                {["Oy", "Buyurtmalar", "Sotuvlar", "Ijaralar", "Tushum"].map((head) => <Th key={head}>{head}</Th>)}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={5}><EmptyState title="Hisobot bo'sh" text="Bazadan oylik yig'indi olinmadi." /></td></tr>
              )}
              {rows.map((row, index) => (
                <tr key={`${row.label}-${index}`} className="border-b border-white/5 last:border-0">
                  <Td className="text-white">{row.label}</Td>
                  <Td>{formatSpace(row.orders)}</Td>
                  <Td>{formatSpace(row.sales)}</Td>
                  <Td>{formatSpace(row.rents)}</Td>
                  <Td>{formatMoney(row.revenue)}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </div>
    </Page>
  );
}
