"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";
import {
  EmptyState,
  GhostButton,
  IconButton,
  Modal,
  Pill,
  PrimaryButton,
  TableWrap,
  Td,
  TextInput,
  Th,
} from "../components/ui";

export default function KurierControl({ refreshKey = 0 }) {
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ fullName: "", email: "", phone: "", password: "" });
  const [saving, setSaving] = useState(false);

  const fetchCouriers = async () => {
    try {
      const res = await fetch("/api/admin/couriers");
      const data = await res.json();
      if (data.success) setCouriers(data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCouriers();
  }, [refreshKey]);

  const handleDelete = async (id) => {
    if (!window.confirm("Rostdan ham bu kuryerni o'chirmoqchimisiz?")) return;
    const toastId = toast.loading("O'chirilmoqda...");
    try {
      const res = await fetch(`/api/admin/couriers/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message || "O'chirib bo'lmadi", { id: toastId });
        return;
      }
      toast.success("Kuryer o'chirildi", { id: toastId });
      setCouriers((prev) => prev.filter((courier) => courier.id !== id));
    } catch (error) {
      toast.error("Xatolik", { id: toastId });
    }
  };

  const openEdit = (courier) => {
    setEditingUser(courier);
    setEditForm({ fullName: courier.name || "", email: "", phone: courier.phone || "", password: "" });
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/couriers/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message || "Yangilab bo'lmadi");
        return;
      }
      toast.success("Yangilandi");
      setEditingUser(null);
      fetchCouriers();
    } catch (error) {
      toast.error("Xatolik");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <TableWrap>
        <table className="w-full min-w-[760px]">
          <thead className="border-b border-white/5">
            <tr>
              {["Kuryer", "Telefon", "Holat", "Bugungi yetkazish", "Qaytarish", "Amal"].map((head) => <Th key={head}>{head}</Th>)}
            </tr>
          </thead>
          <tbody>
            {!loading && couriers.length === 0 && (
              <tr><td colSpan={6}><EmptyState title="Kuryer yo'q" text="Yangi kuryer qo'shish tugmasidan foydalaning." /></td></tr>
            )}
            {couriers.map((courier) => (
              <tr key={courier.id} className="border-b border-white/5 last:border-0">
                <Td>
                  <p className="font-medium text-white">{courier.name}</p>
                  <p className="text-xs text-slate-400">{courier.location || "—"}</p>
                </Td>
                <Td>{courier.phone || "—"}</Td>
                <Td><Pill tone={courier.status === "busy" ? "orange" : "green"}>{courier.status === "busy" ? "Band" : "Faol"}</Pill></Td>
                <Td>{courier.todayDeliveries || 0}</Td>
                <Td>{courier.todayReturns || 0}</Td>
                <Td>
                  <div className="flex gap-1.5">
                    <IconButton label="Tahrirlash" onClick={() => openEdit(courier)}><Pencil size={14} /></IconButton>
                    <IconButton label="O'chirish" onClick={() => handleDelete(courier.id)}><Trash2 size={14} /></IconButton>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>

      <Modal open={Boolean(editingUser)} title="Kuryerni tahrirlash" onClose={() => setEditingUser(null)}>
        <form onSubmit={handleUpdate} className="space-y-3">
          <TextInput label="F.I.SH" required value={editForm.fullName} onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })} />
          <TextInput label="Telefon" required value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
          <TextInput label="Email (bo'sh qoldirilsa o'zgarmaydi)" type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
          <TextInput label="Yangi parol" type="password" value={editForm.password} onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} />
          <div className="flex justify-end gap-2 pt-2">
            <GhostButton type="button" onClick={() => setEditingUser(null)}>Bekor qilish</GhostButton>
            <PrimaryButton type="submit" disabled={saving}>{saving ? "Saqlanmoqda..." : "Saqlash"}</PrimaryButton>
          </div>
        </form>
      </Modal>
    </>
  );
}
