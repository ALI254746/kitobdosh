"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
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
  approved: { label: "Tasdiqlangan", tone: "teal" },
  active: { label: "Faol", tone: "green" },
  courier_assigned: { label: "Yetkazilmoqda", tone: "orange" },
  courier_picked_up: { label: "Yetkazilmoqda", tone: "orange" },
  return_requested: { label: "Qaytarish so'rovi", tone: "amber" },
  returned: { label: "Qaytarilgan", tone: "green" },
  late: { label: "Muddat tugash arafasida", tone: "amber" },
  rejected: { label: "Rad etilgan", tone: "red" },
};

export default function RentRequestsPage() {
  const [rents, setRents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await fetch("/api/rent");
      const data = await res.json();
      if (data.success) {
        setRents(data.data || []);
        setError("");
      } else setError(data.message || "Ijaralarni yuklab bo'lmadi");
    } catch (err) {
      console.error(err);
      setError("Ijaralarni yuklab bo'lmadi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, next) => {
    const toastId = toast.loading("Yangilanmoqda...");
    try {
      const res = await fetch("/api/rent", {
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
    return rents.filter((rent) => {
      const haystack = `${rent.fullName || ""} ${rent.bookTitle || ""} ${rent.phone || ""}`.toLowerCase();
      const matchesQuery = !query || haystack.includes(query);
      const matchesStatus = status === "all" || rent.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [rents, search, status]);

  return (
    <Page>
      <PageHeader title="Ijaralar" subtitle={loading ? "Yuklanmoqda..." : `${visible.length} ta so'rov`}>
        <GhostButton onClick={load}>Yangilash</GhostButton>
      </PageHeader>
      {error && <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">{error}</div>}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <SearchField value={search} onChange={setSearch} placeholder="Mijoz, kitob yoki telefon..." />
        <SelectField value={status} onChange={setStatus}>
          <option value="all">Barcha holatlar</option>
          {Object.entries(STATUS).map(([key, meta]) => (
            <option key={key} value={key}>{meta.label}</option>
          ))}
        </SelectField>
      </div>

      <TableWrap>
        <table className="w-full min-w-[900px]">
          <thead className="border-b border-white/5">
            <tr>
              {["Kitob", "Mijoz", "Muddat", "Summa", "Holat", "Amal"].map((head) => <Th key={head}>{head}</Th>)}
            </tr>
          </thead>
          <tbody>
            {!loading && visible.length === 0 && (
              <tr><td colSpan={6}><EmptyState title="Ijara topilmadi" text="Hozircha bu filtr bo'yicha ijara so'rovi yo'q." /></td></tr>
            )}
            {visible.map((rent) => {
              const meta = STATUS[rent.status] || { label: rent.status, tone: "slate" };
              return (
                <tr key={rent._id} className="border-b border-white/5 last:border-0">
                  <Td>
                    <div className="flex items-center gap-3">
                      <img src={rent.bookImage || "https://placehold.co/80x110?text=Ijara"} alt="" className="h-14 w-10 rounded-md object-cover" />
                      <span className="font-medium text-white">{rent.bookTitle}</span>
                    </div>
                  </Td>
                  <Td>
                    <p className="text-white">{rent.fullName}</p>
                    <p className="text-xs text-slate-400">{rent.phone}</p>
                  </Td>
                  <Td>{rent.days} kun</Td>
                  <Td>{formatMoney(rent.totalPrice)}</Td>
                  <Td><Pill tone={meta.tone}>{meta.label}</Pill></Td>
                  <Td>
                    <IconButton label="Batafsil" onClick={() => setSelected(rent)}><Eye size={14} /></IconButton>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableWrap>

      <Modal open={Boolean(selected)} title="Ijara so'rovi" onClose={() => setSelected(null)}>
        {selected && (
          <div className="space-y-3 text-sm text-slate-200">
            <p><span className="text-slate-400">Kitob: </span>{selected.bookTitle}</p>
            <p><span className="text-slate-400">Mijoz: </span>{selected.fullName}</p>
            <p><span className="text-slate-400">Telefon: </span>{selected.phone}</p>
            <p><span className="text-slate-400">Manzil: </span>{selected.address}</p>
            <p><span className="text-slate-400">To&apos;lov: </span>{selected.paymentMethod}</p>
            {selected.passportUrl && (
              <a href={selected.passportUrl} target="_blank" rel="noreferrer" className="inline-block text-[#60a5fa] hover:underline">
                Pasportni ko&apos;rish
              </a>
            )}
            <div className="flex flex-wrap justify-end gap-2 pt-2">
              {selected.status === "pending" && (
                <>
                  <GhostButton onClick={() => updateStatus(selected._id, "rejected")}>Rad qilish</GhostButton>
                  <PrimaryButton onClick={() => updateStatus(selected._id, "approved")}>Tasdiqlash</PrimaryButton>
                </>
              )}
              {selected.status === "approved" && (
                <PrimaryButton onClick={() => updateStatus(selected._id, "returned")}>Qaytarildi</PrimaryButton>
              )}
            </div>
          </div>
        )}
      </Modal>
    </Page>
  );
}
