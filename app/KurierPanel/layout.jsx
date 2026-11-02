"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./sidebar/page";
import TopNavbar from "./TopNavbar/page";
import BottomNav from "./components/BottomNav";
import CourierLive from "./components/CourierLive";
import { MainProvider } from "../mainPage/MainContext";

export default function CourierLayout({ children }) {
  const pathname = usePathname();
  const isMap = pathname === "/KurierPanel/xarita";

  return (
    <MainProvider>
      <div className="dark min-h-screen bg-[#070E1C] text-white">
        <CourierLive />
        <Sidebar />
        <div className="flex min-h-screen flex-col lg:pl-[260px]">
          <TopNavbar />
          <main
            className={
              isMap
                ? "relative min-h-[calc(100dvh-4.25rem)] flex-1"
                : "mx-auto w-full max-w-5xl flex-1 px-4 pb-28 pt-4 sm:px-6 lg:pb-10"
            }
          >
            {children}
          </main>
        </div>
        <div className="lg:hidden">
          <BottomNav />
        </div>
      </div>
    </MainProvider>
  );
}
