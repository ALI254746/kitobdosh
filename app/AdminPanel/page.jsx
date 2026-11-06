"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, BookOpen, Truck, Database, TrendingUp, ChartNoAxesCombined, ChartColumnIncreasing, ClipboardList, ArrowRight, Eye, RefreshCw, X } from "lucide-react";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip, Legend);
const months = ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"];
const number = value => Number(value || 0).toLocaleString("uz-UZ");
const statuses = { pending: ["Yangi", "blue"], processing: ["Yetkazilmoqda", "orange"], completed: ["Yetkazib berildi", "green"], cancelled: ["Bekor qilingan", "red"] };

export default function DashboardPage() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(12);
  const [barPeriod, setBarPeriod] = useState(6);
  const [today, setToday] = useState("");
  async function loadStats() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/stats", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Ma’lumotlarni yuklab bo‘lmadi");
      setStats(result.stats);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }
  useEffect(() => {
    loadStats();
    setToday(new Date().toLocaleDateString("uz-UZ", { year:"numeric", month:"long", day:"numeric", weekday:"long", timeZone:"Asia/Tashkent" }));
  }, []);
  useEffect(() => {
    if (!selectedOrder) return;
    const previous = document.activeElement;
    const close = event => { if (event.key === "Escape") setSelectedOrder(null); };
    const dialog = document.getElementById("order-details");
    dialog?.focus();
    const trap = event => {
      if (event.key !== "Tab" || !dialog) return;
      const nodes = dialog.querySelectorAll('button, a[href], [tabindex="0"]');
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", close);
    document.addEventListener("keydown", trap);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; document.removeEventListener("keydown", close); document.removeEventListener("keydown", trap); previous?.focus(); };
  }, [selectedOrder]);
  const dashboard = stats?.dashboard || {};
  const activity = dashboard.orderActivity || [];
  const rentals = dashboard.rentalActivity || [];
  const now = new Date();
  const timeline = Array.from({ length:12 }, (_, index) => {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11 + index, 1));
    const year = date.getUTCFullYear(), month = date.getUTCMonth() + 1;
    const order = activity.find(item => item._id.year === year && item._id.month === month);
    const rent = rentals.find(item => item._id.year === year && item._id.month === month);
    return { label: months[month-1], count: order?.count || 0, sales: order?.sales || 0, rentals: rent?.count || 0 };
  });
  const lineData = timeline.slice(-period);
  const bars = timeline.slice(-barPeriod);
  const chartOptions = {
    responsive:true, maintainAspectRatio:false,
    plugins:{legend:{display:false},tooltip:{backgroundColor:"#1c3555",titleColor:"#e8f1ff",bodyColor:"#c2d4ef",padding:12}},
    scales:{
      x:{ticks:{color:"#8fa5c5",font:{size:10}},grid:{color:"#20314b"},border:{display:false}},
      y:{beginAtZero:true,ticks:{color:"#8fa5c5",precision:0,font:{size:10}},grid:{color:"#20314b"},border:{display:false}}
    }
  };
  const cards = [
    { label:"Jami buyurtmalar", value:dashboard.totalOrders, note:"Barcha buyurtmalar", Icon:ShoppingCart, color:"blue" },
    { label:"Faol ijaralar", value:stats?.activeRentals, note:"Hozirgi faol ijaralar", Icon:BookOpen, color:"green" },
    { label:"Yetkazilmoqda", value:dashboard.inDelivery, note:"Jarayondagi buyurtmalar", Icon:Truck, color:"orange" },
    { label:"Oylik tushum", value:dashboard.monthlyIncome, note:"Shu oydagi to‘langanlar", Icon:Database, color:"purple", money:true },
  ];
  return <div className="dash-dashboard">
    <div className="dash-heading"><div><h1>Boshqaruv paneli</h1><p>Kitobdosh platformasining umumiy holati va asosiy ko‘rsatkichlari</p></div><div className="dash-date">Bugun: {today}</div></div>
    {error && <div role="alert" className="dash-error">{error} <button onClick={loadStats} className="dash-action"><RefreshCw size={13}/> Qayta urinish</button></div>}
    <div className="dash-stats">
      {cards.map(({label,value,note,Icon,color,money}) => loading ? <div key={label} className="dash-loading" aria-label="Yuklanmoqda"/> : <section className="dash-card" key={label}><div className="dash-card-top"><span className={"dash-icon "+color}><Icon size={27} strokeWidth={1.6}/></span><div><p className="dash-label">{label}</p><p className={"dash-value "+(money?"money":"")}>{stats ? number(value) : "—"}{money && <small>so‘m</small>}</p></div></div><p className="dash-card-note"><TrendingUp size={13}/>{note}</p></section>)}
    </div>
    <div className="dash-charts">
      <section className="dash-panel"><div className="dash-panel-header"><h2><ChartNoAxesCombined size={19}/>Buyurtmalar dinamikasi</h2><select aria-label="Buyurtmalar davri" className="dash-select" value={period} onChange={event => setPeriod(Number(event.target.value))}><option value={12}>So‘nggi 12 oy</option><option value={6}>So‘nggi 6 oy</option><option value={3}>So‘nggi 3 oy</option></select></div><div className="dash-chart"><Line options={chartOptions} data={{labels:lineData.map(item=>item.label),datasets:[{label:"Buyurtmalar",data:lineData.map(item=>item.count),borderColor:"#388dff",backgroundColor:context=>{const gradient=context.chart.ctx.createLinearGradient(0,0,0,250);gradient.addColorStop(0,"#3388ff66");gradient.addColorStop(1,"#3388ff05");return gradient;},fill:true,tension:.3,borderWidth:2,pointRadius:3,pointBackgroundColor:"#71b6ff",pointBorderWidth:0}]}}/></div></section>
      <section className="dash-panel"><div className="dash-panel-header"><h2><ChartColumnIncreasing size={19}/>Sotuv va ijara</h2><select aria-label="Sotuv va ijara davri" className="dash-select" value={barPeriod} onChange={event=>setBarPeriod(Number(event.target.value))}><option value={6}>So‘nggi 6 oy</option><option value={12}>So‘nggi 12 oy</option><option value={3}>So‘nggi 3 oy</option></select></div><div className="dash-chart"><Bar options={{...chartOptions,plugins:{...chartOptions.plugins,legend:{display:true,align:"end",labels:{color:"#9eb5d5",usePointStyle:true,pointStyle:"circle",boxWidth:7,boxHeight:7,font:{size:10},padding:15}}}}} data={{labels:bars.map(item=>item.label),datasets:[{label:"Sotuvlar",data:bars.map(item=>item.sales),backgroundColor:"#3187f7",borderRadius:2,maxBarThickness:25},{label:"Ijara so‘rovlari",data:bars.map(item=>item.rentals),backgroundColor:"#43c894",borderRadius:2,maxBarThickness:25}]}}/></div></section>
    </div>
    <section className="dash-panel"><div className="dash-panel-header"><h2><ClipboardList size={18}/>So‘nggi buyurtmalar</h2><Link href="/AdminPanel/sotuvdagiKitoblar">Barchasini ko‘rish <ArrowRight size={13}/></Link></div><div className="dash-table-wrap"><table className="dash-table"><thead><tr><th>ID</th><th>Mijoz</th><th>Turi</th><th>Summa</th><th>Holat</th><th>Sana</th><th>Amal</th></tr></thead><tbody>
      {(dashboard.recentOrders || []).map(order=>{
        const types = new Set((order.items || []).map(item=>item.type));
        const rentalOnly = types.has("rent") && !types.has("buy");
        const [status,color] = statuses[order.status] || [order.status,"gray"];
        return <tr key={order._id}><td className="dash-order-id">#{order._id.slice(-6).toUpperCase()}</td><td>{order.customer?.name || "—"}</td><td><span className={"dash-badge "+(rentalOnly?"green":"blue")}>{types.size>1?"Sotuv / ijara":rentalOnly?"Ijara":"Sotuv"}</span></td><td>{number(order.totalPrice)} so‘m</td><td><span className={"dash-badge "+color}>{status}</span></td><td>{new Date(order.createdAt).toLocaleDateString("uz-UZ",{timeZone:"Asia/Tashkent"})}</td><td><button onClick={()=>setSelectedOrder(order)} aria-label={order.customer?.name+" buyurtmasini ko‘rish"} className="dash-table-action"><Eye size={14}/><span>Ko‘rish</span></button></td></tr>;
      })}
      {!loading && !dashboard.recentOrders?.length && <tr><td colSpan={7} className="dash-empty">{error ? "Ma’lumot yuklanmadi" : "Hozircha buyurtmalar yo‘q"}</td></tr>}
      {loading && <tr><td colSpan={7} className="dash-empty">Buyurtmalar yuklanmoqda…</td></tr>}
    </tbody></table></div></section>
    <div className="dash-secondary"><Link href="/AdminPanel/Kitoblar">Jami kitoblar <strong>{stats?number(stats.totalBooks):"—"}</strong></Link><Link href="/AdminPanel/Foydalanuvchilar">Foydalanuvchilar <strong>{stats?number(stats.totalUsers):"—"}</strong></Link><Link href="/AdminPanel/rentRequest">Kutilayotgan ijaralar <strong>{stats?number(stats.pendingRentRequests):"—"}</strong></Link><Link href="/AdminPanel/rentRequest">Muddati o‘tgan ijaralar <strong>{stats?number(stats.overdueRentals):"—"}</strong></Link></div>
    {selectedOrder && <div className="dash-dialog-backdrop" onClick={()=>setSelectedOrder(null)}><section id="order-details" role="dialog" aria-modal="true" aria-labelledby="order-title" tabIndex={-1} className="dash-dialog" onClick={event=>event.stopPropagation()}><div className="dash-panel-header"><h2 id="order-title">Buyurtma #{selectedOrder._id.slice(-6).toUpperCase()}</h2><button className="dash-table-action" aria-label="Tafsilotlarni yopish" onClick={()=>setSelectedOrder(null)}><X size={18}/></button></div><div className="dash-dialog-body"><dl><dt>Mijoz</dt><dd>{selectedOrder.customer?.name || "—"}</dd><dt>Telefon</dt><dd>{selectedOrder.customer?.phone || "—"}</dd><dt>Manzil</dt><dd>{selectedOrder.customer?.address || "Olib ketish"}</dd><dt>Holat</dt><dd>{(statuses[selectedOrder.status] || [selectedOrder.status])[0]}</dd><dt>Jami summa</dt><dd>{number(selectedOrder.totalPrice)} so‘m</dd></dl><h3>Kitoblar</h3><ul>{selectedOrder.items?.map((item,index)=><li key={index}><span>{item.title || "Kitob"} × {item.quantity}</span><strong>{number(item.price * item.quantity)} so‘m</strong></li>)}</ul><Link className="dash-action" href="/AdminPanel/sotuvdagiKitoblar">Buyurtmalarni boshqarish <ArrowRight size={14}/></Link></div></section></div>}
  </div>;
}
