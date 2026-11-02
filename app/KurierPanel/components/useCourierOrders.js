"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { COURIER_KEY, groupOrders } from "./courierUtils";

const fetcher = async (url) => {
  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.success === false) {
    const error = new Error(data?.message || "Ma'lumotlarni yuklab bo'lmadi");
    error.info = data;
    throw error;
  }
  return data;
};

export function useCourierOrders() {
  const { data: session } = useSession();
  const { data, error, isLoading, mutate } = useSWR(COURIER_KEY, fetcher);
  const orders = Array.isArray(data?.data) ? data.data : [];
  const groups = useMemo(() => groupOrders(orders), [orders]);

  const updateStatus = async (order, status) => {
    const res = await fetch("/api/courier", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: order.id,
        type: order.type,
        status,
        courierId: session?.user?.id,
      }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || !body.success) {
      throw new Error(body.message || "Holat yangilanmadi");
    }
    await mutate();
    return body;
  };

  return {
    orders,
    groups,
    isLoading,
    error,
    mutate,
    updateStatus,
  };
}

export function useCourierLocation() {
  const [pos, setPos] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setReady(true);
      return;
    }
    const watch = navigator.geolocation.watchPosition(
      (p) => {
        setPos({ lat: p.coords.latitude, lng: p.coords.longitude });
        setReady(true);
      },
      () => setReady(true),
      { enableHighAccuracy: true, maximumAge: 20000, timeout: 8000 }
    );
    return () => navigator.geolocation.clearWatch(watch);
  }, []);

  return { pos, ready };
}
