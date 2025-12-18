"use client";
import React from "react";
import { 
  FaPhone, 
  FaEnvelope, 
  FaBox, 
  FaCheckCircle, 
  FaStar, 
  FaClock, 
  FaCog, 
  FaQuestionCircle, 
  FaSignOutAlt, 
  FaChevronRight,
  FaUserEdit,
  FaWallet
} from "react-icons/fa";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const stats = [
    { label: "Bugun", value: "12", icon: <FaBox />, color: "bg-blue-100 text-blue-600" },
    { label: "Jami", value: "487", icon: <FaCheckCircle />, color: "bg-green-100 text-green-600" },
    { label: "Reyting", value: "4.9", icon: <FaStar />, color: "bg-yellow-100 text-yellow-600" },
    { label: "Vaqtida", value: "95%", icon: <FaClock />, color: "bg-purple-100 text-purple-600" },
  ];

  const menuItems = [
    { icon: <FaUserEdit className="text-blue-500" />, label: "Profilni Tahrirlash" },
    { icon: <FaWallet className="text-green-500" />, label: "Hamyon va To'lovlar" },
    { icon: <FaCog className="text-gray-500" />, label: "Sozlamalar" },
    { icon: <FaQuestionCircle className="text-orange-500" />, label: "Yordam Markazi" },
  ];

  return (
    <div className="pb-24 pt-6">
      
      {/* HEADER SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mx-4 mb-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 -z-0"></div>
        
        <div className="flex flex-col items-center relative z-10">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative w-28 h-28 mb-4 rounded-full p-1 bg-gradient-to-tr from-blue-500 to-purple-500"
            >
               <div className="w-full h-full rounded-full overflow-hidden border-4 border-white relative">
                  <Image
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop"
                    alt="Profil"
                    fill
                    className="object-cover"
                  />
               </div>
               <div className="absolute bottom-1 right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
            </motion.div>
            
            <h2 className="text-2xl font-bold text-gray-800">Aziz Rahimov</h2>
            <p className="text-gray-500 font-medium text-sm mb-4">Professional Kurier</p>
            
            <div className="flex gap-3 w-full justify-center">
                 <a href="tel:+998901234567" className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                     <FaPhone className="text-green-500" /> Qo&apos;ng&apos;iroq
                 </a>
                 <a href="mailto:aziz@mail.uz" className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                     <FaEnvelope className="text-blue-500" /> Email
                 </a>
            </div>
        </div>
      </motion.div>

      {/* STATS GRID */}
      <motion.div 
         variants={containerVariants}
         initial="hidden"
         animate="visible"
         className="grid grid-cols-2 gap-4 px-4 mb-8"
      >
          {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow"
              >
                  <div className={`p-3 rounded-full mb-2 ${stat.color}`}>
                      <span className="text-xl">{stat.icon}</span>
                  </div>
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">{stat.label}</span>
                  <span className="text-xl font-bold text-gray-800">{stat.value}</span>
              </motion.div>
          ))}
      </motion.div>

      {/* PERFORMANCE METRICS */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8"
      >
          <h3 className="font-bold text-lg text-gray-800 mb-6 flex items-center gap-2">
              <FaCheckCircle className="text-blue-600" /> Natijalar
          </h3>
          
          <div className="space-y-6">
              {[
                  { label: "O'z vaqtida yetkazilgan", val: 95, color: "bg-green-500" },
                  { label: "Mijozlar mamnuniyati", val: 98, color: "bg-blue-500" },
                  { label: "Faollik darajasi", val: 88, color: "bg-purple-500" }
              ].map((item, idx) => (
                  <div key={idx}>
                      <div className="flex justify-between text-sm font-medium mb-2">
                          <span className="text-gray-600">{item.label}</span>
                          <span className="text-gray-900">{item.val}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <motion.div 
                             initial={{ width: 0 }}
                             whileInView={{ width: `${item.val}%` }}
                             transition={{ duration: 1, delay: idx * 0.2 }}
                             className={`h-full rounded-full ${item.color}`}
                          ></motion.div>
                      </div>
                  </div>
              ))}
          </div>
      </motion.div>

      {/* MENU LIST */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mx-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8"
      >
          {menuItems.map((item, idx) => (
              <button 
                key={idx}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
              >
                  <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-lg">
                          {item.icon}
                      </div>
                      <span className="font-medium text-gray-700">{item.label}</span>
                  </div>
                  <FaChevronRight className="text-gray-300 text-sm" />
              </button>
          ))}
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors group">
              <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-lg group-hover:bg-red-100 transition-colors">
                      <FaSignOutAlt className="text-red-500" />
                  </div>
                  <span className="font-medium text-red-500">Chiqish</span>
              </div>
          </button>
      </motion.div>
      
      <p className="text-center text-gray-400 text-xs pb-4">Versiya 1.0.4 • Kitobdosh Inc.</p>

    </div>
  );
}
