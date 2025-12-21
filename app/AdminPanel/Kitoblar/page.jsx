"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaEdit, FaTrash, FaSearch, FaPlus, FaFilter, FaSortAmountDown, FaLayerGroup, FaTags, FaStar, FaBookmark, FaTimes, FaCamera, FaExclamationTriangle } from "react-icons/fa";
import { useAdmin } from "../AdminContext";
import toast from "react-hot-toast";
import { uploadToCloudinary } from "../../../lib/cloudinary";
import { BOOK_CATEGORIES, PUBLISHERS } from "../../../lib/constants";

// --- COMPONENTS ---

const FilterSidebar = ({ darkMode }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`hidden lg:block w-72 rounded-2xl p-6 h-fit sticky top-28 border backdrop-blur-md
                ${darkMode 
                    ? "bg-[#163201]/40 border-[#A3ED96]/20" 
                    : "bg-white border-gray-100 shadow-xl"
                }
            `}
        >
            <h3 className={`text-lg font-black mb-6 flex items-center gap-2 ${darkMode ? "text-white" : "text-[#163201]"}`}>
                <FaFilter className="text-[#A3ED96]" /> Filterlar
            </h3>

            {/* Categories */}
            <div className="mb-8">
                <p className={`text-xs font-bold uppercase tracking-wider mb-4 ${darkMode ? "text-[#A3ED96]/60" : "text-gray-400"}`}>
                    Kategoriyalar
                </p>
                <div className="space-y-2">
                    <div className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 group bg-[#163201] text-[#A3ED96]`}>
                        <div className="flex items-center gap-3">
                            <FaLayerGroup />
                            <span className="font-bold text-sm">Barchasi</span>
                        </div>
                    </div>
                    {BOOK_CATEGORIES.map((cat, index) => (
                        <div key={index} className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 group
                            ${darkMode ? "hover:bg-white/5 text-gray-300" : "hover:bg-gray-50 text-gray-600"}
                        `}>
                            <div className="flex items-center gap-3">
                                <FaTags className="opacity-70" />
                                <span className="font-bold text-sm">{cat.id}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}

const BookSkeleton = ({ darkMode }) => {
    const shimmerBase = darkMode ? "bg-[#A3ED96]/[0.05]" : "bg-gray-200";
    return (
        <div className={`rounded-2xl p-4 animate-pulse flex flex-col gap-4 border ${darkMode ? 'border-[#A3ED96]/10' : 'border-gray-100'}`}>
            <div className={`w-full h-48 rounded-xl ${shimmerBase}`} />
            <div className={`w-3/4 h-6 rounded-lg ${shimmerBase}`} />
            <div className={`w-1/2 h-4 rounded-lg ${shimmerBase}`} />
            <div className="flex justify-between mt-2">
                 <div className={`w-20 h-8 rounded-lg ${shimmerBase}`} />
                 <div className={`w-20 h-8 rounded-lg ${shimmerBase}`} />
            </div>
        </div>
    )
}

const BookCard = ({ book, darkMode, onEdit, onDelete, onView }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className={`group relative rounded-2xl overflow-hidden shadow-lg border backdrop-blur-sm transition-all duration-300
                ${darkMode 
                    ? "bg-[#163201]/40 border-[#A3ED96]/20 text-white hover:border-[#A3ED96]/50" 
                    : "bg-white border-gray-100 text-gray-800 hover:shadow-xl"
                }
            `}
        >
            <div className="relative w-full h-64 overflow-hidden bg-gray-100">
                <Image 
                    src={book.images && book.images[0] ? book.images[0] : "https://placehold.co/400x600?text=No+Image"} 
                    alt={book.title} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                     <p className="text-white text-xs font-bold mb-1 opacity-80">KATEGORIYA</p>
                     <p className="text-[#A3ED96] font-bold text-sm truncate">{book.category}</p>
                </div>
                <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-md
                        ${book.stock > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
                    `}>
                        {book.stock > 0 ? `${book.stock} ta` : 'Tugagan'}
                    </div>
                    {book.publisher && (
                        <div className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white/20 backdrop-blur-md text-white border border-white/20">
                            {book.publisher}
                        </div>
                    )}
                </div>
            </div>

            <div className="p-5">
                <h3 className={`text-lg font-bold mb-1 truncate ${darkMode ? "text-white" : "text-[#163201]"}`}>
                    {book.title}
                </h3>
                <p className={`text-sm mb-4 ${darkMode ? "text-[#A3ED96]/70" : "text-gray-500"}`}>
                    {book.author}
                </p>

                <div className="flex items-center justify-between mb-4">
                     <div>
                        <p className={`text-xs font-bold ${darkMode ? "text-gray-400" : "text-gray-400"}`}>IJARA</p>
                        <p className={`font-bold ${darkMode ? "text-[#A3ED96]" : "text-blue-600"}`}>
                            {book.isRentable ? `${book.rentalPricePerDay?.toLocaleString()} so'm` : "-"}
                        </p>
                     </div>
                     <div className="text-right">
                        <p className={`text-xs font-bold ${darkMode ? "text-gray-400" : "text-gray-400"}`}>NARXI</p>
                        <p className={`font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                            {book.price?.toLocaleString()} so&apos;m
                        </p>
                     </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-dashed border-gray-200 dark:border-white/10">
                    <button onClick={() => onView(book)} className={`flex-1 flex items-center justify-center p-2 rounded-lg transition-colors
                        ${darkMode ? "bg-white/10 hover:bg-white/20 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}
                    `} title="Ko'rish">
                        <FaEye />
                    </button>
                    <button onClick={() => onEdit(book)} className={`flex-1 flex items-center justify-center p-2 rounded-lg transition-colors
                        ${darkMode ? "bg-[#A3ED96]/20 hover:bg-[#A3ED96]/30 text-[#A3ED96]" : "bg-blue-100 hover:bg-blue-200 text-blue-600"}
                    `} title="Tahrirlash">
                        <FaEdit />
                    </button>
                    <button onClick={() => onDelete(book._id)} className={`flex-1 flex items-center justify-center p-2 rounded-lg transition-colors
                        ${darkMode ? "bg-red-500/20 hover:bg-red-500/30 text-red-500" : "bg-red-100 hover:bg-red-200 text-red-600"}
                    `} title="O'chirish">
                        <FaTrash />
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

// --- CONFIRM DELETE MODAL ---
const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, darkMode }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div 
                         initial={{ opacity: 0, scale: 0.9 }}
                         animate={{ opacity: 1, scale: 1 }}
                         exit={{ opacity: 0, scale: 0.9 }}
                         className={`w-full max-w-sm p-6 rounded-2xl text-center shadow-2xl
                            ${darkMode ? "bg-[#163201] text-white border border-[#A3ED96]/20" : "bg-white text-gray-800"}
                         `}
                    >
                         <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 text-2xl">
                             <FaExclamationTriangle />
                         </div>
                         <h3 className="text-xl font-bold mb-2">Ishonchingiz komilmi?</h3>
                         <p className="text-sm opacity-70 mb-6">Bu kitob butunlay o'chiriladi. Bu amalni ortga qaytarib bo'lmaydi.</p>
                         
                         <div className="flex gap-3">
                             <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">Bekor qilish</button>
                             <button onClick={onConfirm} className="flex-1 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30">O'chirish</button>
                         </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

// --- BOOK FORM MODAL (ADD / EDIT) ---
const BookFormModal = ({ isOpen, onClose, onSubmit, initialData, darkMode }) => {
    const isEdit = !!initialData;
    const [formData, setFormData] = useState({
        title: "", author: "", price: "", category: "Badiiy Adabiyotlar", 
        description: "", stock: 1, isRentable: false, rentalPricePerDay: 0,
        imageUrl: "", publisher: "Kitobdosh" 
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(initialData) {
            setFormData({
                title: initialData.title,
                author: initialData.author,
                price: initialData.price,
                category: initialData.category,
                description: initialData.description,
                stock: initialData.stock,
                isRentable: initialData.isRentable || false,
                rentalPricePerDay: initialData.rentalPricePerDay || 0,
                imageUrl: initialData.images && initialData.images[0] ? initialData.images[0] : "",
                cloudinaryId: initialData.cloudinaryIds && initialData.cloudinaryIds[0] ? initialData.cloudinaryIds[0] : "",
                publisher: initialData.publisher || "Kitobdosh"
            });
        } else {
            setFormData({ title: "", author: "", price: "", category: "Badiiy Adabiyotlar", description: "", stock: 1, isRentable: false, rentalPricePerDay: 0, imageUrl: "", cloudinaryId: "", publisher: "Kitobdosh" });
        }
    }, [initialData, isOpen]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const toastId = toast.loading("Rasm yuklanmoqda...");
        try {
            const result = await uploadToCloudinary(file, 'books');
            setFormData(prev => ({
                ...prev,
                imageUrl: result.url,
                cloudinaryId: result.publicId
            }));
            toast.success("Rasm muvaffaqiyatli yuklandi!", { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error("Rasm yuklashda xatolik!", { id: toastId });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-3xl shadow-2xl relative
                            ${darkMode ? "bg-[#163201] text-white border border-[#A3ED96]/20" : "bg-white text-gray-800"}
                        `}
                    >
                        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-black/10 rounded-full transition-colors">
                            <FaTimes />
                        </button>
                        
                        <h2 className="text-2xl font-black mb-6">{isEdit ? "Kitobni Tahrirlash" : "Yangi Kitob Qo'shish"}</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold opacity-70">Kitob nomi</label>
                                    <input required className="w-full p-3 rounded-xl border bg-transparent" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Masalan: O'tkan kunlar" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold opacity-70">Muallif</label>
                                    <input required className="w-full p-3 rounded-xl border bg-transparent" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} placeholder="Abdulla Qodiriy" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold opacity-70">Narxi (so'm)</label>
                                    <input type="number" required className="w-full p-3 rounded-xl border bg-transparent" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="50000" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold opacity-70">Kategoriya</label>
                                    <select className="w-full p-3 rounded-xl border bg-transparent outline-none focus:ring-2 focus:ring-[#A3ED96]/30" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                        {BOOK_CATEGORIES.map(c => <option key={c.id} value={c.id} className="text-black">{c.id}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold opacity-70">Nashriyot / Do&apos;kon</label>
                                    <select className="w-full p-3 rounded-xl border bg-transparent outline-none focus:ring-2 focus:ring-[#A3ED96]/30" value={formData.publisher} onChange={e => setFormData({...formData, publisher: e.target.value})}>
                                        {PUBLISHERS.map(p => <option key={p.id} value={p.id} className="text-black">{p.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-xs font-bold opacity-70">Kitob Rasmi</label>
                                <div className="flex gap-4 items-center">
                                    <label className={`flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all
                                        ${darkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300"}
                                    `}>
                                        <div className="flex flex-col items-center gap-2">
                                            <FaCamera className={`text-2xl ${darkMode ? "text-[#A3ED96]" : "text-gray-400"}`} />
                                            <span className="text-sm font-bold opacity-70">
                                                {formData.imageUrl ? "Rasmni almashtirish" : "Rasm tanlang"}
                                            </span>
                                        </div>
                                        <input type="file" required={!isEdit} accept="image/*" className="hidden" onChange={handleFileChange} />
                                    </label>
                                    
                                    {formData.imageUrl && (
                                        <div className="w-24 h-32 rounded-xl overflow-hidden shadow-lg border-2 border-white/10 flex-shrink-0 bg-gray-100">
                                            <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold opacity-70">Tavsif</label>
                                <textarea required rows="3" className="w-full p-3 rounded-xl border bg-transparent" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Kitob haqida qisqacha..." />
                            </div>

                            <div className="p-4 rounded-xl border border-dashed border-gray-300 dark:border-white/20 bg-gray-50/50 dark:bg-black/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <input type="checkbox" id="rent" className="w-5 h-5 accent-[#A3ED96]" checked={formData.isRentable} onChange={e => setFormData({...formData, isRentable: e.target.checked})} />
                                    <label htmlFor="rent" className="font-bold cursor-pointer">Ijaraga beriladimi?</label>
                                </div>
                                {formData.isRentable && (
                                    <div className="ml-8 mt-2 animation-fade-in">
                                         <label className="text-xs font-bold opacity-70">Kunlik ijara narxi</label>
                                         <input type="number" className="w-full p-2 rounded-lg border bg-transparent" value={formData.rentalPricePerDay} onChange={e => setFormData({...formData, rentalPricePerDay: e.target.value})} placeholder="3000" />
                                    </div>
                                )}
                            </div>

                            <button disabled={loading} type="submit" className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${darkMode ? "bg-[#A3ED96] text-[#163201] hover:bg-[#bbfeb0]" : "bg-[#163201] text-white hover:bg-[#2d5c02]"}`}>
                                {loading ? "Saqlanmoqda..." : (isEdit ? "Saqlash" : "Kitobni Qo'shish")}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

// --- BOOK DETAILS MODAL ---
const ViewBookModal = ({ isOpen, onClose, book, darkMode }) => {
    if (!book) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                         className={`w-full max-w-3xl overflow-hidden rounded-3xl shadow-2xl relative flex flex-col md:flex-row
                            ${darkMode ? "bg-[#163201] text-white" : "bg-white text-gray-800"}
                        `}
                    >
                         <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors backdrop-blur-md text-white">
                            <FaTimes />
                        </button>

                        <div className="w-full md:w-2/5 h-64 md:h-auto relative bg-gray-200">
                             <Image 
                                src={book.images && book.images[0] ? book.images[0] : "https://placehold.co/400x600?text=No+Image"} 
                                alt={book.title} 
                                fill 
                                className="object-cover"
                            />
                        </div>

                        <div className="flex-1 p-8">
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#A3ED96] text-[#163201] mb-4">
                                {book.category}
                            </span>
                            <h2 className="text-3xl font-black mb-1 leading-tight">{book.title}</h2>
                            <p className="text-lg opacity-70 mb-6 font-medium">{book.author}</p>
                            
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className={`p-4 rounded-xl border ${darkMode ? "border-white/10 bg-white/5" : "border-gray-100 bg-gray-50"}`}>
                                     <p className="text-xs font-bold opacity-50 uppercase">Sotuv Narxi</p>
                                     <p className="text-xl font-bold text-blue-500">{book.price?.toLocaleString()} so'm</p>
                                </div>
                                <div className={`p-4 rounded-xl border ${darkMode ? "border-white/10 bg-white/5" : "border-gray-100 bg-gray-50"}`}>
                                     <p className="text-xs font-bold opacity-50 uppercase">Ijara Narxi</p>
                                     <p className="text-xl font-bold text-[#A3ED96]">
                                        {book.isRentable ? `${book.rentalPricePerDay?.toLocaleString()} so'm/kun` : "Mavjud emas"}
                                     </p>
                                </div>
                            </div>

                            <p className="opacity-80 leading-relaxed mb-6">
                                {book.description}
                            </p>

                            <div className="text-xs opacity-50">
                                Qo'shilgan sana: {new Date(book.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

// --- MAIN PAGE ---

export default function BooksPage() {
  const { darkMode } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  
  // Modals State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  
  const [selectedBook, setSelectedBook] = useState(null);

  // Fetch books from API
  const fetchBooks = async () => {
    try {
        const res = await fetch('/api/books');
        const data = await res.json();
        if(data.success) {
            setBooks(data.data);
        }
    } catch (error) {
        console.error("Failed to fetch books", error);
        toast.error("Kitoblarni yuklashda xatolik!");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // CRUD OPERATIONS
   const handleCreateOrUpdate = async (formData) => {
      // images array qilib yuboramiz
      const payload = { 
        ...formData, 
        images: [formData.imageUrl],
        cloudinaryIds: formData.cloudinaryId ? [formData.cloudinaryId] : []
      };
      
      if (selectedBook) {
          // UPDATE
          try {
              const res = await fetch(`/api/books/${selectedBook._id}`, {
                  method: 'PUT',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify(payload)
              });
              const data = await res.json();
              if(data.success) {
                  toast.success("Kitob yangilandi!");
                  setBooks(books.map(b => b._id === selectedBook._id ? data.data : b));
              } else {
                  toast.error(data.message);
              }
          } catch(e) { toast.error("Xatolik!"); }
      } else {
          // CREATE
          try {
             const res = await fetch('/api/books', {
                  method: 'POST',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify(payload)
              });
              const data = await res.json();
              if(data.success) {
                  toast.success("Kitob qo'shildi!");
                  setBooks([data.data, ...books]);
              } else {
                  toast.error(data.message);
              }
          } catch(e) { toast.error("Xatolik!"); }
      }
      setSelectedBook(null);
  };

  const handleDelete = async () => {
      if(!selectedBook) return;
      try {
          const res = await fetch(`/api/books/${selectedBook._id}`, { method: 'DELETE' });
          const data = await res.json();
          if(data.success) {
              toast.success("Kitob o'chirildi!");
              setBooks(books.filter(b => b._id !== selectedBook._id));
              setIsDeleteOpen(false);
              setSelectedBook(null);
          } else {
              toast.error(data.message);
          }
      } catch (e) { toast.error("Xatolik!"); }
  };

  const openEditModal = (book) => {
      setSelectedBook(book);
      setIsFormOpen(true);
  };

  const openDeleteModal = (id) => {
      // Bizga butun kitob objekti kerak emas deleteda, lekin id yetadi. 
      // State structureni buzmaslik uchun vaqtinchalik { _id: id } deb qo'yamiz
      setSelectedBook({ _id: id });
      setIsDeleteOpen(true);
  };
  
  const openViewModal = (book) => {
      setSelectedBook(book);
      setIsViewOpen(true);
  }

  const handleCloseForm = () => {
      setIsFormOpen(false);
      setSelectedBook(null);
  }

  return (
    <div className={`min-h-screen p-6 sm:p-8 transition-colors duration-300 ${darkMode ? "bg-[#0b1a00]" : "bg-[#f8fafc]"}`}>
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`text-3xl font-black tracking-tight mb-2 ${darkMode ? "text-white" : "text-[#163201]"}`}
            >
                Kitoblar Boshqaruvi
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className={`text-sm ${darkMode ? "text-[#A3ED96]/60" : "text-gray-500"}`}
            >
                Jami {books.length} ta kitob mavjud
            </motion.p>
          </div>

          <motion.button 
             onClick={() => setIsFormOpen(true)}
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg shadow-green-500/20 transition-all
                ${darkMode 
                    ? "bg-[#A3ED96] text-[#163201] hover:bg-[#bbfeb0]" 
                    : "bg-[#163201] text-[#A3ED96] hover:bg-[#1f4202]"
                }
             `}
          >
              <FaPlus />
              Yangi Kitob
          </motion.button>
      </div>

     <div className="flex flex-col lg:flex-row gap-8 items-start">
        <FilterSidebar darkMode={darkMode} />

        <div className="flex-1 w-full">
            {/* Toolkit */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col md:flex-row gap-4 mb-8"
            >
                <div className="flex-1 relative">
                    <FaSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-[#A3ED96]/50" : "text-gray-400"}`} />
                    <input 
                        type="text" 
                        placeholder="Qidirish (Nomi, Muallifi)..." 
                        className={`w-full pl-12 pr-4 py-4 rounded-xl border outline-none font-bold transition-all
                            ${darkMode 
                                ? "bg-[#163201]/40 border-[#A3ED96]/20 text-white focus:border-[#A3ED96] placeholder-[#A3ED96]/30" 
                                : "bg-white border-gray-200 text-gray-900 focus:border-[#163201] focus:ring-1 focus:ring-[#163201]"
                            }
                        `}
                    />
                </div>
                 <div className="relative">
                    <FaSortAmountDown className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-[#A3ED96]/50" : "text-gray-400"}`} />
                    <select className={`pl-12 pr-8 py-4 rounded-xl border outline-none font-bold cursor-pointer appearance-none
                        ${darkMode 
                            ? "bg-[#163201]/40 border-[#A3ED96]/20 text-[#A3ED96] focus:border-[#A3ED96]" 
                            : "bg-white border-gray-200 text-gray-700 focus:border-[#163201]"
                        }
                    `}>
                        <option>Saralash</option>
                        <option>Narx (Arzon)</option>
                        <option>Narx (Qimmat)</option>
                        <option>Yangi qo&apos;shilgan</option>
                    </select>
                </div>
            </motion.div>

            {/* Grid Content */}
            <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
            >
                <AnimatePresence>
                    {loading 
                        ? [...Array(6)].map((_, i) => <BookSkeleton key={i} darkMode={darkMode} />)
                        : books.map((book) => (
                            <BookCard 
                                key={book._id} 
                                book={book} 
                                darkMode={darkMode} 
                                onEdit={openEditModal}
                                onDelete={(id) => openDeleteModal(id)}
                                onView={openViewModal}
                            />
                        ))
                    }
                </AnimatePresence>
                {!loading && books.length === 0 && (
                    <div className="col-span-full text-center py-20 text-gray-400">
                        Hozircha kitoblar yo'q. Yangi kitob qo'shing!
                    </div>
                )}
            </motion.div>
        </div>
     </div>
     
     {/* Modals */}
     <BookFormModal 
        isOpen={isFormOpen} 
        onClose={handleCloseForm} 
        onSubmit={handleCreateOrUpdate}
        initialData={selectedBook}
        darkMode={darkMode}
     />
     
     <ConfirmDeleteModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        darkMode={darkMode}
     />
     
     <ViewBookModal 
        isOpen={isViewOpen}
        onClose={() => { setIsViewOpen(false); setSelectedBook(null); }}
        book={selectedBook}
        darkMode={darkMode}
     />
    </div>
  );
}
