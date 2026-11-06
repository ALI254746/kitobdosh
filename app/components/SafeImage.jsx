"use client";
import { useState } from "react";
import Image from "next/image";
import covers from "@/lib/book-covers.json";
const normalize = value => String(value || "").toLowerCase().normalize("NFKC").replace(/[’‘ʻʼ\x27\x60]/g, "").trim();
const localCover = (src, title) => covers.find(item => (src !== "/demo-book.svg" && item.source === src) || (src === "/demo-book.svg" && normalize(item.title) === normalize(title)))?.image || src;

export default function SafeImage({src,fallbackSrc="/book-cover.svg",alt="Kitob muqovasi",onError,...rest}) {
  const fallback = typeof fallbackSrc === "string" && !fallbackSrc.includes("placehold.co") ? fallbackSrc : "/book-cover.svg";
  const candidate = localCover(src, alt) || fallback;
  const [failedSource,setFailedSource] = useState(null);
  const displayed = failedSource === candidate ? fallback : candidate;
  return <Image {...rest} src={displayed} alt={alt} onError={event=>{
    if(displayed !== fallback)setFailedSource(candidate);
    onError?.(event);
  }}/>;
}
