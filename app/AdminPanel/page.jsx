"use client";

import { FaBook, FaUsers, FaHandshake, FaDollarSign } from "react-icons/fa";
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
} from "react-icons/fa";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

// Stats kartochkalar
function StatsCard({ icon, value, label, percent, colors }) {
  return (
    <div
      className={`bg-gradient-to-br ${colors} rounded-xl p-6 text-white shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center shadow-lg">
          {icon}
        </div>
        <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full shadow-md">
          {percent}
        </span>
      </div>
      <h3 className="text-3xl font-bold mb-1">{value}</h3>
      <p className="text-sm">{label}</p>
    </div>
  );
}

// Faol foydalanuvchilar
function ActiveUser({ img, name, desc, rating }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100  rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">
      <div className="flex items-center space-x-3">
        <img
          src={img}
          alt={name}
          className="w-12 h-12 rounded-full shadow-md"
        />
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
        </div>
      </div>
      <span className="text-blue-600 dark:text-blue-400 font-bold">
        ★ {rating}
      </span>
    </div>
  );
}

// Dashboard
export default function DashboardPage({ darkMode }) {
  const chartData = {
    labels: ["Yan", "Fev", "Mar", "Apr", "May", "Iyun"],
    datasets: [
      {
        label: "Savdo ($)",
        data: [5000, 7000, 6500, 8000, 9500, 11000],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: darkMode ? "#d1d5db" : "#374151",
          callback: (val) => `$${val}`,
        },
        grid: {
          color: darkMode ? "rgba(255,255,255,0.1)" : "rgba(55, 65, 81, 0.1)",
        },
      },
      x: {
        ticks: { color: darkMode ? "#d1d5db" : "#374151" },
        grid: { display: false },
      },
    },
  };

  return (
    <div
      className={`min-h-screen p-6 ${
        darkMode ? " text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          icon={<FaBook className="text-2xl" />}
          value="1,247"
          label="Jami Kitoblar"
          percent="+12%"
          colors={
            darkMode ? "from-gray-700 to-gray-800" : "from-blue-500 to-blue-700"
          }
        />
        <StatsCard
          icon={<FaUsers className="text-2xl" />}
          value="3,842"
          label="Faol Foydalanuvchilar"
          percent="+8%"
          colors={
            darkMode
              ? "from-gray-600 to-gray-700"
              : "from-green-500 to-green-700"
          }
        />
        <StatsCard
          icon={<FaHandshake className="text-2xl" />}
          value="156"
          label="Ijara So'rovlari"
          percent="+24%"
          colors={
            darkMode
              ? "from-gray-500 to-gray-600"
              : "from-purple-500 to-purple-700"
          }
        />
        <StatsCard
          icon={<FaDollarSign className="text-2xl" />}
          value="$24,580"
          label="Umumiy Daromad"
          percent="+18%"
          colors={
            darkMode
              ? "from-gray-400 to-gray-500"
              : "from-orange-500 to-orange-700"
          }
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* 1. Bugun qabul qilingan */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Bugun qabul qilingan</p>
              <h3 className="text-3xl font-bold mt-2">25 ta</h3>
            </div>
            <FaBookOpen className="text-4xl text-blue-200" />
          </div>
        </div>

        {/* 2. Bazaga topshirilgan */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Bazaga topshirilgan</p>
              <h3 className="text-3xl font-bold mt-2">12 ta</h3>
            </div>
            <FaCheckCircle className="text-4xl text-green-200" />
          </div>
        </div>

        {/* 3. Zarar holatidagi */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Zarar holatidagi</p>
              <h3 className="text-3xl font-bold mt-2">3 ta</h3>
            </div>
            <FaExclamationTriangle className="text-4xl text-red-200" />
          </div>
        </div>
      </div>

      {/* Chart + Active users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div
          className={`rounded-xl p-6 shadow-2xl transition-colors duration-300 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3 className="text-lg font-bold mb-4">Savdo Tendensiyalari</h3>
          <div className="h-80 overflow-hidden">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div
          className={`rounded-xl p-6 shadow-2xl transition-colors duration-300 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3 className="text-lg font-bold mb-4">Eng Faol Foydalanuvchilar</h3>
          <div className="space-y-4">
            <ActiveUser
              img="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
              name="Malika Karimova"
              desc="42 kitob ijaraga olgan"
              rating="4.9"
            />
            <ActiveUser
              img="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
              name="Sardor Aliyev"
              desc="38 kitob ijaraga olgan"
              rating="4.8"
            />
            <ActiveUser
              img="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
              name="Nilufar Rahimova"
              desc="35 kitob ijaraga olgan"
              rating="4.7"
            />
            <ActiveUser
              img="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
              name="Jasur Toshmatov"
              desc="32 kitob ijaraga olgan"
              rating="4.6"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
