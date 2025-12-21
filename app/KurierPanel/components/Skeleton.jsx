"use client";

import { motion } from "framer-motion";

export const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded-2xl ${className}`} />
);

export const DashboardSkeleton = () => (
  <div className="space-y-10">
    {/* Header Skeleton */}
    <div className="space-y-4">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-12 w-64" />
      <Skeleton className="h-4 w-full max-w-md" />
    </div>

    {/* Active Task Skeleton */}
    <Skeleton className="h-48 w-full rounded-[2.5rem]" />

    {/* Stats Grid Skeleton */}
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      <Skeleton className="h-32 rounded-[2.5rem]" />
      <Skeleton className="h-32 rounded-[2.5rem]" />
      <Skeleton className="h-32 rounded-[2.5rem]" />
    </div>

    {/* Earnings Card Skeleton */}
    <Skeleton className="h-32 w-full rounded-[2.5rem]" />
  </div>
);

export const OrderListSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map(i => (
      <Skeleton key={i} className="h-40 w-full rounded-[2.5rem]" />
    ))}
  </div>
);
