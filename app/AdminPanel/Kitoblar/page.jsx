"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { BOOK_CATEGORIES, PUBLISHERS } from "../../../lib/constants";
import { uploadToCloudinary } from "../../../lib/cloudinary";
import {
  DangerButton,
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
  TextArea,
  TextInput,
  Th,
  formatMoney,
} from "../components/ui";

const SCHEMA_CATEGORIES = [
  "Badiiy Adabiyotlar",
  "Darsliklar va Qo'llanmalar",
  "Bolalar Adabiyoti",
  "Psixologiya va Biznes",
  "Ilmiy Kitoblar",
  "Diniy Adabiyotlar",
  "Boshqa",
];
const CATEGORY_OPTIONS = Array.from(new Set([...SCHEMA_CATEGORIES, ...BOOK_CATEGORIES.map((item) => item.id)]));

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Barchasi");
  const [sort, setSort] = useState("new");
  const [formOpen, setFormOpen] = useState(false);
  const [viewBook, setViewBook] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm());

  const load = async () => {
    try {
      const params = new URLSearchParams({ limit: "200", page: "1" });
      if (search.trim()) params.set("search", search.trim());
      if (category !== "Barchasi") params.set("category", category);
      const res = await fetch(`/api/books?${params}`);
      const data = await res.json();
      if (data.success) setBooks(data.data || []);
      else toast.error(data.message || "Kitoblarni yuklab bo'lmadi");
    } catch (error) {
      console.error(error);
      toast.error("Kitoblarni yuklab bo'lmadi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category]);

  const visible = useMemo(() => {
    const list = [...books];
    if (sort === "cheap") list.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sort === "expensive") list.sort((a, b) => (b.price || 0) - (a.price || 0));
    if (sort === "stock") list.sort((a, b) => (b.stock || 0) - (a.stock || 0));
    return list;
  }, [books, sort]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setFormOpen(true);
  };

  const openEdit = (book) => {
    setEditing(book);
    setForm({
      title: book.title || "",
      author: book.author || "",
      price: book.price ?? "",
      category: book.category || CATEGORY_OPTIONS[0],
      description: book.description || "",
      stock: book.stock ?? 1,
      isRentable: Boolean(book.isRentable),
      rentalPricePerDay: book.rentalPricePerDay || 0,
      imageUrl: book.images?.[0] || "",
      cloudinaryId: book.cloudinaryIds?.[0] || "",
      publisher: book.publisher || "Kitobdosh",
    });
    setFormOpen(true);
  };

  const onFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const toastId = toast.loading("Rasm yuklanmoqda...");
    try {
      const result = await uploadToCloudinary(file, "books");
      setForm((prev) => ({ ...prev, imageUrl: result.url, cloudinaryId: result.publicId }));
      toast.success("Rasm yuklandi", { id: toastId });
    } catch (error) {
      toast.error("Rasm yuklashda xatolik", { id: toastId });
    }
  };

  const save = async (event) => {
    event.preventDefault();
    if (!form.imageUrl) {
      toast.error("Kitob rasmi kerak");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      rentalPricePerDay: Number(form.rentalPricePerDay) || 0,
      images: [form.imageUrl],
      cloudinaryIds: form.cloudinaryId ? [form.cloudinaryId] : [],
    };
    try {
      const res = await fetch(editing ? `/api/books/${editing._id}` : "/api/books", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message || "Saqlab bo'lmadi");
        return;
      }
      toast.success(editing ? "Kitob yangilandi" : "Kitob qo'shildi");
      setFormOpen(false);
      setLoading(true);
      await load();
    } catch (error) {
      toast.error("Saqlashda xatolik");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    try {
      const res = await fetch(`/api/books/${deleteId}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message || "O'chirib bo'lmadi");
        return;
      }
      toast.success("Kitob o'chirildi");
      setBooks((prev) => prev.filter((book) => book._id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      toast.error("O'chirishda xatolik");
    }
  };

  return (
    <Page>
      <PageHeader title="Kitoblar" subtitle={loading ? "Yuklanmoqda..." : `Jami ${visible.length} ta kitob`}>
        <PrimaryButton onClick={openCreate}><Plus size={16} /> Yangi kitob</PrimaryButton>
      </PageHeader>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <SearchField value={search} onChange={setSearch} placeholder="Nomi yoki muallif..." />
        <SelectField value={category} onChange={setCategory}>
          <option value="Barchasi">Barcha kategoriyalar</option>
          {CATEGORY_OPTIONS.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </SelectField>
        <SelectField value={sort} onChange={setSort}>
          <option value="new">Yangi qo&apos;shilgan</option>
          <option value="cheap">Narx (arzon)</option>
          <option value="expensive">Narx (qimmat)</option>
          <option value="stock">Qoldiq</option>
        </SelectField>
      </div>

      <TableWrap>
        <table className="w-full min-w-[860px]">
          <thead className="border-b border-white/5">
            <tr>
              {["Kitob", "Kategoriya", "Narx", "Ijara", "Qoldiq", "Amal"].map((head) => <Th key={head}>{head}</Th>)}
            </tr>
          </thead>
          <tbody>
            {!loading && visible.length === 0 && (
              <tr><td colSpan={6}><EmptyState title="Kitob topilmadi" text="Filtrni o'zgartiring yoki yangi kitob qo'shing." /></td></tr>
            )}
            {visible.map((book) => (
              <tr key={book._id} className="border-b border-white/5 last:border-0">
                <Td>
                  <div className="flex items-center gap-3">
                    <img src={book.images?.[0] || "https://placehold.co/80x110?text=Kitob"} alt="" className="h-14 w-10 rounded-md object-cover" />
                    <div>
                      <p className="font-medium text-white">{book.title}</p>
                      <p className="text-xs text-slate-400">{book.author}</p>
                    </div>
                  </div>
                </Td>
                <Td>{book.category}</Td>
                <Td>{formatMoney(book.price)}</Td>
                <Td>{book.isRentable ? formatMoney(book.rentalPricePerDay) : "—"}</Td>
                <Td><Pill tone={book.stock > 0 ? "green" : "red"}>{book.stock > 0 ? `${book.stock} ta` : "Tugagan"}</Pill></Td>
                <Td>
                  <div className="flex gap-1.5">
                    <IconButton label="Ko'rish" onClick={() => setViewBook(book)}><Eye size={14} /></IconButton>
                    <IconButton label="Tahrirlash" onClick={() => openEdit(book)}><Pencil size={14} /></IconButton>
                    <IconButton label="O'chirish" onClick={() => setDeleteId(book._id)}><Trash2 size={14} /></IconButton>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>

      <Modal open={formOpen} title={editing ? "Kitobni tahrirlash" : "Yangi kitob"} onClose={() => setFormOpen(false)} wide>
        <form onSubmit={save} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextInput label="Kitob nomi" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <TextInput label="Muallif" required value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
          <TextInput label="Narxi (so'm)" type="number" required min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <TextInput label="Qoldiq" type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-slate-400">Kategoriya</span>
            <select className="h-11 w-full rounded-xl border border-white/10 bg-[#0e1728] px-3 text-sm text-white" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {SCHEMA_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-slate-400">Nashriyot</span>
            <select className="h-11 w-full rounded-xl border border-white/10 bg-[#0e1728] px-3 text-sm text-white" value={form.publisher} onChange={(e) => setForm({ ...form, publisher: e.target.value })}>
              {PUBLISHERS.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <div className="md:col-span-2">
            <TextArea label="Tavsif" required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="md:col-span-2 flex items-center gap-4">
            <label className="flex h-24 flex-1 cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/15 text-sm text-slate-300 hover:bg-white/5">
              {form.imageUrl ? "Rasmni almashtirish" : "Rasm tanlang"}
              <input type="file" accept="image/*" className="hidden" onChange={onFile} />
            </label>
            {form.imageUrl && <img src={form.imageUrl} alt="" className="h-24 w-16 rounded-lg object-cover" />}
          </div>
          <label className="md:col-span-2 flex items-center gap-2 text-sm text-slate-200">
            <input type="checkbox" checked={form.isRentable} onChange={(e) => setForm({ ...form, isRentable: e.target.checked })} />
            Ijaraga beriladi
          </label>
          {form.isRentable && (
            <TextInput label="Kunlik ijara narxi" type="number" min="0" value={form.rentalPricePerDay} onChange={(e) => setForm({ ...form, rentalPricePerDay: e.target.value })} />
          )}
          <div className="md:col-span-2 flex justify-end gap-2">
            <GhostButton type="button" onClick={() => setFormOpen(false)}>Bekor qilish</GhostButton>
            <PrimaryButton type="submit" disabled={saving}>{saving ? "Saqlanmoqda..." : "Saqlash"}</PrimaryButton>
          </div>
        </form>
      </Modal>

      <Modal open={Boolean(viewBook)} title={viewBook?.title || "Kitob"} onClose={() => setViewBook(null)} wide>
        {viewBook && (
          <div className="grid gap-5 md:grid-cols-[140px_1fr]">
            <img src={viewBook.images?.[0] || "https://placehold.co/200x280?text=Kitob"} alt="" className="h-48 w-full rounded-xl object-cover" />
            <div>
              <p className="text-slate-400">{viewBook.author}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Pill tone="blue">{viewBook.category}</Pill>
                <Pill tone={viewBook.stock > 0 ? "green" : "red"}>{viewBook.stock > 0 ? `${viewBook.stock} ta` : "Tugagan"}</Pill>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">{viewBook.description}</p>
              <p className="mt-4 text-sm text-white">Sotuv: {formatMoney(viewBook.price)}</p>
              <p className="text-sm text-slate-300">Ijara: {viewBook.isRentable ? `${formatMoney(viewBook.rentalPricePerDay)} / kun` : "Mavjud emas"}</p>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={Boolean(deleteId)} title="Kitobni o'chirish" onClose={() => setDeleteId(null)}>
        <p className="text-sm text-slate-300">Bu kitob butunlay o&apos;chiriladi. Amalni ortga qaytarib bo&apos;lmaydi.</p>
        <div className="mt-5 flex justify-end gap-2">
          <GhostButton onClick={() => setDeleteId(null)}>Bekor qilish</GhostButton>
          <DangerButton onClick={remove}>O&apos;chirish</DangerButton>
        </div>
      </Modal>
    </Page>
  );
}

function emptyForm() {
  return {
    title: "",
    author: "",
    price: "",
    category: CATEGORY_OPTIONS[0],
    description: "",
    stock: 1,
    isRentable: false,
    rentalPricePerDay: 0,
    imageUrl: "",
    cloudinaryId: "",
    publisher: "Kitobdosh",
  };
}
