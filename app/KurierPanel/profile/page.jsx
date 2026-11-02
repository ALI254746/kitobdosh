"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, ChevronRight, LogOut, Phone, User, Wallet } from "lucide-react";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { COURIER_KEY } from "../components/courierUtils";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ today: 0, total: 0, delivered: 0, active: 0 });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: "", phone: "", avatar: null });

  const fetchProfileData = async () => {
    try {
      const [profileRes, courierRes] = await Promise.all([
        fetch("/api/user/profile"),
        fetch(COURIER_KEY),
      ]);
      const profileData = await profileRes.json();
      const courierData = await courierRes.json();

      if (profileData.success) {
        setUser(profileData.data.user);
        setEditForm({
          fullName: profileData.data.user.fullName || "",
          phone: profileData.data.user.phone || "",
          avatar: null,
        });
      }

      if (courierData.success && Array.isArray(courierData.data)) {
        const orders = courierData.data;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        setStats({
          today: orders.filter((o) => new Date(o.createdAt) >= today).length,
          total: orders.length,
          delivered: orders.filter((o) => o.status === "delivered").length,
          active: orders.filter((o) => ["accepted", "picked_up", "on_way"].includes(o.status)).length,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Ma'lumotlarni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleLogout = async () => {
    if (window.confirm("Tizimdan chiqishni xohlaysizmi?")) {
      await signOut({ callbackUrl: "/" });
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullName", editForm.fullName);
      formData.append("phone", editForm.phone);
      if (editForm.avatar) formData.append("avatar", editForm.avatar);

      const res = await fetch("/api/user/profile", { method: "PUT", body: formData });
      const data = await res.json();
      if (data.success) {
        toast.success("Profil yangilandi");
        setUser(data.data);
        setIsEditModalOpen(false);
      } else {
        toast.error(data.message || "Xatolik yuz berdi");
      }
    } catch (error) {
      console.error(error);
      toast.error("Yangilashda xatolik");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return <p className="py-20 text-center text-sm text-[#8EA0B8]">Yuklanmoqda...</p>;
  }

  const cards = [
    { label: "Bugun", value: stats.today },
    { label: "Jami", value: stats.total },
    { label: "Faol", value: stats.active },
    { label: "Yetkazildi", value: stats.delivered },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-5 pb-8">
      <section className="rounded-3xl border border-white/10 bg-[#10192C] p-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
          <div className="relative h-24 w-24 overflow-hidden rounded-3xl bg-[#0C1424]">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-[#64748B]"><User size={36} /></span>
            )}
            <span className="absolute bottom-2 right-2 h-3 w-3 rounded-full border-2 border-[#10192C] bg-emerald-400" />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-xs text-emerald-400">Onlayn</p>
            <h1 className="text-2xl font-semibold">{user?.fullName || "Ism kiritilmagan"}</h1>
            <p className="mt-1 flex items-center justify-center gap-2 text-sm text-[#8EA0B8] sm:justify-start">
              <Phone size={14} /> {user?.phone || "-"}
            </p>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="mt-3 rounded-xl bg-[#2F6BFF] px-4 py-2 text-xs font-semibold"
            >
              Tahrirlash
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/10 bg-[#10192C] p-4 text-center">
            <p className="text-[11px] text-[#8EA0B8]">{stat.label}</p>
            <p className="mt-1 text-xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-3xl border border-white/10 bg-[#10192C] p-5">
        <h2 className="text-sm font-semibold">Reyting</h2>
        <p className="mt-2 text-2xl font-semibold text-[#8EA0B8]">-</p>
        <p className="mt-1 text-xs text-[#8EA0B8]">Reyting bo&apos;yicha alohida ma&apos;lumot yo&apos;q.</p>
      </section>

      <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#10192C]">
        <ProfileLink href="/KurierPanel/hamyon" icon={<Wallet size={18} />} label="Hamyon" />
        <ProfileLink href="/KurierPanel/bildirishnomalar" icon={<Bell size={18} />} label="Bildirishnomalar" />
        <ProfileLink href="/KurierPanel/sozlamalar" icon={<ChevronRight size={18} />} label="Sozlamalar" />
        <button type="button" onClick={handleLogout} className="flex w-full items-center justify-between px-5 py-4 text-left text-rose-300 hover:bg-rose-500/10">
          <span className="flex items-center gap-3"><LogOut size={18} /> Tizimdan chiqish</span>
          <ChevronRight size={16} />
        </button>
      </section>

      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <motion.button
              type="button"
              aria-label="Yopish"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !updateLoading && setIsEditModalOpen(false)}
              className="absolute inset-0 bg-black/60"
            />
            <motion.form
              onSubmit={handleUpdateProfile}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="relative w-full max-w-md space-y-4 rounded-3xl border border-white/10 bg-[#10192C] p-6"
            >
              <h2 className="text-lg font-semibold">Profilni tahrirlash</h2>
              <label className="block text-xs text-[#8EA0B8]">
                Profil rasmi
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditForm({ ...editForm, avatar: e.target.files?.[0] || null })}
                  className="mt-2 block w-full text-sm text-slate-300"
                />
              </label>
              <label className="block text-xs text-[#8EA0B8]">
                Ism familiya
                <input
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0C1424] px-4 py-3 text-sm text-white outline-none"
                />
              </label>
              <label className="block text-xs text-[#8EA0B8]">
                Telefon
                <input
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0C1424] px-4 py-3 text-sm text-white outline-none"
                />
              </label>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 rounded-2xl border border-white/10 py-3 text-sm">
                  Bekor qilish
                </button>
                <button type="submit" disabled={updateLoading} className="flex-[2] rounded-2xl bg-[#2F6BFF] py-3 text-sm font-semibold disabled:opacity-60">
                  {updateLoading ? "Saqlanmoqda..." : "Saqlash"}
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProfileLink({ href, icon, label }) {
  return (
    <Link href={href} className="flex items-center justify-between border-b border-white/5 px-5 py-4 hover:bg-white/5">
      <span className="flex items-center gap-3 text-sm">{icon}{label}</span>
      <ChevronRight size={16} className="text-[#64748B]" />
    </Link>
  );
}
