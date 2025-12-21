"use client";

import React from "react";

const SkeletonPulse = ({ className }) => (
    <div className={`bg-gray-200 dark:bg-slate-700 animate-pulse rounded-2xl ${className}`} />
);

export default function HomeSkeleton() {
    return (
        <div className="p-4 space-y-6">
            {/* Search Bar Skeleton */}
            <SkeletonPulse className="h-12 w-full mb-4" />

            {/* Banner Skeleton */}
            <div className="relative w-screen -ml-4 px-4 overflow-hidden">
                <SkeletonPulse className="w-full h-[170px] rounded-3xl" />
                <div className="flex justify-center gap-2 mt-3">
                    <SkeletonPulse className="w-6 h-1.5" />
                    <SkeletonPulse className="w-1.5 h-1.5" />
                    <SkeletonPulse className="w-1.5 h-1.5" />
                </div>
            </div>

            {/* Quick Actions Skeleton */}
            <div className="grid grid-cols-2 gap-4">
                <SkeletonPulse className="col-span-2 h-24 rounded-3xl" />
            </div>

            {/* Section Headers Skeleton */}
            <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <SkeletonPulse className="h-6 w-32" />
                            <SkeletonPulse className="h-4 w-16" />
                        </div>
                        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                            {[1, 2, 3, 4].map((j) => (
                                <SkeletonPulse key={j} className="min-w-[150px] h-56 rounded-2xl" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Authors Section Skeleton */}
            <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <SkeletonPulse className="h-6 w-40" />
                </div>
                <div className="flex gap-4 overflow-x-auto no-scrollbar">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex flex-col items-center gap-2 min-w-[120px]">
                            <SkeletonPulse className="w-20 h-20 rounded-full" />
                            <SkeletonPulse className="h-4 w-20" />
                            <SkeletonPulse className="h-3 w-12" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
