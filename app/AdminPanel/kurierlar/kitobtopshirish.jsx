"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  EmptyState,
  GhostButton,
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
  return_requested: { label: "Qaytarish so'rovi", tone: "amber" },
  courier_assigned: { label: "Kuryer tayinlangan", tone: "blue" },
  courier_picked_up: { label: "Olib ketilgan", tone: "orange" },
};

export default function ReturnBooksPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/courier/returns");
      const data = await res.json();
      if (data.success) {
        setItems(data.data || []);
        setError("");
      } else setError(data.message || "Qaytarishlarni yuklab bo'lmadi");
    } catch (err) {
      setError("Qaytarishlarni yuklab bo'lmadi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesFilter = filter === "all" || item.status === filter;
      const haystack = `${item.bookTitle || ""} ${item.userName || ""}`.toLowerCase();
      return matchesFilter && (!query || haystack.includes(query));
    });
  }, [items, search, filter]);

  const act = async (rentId, action) => {
    const toastId = toast.loading("Yangilanmoqda...");
    try {
      const res = await fetch("/api/courier/returns", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rentId, action, condition: action === "complete" ? "perfect" : undefined }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message || "Yangilab bo'lmadi", { id: toastId });
        return;
      }
      toast.success("Holat yangilandi", { id: toastId });
      load();
    } catch (err) {
      toast.error("Xatolik", { id: toastId });
    }
  };

  return (
    <div>
      {error && <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">{error}</div>}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <SearchField value={search} onChange={setSearch} placeholder="Kitob yoki mijoz..." />
        <SelectField value={filter} onChange={setFilter}>
          <option value="all">Barchasi</option>
          <option value="return_requested">Qaytarish so&apos;rovi</option>
          <option value="courier_assigned">Kuryer tayinlangan</option>
          <option value="courier_picked_up">Olib ketilgan</option>
        </SelectField>
        <GhostButton onClick={load}>Yangilash</GhostButton>
      </div>
      <TableWrap>
        <table className="w-full min-w-[820px]">
          <thead className="border-b border-white/5">
            <tr>
              {["Kitob", "Mijoz", "Telefon", "Summa", "Holat", "Amal"].map((head) => <Th key={head}>{head}</Th>)}
            </tr>
          </thead>
          <tbody>
            {!loading && visible.length === 0 && (
              <tr><td colSpan={6}><EmptyState title="Qaytarish yo'q" text="Qaytarish so'ralgan ijaralar shu jadvalda chiqadi." /></td></tr>
            )}
            {visible.map((item) => {
              const meta = STATUS[item.status] || { label: item.status, tone: "slate" };
              return (
                <tr key={item._id} className="border-b border-white/5 last:border-0">
                  <Td>
                    <div className="flex items-center gap-3">
                      <img src={item.bookImage || "https://placehold.co/80x110?text=Kitob"} alt="" className="h-14 w-10 rounded-md object-cover" />
                      <span className="font-medium text-white">{item.bookTitle}</span>
                    </div>
                  </Td>
                  <Td>{item.userName || "—"}</Td>
                  <Td>{item.userPhone || "—"}</Td>
                  <Td>{formatMoney(item.totalPrice)}</Td>
                  <Td><Pill tone={meta.tone}>{meta.label}</Pill></Td>
                  <Td>
                    {item.status === "return_requested" && <PrimaryButton className="px-3 py-1.5 text-xs" onClick={() => act(item._id, "accept")}>Qabul</PrimaryButton>}
                    {item.status === "courier_assigned" && <PrimaryButton className="px-3 py-1.5 text-xs" onClick={() => act(item._id, "pickup")}>Olib ketildi</PrimaryButton>}
                    {item.status === "courier_picked_up" && <PrimaryButton className="px-3 py-1.5 text-xs" onClick={() => act(item._id, "complete")}>Yakunlash</PrimaryButton>}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableWrap>
    </div>
  );
}
