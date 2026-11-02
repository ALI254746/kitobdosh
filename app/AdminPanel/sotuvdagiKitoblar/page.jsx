"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Pusher from "pusher-js";
import { Eye } from "lucide-react";
import {
  EmptyState,
  GhostButton,
  IconButton,
  Modal,
  Page,
  PageHeader,
  Pill,
  PrimaryButton,
  SearchField,
  SelectField,
  TableWrap,
  Td,
  Th,
  formatMoney,
} from "../components/ui";

const STATUS = {
  pending: { label: "Yangi", tone: "blue" },
  processing: { label: "Yetkazilmoqda", tone: "orange" },
  completed: { label: "Yetkazib berildi", tone: "green" },
  cancelled: { label: "Bekor qilingan", tone: "red" },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await fetch("/api/order");
      const data = await res.json();
      if (data.success) {
        const sales = (data.data || []).filter((order) => {
          const items = order.items || [];
          return items.length === 0 || items.some((item) => item.type === "buy" || !item.type);
        });
        setOrders(sales);
        setError("");
      } else {
        setError(data.message || "Buyurtmalarni yuklab bo'lmadi");
      }
    } catch (err) {
      console.error(err);
      setError("Buyurtmalarni yuklab bo'lmadi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
    if (!key) return undefined;
    const pusher = new Pusher(key, { cluster });
    const channel = pusher.subscribe("admin-channel");
    channel.bind("new-order", (payload) => {
      toast.success(payload?.message || "Yangi buyurtma");
      load();
    });
    return () => pusher.unsubscribe("admin-channel");
  }, []);

  const updateStatus = async (id, next) => {
    const toastId = toast.loading("Yangilanmoqda...");
    try {
      const res = await fetch("/api/order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: next }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message || "Yangilab bo'lmadi", { id: toastId });
        return;
      }
      toast.success("Holat o'zgartirildi", { id: toastId });
      setSelected(null);
      await load();
    } catch (err) {
      toast.error("Xatolik", { id: toastId });
    }
  };

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter((order) => {
      const name = order.customer?.name || "";
      const phone = order.customer?.phone || "";
      const matchesQuery = !query || name.toLowerCase().includes(query) || phone.includes(query) || String(order._id).toLowerCase().includes(query);
      const matchesStatus = status === "all" || order.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [orders, search, status]);

  return (
    <Page>
      <PageHeader title="Buyurtmalar" subtitle={loading ? "Yuklanmoqda..." : `${visible.length} ta yozuv`}>
        <GhostButton onClick={load}>Yangilash</GhostButton>
      </PageHeader>

      {error && <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">{error}</div>}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <SearchField value={search} onChange={setSearch} placeholder="Mijoz, telefon yoki ID..." />
        <SelectField value={status} onChange={setStatus}>
          <option value="all">Barcha holatlar</option>
          <option value="pending">Yangi</option>
          <option value="processing">Yetkazilmoqda</option>
          <option value="completed">Yetkazib berildi</option>
          <option value="cancelled">Bekor qilingan</option>
        </SelectField>
      </div>

      <TableWrap>
        <table className="w-full min-w-[820px]">
          <thead className="border-b border-white/5">
            <tr>
              {["ID", "Mijoz", "Telefon", "Summa", "Yetkazish", "Holat", "Amal"].map((head) => <Th key={head}>{head}</Th>)}
            </tr>
          </thead>
          <tbody>
            {!loading && visible.length === 0 && (
              <tr><td colSpan={7}><EmptyState title="Buyurtma topilmadi" text="Hozircha bu filtr bo'yicha sotuv buyurtmasi yo'q." /></td></tr>
            )}
            {visible.map((order) => {
              const meta = STATUS[order.status] || { label: order.status, tone: "slate" };
              return (
                <tr key={order._id} className="border-b border-white/5 last:border-0">
                  <Td className="font-mono text-xs text-slate-400">#{String(order._id).slice(-5).toUpperCase()}</Td>
                  <Td className="text-white">{order.customer?.name || "Noma'lum"}</Td>
                  <Td>{order.customer?.phone || "—"}</Td>
                  <Td>{formatMoney(order.totalPrice)}</Td>
                  <Td>{order.deliveryMethod === "pickup" ? "Olib ketish" : "Yetkazib berish"}</Td>
                  <Td><Pill tone={meta.tone}>{meta.label}</Pill></Td>
                  <Td>
                    <IconButton label="Batafsil" onClick={() => setSelected(order)}><Eye size={14} /></IconButton>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableWrap>

      <Modal open={Boolean(selected)} title="Buyurtma" onClose={() => setSelected(null)} wide>
        {selected && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 text-sm">
              <p><span className="text-slate-400">Mijoz: </span>{selected.customer?.name}</p>
              <p><span className="text-slate-400">Telefon: </span>{selected.customer?.phone}</p>
              <p className="sm:col-span-2"><span className="text-slate-400">Manzil: </span>{selected.customer?.address || "—"}</p>
            </div>
            <div className="divide-y divide-white/5 rounded-xl border border-white/10">
              {(selected.items || []).filter((item) => item.type === "buy" || !item.type).map((item, index) => (
                <div key={index} className="flex items-center justify-between px-3 py-2 text-sm">
                  <span>{item.quantity}× {item.title}</span>
                  <span>{formatMoney(item.price)}</span>
                </div>
              ))}
            </div>
            <p className="text-right text-base font-semibold text-white">Jami: {formatMoney(selected.totalPrice)}</p>
            <div className="flex flex-wrap justify-end gap-2">
              {selected.status === "pending" && (
                <>
                  <GhostButton onClick={() => updateStatus(selected._id, "cancelled")}>Bekor qilish</GhostButton>
                  <PrimaryButton onClick={() => updateStatus(selected._id, "processing")}>Tasdiqlash</PrimaryButton>
                </>
              )}
              {selected.status === "processing" && (
                <PrimaryButton onClick={() => updateStatus(selected._id, "completed")}>Yetkazildi</PrimaryButton>
              )}
            </div>
          </div>
        )}
      </Modal>
    </Page>
  );
}
