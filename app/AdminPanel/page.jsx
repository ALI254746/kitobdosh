"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaBook, FaUsers, FaHandshake, FaDollarSign } from "react-icons/fa";
import Image from "next/image";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  FaBookOpen,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowUp,
} from "react-icons/fa";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

// --- SKELETON LOADER ---
function DashboardSkeleton({ darkMode }) {
  const shimmerBase = darkMode ? "bg-[#A3ED96]/[0.05]" : "bg-gray-200";
  const shimmerHighlight = darkMode ? "bg-[#A3ED96]/[0.1]" : "bg-gray-300";

  return (
    <div className={`min-h-screen p-8 transition-colors duration-300`}>
      {/* Header Skeleton */}
      <div className="mb-8 w-64 h-10 rounded-xl animate-pulse bg-gray-300 dark:bg-gray-700 opacity-20" />

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`h-40 rounded-2xl animate-pulse ${shimmerBase}`} />
        ))}
      </div>

      {/* Status Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className={`h-32 rounded-2xl animate-pulse ${shimmerBase}`} />
        ))}
      </div>

      {/* Chart & List Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={`lg:col-span-2 h-[400px] rounded-3xl animate-pulse ${shimmerBase}`} />
        <div className={`h-[400px] rounded-3xl animate-pulse ${shimmerBase}`} />
      </div>
    </div>
  );
}

// Stats kartochkalar
function StatsCard({ icon, value, label, percent, darkMode }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className={`relative overflow-hidden rounded-2xl p-6 shadow-xl border backdrop-blur-md transition-all duration-300
        ${
          darkMode
            ? "bg-[#A3ED96]/10 border-[#A3ED96]/20 text-white"
            : "bg-white border-gray-100 text-[#163201] shadow-lg"
        }`}
    >
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full bg-gradient-to-br from-[#A3ED96]/20 to-transparent -mr-4 -mt-4 opacity-50`} />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg
            ${darkMode ? "bg-[#163201] text-[#A3ED96] border border-[#A3ED96]/30" : "bg-[#163201] text-white"}
        `}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full
            ${darkMode ? "bg-[#A3ED96] text-[#163201]" : "bg-[#A3ED96]/20 text-[#163201] border border-[#A3ED96]"}
        `}>
          <FaArrowUp size={10} />
          {percent}
        </div>
      </div>
      <h3 className="text-4xl font-extrabold mb-1 tracking-tight relative z-10">{value}</h3>
      <p className={`text-sm font-medium relative z-10 ${darkMode ? "text-[#A3ED96]/80" : "text-gray-500"}`}>{label}</p>
    </motion.div>
  );
}

// Holat kartochkalari
function StatusCard({ title, count, icon, colorClass, darkMode }) {
    return (
        <motion.div 
            whileHover={{ scale: 1.02 }}
            className={`flex items-center justify-between p-6 rounded-2xl border shadow-lg backdrop-blur-sm
                ${darkMode 
                    ? `bg-[${colorClass}]/10 border-[${colorClass}]/20 text-white` 
                    : `bg-white border-gray-100 text-gray-800`
                }
            `}
        >
            <div>
                <p className={`text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-500"}`}>{title}</p>
                <h3 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-[#163201]"}`}>{count}</h3>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl
                 ${darkMode ? `bg-white/10 text-[${colorClass}]` : `bg-[#163201]/5 text-[${colorClass}]`}
            `}>
                {icon}
            </div>
        </motion.div>
    )
}

// Faol foydalanuvchilar
function ActiveUser({ img, name, desc, rating, darkMode }) {
  return (
    <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200
            ${darkMode 
                ? "bg-[#163201]/50 border-[#A3ED96]/10 hover:bg-[#A3ED96]/5" 
                : "bg-gray-50 border-gray-100 hover:bg-white hover:shadow-md"
            }`}
    >
      <div className="flex items-center space-x-4">
        <div className="relative w-12 h-12 border-2 border-[#A3ED96] rounded-full p-0.5">
          <Image
            src={img}
            alt={name}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <p className={`font-bold ${darkMode ? "text-white" : "text-[#163201]"}`}>{name}</p>
          <p className={`text-xs ${darkMode ? "text-[#A3ED96]/70" : "text-gray-500"}`}>{desc}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 text-[#F59E0B] font-bold text-sm">
        <span>★</span>
        <span>{rating}</span>
      </div>
    </motion.div>
  );
}

// Dashboard
import { useAdmin } from "./AdminContext";

export default function DashboardPage() {
  const { darkMode } = useAdmin();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Ma'lumotlarni yuklashda xatolik yuz berdi");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const chartData = {
    labels: stats?.monthlySales?.map(s => {
        const months = ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"];
        return months[s._id.month - 1];
    }) || ["-", "-", "-", "-", "-", "-"],
    datasets: [
      {
        label: "Savdo (so'm)",
        data: stats?.monthlySales?.map(s => s.total) || [0, 0, 0, 0, 0, 0],
        borderColor: "#A3ED96", // Neon Green
        backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, "rgba(163, 237, 150, 0.5)");
            gradient.addColorStop(1, "rgba(163, 237, 150, 0)");
            return gradient;
        },
        pointBackgroundColor: "#163201",
        pointBorderColor: "#A3ED96",
        pointBorderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: darkMode ? "#A3ED96" : "#163201",
          callback: (val) => `${val.toLocaleString()} so'm`,
          font: { family: 'inherit' }
        },
        grid: {
          color: darkMode ? "rgba(163, 237, 150, 0.1)" : "rgba(22, 50, 1, 0.05)",
        },
        border: { display: false }
      },
      x: {
        ticks: { color: darkMode ? "#A3ED96" : "#163201", font: { family: 'inherit' } },
        grid: { display: false },
        border: { display: false }
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) {
    return <DashboardSkeleton darkMode={darkMode} />;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`min-h-screen p-8 transition-colors duration-300 ${
        darkMode ? "bg-[#0b1a00] text-white" : "bg-[#f8fafc] text-[#163201]"
      }`}
    >
      <div className="mb-8">
          <h1 className="text-3xl font-black mb-2 tracking-tight">Xush kelibsiz, Admin! 👋</h1>
          <p className={`text-sm ${darkMode ? "text-[#A3ED96]/70" : "text-gray-500"}`}>Bugungi statistikani ko&apos;rib chiqing.</p>
      </div>

      <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div variants={itemVariants}>
            <StatsCard
            icon={<FaBook className="text-2xl" />}
            value={stats?.totalBooks || 0}
            label="Jami Kitoblar"
            percent="Yangi"
            darkMode={darkMode}
            />
        </motion.div>
        <motion.div variants={itemVariants}>
            <StatsCard
            icon={<FaUsers className="text-2xl" />}
            value={stats?.totalUsers || 0}
            label="Jami Foydalanuvchilar"
            percent="A'zo"
            darkMode={darkMode}
            />
        </motion.div>
        <motion.div variants={itemVariants}>
            <StatsCard
            icon={<FaHandshake className="text-2xl" />}
            value={stats?.pendingRentRequests || 0}
            label="Kutilayotgan Ijaralar"
            percent="So'rov"
            darkMode={darkMode}
            />
        </motion.div>
        <motion.div variants={itemVariants}>
            <StatsCard
            icon={<FaDollarSign className="text-2xl" />}
            value={`${(stats?.totalIncome || 0).toLocaleString()} so'm`}
            label="Umumiy Daromad"
            percent="Jami"
            darkMode={darkMode}
            />
        </motion.div>
      </motion.div>

      {/* Status Cards */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div variants={itemVariants}>
            <div className={`p-6 rounded-2xl border flex items-center justify-between ${darkMode ? "bg-blue-900/20 border-blue-500/30 text-blue-200" : "bg-blue-50 border-blue-100 text-blue-900"}`}>
                <div>
                    <span className="text-xs uppercase font-bold tracking-wider opacity-70">Faol Ijaralar</span>
                    <h3 className="text-3xl font-black mt-1">{stats?.activeRentals || 0} ta</h3>
                </div>
                <FaBookOpen className="text-4xl opacity-50" />
            </div>
        </motion.div>
         <motion.div variants={itemVariants}>
            <div className={`p-6 rounded-2xl border flex items-center justify-between ${darkMode ? "bg-red-900/20 border-red-500/30 text-red-200" : "bg-red-50 border-red-100 text-red-900"}`}>
                <div>
                    <span className="text-xs uppercase font-bold tracking-wider opacity-70">Ijara muddati o'tgan</span>
                    <h3 className="text-3xl font-black mt-1">{stats?.overdueRentals || 0} ta</h3>
                </div>
                <FaExclamationTriangle className="text-4xl opacity-50" />
            </div>
        </motion.div>
         <motion.div variants={itemVariants}>
            <div className={`p-6 rounded-2xl border flex items-center justify-between ${darkMode ? "bg-green-900/20 border-green-500/30 text-green-200" : "bg-green-50 border-green-100 text-green-900"}`}>
                <div>
                    <span className="text-xs uppercase font-bold tracking-wider opacity-70">Eng faol kategoriya</span>
                    <h3 className="text-xl font-black mt-1 line-clamp-1">{stats?.topCategory || "Barcha"}</h3>
                </div>
                <FaCheckCircle className="text-4xl opacity-50" />
            </div>
        </motion.div>
      </motion.div>

      {/* Chart + Active users */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
           variants={itemVariants}
          className={`lg:col-span-2 rounded-3xl p-8 shadow-xl border transition-colors duration-300 ${
            darkMode 
                ? "bg-[#163201]/40 border-[#A3ED96]/20 backdrop-blur-sm" 
                : "bg-white border-gray-100"
          }`}
        >
          <div className="flex items-center justify-between mb-8">
              <h3 className={`text-xl font-bold ${darkMode ? "text-white" : "text-[#163201]"}`}>Savdo Statistikasi</h3>
              <select className={`text-xs p-2 rounded-lg border outline-none cursor-pointer ${darkMode ? "bg-[#163201] text-[#A3ED96] border-[#A3ED96]/30" : "bg-gray-50 border-gray-200"}`}>
                  <option>Bu hafta</option>
                  <option>Bu oy</option>
                  <option>Bu yil</option>
              </select>
          </div>
          <div className="h-[300px] w-full">
            <Line data={chartData} options={chartOptions} />
          </div>
        </motion.div>

        <motion.div
           variants={itemVariants}
          className={`rounded-3xl p-8 shadow-xl border transition-colors duration-300 ${
            darkMode 
                ? "bg-[#163201]/40 border-[#A3ED96]/20 backdrop-blur-sm" 
                : "bg-white border-gray-100"
          }`}
        >
          <h3 className={`text-xl font-bold mb-6 ${darkMode ? "text-white" : "text-[#163201]"}`}>Faol Kitobxonlar</h3>
          <div className="space-y-4">
            {stats?.topReaders?.map((reader, index) => (
                <ActiveUser
                key={index}
                img={reader.avatar}
                name={reader.name}
                desc={`${reader.count} ta buyurtma`}
                rating="5.0"
                darkMode={darkMode}
                />
            ))}
            {(!stats?.topReaders || stats.topReaders.length === 0) && (
                <p className="text-center text-gray-500 py-10">Ma'lumot yo'q</p>
            )}
          </div>
          <button className={`w-full mt-6 py-3 rounded-xl text-sm font-bold border transition-all
              ${darkMode 
                  ? "border-[#A3ED96] text-[#A3ED96] hover:bg-[#A3ED96] hover:text-[#163201]" 
                  : "border-[#163201] text-[#163201] hover:bg-[#163201] hover:text-white"
              }
          `}>
              Barchasini ko&apos;rish
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
