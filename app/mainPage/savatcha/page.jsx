"use client";
import React, { useEffect, useState } from "react";
// react-icons dan
import { motion } from "framer-motion";
import {
  FaBagShopping,
  FaLocationDot,
  FaTruck,
  FaBolt,
  FaShieldHalved,
} from "react-icons/fa6";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";

export default function CartHeader() {
  const [isVisible, setIsVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => setQuantity((q) => q + 1);
  const handleDecrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const price = 45.0;
  const total = (price * quantity).toFixed(2);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center py-25">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center justify-center mb-4"
        >
          <FaBagShopping className="text-5xl text-blue-600 drop-shadow-[0_0_10px_rgba(37,99,235,0.6)] mr-3" />
          <h1 className="text-4xl font-bold text-gray-900 drop-shadow-[0_2px_5px_rgba(37,99,235,0.5)]">
            Sizning savatingiz
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-lg text-gray-700 max-w-2xl mx-auto"
        >
          Buyurtma berishdan oldin tanlagan kitoblaringizni ko‘rib chiqing.
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6">
        {/* CHAP USTUN - SAVATDAGI MAHSULOTLAR */}
        <div id="cart-items" className="lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Ijaraga olingan mahsulotlar
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <FaInfoCircle className="text-blue-500 mr-3" />
                <p className="text-blue-700 text-sm">
                  Eslatma: Sotib olingan mahsulotlar savatda saqlanmaydi —
                  darhol xaridni yakunlash uchun “Hozir sotib olish” tugmasini
                  bosing.
                </p>
              </div>
            </div>
          </div>

          {/* IJARA KARTASI */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 hover:shadow-lg transition-shadow">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <img
                  className="w-24 h-32 rounded-lg object-cover"
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/adb4f7409e-76c10fce523b814d55d0.png"
                  alt="matematika darsligi"
                />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      Yuqori darajadagi matematika
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Muallif: Dr. Sarah Wilson
                    </p>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                        Akademik kitob do‘koni
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-500 hover:text-cyan-400 transition-colors">
                      <FaLocationDot className="text-lg" />
                    </button>
                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                      <FaTrash className="text-lg" />
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Boshlanish sanasi
                    </label>
                    <input
                      type="date"
                      defaultValue="2024-01-15"
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tugash sanasi
                    </label>
                    <input
                      type="date"
                      defaultValue="2024-01-25"
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <span className="text-cyan-500 font-semibold">
                      ₸ 3,000 / kun
                    </span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      Mavjud
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">10 kun</p>
                    <p className="text-lg font-bold text-gray-800">₸ 30,000</p>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  Ijara to‘lovi har kuni hisoblanadi. Qaytarish sanasi:
                  25/01/2024
                </p>
              </div>
            </div>
          </div>

          {/* YANA SHU MAHSULOT */}
          <div
            id="cart-item-1"
            className="bg-white rounded-2xl p-6 mb-4 border border-gray-100 hover:shadow-md transition-transform hover:-translate-y-1"
          >
            <div className="flex items-center space-x-4">
              <img
                className="w-20 h-28 rounded-lg object-cover"
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/0a3c673cab-677aa09155081621fd6a.png"
                alt="zamonaviy kitob muqovasi"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-lg">
                  Yuqori darajadagi matematika
                </h3>
                <p className="text-gray-600 mb-2">Muallif: Dr. Sarah Johnson</p>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                  Akademik kitoblar do‘koni
                </span>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleDecrease}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                    >
                      <FaMinus className="text-sm" />
                    </button>

                    <span className="font-medium">{quantity}</span>

                    <button
                      onClick={handleIncrease}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                    >
                      <FaPlus className="text-sm" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500">$45.00 dona</p>
                    <p className="font-semibold text-lg text-gray-800">
                      ${total}
                    </p>
                  </div>
                </div>
              </div>

              <button className="text-red-500 hover:text-red-700 p-2">
                <FaTrash />
              </button>
            </div>
          </div>

          {/* TAVSIYA QILINADI */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Sizga yoqishi mumkin
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Organik kimyo",
                  price: "₸ 2,800 / kun",
                  img: "https://storage.googleapis.com/uxpilot-auth.appspot.com/74f926aba4-73f686cbb57a263e0f29.png",
                },
                {
                  title: "Hujayra biologiyasi",
                  price: "₸ 3,200 / kun",
                  img: "https://storage.googleapis.com/uxpilot-auth.appspot.com/a01b7cb7d3-7b904b2368a76341cdce.png",
                },
                {
                  title: "Statistika",
                  price: "₸ 2,600 / kun",
                  img: "https://storage.googleapis.com/uxpilot-auth.appspot.com/40846ccb30-19066ac07af289eb02f0.png",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                >
                  <img
                    className="w-full h-32 rounded-lg object-cover mb-3"
                    src={item.img}
                    alt={item.title}
                  />
                  <h4 className="font-medium text-gray-800 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">{item.price}</p>
                  <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Ijaraga olish
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* O‘NG USTUN - BUYURTMA XULOSASI */}
        <div className="lg:col-span-1">
          <div className="glassmorphism rounded-xl p-6 shadow-lg sticky top-32">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Buyurtma xulosasi
            </h3>

            {/* YETKAZIB BERISH VARIANTLARI */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">
                Yetkazib berish usullari
              </h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="radio" name="delivery" defaultChecked />
                  <div className="flex items-center space-x-2">
                    <FaLocationDot className="text-blue-700" />
                    <div>
                      <p className="text-sm text-black font-medium">
                        Kitob do‘konidan olib ketish
                      </p>
                      <p className="text-xs text-gray-500">Bepul</p>
                    </div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="radio" name="delivery" />
                  <div className="flex items-center space-x-2">
                    <FaTruck className="text-blue-700" />
                    <div>
                      <p className="text-sm text-black font-medium">
                        Oddiy yetkazib berish (1–3 kun)
                      </p>
                      <p className="text-xs text-gray-500">₸ 2,000</p>
                    </div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="radio" name="delivery" />
                  <div className="flex items-center space-x-2">
                    <FaBolt className="text-yellow-500" />
                    <div>
                      <p className="text-sm text-black font-medium">
                        Tezkor yetkazib berish (shu kunning o‘zida)
                      </p>
                      <p className="text-xs text-gray-500">₸ 5,000</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* JAMI */}
            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Mahsulotlar jami</span>
                <span className="font-medium text-black">₸ 70,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Kuryer to‘lovi</span>
                <span className="font-medium text-black">₸ 0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Chegirma</span>
                <span className="font-medium text-green-600">-₸ 0</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">
                    Umumiy summa
                  </span>
                  <span className="text-xl font-bold text-blue-600">
                    ₸ 70,000
                  </span>
                </div>
              </div>
            </div>

            {/* KUPON */}
            <div className="mt-6 flex space-x-2">
              <input
                type="text"
                placeholder="Kupon kodini kiriting"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                Qo‘llash
              </button>
            </div>

            {/* HARAKATLAR */}
            <div className="mt-8 space-y-3">
              <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors">
                To‘lovga o‘tish
              </button>
              <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Xaridni davom ettirish
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center gap-1">
              <FaShieldHalved /> Xavfsiz to‘lovlar — karta, Payme, Click orqali
              amalga oshiriladi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
