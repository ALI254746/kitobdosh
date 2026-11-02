"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  EmptyState,
  GhostButton,
  Modal,
  Pill,
  PrimaryButton,
  SearchField,
  TableWrap,
  Td,
  TextArea,
  Th,
} from "../components/ui";

const STATUS = {
  accepted: { text: "Kuryer kelmoqda", tone: "blue" },
  picked_up: { text: "Olib ketildi", tone: "orange" },
  on_way: { text: "Yo'lda", tone: "amber" },
  delivered: { text: "Yetkazildi", tone: "green" },
  new: { text: "Kutmoqda", tone: "slate" },
};

export default function PickupTab() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [msgModal, setMsgModal] = useState({ open: false, targetId: null, targetName: "", role: "user" });
  const [msgText, setMsgText] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const [selectModal, setSelectModal] = useState({ open: false, order: null });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/courier", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data || []);
        setError("");
      } else setError(data.message || "Buyurtmalarni yuklab bo'lmadi");
    } catch (err) {
      setError("Buyurtmalarni yuklab bo'lmadi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const currentList = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return orders.filter((order) => (order.book || "").toLowerCase().includes(query) || (order.customer || "").toLowerCase().includes(query));
  }, [orders, searchQuery]);

  const handleGiveBook = async (orderId, type) => {
    const toastId = toast.loading("Yangilanmoqda...");
    try {
      const res = await fetch("/api/courier", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, type, status: "picked_up" }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message || "Xatolik", { id: toastId });
        return;
      }
      toast.success("Kitob berildi", { id: toastId });
      fetchOrders();
    } catch (err) {
      toast.error("Tarmoq xatosi", { id: toastId });
    }
  };

  const openMsgModal = (id, name, role = "user") => {
    setMsgModal({ open: true, targetId: id, targetName: name, role });
    setMsgText("");
  };

  const handleMessageClick = (order) => {
    if (order.userId && order.courierId) setSelectModal({ open: true, order });
    else if (order.userId) openMsgModal(order.userId, order.customer || "Mijoz", "user");
    else if (order.courierId) openMsgModal(order.courierId, "Kuryer", "courier");
  };

  const handleSendMessage = async () => {
    if (!msgText.trim()) return;
    setSendingMsg(true);
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: msgModal.targetId,
          title: msgModal.role === "courier" ? "Admin (kuryerga)" : "Admin xabari",
          message: msgText,
          type: msgModal.role === "courier" ? "courier_message" : "user_message",
        }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message || "Xatolik");
        return;
      }
      toast.success("Xabar yuborildi");
      setMsgModal({ open: false, targetId: null, targetName: "", role: "user" });
    } catch (err) {
      toast.error("Tarmoq xatosi");
    } finally {
      setSendingMsg(false);
    }
  };

  return (
    <div>
      {error && <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">{error}</div>}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchField value={searchQuery} onChange={setSearchQuery} placeholder="Kitob yoki mijoz..." />
        <GhostButton onClick={fetchOrders}>Yangilash</GhostButton>
      </div>
      <TableWrap>
        <table className="w-full min-w-[820px]">
          <thead className="border-b border-white/5">
            <tr>
              {["Kitob", "Mijoz", "ID", "Holat", "Amal"].map((head) => <Th key={head}>{head}</Th>)}
            </tr>
          </thead>
          <tbody>
            {!loading && currentList.length === 0 && (
              <tr><td colSpan={5}><EmptyState title="Topshiriq yo'q" text="Kuryerga biriktirilgan faol yetkazishlar shu yerda chiqadi." /></td></tr>
            )}
            {currentList.map((order) => {
              const meta = STATUS[order.status] || STATUS.new;
              return (
                <tr key={order.id} className="border-b border-white/5 last:border-0">
                  <Td>
                    <div className="flex items-center gap-3">
                      <img src={order.image || "https://placehold.co/80x110?text=Kitob"} alt="" className="h-14 w-10 rounded-md object-cover" />
                      <span className="font-medium text-white">{order.book}</span>
                    </div>
                  </Td>
                  <Td>{order.customer}</Td>
                  <Td className="font-mono text-xs text-slate-400">{String(order.id).slice(-6)}</Td>
                  <Td><Pill tone={meta.tone}>{meta.text}</Pill></Td>
                  <Td>
                    <div className="flex flex-wrap gap-2">
                      {order.status === "accepted" && (
                        <PrimaryButton className="px-3 py-1.5 text-xs" onClick={() => handleGiveBook(order.id, order.type)}>Kitobni berish</PrimaryButton>
                      )}
                      {(order.userId || order.courierId) && (
                        <GhostButton className="px-3 py-1.5 text-xs" onClick={() => handleMessageClick(order)}>Xabar</GhostButton>
                      )}
                    </div>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableWrap>

      <Modal open={msgModal.open} title={`Xabar: ${msgModal.targetName || ""}`} onClose={() => setMsgModal({ ...msgModal, open: false })}>
        <TextArea rows={4} value={msgText} onChange={(event) => setMsgText(event.target.value)} placeholder="Xabarni kiriting..." />
        <div className="mt-4 flex justify-end gap-2">
          <GhostButton onClick={() => setMsgModal({ ...msgModal, open: false })}>Bekor qilish</GhostButton>
          <PrimaryButton onClick={handleSendMessage} disabled={sendingMsg || !msgText.trim()}>{sendingMsg ? "Yuborilmoqda..." : "Yuborish"}</PrimaryButton>
        </div>
      </Modal>

      <Modal open={selectModal.open} title="Kimga xabar yuborilsin?" onClose={() => setSelectModal({ open: false, order: null })}>
        <div className="grid grid-cols-2 gap-3">
          <GhostButton onClick={() => { openMsgModal(selectModal.order.userId, selectModal.order.customer || "Mijoz", "user"); setSelectModal({ open: false, order: null }); }}>Mijoz</GhostButton>
          <GhostButton onClick={() => { openMsgModal(selectModal.order.courierId, "Kuryer", "courier"); setSelectModal({ open: false, order: null }); }}>Kuryer</GhostButton>
        </div>
      </Modal>
    </div>
  );
}
