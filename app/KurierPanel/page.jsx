"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaBox, FaCheckCircle, FaTruck, FaInfoCircle } from "react-icons/fa";

export default function KurierHome() {
  return (
    <div className="p-4 mt-10 space-y-6 max-w-md mx-auto">
      {/* HERO SECTION (Mobile Optimized) */}
      <div className="bg-blue-600 text-white rounded-3xl p-5 relative overflow-hidden shadow-lg">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold">Assalomu alaykum, Kurier! 🚚</h1>
            <p className="text-white/80 text-sm mt-1">
              Bu yerda bugungi vazifalaringizni ko‘rib, boshqarishingiz mumkin.
            </p>
          </div>
        </div>

        {/* Rasm */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut",
          }}
          className="absolute right-1 bottom-0 opacity-90"
        >
          <Image
            src="https://cdn-icons-png.flaticon.com/512/1645/1645087.png"
            width={120}
            height={120}
            alt="Courier"
            className="drop-shadow-lg"
          />
        </motion.div>
      </div>

      {/* STATS SECTION */}
      <div className="grid grid-cols-2 gap-4">
        {/* Card 1 */}
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="bg-white p-4 rounded-2xl shadow flex items-center gap-3"
        >
          <FaTruck className="text-blue-600 text-3xl" />
          <div>
            <p className="text-gray-500 text-xs">Bugun yetkazilgan</p>
            <p className="text-xl text-black font-extrabold">12 ta</p>
          </div>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="bg-white p-4 rounded-2xl shadow flex items-center gap-3"
        >
          <FaBox className="text-green-600 text-3xl" />
          <div>
            <p className="text-gray-500 text-xs">Yangi buyurtmalar</p>
            <p className="text-xl text-black font-extrabold">5 ta</p>
          </div>
        </motion.div>

        {/* Card 3 */}
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="bg-white p-4 rounded-2xl shadow flex items-center gap-3"
        >
          <FaCheckCircle className="text-purple-600 text-3xl" />
          <div>
            <p className="text-gray-500 text-xs">Bajargan topshiriqlar</p>
            <p className="text-xl text-black font-extrabold">147 ta</p>
          </div>
        </motion.div>

        {/* Card 4 */}
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="bg-white p-4 rounded-2xl shadow flex items-center gap-3"
        >
          <FaInfoCircle className="text-orange-500 text-3xl" />
          <div>
            <p className="text-gray-500 text-xs">Kutilayotgan topshiriqlar</p>
            <p className="text-xl text-black font-extrabold">3 ta</p>
          </div>
        </motion.div>
      </div>

      {/* HOW IT WORKS SECTION */}
      <div className="bg-white rounded-2xl shadow p-5 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Kurier vazifalari
        </h2>

        <div className="space-y-3 text-sm text-gray-600">
          <p>📦 Buyurtmalarni o‘z vaqtida olib ketish.</p>
          <p>🚚 Kitoblarni belgilangan manzillarga yetkazish.</p>
          <p>📲 Yetkazilgan kitobni tizimda tasdiqlash.</p>
          <p>🔄 Qaytarilgan kitoblarni omborga topshirish.</p>
        </div>
      </div>

      {/* INFO BANNER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 rounded-2xl p-4 border border-blue-200 shadow"
      >
        <h3 className="text-blue-700 font-semibold">Qanday ishlaydi?</h3>
        <p className="text-sm text-blue-600 mt-1">
          Sizga berilgan har bir kitob uchun “Olib ketdim”, “Yetkazdim”
          tugmalaridan foydalaning. Barcha jarayon real vaqt rejimida
          yangilanadi.
        </p>
      </motion.div>
    </div>
  );
}
