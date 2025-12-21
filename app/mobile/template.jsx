"use client";

import { motion } from "framer-motion";

export default function Template({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.23, 1, 0.32, 1] // Custom cubic-bezier for premium feel
      }}
      className="flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
}
