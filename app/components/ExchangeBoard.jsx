'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const initial = { title: '', author: '', condition: '', description: '', contact: '' };
const labels = { pending: 'Kutilmoqda', accepted: 'Qabul qilindi', rejected: 'Rad etildi', completed: 'Almashildi', available: 'Faol', reserved: 'Band', exchanged: 'Almashildi', withdrawn: 'Yashirilgan', cancelled: 'Bekor qilindi' };
const input = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900';
const button = 'rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50';

export default function ExchangeBoard({ mobile = false }) {
  const [data, setData] = useState({ books: [], offers: [] });
  const [form, setForm] = useState(initial), [selected, setSelected] = useState({}), [contacts, setContacts] = useState({}), [review, setReview] = useState({});
  const [loading, setLoading] = useState(true), [busy, setBusy] = useState(false), [error, setError] = useState(''), [notice, setNotice] = useState('');
  async function load() {
    setError('');
    try { const res = await fetch('/api/exchange', { cache: 'no-store' }); const result = await res.json(); if (!res.ok) throw new Error(result.message || 'Yuklashda xatolik'); setData(result.data); }
    catch (e) { setError(e.message || 'Tarmoq xatosi'); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  async function act(method, body, success) {
    setBusy(true); setError(''); setNotice('');
    try { const res = await fetch('/api/exchange', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); const result = await res.json(); if (!res.ok) throw new Error(result.message || 'Amal bajarilmadi'); await load(); setNotice(success); return true; }
    catch (e) { setError(e.message || 'Tarmoq xatosi'); return false; }
    finally { setBusy(false); }
  }
  const mine = data.books.filter(b => b.mine && b.status === 'available');
  const others = data.books.filter(b => !b.mine && b.status === 'available');
  const bookCard = b => <div key={b.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <h3 className="break-words text-lg font-bold text-slate-900">{b.title}</h3>
    <p className="text-sm text-slate-600">{b.author} · {b.condition}</p>
    {b.description && <p className="mt-2 break-words text-sm">{b.description}</p>}
    <p className="mt-2 text-sm font-semibold text-emerald-800">{b.exchangeCount} marta almashilgan · {b.participantsCount} odam qatnashgan</p>
    <div className="mt-3 text-sm"><strong>O‘quvchilar sharhlari:</strong>{b.reviews.length ? <ul className="mt-1 space-y-1">{b.reviews.map((r,i) => <li key={i} className="break-words">{r.rating}/5 — {r.text}</li>)}</ul> : <p>Hali sharh yo‘q.</p>}</div>
    {b.mine ? <div className="mt-4 space-y-2"><p className="text-sm">Holat: {labels[b.status] || b.status}</p>
      {b.status === 'available' && <button type="button" disabled={busy} className={button} onClick={() => act('PATCH', { action: 'withdraw', id: b.id }, 'E’lon yashirildi')}>E’lonni yashirish</button>}
      {['exchanged','withdrawn'].includes(b.status) && <div className="space-y-2"><label className="block text-sm">Yangi aloqa ma’lumotingiz<input className={input} value={contacts[b.id] || ''} maxLength={150} onChange={e => setContacts({ ...contacts, [b.id]: e.target.value })} /></label><button type="button" disabled={busy || !(contacts[b.id] || '').trim()} className={button} onClick={() => act('PATCH', { action: 'relist', id: b.id, contact: contacts[b.id] }, 'E’lon qayta ochildi')}>Qayta e’lon qilish</button></div>}
    </div> : <div className="mt-4 space-y-2"><label className="block text-sm">Taklif qiladigan kitobingiz<select className={input} value={selected[b.id] || ''} onChange={e => setSelected({ ...selected, [b.id]: e.target.value })}><option value="">Kitobni tanlang</option>{mine.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}</select></label><button type="button" className={button} disabled={busy || !selected[b.id]} onClick={() => act('POST', { action: 'offer', targetId: b.id, offeredId: selected[b.id] }, 'Taklif yuborildi')}>Almashish taklifi</button>{!mine.length && <p className="text-sm">Avval o‘z kitobingizni e’lon qiling.</p>}</div>}
  </div>;
  return <main className="mx-auto max-w-6xl space-y-7 px-4 py-8 text-slate-800">
    {mobile && <Link className="text-sm font-semibold text-emerald-800" href="/mobile">← Mobil bosh sahifa</Link>}
    <header><h1 className="text-3xl font-black">Kitob almashish</h1><p className="mt-2 text-slate-600">Kitobingizni e’lon qiling, taklif yuboring va ikki tomon almashuvni tasdiqlang.</p><p className="mt-1 text-sm text-slate-600">Aloqa ma’lumoti faqat taklif qabul qilingandan so‘ng ikki ishtirokchiga ko‘rinadi. Son tasdiqlangan almashuvlarni bildiradi.</p></header>
    {error && <div role="alert" className="rounded-xl bg-red-50 p-3 text-red-800">{error} <button type="button" className="underline" onClick={load}>Qayta urinish</button>{error.includes('kiring') && <> · <Link href="/" className="underline">Kirish</Link></>}</div>}
    {notice && <p role="status" className="rounded-xl bg-green-50 p-3 text-green-800">{notice}</p>}
    {loading ? <p>Yuklanmoqda…</p> : <>
      <section className="rounded-2xl bg-slate-50 p-5"><h2 className="mb-3 text-xl font-bold">Kitobni e’lon qilish</h2><form className="grid gap-3 sm:grid-cols-2" onSubmit={async e => { e.preventDefault(); if (await act('POST', { action: 'create', ...form }, 'Kitob e’lon qilindi')) setForm(initial); }}>
        {[['title','Kitob nomi',120],['author','Muallif',120],['condition','Kitob holati',80],['contact','Aloqa: telefon yoki email',150]].map(([key,label,max]) => <label key={key} className="text-sm font-medium">{label}<input required maxLength={max} className={input} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} /></label>)}
        <label className="text-sm font-medium sm:col-span-2">Tavsif (ixtiyoriy)<textarea maxLength={500} className={input} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label><button disabled={busy} className={`${button} sm:col-span-2`}>E’lon qilish</button></form></section>
      <section><h2 className="mb-3 text-xl font-bold">Mening kitoblarim</h2>{data.books.some(b => b.mine) ? <div className="grid gap-4 md:grid-cols-2">{data.books.filter(b => b.mine).map(bookCard)}</div> : <p>Hali kitob qo‘shmagansiz.</p>}</section>
      <section><h2 className="mb-3 text-xl font-bold">Almashish uchun kitoblar</h2>{others.length ? <div className="grid gap-4 md:grid-cols-2">{others.map(bookCard)}</div> : <p>Hozircha boshqa e’lonlar yo‘q.</p>}</section>
      <section><h2 className="mb-3 text-xl font-bold">Almashish takliflari</h2>{data.offers.length ? <div className="space-y-4">{data.offers.map(o => <div key={o.id} className="rounded-2xl border border-slate-200 bg-white p-4"><p className="font-semibold break-words">{o.target?.title || 'Kitob'} ↔ {o.offered?.title || 'Kitob'}</p><p className="text-sm">{o.incoming ? 'Kiruvchi' : 'Yuborilgan'} · {labels[o.status] || o.status}</p>
        {o.incoming && o.status === 'pending' && <div className="mt-3 flex gap-2"><button type="button" className={button} disabled={busy} onClick={() => act('PATCH', { action:'accept', id:o.id }, 'Taklif qabul qilindi')}>Qabul qilish</button><button type="button" className="rounded-xl border px-4 py-2" disabled={busy} onClick={() => act('PATCH', { action:'reject', id:o.id }, 'Taklif rad etildi')}>Rad etish</button></div>}
        {['accepted','completed'].includes(o.status) && <p className="mt-2 break-words text-sm">Ikkinchi tomon aloqasi: {o.contact || 'Mavjud emas'}</p>}
        {o.status === 'accepted' && <div className="mt-3"><p className="text-sm">Siz: {o.confirmed ? 'tasdiqladingiz' : 'tasdiqlamadingiz'} · Ikkinchi tomon: {o.otherConfirmed ? 'tasdiqladi' : 'kutilmoqda'}</p><button type="button" className={`${button} mt-2`} disabled={busy || o.confirmed} onClick={() => act('PATCH', { action:'confirm', id:o.id }, 'Tasdiq saqlandi')}>Almashuv tugaganini tasdiqlash</button> <button type="button" className="mt-2 rounded-xl border px-4 py-2" disabled={busy} onClick={() => act('PATCH', { action:'cancel', id:o.id }, 'Almashuv bekor qilindi')}>Almashuvni bekor qilish</button></div>}
        {o.status === 'completed' && !o.reviewed && <form className="mt-3 space-y-2" onSubmit={async e => { e.preventDefault(); const r=review[o.id] || {}; if (await act('POST', { action:'review', offerId:o.id, text:r.text, rating:Number(r.rating || 5) }, 'Sharh saqlandi')) setReview({ ...review, [o.id]: { text:'', rating:5 } }); }}><p className="text-sm font-semibold">Olgan kitobingiz haqida sharh</p><label className="block text-sm">Baho<select className={input} value={review[o.id]?.rating || 5} onChange={e => setReview({ ...review, [o.id]: { ...review[o.id], rating:e.target.value } })}>{[5,4,3,2,1].map(n => <option key={n} value={n}>{n}/5</option>)}</select></label><label className="block text-sm">Sharh<textarea required minLength={3} maxLength={500} className={input} value={review[o.id]?.text || ''} onChange={e => setReview({ ...review, [o.id]: { ...review[o.id], text:e.target.value } })} /></label><button className={button} disabled={busy}>Sharh yuborish</button></form>}
      </div>)}</div> : <p>Takliflar hali yo‘q.</p>}</section>
    </>}
  </main>;
}
