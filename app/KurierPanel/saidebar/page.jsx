"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  FaBox,
  FaClock,
  FaCheckCircle,
  FaUndo,
  FaUser,
  FaTimes,
} from "react-icons/fa";

export default function Sidebar({ mobileMenuOpen, setMobileMenuOpen }) {
  const pathname = usePathname();

  const menu = [
    { name: "Bosh sahifa", href: "/KurierPanel", icon: <FaBox /> },
    { name: "Buyurtmalar", href: "/KurierPanel/buyurtmalar", icon: <FaBox /> },
    {
      name: "Yetkazmalarim",
      href: "/KurierPanel/faolTopshiriqlar",
      icon: <FaClock />,
    },

    {
      name: "Kitobni qaytarish",
      href: "/KurierPanel/kitobniQaytarish",
      icon: <FaUndo />,
    },
    { name: "Profil", href: "/KurierPanel/profile", icon: <FaUser /> },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-white shadow p-4">
        <div className=" border-b border-gray-100">
          {/* Title + Close Button */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">Kurier Paneli</h1>
          </div>

          {/* Profile */}
          <div className="flex items-center gap-3 mt-4">
            <div className="relative w-12 h-12">
              <Image
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                alt="Profil"
                fill
                className="rounded-full object-cover"
              />
            </div>

            <div>
              <p className="font-semibold text-gray-800">Aziz Rahimov</p>
              <p className="text-xs text-gray-500">Kurier</p>
            </div>
          </div>
        </div>
        {menu.map((item, i) => {
          const active = pathname === item.href;
          return (
            <Link
              key={i}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 
                ${
                  active
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              <span className="w-5">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </aside>

      {/* OVERLAY (mobil) */}


      {/* MOBILE SIDEBAR */}

    </>
  );
}
