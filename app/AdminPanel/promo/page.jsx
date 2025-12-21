"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Edit3, Save, X, ExternalLink, Megaphone, Image as ImageIcon, Upload, Info, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PromoAdmin() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentBanner, setCurrentBanner] = useState({
        badge: "🔥 Bugungi chegirma",
        text: "",
        link: "/mobile/components/search?type=sale",
        image: "",
        isActive: true
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const res = await fetch("/api/admin/promo");
            const data = await res.json();
            if (data.success) setBanners(data.data);
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
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "promo-banners");

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                setCurrentBanner({ ...currentBanner, image: data.url });
                toast.success("Rasm yuklandi");
            } else {
                toast.error(data.message || "Yuklashda xatolik");
            }
        } catch (error) {
            toast.error("Rasm yuklashda xatolik");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin/promo", {
                method: "POST",
                body: JSON.stringify(currentBanner)
            });
            const data = await res.json();
            if (data.success) {
                toast.success(currentBanner._id ? "Banner yangilandi" : "Banner qo'shildi");
                setIsEditing(false);
                setCurrentBanner({ badge: "🔥 Bugungi chegirma", text: "", link: "/mobile/components/search?type=sale", image: "", isActive: true });
                fetchBanners();
            }
        } catch (error) {
            toast.error("Saqlashda xatolik");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Haqiqatan ham ushbu bannerni o'chirmoqchimisiz?")) return;
        try {
            const res = await fetch(`/api/admin/promo?id=${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                toast.success("O'chirildi");
                fetchBanners();
            }
        } catch (error) {
            toast.error("O'chirishda xatolik");
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Megaphone className="text-orange-500" />
                        Promo Bannerlar
                    </h1>
                    <p className="text-gray-500 text-sm">Mobil ilovadagi reklama bannerlarini boshqarish</p>
                </div>
                <button 
                    onClick={() => {
                        setIsEditing(true);
                        setCurrentBanner({ badge: "🔥 Bugungi chegirma", text: "", link: "/mobile/components/search?type=sale", image: "", isActive: true });
                    }}
                    className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition shadow-lg shadow-orange-500/20 active:scale-95"
                >
                    <Plus size={20} />
                    Yangi Banner
                </button>
            </div>

            <AnimatePresence>
                {isEditing && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-8"
                    >
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Badge (Nishon)</label>
                                    <input 
                                        type="text"
                                        value={currentBanner.badge}
                                        onChange={(e) => setCurrentBanner({...currentBanner, badge: e.target.value})}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition"
                                        placeholder="Masalan: 🔥 Bugungi chegirma"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Havola (Link)</label>
                                    <input 
                                        type="text"
                                        value={currentBanner.link}
                                        onChange={(e) => setCurrentBanner({...currentBanner, link: e.target.value})}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition"
                                        placeholder="/mobile/components/search?type=sale"
                                        required
                                    />
                                </div>
                            </div>
                            
                            {/* Rasm yuklash bo'limi */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Banner Rasmi (Ixtiyoriy)</label>
                                <div className="flex flex-col md:flex-row gap-4 items-start">
                                    <div className="relative group w-full md:w-64 h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden flex items-center justify-center transition hover:border-orange-300">
                                        {currentBanner.image ? (
                                            <>
                                                <img src={currentBanner.image} alt="Preview" className="w-full h-full object-cover" />
                                                <button 
                                                    type="button"
                                                    onClick={() => setCurrentBanner({...currentBanner, image: ""})}
                                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </>
                                        ) : (
                                            <div className="text-center p-4">
                                                {uploading ? (
                                                    <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto" />
                                                ) : (
                                                    <>
                                                        <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-1" />
                                                        <p className="text-[10px] text-gray-400">Fondagi rasm (Rasm matn ortida chiroyli ko'rinadi)</p>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            disabled={uploading}
                                        />
                                    </div>
                                    <div className="flex-1 space-y-2 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                                        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
                                            <Info size={14} />
                                            Maslahat
                                        </div>
                                        <p className="text-xs text-blue-700 leading-relaxed">
                                            Agar rasm yuklasangiz, u bannerning foni (background) bo'lib xizmat qiladi. Matnlar rasmning ustida chiroyli gradient bilan ko'rinadi. Optimal rasm o'lchami: 1000x400px.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Asosiy Matn</label>
                                <textarea 
                                    rows="2"
                                    value={currentBanner.text}
                                    onChange={(e) => setCurrentBanner({...currentBanner, text: e.target.value})}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition"
                                    placeholder="Chegirma haqida batafsil ma'lumot..."
                                    required
                                />
                            </div>
                            <div className="flex items-center gap-3 py-2">
                                <input 
                                    type="checkbox"
                                    id="isActive"
                                    checked={currentBanner.isActive}
                                    onChange={(e) => setCurrentBanner({...currentBanner, isActive: e.target.checked})}
                                    className="w-5 h-5 accent-orange-500 cursor-pointer"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
                                    Hozir faollashtirish (Asosiy sahifada ko'rsatish)
                                </label>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                                <button 
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition"
                                >
                                    Bekor qilish
                                </button>
                                <button 
                                    type="submit"
                                    className="px-8 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition flex items-center gap-2"
                                >
                                    <Save size={20} />
                                    Saqlash
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    </div>
                ) : banners.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <Megaphone className="mx-auto text-gray-300 mb-3" size={48} />
                        <p className="text-gray-500">Hozircha hech qanday banner yaratilmagan</p>
                    </div>
                ) : (
                    banners.map((banner) => (
                        <div 
                            key={banner._id}
                            className={`p-1 rounded-2xl border transition-all ${
                                banner.isActive ? 'border-orange-500 shadow-md shadow-orange-500/5' : 'border-gray-100 opacity-60'
                            }`}
                        >
                            <div className="bg-white p-6 rounded-[14px] flex flex-col md:flex-row justify-between items-center gap-6">
                                {banner.image && (
                                    <div className="w-24 h-16 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                                        <img src={banner.image} alt="Banner" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-black uppercase rounded-lg border border-orange-100">
                                            {banner.badge}
                                        </span>
                                        {!banner.isActive && (
                                            <span className="px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-black uppercase rounded-lg">
                                                Faol emas
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-gray-800 text-lg">{banner.text}</h3>
                                    <div className="flex items-center gap-2 mt-2 text-blue-500 text-xs font-medium">
                                        <ExternalLink size={12} />
                                        {banner.link}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => {
                                            setIsEditing(true);
                                            setCurrentBanner(banner);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-orange-50 hover:text-orange-500 transition"
                                    >
                                        <Edit3 size={20} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(banner._id)}
                                        className="p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-500 transition"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
