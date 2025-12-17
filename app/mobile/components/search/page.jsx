"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import {
  BookOpen,
  BookMarked,
  Feather,
  ScrollText,
  Brain,
  MoonStar,
  Sparkles,
  Baby,
  FlaskConical,
} from "lucide-react";
export default function SearchWithCategories() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Asosiy");

  const categories = [
    { id: "Asosiy", label: "Asosiy", icon: BookOpen },
    { id: "Roman", label: "Roman", icon: BookMarked },
    { id: "Sher", label: "She'r", icon: Feather },
    { id: "Qissa", label: "Qissa", icon: ScrollText },
    { id: "Rivojlanish", label: "Rivojlanish", icon: Brain },
    { id: "Diniy", label: "Diniy", icon: MoonStar },
    { id: "Fantastika", label: "Fantastika", icon: Sparkles },
    { id: "Ertak", label: "Ertak", icon: Baby },
    { id: "Ilmiy", label: "Ilmiy", icon: FlaskConical },
  ];

  return (
    <div className="w-full pt-1 px-3 pl-3">
      {/* Search Input */}
      
      {/* Category Tabs */}
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 -mx-5 px-5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-extrabold whitespace-nowrap transition-all
          ${
            isActive
              ? "bg-primary text-white shadow-lg shadow-primary/30"
              : "bg-gray-100 text-gray-600 hover:bg-white hover:shadow-md"
          }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? "text-white" : "text-primary"
                }`}
              />
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
