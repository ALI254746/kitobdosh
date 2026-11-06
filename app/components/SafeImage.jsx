"use client";
import { useState } from "react";
import Image from "next/image";

export default function SafeImage({src,fallbackSrc="/book-cover.svg",alt="Kitob muqovasi",onError,...rest}) {
  const fallback = typeof fallbackSrc === "string" && !fallbackSrc.includes("placehold.co") ? fallbackSrc : "/book-cover.svg";
  const candidate = src || fallback;
  const [failedSource,setFailedSource] = useState(null);
  const displayed = failedSource === candidate ? fallback : candidate;
  return <Image {...rest} src={displayed} alt={alt} onError={event=>{
    if(displayed !== fallback)setFailedSource(candidate);
    onError?.(event);
  }}/>;
}
