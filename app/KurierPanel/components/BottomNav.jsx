"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, Map, ChartNoAxesColumnIncreasing, Settings } from "lucide-react";
const links=[["Bosh sahifa","/KurierPanel",Home],["Topshiriqlar","/KurierPanel/buyurtmalar",ClipboardList],["Xarita","/KurierPanel/xarita",Map],["Statistika","/KurierPanel/statistika",ChartNoAxesColumnIncreasing],["Sozlamalar","/KurierPanel/sozlamalar",Settings]];
export default function BottomNav(){
 const path=usePathname();
 return <nav className="courier-bottom" aria-label="Pastki menyu">{links.map(([label,href,Icon])=><Link key={href} href={href} className={path===href?"active":""} aria-current={path===href?"page":undefined}><Icon size={21}/><span>{label}</span></Link>)}</nav>;
}
