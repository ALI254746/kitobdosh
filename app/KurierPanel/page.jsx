"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaBox, FaCheckCircle, FaTruck, FaInfoCircle, FaChevronRight } from "react-icons/fa";

export default function KurierHome() {
  return (
    <div className="space-y-6 max-w-lg mx-auto pb-4">
      {/* HEADER: Welcome & Date */}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-gray-500 text-sm">Bugun, 20 Fevral</p>
          <h1 className="text-2xl font-bold text-gray-900">Salom, Aziz! 👋</h1>
        </div>
        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
           <Image 
             src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" 
             alt="Profile" 
             fill
             className="object-cover"
           />
        </div>
      </div>

      {/* HERO / ACTIVE TASK SUMMARY */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-3xl p-6 relative overflow-hidden shadow-blue-lg shadow-blue-200">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium mb-2">
                Faol topshiriq
              </span>
              <h2 className="text-xl font-bold">Fizika 11-sinf</h2>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
              <FaTruck className="text-xl" />
            </div>
          </div>
          
          <div className="space-y-2 mb-6">
             <p className="text-white/80 text-sm flex items-center gap-2">
               <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
               Yetkazilmoqda...
             </p>
             <p className="text-sm font-medium">
               Toshkent sh., Shayxontohur tumani
             </p>
          </div>

          <Link href="/KurierPanel/faolTopshiriqlar" className="w-full block text-center bg-white text-blue-700 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
            Batafsil ko‘rish
          </Link>
        </div>

        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
      </div>

      {/* STATS GRID */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3 text-lg">Bugungi hisobot</h3>
        <div className="grid grid-cols-2 gap-3">
            <StatCard 
              icon={<FaCheckCircle className="text-green-600" />} 
              label="Yetkazildi" 
              value="12 ta" 
              bg="bg-green-50"
            />
            <StatCard 
              icon={<FaBox className="text-blue-600" />} 
              label="Yangi" 
              value="5 ta" 
              bg="bg-blue-50"
            />
            <StatCard 
              icon={<FaInfoCircle className="text-orange-500" />} 
              label="Kutilmoqda" 
              value="3 ta" 
              bg="bg-orange-50"
            />
            <StatCard 
              icon={<FaTruck className="text-purple-600" />} 
              label="Yo'lda" 
              value="1 ta" 
              bg="bg-purple-50"
            />
        </div>
      </div>

      {/* QUICK ACTIONS / MENU LINKS */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
         <MenuLink href="/KurierPanel/buyurtmalar" icon={<FaBox className="text-blue-500" />} label="Barcha buyurtmalar" />
         <div className="h-px bg-gray-50 mx-4"></div>
         <MenuLink href="/KurierPanel/kitobniQaytarish" icon={<FaCheckCircle className="text-green-500" />} label="Kitobni qaytarish" />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, bg }) {
  return (
    <div className={`p-4 rounded-2xl border border-transparent hover:border-gray-100 transition-all ${bg}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className="text-xl">{icon}</div>
        <span className="text-xs font-semibold text-gray-500">{label}</span>
      </div>
      <p className="text-xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

function MenuLink({ href, icon, label }) {
  return (
    <Link href={href} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
          {icon}
        </div>
        <span className="font-semibold text-gray-700">{label}</span>
      </div>
      <FaChevronRight className="text-gray-300 group-hover:text-gray-500" />
    </Link>
  );
}
