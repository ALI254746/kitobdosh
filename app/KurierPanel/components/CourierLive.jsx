"use client";

import { useEffect } from "react";
import Pusher from "pusher-js";
import { mutate } from "swr";
import toast from "react-hot-toast";
import { COURIER_KEY } from "./courierUtils";

export default function CourierLive() {
  useEffect(() => {
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
    if (!pusherKey) return;

    const pusher = new Pusher(pusherKey, { cluster: pusherCluster });
    const channel = pusher.subscribe("courier-channel");
    channel.bind("new-job", (data) => {
      const audio = new Audio("/sounds/notification.mp3");
      audio.play().catch(() => {});
      toast.success(data?.message || "Yangi buyurtma keldi!", { icon: "📦" });
      mutate(COURIER_KEY);
    });

    return () => {
      pusher.unsubscribe("courier-channel");
      pusher.disconnect();
    };
  }, []);

  return null;
}
