"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaSearch } from "react-icons/fa";

// Skeleton Component
const TableSkeleton = ({ darkMode }) => (
  <div className="w-full animate-pulse">
    {[1, 2, 3, 4, 5].map((i) => (
      <div 
        key={i} 
        className={`flex items-center space-x-4 p-4 border-b last:border-0
          ${darkMode ? "border-[#A3ED96]/10" : "border-[#163201]/10"}
        `}
      >
        <div className={`w-12 h-16 rounded ${darkMode ? "bg-[#A3ED96]/5" : "bg-[#163201]/5"}`} />
        <div className="flex-1 space-y-2">
            <div className={`h-4 w-1/3 rounded ${darkMode ? "bg-[#A3ED96]/5" : "bg-[#163201]/5"}`} />
            <div className={`h-3 w-1/4 rounded ${darkMode ? "bg-[#A3ED96]/5" : "bg-[#163201]/5"}`} />
        </div>
        <div className={`w-24 h-8 rounded-full ${darkMode ? "bg-[#A3ED96]/5" : "bg-[#163201]/5"}`} />
        <div className={`w-20 h-8 rounded-lg ${darkMode ? "bg-[#A3ED96]/5" : "bg-[#163201]/5"}`} />
      </div>
    ))}
  </div>
);

export default function ReturnBooksPage({ darkMode }) {
  const [returnFilter, setReturnFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const returnBooks = [
    {
      id: 1,
      name: "Ikki eshik orasi",
      user: "Dilnoza Karimova",
      courier: "Abbos Jo‘rayev",
      status: "qaytarilgan",
      damage: "zararsiz",
      payment: "0 so‘m",
      images: [
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=140&fit=crop",
      ],
    },
    {
      id: 2,
      name: "Sariq devni minib",
      user: "Aziza To‘laganova",
      courier: "Bekzod Xoliqov",
      status: "tekshirilmoqda",
      damage: "yengil",
      payment: "15 000 so‘m",
      images: [
        "https://images.unsplash.com/photo-1589998059171-988d887df646?w=100&h=140&fit=crop",
      ],
    },
    {
      id: 3,
      name: "Kecha va kunduz",
      user: "Olim Saidov",
      courier: "Murod Rahimov",
      status: "topshirildi",
      damage: "ortacha",
      payment: "50 000 so‘m",
      images: [
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=100&h=140&fit=crop",
      ],
    },
  ];

  const filteredBooks = returnBooks.filter(
    (book) =>
      (returnFilter === "all" || book.status === returnFilter) &&
      (book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.user.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusClass = (status) => {
    // Only styling with #163201 (Deep Green) and #A3ED96 (Neon Mint)
    switch (status) {
      case "qaytarilgan": // Mint Background
        return darkMode ? "bg-[#A3ED96]/20 text-[#A3ED96]" : "bg-[#163201]/10 text-[#163201]";
      case "tekshirilmoqda": // Outlined 
        return darkMode ? "border border-[#A3ED96]/50 text-[#A3ED96]" : "border border-[#163201]/50 text-[#163201]";
      case "topshirildi": // Solid Green/Mint
        return darkMode ? "bg-[#A3ED96] text-[#163201]" : "bg-[#163201] text-white";
      default:
        return "";
    }
  };

  const getDamageClass = (damage) => {
    switch (damage) {
      case "zararsiz": // Light Mint
        return darkMode ? "bg-[#A3ED96]/10 text-[#A3ED96]" : "bg-[#163201]/5 text-[#163201]";
      case "yengil": // Outlined
        return darkMode ? "border border-[#A3ED96]/30 text-[#A3ED96]/80" : "border border-[#163201]/30 text-[#163201]/80";
      case "ortacha": // Medium Opacity
        return darkMode ? "bg-[#A3ED96]/30 text-[#A3ED96]" : "bg-[#163201]/20 text-[#163201]";
      case "yaroqsiz": // Solid (Alert feel but strict color)
        return darkMode ? "bg-[#163201] border border-[#A3ED96] text-[#A3ED96]" : "bg-[#163201] text-white";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* FILTERLAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "Barchasi" },
            { id: "qaytarilgan", label: "Qaytarilgan" },
            { id: "tekshirilmoqda", label: "Tekshirilmoqda" },
            { id: "topshirildi", label: "Topshirildi" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setReturnFilter(f.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                returnFilter === f.id
                  ? (darkMode ? "bg-[#A3ED96] text-[#163201] border-[#A3ED96]" : "bg-[#163201] text-white border-[#163201]")
                  : (darkMode ? "bg-transparent text-[#A3ED96] border-[#A3ED96]/30 hover:bg-[#A3ED96]/10" : "bg-transparent text-[#163201] border-[#163201]/30 hover:bg-[#163201]/10")
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Qidirish..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl font-medium outline-none border transition-all
                ${darkMode 
                    ? "bg-white/5 border-[#A3ED96]/20 text-white focus:border-[#A3ED96] placeholder-[#A3ED96]/30" 
                    : "bg-white border-[#163201]/20 text-[#163201] focus:border-[#163201] placeholder-[#163201]/50"
                }
            `}
          />
          <FaSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-[#A3ED96]/50" : "text-[#163201]/50"}`} />
        </div>
      </div>

      {/* JADVAL */}
      <div className={`rounded-2xl border overflow-hidden min-h-[400px]
          ${darkMode ? "border-[#A3ED96]/20 bg-[#163201]/20" : "border-[#163201]/10 bg-white"}
      `}>
         {loading ? (
             <TableSkeleton darkMode={darkMode} />
         ) : (
            <div className="overflow-x-auto">
                <table className="w-full">
                <thead className={`${darkMode ? "bg-[#A3ED96]/5" : "bg-[#163201]/5"}`}>
                    <tr>
                        {["Kitob", "Nomi", "Foydalanuvchi", "Kuryer", "Holat", "Zarar", "To'lov", "Amal"].map((head) => (
                            <th key={head} className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider
                                ${darkMode ? "text-[#A3ED96]/70" : "text-[#163201]/70"}
                            `}>
                                {head}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className={`divide-y ${darkMode ? "divide-[#A3ED96]/10" : "divide-[#163201]/10"}`}>
                    {filteredBooks.map((book) => (
                    <tr
                        key={book.id}
                        className={`group transition-colors
                            ${darkMode ? "hover:bg-[#A3ED96]/5" : "hover:bg-[#163201]/5"}
                        `}
                    >
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                                {book.images.map((img, index) => (
                                <div key={index} className={`relative w-10 h-14 shadow-sm rounded overflow-hidden hover:scale-110 transition-transform border
                                    ${darkMode ? "border-[#A3ED96]/20" : "border-[#163201]/20"}
                                `}>
                                    <Image
                                        src={img}
                                        alt="Book"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                ))}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <p className={`text-sm font-bold ${darkMode ? "text-white" : "text-[#163201]"}`}>{book.name}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <p className={`text-sm cursor-pointer hover:underline font-medium ${darkMode ? "text-[#A3ED96]" : "text-[#163201]"}`}>
                                {book.user}
                            </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{book.courier}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${getStatusClass(book.status)}`}>
                                {book.status === "qaytarilgan" ? "Qaytarilgan" : 
                                book.status === "tekshirilmoqda" ? "Tekshirilmoqda" : "Bazaga topshirildi"}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${getDamageClass(book.damage)}`}>
                                {book.damage}
                            </span>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold
                            ${book.payment === "0 so‘m" 
                                ? (darkMode ? "text-[#A3ED96]" : "text-[#163201]")
                                : (darkMode ? "text-white" : "text-gray-900") // Keeping payment visible but distinct
                            }
                        `}>
                            {book.payment}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <button className={`w-full px-4 py-2 text-sm font-bold rounded-lg transition-all border
                                ${darkMode 
                                    ? "bg-[#A3ED96] text-[#163201] border-[#A3ED96] hover:bg-transparent hover:text-[#A3ED96]" 
                                    : "bg-[#163201] text-white border-[#163201] hover:bg-white hover:text-[#163201]"
                                }
                            `}>
                                Qabul
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
