"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Mail, UserRound } from "lucide-react";
import {
  EmptyState,
  GhostButton,
  IconButton,
  Modal,
  Page,
  PageHeader,
  Panel,
  Pill,
  PrimaryButton,
  SearchField,
  SelectField,
  TableWrap,
  Td,
  TextArea,
  Th,
} from "../components/ui";

const ROLE = {
  admin: { label: "Admin", tone: "purple" },
  user: { label: "Foydalanuvchi", tone: "blue" },
  kurier: { label: "Kuryer", tone: "orange" },
  kurer: { label: "Kuryer", tone: "orange" },
  courier: { label: "Kuryer", tone: "orange" },
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [error, setError] = useState("");
  const [messageFor, setMessageFor] = useState(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        if (data.success) setUsers(data.data || []);
        else setError(data.message || "Foydalanuvchilarni yuklab bo'lmadi");
      } catch (err) {
        console.error(err);
        setError("Foydalanuvchilarni yuklab bo'lmadi");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesQuery = !query || `${user.name || ""} ${user.email || ""} ${user.phone || ""}`.toLowerCase().includes(query);
      const matchesRole = role === "all" || user.role === role || (role === "courier" && ["kurier", "kurer", "courier"].includes(user.role));
      return matchesQuery && matchesRole;
    });
  }, [users, search, role]);

  const stats = {
    total: users.length,
    today: users.filter((user) => new Date(user.createdAt).toDateString() === new Date().toDateString()).length,
    buyers: users.filter((user) => user.bought > 0).length,
    renters: users.filter((user) => user.rented > 0).length,
  };

  const send = async () => {
    if (!text.trim() || !messageFor) return;
    setSending(true);
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: messageFor.id,
          title: "Admin xabari",
          message: text,
          type: "info",
        }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message || "Yuborib bo'lmadi");
        return;
      }
      toast.success("Xabar yuborildi");
      setMessageFor(null);
      setText("");
    } catch (err) {
      toast.error("Xatolik");
    } finally {
      setSending(false);
    }
  };

  return (
    <Page>
      <PageHeader title="Foydalanuvchilar" subtitle={loading ? "Yuklanmoqda..." : `${visible.length} ta yozuv`} />
      {error && <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">{error}</div>}

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Jami", stats.total],
          ["Bugun qo'shilgan", stats.today],
          ["Xaridorlar", stats.buyers],
          ["Ijarachilar", stats.renters],
        ].map(([label, value]) => (
          <Panel key={label} className="px-4 py-3">
            <p className="text-xs text-slate-400">{label}</p>
            <p className="mt-1 text-2xl font-bold text-white">{loading ? "—" : value}</p>
          </Panel>
        ))}
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <SearchField value={search} onChange={setSearch} placeholder="Ism, email yoki telefon..." />
        <SelectField value={role} onChange={setRole}>
          <option value="all">Barcha rollar</option>
          <option value="user">Foydalanuvchi</option>
          <option value="courier">Kuryer</option>
          <option value="admin">Admin</option>
        </SelectField>
      </div>

      <TableWrap>
        <table className="w-full min-w-[820px]">
          <thead className="border-b border-white/5">
            <tr>
              {["Foydalanuvchi", "Rol", "Sotib olgan", "Ijara", "Qo'shilgan", "Amal"].map((head) => <Th key={head}>{head}</Th>)}
            </tr>
          </thead>
          <tbody>
            {!loading && visible.length === 0 && (
              <tr><td colSpan={6}><EmptyState title="Foydalanuvchi topilmadi" text="Qidiruv yoki rol filtrini o'zgartiring." /></td></tr>
            )}
            {visible.map((user) => {
              const meta = ROLE[user.role] || { label: user.role || "—", tone: "slate" };
              return (
                <tr key={user.id} className="border-b border-white/5 last:border-0">
                  <Td>
                    <p className="font-medium text-white">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </Td>
                  <Td><Pill tone={meta.tone}>{meta.label}</Pill></Td>
                  <Td>{user.bought || 0}</Td>
                  <Td>{user.rented || 0}</Td>
                  <Td>{user.joined || "—"}</Td>
                  <Td>
                    <div className="flex gap-1.5">
                      <IconButton label="Profil" onClick={() => { window.location.href = `/mainPage/profile?userId=${user.id}`; }}>
                        <UserRound size={14} />
                      </IconButton>
                      <IconButton label="Xabar" onClick={() => { setMessageFor(user); setText(""); }}>
                        <Mail size={14} />
                      </IconButton>
                    </div>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableWrap>

      <Modal open={Boolean(messageFor)} title={messageFor ? `Xabar: ${messageFor.name}` : "Xabar"} onClose={() => setMessageFor(null)}>
        <TextArea rows={4} placeholder="Xabarni kiriting..." value={text} onChange={(event) => setText(event.target.value)} />
        <div className="mt-4 flex justify-end gap-2">
          <GhostButton onClick={() => setMessageFor(null)}>Bekor qilish</GhostButton>
          <PrimaryButton onClick={send} disabled={sending || !text.trim()}>{sending ? "Yuborilmoqda..." : "Yuborish"}</PrimaryButton>
        </div>
      </Modal>
    </Page>
  );
}
