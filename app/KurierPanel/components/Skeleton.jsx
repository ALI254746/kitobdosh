"use client";

export const Skeleton = ({ className }) => (
  <div className={`animate-pulse rounded-2xl bg-white/5 ${className}`} />
);

export const DashboardSkeleton = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-3 gap-2">
      <Skeleton className="h-24" />
      <Skeleton className="h-24" />
      <Skeleton className="h-24" />
    </div>
    <Skeleton className="h-12 w-full rounded-full" />
    <Skeleton className="h-[28rem] w-full rounded-3xl" />
  </div>
);

export const OrderListSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <Skeleton key={i} className="h-40 w-full rounded-3xl" />
    ))}
  </div>
);
