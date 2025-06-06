import { Skeleton } from "@/components/ui/skeleton";

const BriefModalSkeleton = () => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-7 w-1/3" /> {/* Title */}
            <Skeleton className="h-5 w-28 mt-4" /> {/* Duration */}
          </div>
          <Skeleton className="h-4 w-1/4 mb-3" /> {/* Time range */}
          <Skeleton className="h-5 w-full max-w-lg mb-4" /> {/* Description */}
          {/* Feedback Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          {/* Comment input placeholder */}
          <Skeleton className="mt-3 h-10 w-full max-w-md rounded-md" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-[#2a3038] rounded-lg p-3">
            <Skeleton className="h-3 w-20 mb-1" />
            <Skeleton className="h-7 w-16 mb-1" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>

      {/* Audio Player */}
      <div className="bg-[#1a1f23] rounded-lg p-6 mb-6 border border-[#2a3038]">
        {/* Waveform placeholder */}
        <Skeleton className="mb-6 h-16 rounded-lg w-full" />

        {/* Section labels */}
        <div className="flex justify-between items-center mb-4 text-sm">
          <Skeleton className="h-4 w-8" />
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-20" />
            ))}
          </div>
          <Skeleton className="h-4 w-8" />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-12 rounded-full" />
          ))}
        </div>

        {/* Section navigation */}
        <div className="space-y-2 mb-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-full rounded-md" />
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-md" />
          ))}
        </div>
      </div>

      {/* Recent Messages Table */}
      <div className="mb-6">
        <Skeleton className="h-7 w-40 mb-4" />
        <div className="bg-[#2a3038] rounded-lg overflow-hidden">
          <div className="grid grid-cols-6 gap-4 p-3 bg-[#1a1f23] text-sm">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-6 gap-4 p-3 border-t border-gray-700 text-sm"
            >
              {[...Array(6)].map((_, j) => (
                <Skeleton key={j} className="h-5 w-full rounded-sm" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

};

export default BriefModalSkeleton;
