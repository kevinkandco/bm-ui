import { Skeleton } from "@/components/ui/skeleton";

const BriefCardSkeleton = () => {
  return (
    <div
      className="w-full rounded-xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(31, 36, 40, 0.6) 0%, rgba(43, 49, 54, 0.6) 100%)",
      }}
    >
      <div className="p-4 space-y-3">
        {/* Top Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="min-w-0 flex-1 space-y-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>

        {/* Description */}
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/3" />

        {/* Time Range */}
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
};

export default BriefCardSkeleton;
