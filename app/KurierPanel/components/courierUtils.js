export const COURIER_KEY = "/api/courier?includeDelivered=1";

/** Existing hamyon estimate: there is no wallet ledger endpoint. */
export const DELIVERY_FEE = 15000;

export const WEEKDAYS = ["Ya", "Du", "Se", "Ch", "Pa", "Ju", "Sh"];
export const MONTHS = [
  "yanvar", "fevral", "mart", "aprel", "may", "iyun",
  "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
];

export function asList(data) {
  return Array.isArray(data) ? data : [];
}

export function isYangi(order) {
  return !order?.status || order.status === "new";
}

export function isFaol(order) {
  return ["accepted", "picked_up", "on_way"].includes(order?.status);
}

export function isDone(order) {
  return order?.status === "delivered";
}

export function groupOrders(orders) {
  const list = asList(orders);
  return {
    all: list,
    yangi: list.filter(isYangi),
    faol: list.filter(isFaol),
    yakunlangan: list.filter(isDone),
  };
}

export function shortId(id) {
  if (!id) return "-";
  return String(id).slice(-6).toUpperCase();
}

export function maskPhone(phone) {
  if (!phone) return "-";
  const digits = String(phone).replace(/\D/g, "");
  if (digits.length < 7) return String(phone);
  const last2 = digits.slice(-2);
  if (digits.startsWith("998") && digits.length >= 12) {
    return `+998 ${digits.slice(3, 5)} *** ** ${last2}`;
  }
  return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} *** ** ${last2}`;
}

export function formatUzDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${d.getFullYear()} yil ${d.getDate()}-${MONTHS[d.getMonth()]}, ${hh}:${mm}`;
}

export function formatTime(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function statusLabel(status) {
  const map = {
    new: "Yangi",
    accepted: "Qabul qilindi",
    picked_up: "Olingan",
    on_way: "Yo'lda",
    delivered: "Yetkazildi",
  };
  return map[status] || "-";
}

export function typeLabel(type) {
  if (type === "rent") return "Ijara";
  if (type === "buy") return "Xarid";
  return "-";
}

export function paymentLabel(status) {
  if (status === "paid") return { text: "To'langan", tone: "ok" };
  if (status === "pending") return { text: "Kutilmoqda", tone: "wait" };
  if (status === "failed") return { text: "Xatolik", tone: "bad" };
  if (status === "refunded") return { text: "Qaytarilgan", tone: "wait" };
  return { text: "-", tone: "muted" };
}

export function stepperIndex(status) {
  if (status === "delivered") return 3;
  if (status === "on_way" || status === "picked_up") return 2;
  if (status === "accepted") return 1;
  return 0;
}

export function hasCoords(order) {
  return Number.isFinite(order?.lat) && Number.isFinite(order?.lng);
}

export function haversineKm(a, b) {
  if (!a || !b) return null;
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

/** Straight-line distance and a city-speed ETA. Null when a point is missing. */
export function formatRoute(origin, dest) {
  if (!origin || !dest || !Number.isFinite(dest.lat) || !Number.isFinite(dest.lng)) return null;
  const km = haversineKm(origin, { lat: dest.lat, lng: dest.lng });
  if (km == null || Number.isNaN(km)) return null;
  const minutes = Math.max(1, Math.round((km / 22) * 60));
  const kmText = km < 10 ? km.toFixed(1) : String(Math.round(km));
  return { km, minutes, label: `${kmText} km • ${minutes} daqiqa` };
}

export function mapsUrl(provider, order) {
  const coords = hasCoords(order);
  if (provider === "yandex") {
    if (coords) return `https://yandex.uz/maps/?rtext=~${order.lat},${order.lng}&rtt=auto`;
    if (order?.address) return `https://yandex.uz/maps/?text=${encodeURIComponent(order.address)}`;
    return null;
  }
  if (coords) {
    return `https://www.google.com/maps/dir/?api=1&destination=${order.lat},${order.lng}&travelmode=driving`;
  }
  if (order?.address) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.address)}&travelmode=driving`;
  }
  return null;
}

export function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function lastNDays(n) {
  const today = startOfDay(new Date());
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (n - 1 - i));
    return d;
  });
}

export function dayKey(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function deliveredStamp(order) {
  return order?.updatedAt || order?.createdAt || null;
}

export function countByDay(orders, days) {
  const keys = days.map((d) => dayKey(d));
  const counts = Object.fromEntries(keys.map((k) => [k, 0]));
  asList(orders).forEach((order) => {
    const key = dayKey(deliveredStamp(order));
    if (key && counts[key] != null) counts[key] += 1;
  });
  return keys.map((k) => counts[k]);
}

export function primaryAction(status) {
  if (!status || status === "new") return { status: "accepted", label: "Topshiriqni qabul qilish" };
  if (status === "accepted") return { status: "picked_up", label: "Kitobni oldim" };
  if (status === "picked_up") return { status: "on_way", label: "Yo'lga chiqish" };
  if (status === "on_way") return { status: "delivered", label: "Yetkazildi" };
  return null;
}

export const STATUS_OPTIONS = [
  { status: "accepted", label: "Qabul qilindi" },
  { status: "picked_up", label: "Kitob olindi" },
  { status: "on_way", label: "Yo'lda" },
  { status: "delivered", label: "Yetkazildi" },
];
