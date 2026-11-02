"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { formatRoute, hasCoords, shortId, statusLabel } from "../components/courierUtils";
import { useCourierLocation, useCourierOrders } from "../components/useCourierOrders";

const RouteMap = dynamic(() => import("../components/RouteMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-[#0b1220]" />,
});

export default function MapPage() {
  const { groups, isLoading, error } = useCourierOrders();
  const { pos } = useCourierLocation();
  const deliveries = useMemo(
    () => [...groups.faol, ...groups.yangi],
    [groups.faol, groups.yangi]
  );
  const [selectedId, setSelectedId] = useState(null);
  const selected = deliveries.find((order) => order.id === selectedId) || deliveries.find(hasCoords) || null;
  const route = formatRoute(pos, selected);

  const markers = deliveries.filter(hasCoords).map((order) => ({
    id: order.id,
    lat: order.lat,
    lng: order.lng,
    active: order.id === selected?.id,
  }));

  return (
    <div className="absolute inset-0 bottom-16 lg:bottom-0">
      <RouteMap
        origin={pos}
        markers={markers}
        selectedId={selected?.id}
        destination={selected && hasCoords(selected) ? { lat: selected.lat, lng: selected.lng } : null}
        onSelect={setSelectedId}
        className="h-full w-full"
      />

      <div className="pointer-events-none absolute inset-x-0 top-3 z-[500] flex justify-center px-3">
        <div className="pointer-events-auto rounded-full border border-white/10 bg-[#070E1C]/90 px-4 py-2 text-xs text-white">
          {isLoading && "Xarita yuklanmoqda..."}
          {!isLoading && error && "Buyurtmalar yuklanmadi"}
          {!isLoading && !error && markers.length === 0 && "Koordinatali faol yetkazish yo'q"}
          {!isLoading && !error && markers.length > 0 && `${markers.length} ta nuqta`}
          {route ? ` • ${route.label}` : ""}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-3 z-[500] mx-auto w-full max-w-lg px-3 lg:bottom-4 lg:left-auto lg:right-6 lg:top-4 lg:w-80 lg:max-w-[20rem] lg:px-0">
        <div className="max-h-48 space-y-2 overflow-y-auto rounded-2xl border border-white/10 bg-[#10192C]/95 p-2 shadow-2xl lg:max-h-[calc(100%-2rem)]">
          {deliveries.length === 0 && (
            <p className="px-2 py-4 text-center text-sm text-[#8EA0B8]">Faol yetkazishlar yo&apos;q</p>
          )}
          {deliveries.map((order) => (
            <button
              key={order.id}
              type="button"
              onClick={() => setSelectedId(order.id)}
              className={`w-full rounded-xl px-3 py-2 text-left ${
                selected?.id === order.id ? "bg-[#2F6BFF]" : "hover:bg-white/5"
              }`}
            >
              <p className="text-sm font-medium">Buyurtma #{shortId(order.id)}</p>
              <p className="truncate text-xs text-[#D6E2F0]/80">
                {statusLabel(order.status)} • {order.address || "-"}
              </p>
              {!hasCoords(order) && <p className="text-[11px] text-amber-200">Koordinata yo&apos;q</p>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
