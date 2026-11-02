"use client";

import { ShieldCheck } from "lucide-react";
import { Page, PageHeader, Panel } from "../components/ui";

export default function AuditPage() {
  return (
    <Page>
      <PageHeader
        title="Audit"
        subtitle="Administrator amallari jurnali"
      />
      <Panel className="px-6 py-16 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2563eb]/15 text-[#60a5fa]">
          <ShieldCheck size={22} />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-white">Jurnal yozuvlari yo&apos;q</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-slate-400">
          Tizimda admin amallarini saqlaydigan audit yoki log modeli yo&apos;q. Buyurtma, ijara va bildirishnomalar
          alohida saqlanadi, lekin kim qachon holatni o&apos;zgartirgani yozilmaydi. Shu sababli bu sahifa bo&apos;sh holatda qoladi.
        </p>
      </Panel>
    </Page>
  );
}
