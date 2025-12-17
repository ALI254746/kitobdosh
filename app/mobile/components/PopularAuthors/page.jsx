"use client";
import { useEffect, useState } from "react";
import AuthorSkeleton from "/Kitobdosh next.js 14/app/mobile/components/AuthorSkeleton";
import AuthorCard from "../AuthorCard/AuthorCard";
import useAutoScroll from "../hooks/useAutoScoll";

export default function PopularAuthors() {
  const [loading, setLoading] = useState(true);
  const scrollRef = useAutoScroll(0.5);

  const authors = [
    {
      name: "Abdulla Qodiriy",
      books: 12,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    },
    {
      name: "Alisher Navoiy",
      books: 8,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    },
    {
      name: "O‘tkir Hoshimov",
      books: 15,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    },
    {
      name: "Pirimqul Qodirov",
      books: 10,
      image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef",
    },
  ];

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="mb-6 pb-20 ">
      <div className="px-5 mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">Mashhur mualliflar</h2>
        <span className="text-xs text-blue-500 font-semibold">Barchasi</span>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto hide-scrollbar px-5"
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <AuthorSkeleton key={i} />)
          : authors
              .concat(authors)
              .map((author, i) => <AuthorCard key={i} author={author} />)}
      </div>
    </div>
  );
}
