"use client";

import { motion } from "framer-motion";
import { Bell, FileText, Globe, Lock, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useMain } from "../../mainPage/MainContext";

export default function SettingsPage() {
  const { darkMode, setDarkMode } = useMain();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Sozlamalar</h1>
        <p className="mt-1 text-sm text-[#8EA0B8]">Kuryer paneli tungi ko&apos;rinishda ishlaydi</p>
      </div>

      <Section title="Interfeys">
        <Row
          icon={darkMode ? <Moon size={18} className="text-[#7EB6FF]" /> : <Sun size={18} className="text-amber-300" />}
          label="Sayt mavzusi"
          desc="Bu tugma butun sayt uchun. Kuryer paneli baribir tungi rangda qoladi."
          action={
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              aria-pressed={darkMode}
              className={`h-8 w-14 rounded-full p-1 transition ${darkMode ? "bg-[#2F6BFF]" : "bg-white/15"}`}
            >
              <motion.span animate={{ x: darkMode ? 24 : 0 }} className="block h-6 w-6 rounded-full bg-white" />
            </button>
          }
        />
        <Row
          icon={<Globe size={18} className="text-[#7EB6FF]" />}
          label="Til"
          desc="O'zbekcha (lotin)"
        />
      </Section>

      <Section title="Xabarnomalar">
        <Link href="/KurierPanel/bildirishnomalar" className="block">
          <Row
            icon={<Bell size={18} className="text-[#7EB6FF]" />}
            label="Bildirishnomalar"
            desc="Yangi xabarlar va holat yangilanishlari"
          />
        </Link>
      </Section>

      <Section title="Hisob">
        <Row
          icon={<Lock size={18} className="text-rose-300" />}
          label="Parol"
          desc="Parolni o'zgartirish hozircha mavjud emas"
        />
        <Link href="/KurierPanel/profile" className="block">
          <Row
            icon={<FileText size={18} className="text-[#8EA0B8]" />}
            label="Profil"
            desc="Ism, telefon va rasm"
          />
        </Link>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="space-y-2">
      <h2 className="px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8EA0B8]">{title}</h2>
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#10192C]">{children}</div>
    </section>
  );
}

function Row({ icon, label, desc, action }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/5 px-4 py-4 last:border-0">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/5">{icon}</span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white">{label}</p>
          <p className="text-xs text-[#8EA0B8]">{desc}</p>
        </div>
      </div>
      {action}
    </div>
  );
}
