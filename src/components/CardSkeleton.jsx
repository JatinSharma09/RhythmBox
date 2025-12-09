import React from "react";

const CardSkeleton = ({ compact = false }) => {
    // compact: Mobile/List View
    if (compact) {
        return (
            <div className="flex items-center gap-3 p-2 rounded-xl bg-surface/50 border border-white/5 animate-pulse">
                {/* Small Thumbnail Skeleton */}
                <div className="w-12 h-12 rounded-lg bg-white/10 flex-shrink-0" />

                {/* Text Skeleton */}
                <div className="flex-1 min-w-0 space-y-2">
                    <div className="h-4 bg-white/10 rounded w-3/4" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                </div>

                {/* Menu Icon Skeleton */}
                <div className="w-5 h-5 bg-white/5 rounded-full flex-shrink-0" />
            </div>
        );
    }

    // Standard: Desktop/Grid View
    return (
        <div className="relative w-full bg-surface/50 border border-white/5 rounded-2xl overflow-hidden p-3 animate-pulse">
            {/* Album Art Skeleton */}
            <div className="relative w-full aspect-square rounded-xl bg-white/10 mb-3" />

            {/* Text Skeleton */}
            <div className="space-y-2">
                <div className="h-4 bg-white/10 rounded w-3/4" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
            </div>
        </div>
    );
};

export default CardSkeleton;
