"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, ClipboardList, Truck, CircleCheck, Undo2, Wallet, Bell, UserRound, Settings, Map, ChartNoAxesColumnIncreasing } from "lucide-react";
const links=[
 ["Bosh sahifa","/KurierPanel",Home],["Topshiriqlar","/KurierPanel/buyurtmalar",ClipboardList],["Faol topshiriqlar","/KurierPanel/faolTopshiriqlar",Truck],["Yakunlanganlar","/KurierPanel/yakunlanganlar",CircleCheck],["Xarita","/KurierPanel/xarita",Map],["Statistika","/KurierPanel/statistika",ChartNoAxesColumnIncreasing],["Kitobni qaytarish","/KurierPanel/kitobniQaytarish",Undo2],["Hamyon","/KurierPanel/hamyon",Wallet],["Bildirishnomalar","/KurierPanel/bildirishnomalar",Bell],["Profil","/KurierPanel/profile",UserRound],["Sozlamalar","/KurierPanel/sozlamalar",Settings]
];
export default function Sidebar(){
 const pathname=usePathname();
 return <aside className="courier-sidebar"><Link href="/KurierPanel" className="courier-brand"><BookOpen size={31}/><span>Kitobdosh<small>Kuryer xizmati</small></span></Link><nav aria-label="Kuryer menyusi">{links.map(([label,href,Icon])=><Link href={href} key={href} aria-current={pathname===href?"page":undefined} className={pathname===href?"active":""}><Icon size={18}/>{label}</Link>)}</nav><div className="courier-side-note"><BookOpen size={22}/><p>Bugun ham birga,<br/>bilimni yetkazamiz.</p></div></aside>
}
