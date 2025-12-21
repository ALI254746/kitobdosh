"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, Search, Edit2, Trash2, Globe, ShoppingBag, 
  Palette, Image as ImageIcon, CheckCircle2, XCircle,
  Save, X, Upload, Loader2, Star, Move
} from "lucide-react";
import toast from "react-hot-toast";

const COLORS = [
  "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", 
  "#EF4444", "#EC4899", "#14B8A6", "#52C6DA",
  "#F97316", "#06B6D4", "#6366F1", "#84cc16"
];

const EMOJIS = ["🌙", "⭐", "📘", "📚", "🎨", "🔬", "🕌", "🎓", "🚀", "💡", "🏺", "🏛️"];

export default function AdminStoresPage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStore, setCurrentStore] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    color: "#3B82F6",
    logoEmoji: "📚",
    bannerUrl: "",
    description: "Eng sara asarlar to'plami",
    isOfficial: true,
    order: 0,
    isActive: true
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await fetch("/api/admin/stores");
      const data = await res.json();
      if (data.success) {
        setStores(data.data);
      }
    } catch (error) {
      toast.error("Ma'lumotlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload
      });
      const data = await res.json();
      if (data.success) {
        setFormData({ ...formData, bannerUrl: data.url });
        toast.success("Rasm yuklandi!");
      }
    } catch (error) {
      toast.error("Rasm yuklashda xatolik");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = currentStore ? "PUT" : "POST";
    const body = currentStore ? { ...formData, _id: currentStore._id } : formData;

    try {
      const res = await fetch("/api/admin/stores", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        toast.success(currentStore ? "Yangilandi!" : "Yaratildi!");
        setIsModalOpen(false);
        fetchStores();
        resetForm();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Saqlashda xatolik");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Haqiqatdan ham o'chirmoqchimisiz?")) return;

    try {
      const res = await fetch(`/api/admin/stores?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("O'chirildi!");
        fetchStores();
      }
    } catch (error) {
      toast.error("O'chirishda xatolik");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      color: "#3B82F6",
      logoEmoji: "📚",
      bannerUrl: "",
      description: "Eng sara asarlar to'plami",
      isOfficial: true,
      order: 0,
      isActive: true
    });
    setCurrentStore(null);
  };

  const openEdit = (store) => {
    setCurrentStore(store);
    setFormData({
      name: store.name,
      slug: store.slug,
      color: store.color,
      logoEmoji: store.logoEmoji,
      bannerUrl: store.bannerUrl,
      description: store.description,
      isOfficial: store.isOfficial,
      order: store.order,
      isActive: store.isActive
    });
    setIsModalOpen(true);
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  return (
    <div className="p-6 max-w-7xl mx-auto bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Do'konlar Boshqaruvi</h1>
          <p className="text-slate-500 font-medium">Market sahifasidagi do'konlar va bannerlarni boshqarish</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 text-sm"
        >
          <Plus size={20} /> Yangi Do'kon Qo'shish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <div key={store._id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all group relative">
            <div className="h-32 relative">
              {store.bannerUrl ? (
                <img src={store.bannerUrl} alt={store.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full" style={{ backgroundColor: store.color + '20' }} />
              )}
              <div className="absolute top-4 right-4 flex gap-2">
                <button 
                  onClick={() => openEdit(store)}
                  className="p-2 bg-white/90 backdrop-blur-md rounded-xl text-slate-700 hover:text-blue-600 shadow-sm transition-all"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(store._id)}
                  className="p-2 bg-white/90 backdrop-blur-md rounded-xl text-slate-700 hover:text-red-600 shadow-sm transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div 
                className="absolute -bottom-6 left-6 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg border-4 border-white"
                style={{ backgroundColor: store.color }}
              >
                {store.logoEmoji}
              </div>
            </div>

            <div className="pt-10 p-6">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-black text-xl text-slate-900">{store.name}</h3>
                {store.isOfficial && <Star size={16} className="fill-blue-500 text-blue-500" />}
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">ID: {store.slug}</p>
              <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-4">{store.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${store.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-xs font-bold text-slate-400 uppercase">{store.isActive ? 'Faol' : 'Faol emas'}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <Move size={14} />
                  <span className="text-xs font-bold">Tartib: {store.order}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-2xl font-black text-slate-900">{currentStore ? "Do'konni tahrirlash" : "Yangi Do'kon"}</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Ma'lumotlarni to'ldiring</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Do'kon nomi</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Masalan: Hilol Nashr"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Slug (Unikal ID)</label>
                  <input 
                    type="text" 
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    placeholder="hilol-nashr (bo'sh qolsa nomidan o'tadi)"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Qisqacha Tavsif</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 transition-all outline-none h-24 resize-none"
                  placeholder="Do'kon haqida qisqacha ma'lumot..."
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Brend Rangi</label>
                  <div className="flex flex-wrap gap-2">
                    {COLORS.map(c => (
                      <button 
                        key={c}
                        type="button" 
                        onClick={() => setFormData({...formData, color: c})}
                        className={`w-10 h-10 rounded-xl transition-all transform active:scale-90 border-4 ${formData.color === c ? 'border-blue-200 scale-110 shadow-lg' : 'border-transparent'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Emoji Belgi</label>
                  <div className="flex flex-wrap gap-2">
                    {EMOJIS.map(e => (
                      <button 
                        key={e}
                        type="button" 
                        onClick={() => setFormData({...formData, logoEmoji: e})}
                        className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xl transition-all transform active:scale-90 border-4 ${formData.logoEmoji === e ? 'border-blue-200 scale-110 shadow-lg' : 'border-transparent'}`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Banner Rasmi (Cloudinary)</label>
                <div className="flex gap-4 items-center">
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      value={formData.bannerUrl}
                      onChange={(e) => setFormData({...formData, bannerUrl: e.target.value})}
                      placeholder="https://cloudinary.com/..."
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 pr-12 outline-none"
                    />
                    <ImageIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  </div>
                  <label className="bg-slate-900 text-white p-4 rounded-2xl cursor-pointer hover:bg-slate-800 transition-all">
                    {uploading ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
                    <input type="file" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                {formData.bannerUrl && (
                  <div className="mt-4 rounded-2xl overflow-hidden aspect-[3/1] shadow-inner bg-slate-50">
                    <img src={formData.bannerUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex gap-6 items-center pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="isOfficial" 
                    checked={formData.isOfficial} 
                    onChange={(e) => setFormData({...formData, isOfficial: e.target.checked})}
                    className="w-5 h-5 rounded-lg border-slate-200 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="isOfficial" className="text-sm font-bold text-slate-700">Official Store</label>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="isActive" 
                    checked={formData.isActive} 
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="w-5 h-5 rounded-lg border-slate-200 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-bold text-slate-700">Faol (Marketda ko'rinadi)</label>
                </div>
                <div className="flex-1 flex items-center justify-end gap-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tartib:</label>
                  <input 
                    type="number" 
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                    className="w-16 bg-slate-50 border-none rounded-xl py-2 px-3 text-sm font-bold text-slate-900 text-center outline-none"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-2xl shadow-blue-200 active:scale-[0.98] transition-all sticky bottom-0"
              >
                <Save size={20} /> {currentStore ? "O'zgarishlarni saqlash" : "Do'konni yaratish"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
