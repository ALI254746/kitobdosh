"use client";
import Link from "next/link";
import { useState,useEffect,useRef } from "react";
import { useSession,signOut } from "next-auth/react";
import { Bell,UserRound,ChevronDown,LogOut,Settings } from "lucide-react";
import useSWR from "swr";
const fetcher=async url=>{const response=await fetch(url);if(!response.ok)throw new Error("Xabarlarni yuklab bo‘lmadi");return response.json()};
export default function TopNavbar(){
 const {data:session}=useSession();
 const [menu,setMenu]=useState(false);
 const [online,setOnline]=useState(false);
 const root=useRef(null);
 const {data}=useSWR("/api/notifications",fetcher,{refreshInterval:60000});
 const unread=(data?.data||[]).filter(item=>!item.isRead).length;
 useEffect(()=>{
  const update=()=>setOnline(navigator.onLine);update();
  const close=event=>{if(!root.current?.contains(event.target))setMenu(false)};
  const escape=event=>{if(event.key==="Escape")setMenu(false)};
  window.addEventListener("online",update);window.addEventListener("offline",update);document.addEventListener("mousedown",close);document.addEventListener("keydown",escape);
  return()=>{window.removeEventListener("online",update);window.removeEventListener("offline",update);document.removeEventListener("mousedown",close);document.removeEventListener("keydown",escape)};
 },[]);
 return <header className="courier-header"><div><h1>Kuryer paneli</h1><p>Bugun ham birga, bilim yaqinroq!</p></div><div className="courier-header-actions"><Link className="courier-notification" href="/KurierPanel/bildirishnomalar" aria-label="Bildirishnomalar"><Bell size={19}/>{unread>0&&<i/>}</Link><div className="courier-account" ref={root}><button onClick={()=>setMenu(!menu)} aria-label="Kuryer akkaunti" aria-expanded={menu}><span className="courier-avatar"><UserRound size={22}/></span><span><strong>{session?.user?.name?.split(" ")[0]||"Kuryer"}</strong><small><i className={online?"online":""}/>{online?"Onlayn":"Oflayn"}</small></span><ChevronDown size={14}/></button>{menu&&<div className="courier-account-menu"><Link href="/KurierPanel/profile" onClick={()=>setMenu(false)}><UserRound size={16}/>Profil</Link><Link href="/KurierPanel/sozlamalar" onClick={()=>setMenu(false)}><Settings size={16}/>Sozlamalar</Link><button onClick={()=>signOut({callbackUrl:"/"})}><LogOut size={16}/>Tizimdan chiqish</button></div>}</div></div></header>
}
