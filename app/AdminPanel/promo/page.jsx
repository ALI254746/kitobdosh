"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  EmptyState,
  GhostButton,
  IconButton,
  Modal,
  Page,
  PageHeader,
  Pill,
  PrimaryButton,
  TableWrap,
  Td,
  TextInput,
  Th,
} from "../components/ui";

const emptyBanner = {
  badge: "Bugungi chegirma",
  text: "",
  link: "/mobile/components/search?type=sale",
  image: "",
  isActive: true,
};

export default function PromoAdmin() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(emptyBanner);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await fetch("/api/admin/promo");
      const data = await res.json();
      if (data.success) {
        setBanners(data.data || []);
        setError("");
      } else setError(data.message || "Bannerlarni yuklab bo'lmadi");
    } catch (err) {
      setError("Bannerlarni yuklab bo'lmadi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "promo-banners");
    const toastId = toast.loading("Rasm yuklanmoqda...");
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message || "Yuklashda xatolik", { id: toastId });
        return;
      }
      setCurrent((prev) => ({ ...prev, image: data.url }));
      toast.success("Rasm yuklandi", { id: toastId });
    } catch (err) {
      toast.error("Rasm yuklashda xatolik", { id: toastId });
    }
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(current),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message || "Saqlab bo'lmadi");
        return;
      }
      toast.success(current._id ? "Banner yangilandi" : "Banner qo'shildi");
      setOpen(false);
      setCurrent(emptyBanner);
      await load();
    } catch (err) {
      toast.error("Saqlashda xatolik");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Bu bannerni o'chirasizmi?")) return;
    try {
      const res = await fetch(`/api/admin/promo?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message || "O'chirib bo'lmadi");
        return;
      }
      toast.success("O'chirildi");
      setBanners((prev) => prev.filter((banner) => banner._id !== id));
    } catch (err) {
      toast.error("O'chirishda xatolik");
    }
  };

  return (
    <Page>
      <PageHeader title="Bannerlar" subtitle="Mobil ilovadagi reklama bannerlari">
        <PrimaryButton onClick={() => { setCurrent(emptyBanner); setOpen(true); }}>
          <Plus size={16} /> Yangi banner
        </PrimaryButton>
      </PageHeader>
      {error && <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">{error}</div>}

      <TableWrap>
        <table className="w-full min-w-[760px]">
          <thead className="border-b border-white/5">
            <tr>
              {["Banner", "Matn", "Havola", "Holat", "Amal"].map((head) => <Th key={head}>{head}</Th>)}
            </tr>
          </thead>
          <tbody>
            {!loading && banners.length === 0 && (
              <tr><td colSpan={5}><EmptyState title="Banner yo'q" text="Yangi banner qo'shing. Saqlash admin sessiyasini talab qiladi." /></td></tr>
            )}
            {banners.map((banner) => (
              <tr key={banner._id} className="border-b border-white/5 last:border-0">
                <Td>
                  <div className="flex items-center gap-3">
                    {banner.image ? <img src={banner.image} alt="" className="h-12 w-20 rounded-lg object-cover" /> : <div className="h-12 w-20 rounded-lg bg-white/5" />}
                    <span className="text-white">{banner.badge}</span>
                  </div>
                </Td>
                <Td className="max-w-xs truncate">{banner.text}</Td>
                <Td className="max-w-[180px] truncate text-slate-400">{banner.link}</Td>
                <Td><Pill tone={banner.isActive ? "green" : "slate"}>{banner.isActive ? "Faol" : "O'chiq"}</Pill></Td>
                <Td>
                  <div className="flex gap-1.5">
                    <IconButton label="Tahrirlash" onClick={() => { setCurrent(banner); setOpen(true); }}><Pencil size={14} /></IconButton>
                    <IconButton label="O'chirish" onClick={() => remove(banner._id)}><Trash2 size={14} /></IconButton>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>

      <Modal open={open} title={current._id ? "Bannerni tahrirlash" : "Yangi banner"} onClose={() => setOpen(false)}>
        <form onSubmit={save} className="space-y-4">
          <TextInput label="Nishon" value={current.badge || ""} onChange={(e) => setCurrent({ ...current, badge: e.target.value })} />
          <TextInput label="Matn" required value={current.text || ""} onChange={(e) => setCurrent({ ...current, text: e.target.value })} />
          <TextInput label="Havola" value={current.link || ""} onChange={(e) => setCurrent({ ...current, link: e.target.value })} />
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-slate-400">Rasm</span>
            <input type="file" accept="image/*" onChange={upload} className="block w-full text-sm text-slate-300" />
          </label>
          {current.image && <img src={current.image} alt="" className="h-28 w-full rounded-xl object-cover" />}
          <label className="flex items-center gap-2 text-sm text-slate-200">
            <input type="checkbox" checked={Boolean(current.isActive)} onChange={(e) => setCurrent({ ...current, isActive: e.target.checked })} />
            Faol
          </label>
          <div className="flex justify-end gap-2">
            <GhostButton type="button" onClick={() => setOpen(false)}>Bekor qilish</GhostButton>
            <PrimaryButton type="submit" disabled={saving}>{saving ? "Saqlanmoqda..." : "Saqlash"}</PrimaryButton>
          </div>
        </form>
      </Modal>
    </Page>
  );
}
