"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import PickupTab from "./kitobolish";
import ReturnTab from "./kitobtopshirish";
import KurierControl from "./kuriernazorat";
import { GhostButton, Modal, Page, PageHeader, Panel, PrimaryButton, TextInput } from "../components/ui";

const TABS = [
  { id: "kuriernazorat", label: "Kuryerlar" },
  { id: "kitobolish", label: "Kitob olish" },
  { id: "kitobtopshirish", label: "Kitob topshirish" },
];

export default function CourierStats() {
  const [activeTab, setActiveTab] = useState("kuriernazorat");
  const [stats, setStats] = useState({ total: 0, online: 0, todayDeliveries: 0, todayReturns: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "", phone: "" });
  const [creating, setCreating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/couriers");
        const result = await res.json();
        if (result.success) {
          const couriers = result.data || [];
          setStats({
            total: couriers.length,
            online: couriers.filter((item) => item.status !== "blocked").length,
            todayDeliveries: couriers.reduce((sum, item) => sum + (item.todayDeliveries || 0), 0),
            todayReturns: couriers.reduce((sum, item) => sum + (item.todayReturns || 0), 0),
          });
        }
      } catch (error) {
        toast.error("Statistikani yuklashda xatolik");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [refreshKey]);

  const handleCreate = async (event) => {
    event.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/admin/couriers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message || "Qo'shib bo'lmadi");
        return;
      }
      toast.success("Kuryer qo'shildi");
      setShowModal(false);
      setFormData({ fullName: "", email: "", password: "", phone: "" });
      setRefreshKey((value) => value + 1);
    } catch (error) {
      toast.error("Xatolik yuz berdi");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Page>
      <PageHeader title="Kuryerlar" subtitle={loading ? "Yuklanmoqda..." : `${stats.total} ta kuryer`}>
        <PrimaryButton onClick={() => setShowModal(true)}><Plus size={16} /> Yangi kuryer</PrimaryButton>
      </PageHeader>

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Jami", stats.total],
          ["Faol", stats.online],
          ["Bugungi yetkazish", stats.todayDeliveries],
          ["Bugungi qaytarish", stats.todayReturns],
        ].map(([label, value]) => (
          <Panel key={label} className="px-4 py-3">
            <p className="text-xs text-slate-400">{label}</p>
            <p className="mt-1 text-2xl font-bold text-white">{loading ? "—" : value}</p>
          </Panel>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${activeTab === tab.id ? "bg-[#2563eb] text-white" : "border border-white/10 text-slate-300 hover:bg-white/5"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "kuriernazorat" && <KurierControl refreshKey={refreshKey} />}
      {activeTab === "kitobolish" && <PickupTab />}
      {activeTab === "kitobtopshirish" && <ReturnTab />}

      <Modal open={showModal} title="Yangi kuryer" onClose={() => setShowModal(false)}>
        <form onSubmit={handleCreate} className="space-y-3">
          <TextInput label="F.I.SH" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
          <TextInput label="Telefon" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          <TextInput label="Email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <TextInput label="Parol" type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          <div className="flex justify-end gap-2 pt-2">
            <GhostButton type="button" onClick={() => setShowModal(false)}>Bekor qilish</GhostButton>
            <PrimaryButton type="submit" disabled={creating}>{creating ? "Saqlanmoqda..." : "Saqlash"}</PrimaryButton>
          </div>
        </form>
      </Modal>
    </Page>
  );
}
