"use client";
import { useEffect, useState } from "react";
import AuthorSkeleton from "../AuthorSkeleton";
import AuthorCard from "../AuthorCard/AuthorCard";
import useAutoScroll from "../hooks/useAutoScoll";

export default function PopularAuthors({ data }) {
  const [authors, setAuthors] = useState(data || []);
  const [loading, setLoading] = useState(!data);
  const scrollRef = useAutoScroll(0.5);

  useEffect(() => {
    if (data) return;
    async function fetchAuthors() {
        try {
            const res = await fetch("/api/authors/popular");
            const data = await res.json();
            if (data.success && data.data.length > 0) {
                setAuthors(data.data);
            }
        } catch (e) {
            console.error("Authors fetch error:", e);
        } finally {
            setLoading(false);
        }
    }
    fetchAuthors();
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
          : Array.isArray(authors) && authors
              .concat(authors)
              .map((author, i) => <AuthorCard key={i} author={author} />)}
      </div>
    </div>
  );
}
