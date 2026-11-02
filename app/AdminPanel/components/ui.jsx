"use client";

import { Search, X } from "lucide-react";

export function formatSpace(value) {
  const amount = Math.round(Number(value) || 0);
  return String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function formatMoney(value) {
  return `${formatSpace(value)} so'm`;
}

export function Page({ children }) {
  return <div className="px-4 py-6 text-slate-100 sm:px-6 lg:px-8">{children}</div>;
}

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export function Panel({ children, className = "" }) {
  return <div className={`rounded-2xl border border-white/10 bg-[#121a2f] ${className}`}>{children}</div>;
}

export function SearchField({ value, onChange, placeholder }) {
  return (
    <div className="relative w-full sm:w-72">
      <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-white/10 bg-[#0e1728] pl-9 pr-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-[#2563eb]"
      />
    </div>
  );
}

export function SelectField({ value, onChange, children, className = "" }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`h-11 rounded-xl border border-white/10 bg-[#0e1728] px-3 text-sm text-slate-200 outline-none focus:border-[#2563eb] ${className}`}
    >
      {children}
    </select>
  );
}

export function TextInput({ label, ...props }) {
  return (
    <label className="block space-y-1.5">
      {label && <span className="text-xs font-medium text-slate-400">{label}</span>}
      <input
        {...props}
        className="h-11 w-full rounded-xl border border-white/10 bg-[#0e1728] px-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-[#2563eb]"
      />
    </label>
  );
}

export function TextArea({ label, ...props }) {
  return (
    <label className="block space-y-1.5">
      {label && <span className="text-xs font-medium text-slate-400">{label}</span>}
      <textarea
        {...props}
        className="w-full rounded-xl border border-white/10 bg-[#0e1728] px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-[#2563eb]"
      />
    </label>
  );
}

export function PrimaryButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/5 disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function DangerButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400 disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

const TONE = {
  blue: "bg-blue-500/15 text-blue-300",
  green: "bg-emerald-500/15 text-emerald-300",
  teal: "bg-teal-500/15 text-teal-300",
  orange: "bg-orange-500/15 text-orange-300",
  amber: "bg-amber-500/15 text-amber-300",
  red: "bg-red-500/15 text-red-300",
  purple: "bg-violet-500/15 text-violet-300",
  slate: "bg-slate-500/20 text-slate-300",
};

export function Pill({ tone = "slate", children }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${TONE[tone] || TONE.slate}`}>
      {children}
    </span>
  );
}

export function Modal({ open, title, onClose, children, wide = false }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className={`max-h-[90vh] w-full overflow-y-auto rounded-2xl border border-white/10 bg-[#121a2f] p-6 shadow-2xl ${wide ? "max-w-3xl" : "max-w-lg"}`}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-white/5 hover:text-white" aria-label="Yopish">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function EmptyState({ title, text }) {
  return (
    <div className="px-6 py-14 text-center">
      <p className="font-semibold text-slate-100">{title}</p>
      {text && <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">{text}</p>}
    </div>
  );
}

export function TableWrap({ children }) {
  return (
    <Panel className="overflow-hidden">
      <div className="overflow-x-auto">{children}</div>
    </Panel>
  );
}

export function Th({ children }) {
  return <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">{children}</th>;
}

export function Td({ children, className = "" }) {
  return <td className={`px-4 py-3 text-sm text-slate-200 ${className}`}>{children}</td>;
}

export function IconButton({ children, label, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...props}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-300 transition hover:bg-white/5 hover:text-white"
    >
      {children}
    </button>
  );
}
