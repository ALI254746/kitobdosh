"use client";

import { useState } from "react";
import {
  FaMapMarkerAlt,
  FaBook,
  FaCheck,
  FaCar,
  FaCheckDouble,
} from "react-icons/fa";

export default function OrderCard() {
  const [order, setOrder] = useState({
    customer: "Javohir Usmonov",
    address: "Toshkent sh., Shayxontohur tumani, 15-mavze, 33-uy",
    book: "Fizika 11-sinf",
    status: "Qabul qildim", // Boshlang'ich status
  });

  const steps = ["Qabul qildim", "Kitobni oldim", "Yo'ldaman", "Yetkazdim"];
  const stepIcons = {
    "Qabul qildim": <FaCheck />,
    "Kitobni oldim": <FaBook />,
    "Yo'ldaman": <FaCar />,
    Yetkazdim: <FaCheckDouble />,
  };

  const getStepClass = (currentStatus, step) => {
    const currentIndex = steps.indexOf(currentStatus);
    const stepIndex = steps.indexOf(step);
    if (stepIndex < currentIndex)
      return "bg-gradient-to-r from-blue-500 to-green-500 text-white";
    if (stepIndex === currentIndex) return "bg-blue-500 text-white";
    return "bg-gray-200 text-gray-400";
  };

  const getProgressWidth = (currentStatus) => {
    const currentIndex = steps.indexOf(currentStatus);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  return (
    <div className="bg-white rounded-xl mt-15 shadow-sm p-6 max-w-md mx-auto my-6">
      {/* Customer va status */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-4">
        <div>
          <h3 className="font-semibold text-gray-800 text-lg">
            {order.customer}
          </h3>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
            <FaMapMarkerAlt className="text-gray-400" /> {order.address}
          </p>
          <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
            <FaBook className="text-gray-400" /> {order.book}
          </p>
        </div>
        <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium self-start">
          {order.status}
        </span>
      </div>

      {/* Progress steps */}
      <div className="relative">
        <div className="flex justify-between mb-2">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm mb-2 transition-all ${getStepClass(
                  order.status,
                  step
                )}`}
              >
                {stepIcons[step]}
              </div>
              <p
                className={`text-xs text-center hidden sm:block ${
                  steps.indexOf(order.status) >= i
                    ? "text-blue-600 font-medium"
                    : "text-gray-400"
                }`}
              >
                {step}
              </p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="absolute top-4 sm:top-5 left-0 right-0 h-1 bg-gray-200 -z-10 rounded-full">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500 rounded-full"
            style={{ width: `${getProgressWidth(order.status)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
