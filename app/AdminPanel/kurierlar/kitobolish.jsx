"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaSearch, FaChevronRight } from "react-icons/fa";

// Skeleton Component
const TableSkeleton = ({ darkMode }) => (
  <div className="w-full animate-pulse">
    {[1, 2, 3, 4, 5].map((i) => (
      <div 
        key={i} 
        className={`flex items-center space-x-4 p-4 border-b last:border-0
          ${darkMode ? "border-white/5" : "border-gray-100"}
        `}
      >
        <div className={`w-12 h-16 rounded ${darkMode ? "bg-white/5" : "bg-gray-200"}`} />
        <div className="flex-1 space-y-2">
            <div className={`h-4 w-1/3 rounded ${darkMode ? "bg-white/5" : "bg-gray-200"}`} />
            <div className={`h-3 w-1/4 rounded ${darkMode ? "bg-white/5" : "bg-gray-200"}`} />
        </div>
        <div className={`w-24 h-8 rounded-full ${darkMode ? "bg-white/5" : "bg-gray-200"}`} />
        <div className={`w-20 h-8 rounded-lg ${darkMode ? "bg-white/5" : "bg-gray-200"}`} />
      </div>
    ))}
  </div>
);

export default function PickupTab({ darkMode }) {
  const [activeTab, setActiveTab] = useState("pickup");
  const [pickupFilter, setPickupFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const [bookList, setBookList] = useState([
    {
      id: "K001",
      name: "Sariq devni minib",
      user: "Ali Karimov",
      courier: "Jasur Tursunov",
      status: "kutmoqda",
      image: "https://picsum.photos/100/150?random=1",
    },
    {
      id: "K002",
      name: "O‘tkan kunlar",
      user: "Dilnoza Sodiqova",
      courier: "Bahrom Yuldashev",
      status: "yoldaman",
      image: "https://picsum.photos/100/150?random=2",
    },
    {
      id: "K003",
      name: "Jimjitlik",
      user: "Rustam Qodirov",
      courier: "Ulug‘bek Raxmonov",
      status: "olib_boldi",
      image: "https://picsum.photos/100/150?random=3",
    },
  ]);

  const filteredBooks = (bookList || []).filter(
    (book) =>
      (pickupFilter === "all" || book.status === pickupFilter) &&
      (book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.user.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Filter & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {["all", "kutmoqda", "yoldaman", "olib_boldi"].map((status) => {
            const labels = {
              all: "Barchasi",
              kutmoqda: "Kutmoqda",
              yoldaman: "Yo'ldaman",
              olib_boldi: "Olib bo'ldi",
            };
            return (
              <button
                key={status}
                onClick={() => setPickupFilter(status)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                  pickupFilter === status
                    ? (darkMode ? "bg-[#A3ED96] text-[#163201]" : "bg-[#163201] text-white")
                    : (darkMode ? "bg-white/5 text-gray-400 hover:bg-white/10" : "bg-gray-100 text-gray-600 hover:bg-gray-200")
                }`}
              >
                {labels[status]}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-80">
          <input
            type="text"
            placeholder="Qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl font-medium outline-none border transition-all
                ${darkMode 
                    ? "bg-white/5 border-white/10 text-white focus:border-[#A3ED96]" 
                    : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#163201]"
                }
            `}
          />
          <FaSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-[#A3ED96]/50" : "text-gray-400"}`} />
        </div>
      </div>

      {/* Table Content */}
      <div className={`rounded-2xl border overflow-hidden min-h-[400px]
          ${darkMode ? "border-[#A3ED96]/10" : "border-gray-200"}
      `}>
         {loading ? (
             <TableSkeleton darkMode={darkMode} />
         ) : (
            <div className="overflow-x-auto">
                <table className="w-full">
                <thead className={`${darkMode ? "bg-white/5" : "bg-gray-50 border-b border-gray-200"}`}>
                    <tr>
                    {["Kitob", "Nomi", "Foydalanuvchi", "ID", "Holati", "Kuryer", "Amal"].map((head) => (
                        <th key={head} className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider
                            ${darkMode ? "text-[#A3ED96]/70" : "text-gray-500"}
                        `}>
                            {head}
                        </th>
                    ))}
                    </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? "divide-white/5" : "divide-gray-100"}`}>
                    {filteredBooks.map((book) => (
                    <tr
                        key={book.id}
                        className={`group transition-colors
                            ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}
                        `}
                    >
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="relative w-12 h-16 shadow-md rounded overflow-hidden">
                                <Image
                                src={book.image}
                                alt={book.name}
                                fill
                                className="object-cover"
                                />
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <p className={`text-sm font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                                {book.name}
                            </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold
                                    ${darkMode ? "bg-[#A3ED96]/20 text-[#A3ED96]" : "bg-blue-100 text-blue-600"}
                                `}>
                                    {book.user.charAt(0)}
                                </span>
                                <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                    {book.user}
                                </p>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-xs font-mono px-2 py-1 rounded
                                ${darkMode ? "bg-white/10 text-gray-400" : "bg-gray-100 text-gray-600"}
                            `}>
                                {book.id}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                            book.status === "kutmoqda"
                                ? (darkMode ? "bg-yellow-500/10 text-yellow-400" : "bg-yellow-100 text-yellow-800")
                                : book.status === "qabul_qildi"
                                ? (darkMode ? "bg-green-500/10 text-green-400" : "bg-green-100 text-green-800")
                                : book.status === "yoldaman"
                                ? (darkMode ? "bg-blue-500/10 text-blue-400" : "bg-blue-100 text-blue-800")
                                : (darkMode ? "bg-gray-500/10 text-gray-400" : "bg-gray-100 text-gray-800")
                            }`}
                        >
                            {book.status === "kutmoqda" ? "Kutmoqda" : 
                            book.status === "qabul_qildi" ? "Qabul qildi" :
                            book.status === "yoldaman" ? "Yo'ldaman" : "Olib bo'ldi"}
                        </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{book.courier}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <button className={`px-4 py-2 text-sm font-bold rounded-lg transition-all
                                ${darkMode 
                                    ? "bg-[#A3ED96] text-[#163201] hover:shadow-[0_0_15px_rgba(163,237,150,0.3)]" 
                                    : "bg-[#163201] text-white hover:bg-[#2a5c02] hover:shadow-lg"
                                }
                            `}>
                                Berdim
                            </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
         )}
      </div>
    </div>
  );
}
