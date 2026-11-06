"use client";
import { useState,useEffect,useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import toast from "react-hot-toast";
import { ClipboardList,Truck,CircleCheck,Package,UserRound,Phone,BookOpen,CreditCard,MapPin,Navigation,ChevronDown,Copy,Check,RefreshCw,Search,LockKeyhole,ArrowRight,Map,ChartNoAxesColumnIncreasing } from "lucide-react";
const fetcher=async url=>{const response=await fetch(url);const data=await response.json();if(!response.ok||!data.success)throw new Error(data.message||"Topshiriqlar yuklanmadi");return data};
const states={new:"Yangi",accepted:"Qabul qilindi",picked_up:"Kitob olindi",on_way:"Yo‘lda",delivered:"Yetkazildi"};
const nextStates={new:"accepted",accepted:"picked_up",picked_up:"on_way",on_way:"delivered"};
const actions={new:"Topshiriqni qabul qilish",accepted:"Kitobni oldim",picked_up:"Yo‘lga chiqish",on_way:"Yetkazilganini tasdiqlash"};
const money=value=>Number(value||0).toLocaleString("uz-UZ");
const date=value=>value?new Date(value).toLocaleString("uz-UZ",{timeZone:"Asia/Tashkent",day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}):"—";
const tabFor=status=>status==="delivered"?"done":status==="new"?"new":"active";
export function destination(job){
 const lat=Number(job?.lat),lng=Number(job?.lng);
 if(job?.lat!=null&&job?.lng!=null&&Number.isFinite(lat)&&Number.isFinite(lng)&&Math.abs(lat)<=90&&Math.abs(lng)<=180)return {lat,lng};
 return null;
}
export function navigationUrl(job){
 const point=destination(job);
 const target=point?point.lat+","+point.lng:job?.address;
 return target?"https://www.google.com/maps/dir/?api=1&destination="+encodeURIComponent(target):null;
}
export default function CourierDashboard({initialTab="new",view="tasks"}){
 const {data,error,isLoading,mutate}=useSWR("/api/courier",fetcher,{refreshInterval:30000,revalidateOnFocus:true});
 const [tab,setTab]=useState(initialTab);
 const [query,setQuery]=useState("");
 const [selectedId,setSelectedId]=useState("");
 const [busy,setBusy]=useState(false);
 const [menu,setMenu]=useState(false);
 const [confirmDelivery,setConfirmDelivery]=useState(false);
 const statusMenu=useRef(null);
 const searchParams=useSearchParams();
 const jobs=data?.data||[];
 const totals={new:jobs.filter(item=>item.status==="new").length,active:jobs.filter(item=>["accepted","picked_up","on_way"].includes(item.status)).length,done:jobs.filter(item=>item.status==="delivered").length};
 const filtered=jobs.filter(item=>tabFor(item.status)===tab&&[item.id,item.customer,item.book].some(value=>String(value||"").toLowerCase().includes(query.trim().toLowerCase())));
 const selected=filtered.find(item=>item.id===selectedId)||filtered[0];
 const next=nextStates[selected?.status];
 const route=navigationUrl(selected);
 useEffect(()=>{setTab(initialTab);setSelectedId("");setQuery("")},[initialTab]);
 useEffect(()=>{
  const id=searchParams.get("task");
  const target=jobs.find(job=>job.id===id);
  if(target){setTab(tabFor(target.status));setSelectedId(id)}
 },[searchParams,data]); // eslint-disable-line react-hooks/exhaustive-deps
 useEffect(()=>{
  const close=event=>{if(!statusMenu.current?.contains(event.target))setMenu(false)};
  const escape=event=>{if(event.key==="Escape"){setMenu(false);setConfirmDelivery(false)}};
  document.addEventListener("mousedown",close);document.addEventListener("keydown",escape);
  return()=>{document.removeEventListener("mousedown",close);document.removeEventListener("keydown",escape)};
 },[]);
 async function updateStatus(){
  if(!selected||!next||busy)return;
  setBusy(true);setMenu(false);setConfirmDelivery(false);
  try{
   const response=await fetch("/api/courier",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:selected.id,type:selected.type,status:next})});
   const result=await response.json();
   if(!response.ok||!result.success)throw new Error(result.message||(response.status===409?"Topshiriq holati o‘zgargan. Ma’lumotlar yangilandi.":"Holatni yangilab bo‘lmadi"));
   await mutate();
   setTab(tabFor(next));setSelectedId(selected.id);
   toast.success(next==="delivered"?"Buyurtma yetkazildi":states[next]);
  }catch(err){toast.error(err.message);await mutate()}finally{setBusy(false)}
 }
 function requestUpdate(){if(next==="delivered")setConfirmDelivery(true);else updateStatus()}
 async function copyPhone(){if(!selected?.phone)return;try{await navigator.clipboard.writeText(selected.phone);toast.success("Telefon nusxalandi")}catch{toast.error("Telefonni nusxalab bo‘lmadi")}}
 function switchTab(value){setTab(value);setSelectedId("");setMenu(false);setQuery("")}
 const newest=jobs.filter(item=>item.status==="delivered").slice().sort((a,b)=>new Date(b.updatedAt)-new Date(a.updatedAt));
 if(view==="stats")return <div className="courier-dashboard"><div className="courier-section-heading"><h2>Yetkazish statistikasi</h2><p>Hisobingizga tegishli topshiriqlar</p></div><Summary totals={totals}/>{error&&<ErrorBox error={error} retry={()=>mutate()}/>}<section className="courier-card courier-report"><h3><ChartNoAxesColumnIncreasing size={20}/>Topshiriqlar holati</h3>{[["Yangi",totals.new],["Faol",totals.active],["Yakunlangan",totals.done]].map(([label,count])=><div className="courier-report-row" key={label}><span>{label}</span><div><i style={{width:100*count/Math.max(1,jobs.length)+"%"}}/></div><strong>{count}</strong></div>)}<Link href="/KurierPanel/yakunlanganlar">Yetkazilgan buyurtmalar <ArrowRight size={15}/></Link></section><section className="courier-card courier-report"><h3>So‘nggi yetkazmalar</h3>{newest.slice(0,5).map(job=><Link key={job.id} href={"/KurierPanel/yakunlanganlar?task="+job.id}><span>#{job.id.slice(-6).toUpperCase()} · {job.customer}</span><small>{date(job.updatedAt)}</small></Link>)}{!newest.length&&<p>Hali yetkazilgan topshiriqlar yo‘q.</p>}</section></div>;
 return <div className="courier-dashboard">
  <Summary totals={totals}/>
  {error&&<ErrorBox error={error} retry={()=>mutate()}/>}
  <div className="courier-tabs" role="tablist" aria-label="Topshiriqlar holati">{[["new","Yangi",ClipboardList],["active","Faol",Truck],["done","Yakunlangan",CircleCheck]].map(([key,label,Icon])=><button key={key} role="tab" aria-selected={tab===key} onClick={()=>switchTab(key)} className={tab===key?"active":""}><Icon size={17}/>{label} ({totals[key]})</button>)}</div>
  <div className="courier-filter"><label><Search size={15}/><input value={query} onChange={event=>setQuery(event.target.value)} aria-label="Topshiriq qidirish" placeholder="ID, mijoz yoki kitob bo‘yicha qidirish"/></label><button aria-label="Topshiriqlarni yangilash" onClick={()=>mutate()}><RefreshCw size={17}/></button></div>
  {isLoading?<div className="courier-loading" role="status">Topshiriqlar yuklanmoqda…</div>:!selected?<div className="courier-empty"><Package size={32}/><h2>{query?"Topshiriq topilmadi":"Bu bo‘limda topshiriq yo‘q"}</h2><p>{query?"Boshqa ID, kitob yoki mijozni qidirib ko‘ring.":"Yangi topshiriqlar avtomatik yangilanadi."}</p></div>:<>
   {filtered.length>1&&<label className="courier-task-select">Topshiriqni tanlash<select aria-label="Topshiriqni tanlash" value={selected.id} onChange={event=>{setSelectedId(event.target.value);setMenu(false)}}>{filtered.map(job=><option key={job.id} value={job.id}>#{job.id.slice(-6).toUpperCase()} · {job.customer}</option>)}</select></label>}
   <article className="courier-card courier-job">
    <header className="courier-job-header"><Package size={30}/><div><h2>Buyurtma #{selected.id.slice(-6).toUpperCase()}</h2><p>{date(selected.createdAt)}</p></div><span className={"courier-status "+selected.status}><i/>{states[selected.status]||selected.status}</span></header>
    <div className={"courier-job-content "+(view==="map"?"map-view":"")}>
     <div className="courier-details">
      <Detail icon={UserRound} label="Mijoz">{selected.customer||"—"}</Detail>
      <Detail icon={Phone} label="Telefon">{selected.phone?<span className="courier-phone"><a href={"tel:"+selected.phone.replace(/[^+\d]/g,"")}>{selected.phone}</a><button aria-label="Telefonni nusxalash" onClick={copyPhone}><Copy size={13}/></button></span>:<span className="courier-private"><LockKeyhole size={12}/>Qabul qilgach ochiladi</span>}</Detail>
      <Detail icon={BookOpen} label="Buyurtma turi"><span className="courier-type">{selected.type==="rent"?"Ijara":"Xarid"}</span></Detail>
      <Detail icon={CreditCard} label="To‘lov holati"><span className={"courier-payment "+(selected.paymentStatus==="paid"?"paid":"")}>{selected.paymentStatus==="paid"?"To‘langan":selected.paymentStatus==="failed"?"To‘lov bajarilmadi":selected.paymentStatus==="refunded"?"Qaytarilgan":"To‘lov kutilmoqda"}</span></Detail>
      <Detail icon={MapPin} label="Manzil">{selected.address||<span className="courier-private">Topshiriqni qabul qilgach ochiladi</span>}</Detail>
     </div>
     <TaskMap job={selected}/>
    </div>
    <div className="courier-book-line"><BookOpen size={15}/><span>{selected.book}</span><strong>{money(selected.totalPrice)} so‘m</strong></div>
    {next&&<button className="courier-primary" disabled={busy} onClick={requestUpdate}><Package size={20}/>{busy?"Saqlanmoqda…":actions[selected.status]}</button>}
    <div className="courier-job-actions">{route?<a href={route} target="_blank" rel="noopener noreferrer"><Navigation size={17}/>Yo‘lni ochish</a>:<span aria-disabled="true"><LockKeyhole size={15}/>Manzil hali yopiq</span>}<div className="courier-status-menu" ref={statusMenu}><button onClick={()=>setMenu(!menu)} aria-expanded={menu} disabled={!next||busy}><span><ClipboardList size={16}/>Holatni yangilash</span><ChevronDown size={14}/></button>{menu&&next&&<div className="courier-status-options"><button onClick={requestUpdate}>{actions[selected.status]} <ArrowRight size={14}/></button></div>}</div></div>
   </article>
   <Timeline job={selected}/>
   {view==="map"&&<p className="courier-map-note">Xaritada mijoz manzili ko‘rsatilgan. Yo‘l bo‘yicha navigatsiya “Yo‘lni ochish” orqali ochiladi.</p>}
  </>}
  <div className="courier-extra-links"><Link href="/KurierPanel/kitobniQaytarish">Kitobni qaytarish <ArrowRight size={14}/></Link><Link href="/KurierPanel/hamyon">Hamyon <ArrowRight size={14}/></Link></div>
  {confirmDelivery&&<div className="courier-modal-backdrop"><section role="dialog" aria-modal="true" aria-labelledby="delivery-confirm-title" className="courier-confirm"><h2 id="delivery-confirm-title">Buyurtma yetkazildimi?</h2><p>Kitob mijozga topshirilgan bo‘lsa tasdiqlang. Bu amal buyurtma holatini yangilaydi.</p><div><button autoFocus onClick={()=>setConfirmDelivery(false)}>Ortga</button><button className="courier-primary" onClick={updateStatus}>Ha, yetkazildi</button></div></section></div>}
 </div>
}
function Summary({totals}){return <div className="courier-summary">{[["Yangi topshiriqlar",totals.new,"Jami buyurtmalar",ClipboardList,"blue"],["Yo‘lda",totals.active,"Bajarilmoqda",Truck,"cyan"],["Yetkazildi",totals.done,"Muvaffaqiyatli",CircleCheck,"green"]].map(([label,count,note,Icon,color])=><section key={label} className={"courier-stat "+color}><span><Icon size={23}/></span><div><h2>{label}</h2><strong>{count}</strong><small>{note}</small></div></section>)}</div>}
function Detail({icon:Icon,label,children}){return <div className="courier-detail"><span className="courier-detail-icon"><Icon size={17}/></span><div><small>{label}</small><div>{children}</div></div></div>}
function ErrorBox({error,retry}){return <div role="alert" className="courier-error">{error.message}<button onClick={retry}>Qayta urinish</button></div>}
function TaskMap({job}){
 const point=destination(job),route=navigationUrl(job);
 if(!point)return <div className="courier-task-map courier-map-locked"><Map size={40}/><p>{job.address?"Xaritada ochish uchun yo‘l tugmasini bosing":"Manzil topshiriqni qabul qilgach ochiladi"}</p>{route&&<a href={route} target="_blank" rel="noopener noreferrer">Yo‘lni ochish <Navigation size={15}/></a>}</div>;
 const bbox=[point.lng-.018,point.lat-.012,point.lng+.018,point.lat+.012].join(",");
 return <div className="courier-task-map"><iframe key={job.id} title="Mijoz manzili xaritasi" loading="lazy" referrerPolicy="no-referrer" src={"https://www.openstreetmap.org/export/embed.html?bbox="+encodeURIComponent(bbox)+"&layer=mapnik&marker="+point.lat+"%2C"+point.lng}/><a className="courier-map-open" href={route} target="_blank" rel="noopener noreferrer" aria-label="Manzilga navigatsiyani ochish"><Navigation size={20}/></a><span className="courier-map-caption"><MapPin size={13}/>Mijoz manzili</span></div>
}
function Timeline({job}){
 const flow=["new","accepted","picked_up","on_way","delivered"],index=flow.indexOf(job.status);
 return <section className="courier-timeline" aria-label="Yetkazish bosqichlari">{[["new","Biriktirildi"],["accepted","Qabul qilindi"],["picked_up","Kitob olindi"],["on_way","Yo‘lda"],["delivered","Yetkazildi"]].map(([key,label],i)=>{const done=flow.indexOf(key)<=index;const time=job.timeline?.[key]||(key==="new"?job.createdAt:null);return <div key={key} className={done?"done":""}><span>{done?<Check size={16}/>:null}</span><strong>{label}</strong><small>{time?new Date(time).toLocaleTimeString("uz-UZ",{hour:"2-digit",minute:"2-digit",timeZone:"Asia/Tashkent"}):"—"}</small></div>})}</section>
}
