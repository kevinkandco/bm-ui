import { Skeleton } from "@/components/ui/skeleton";

export default function BriefLoadingSkeleton() {
  return (
    <div className="p-2">
      <Skeleton className="h-5 w-2/3 mb-6" />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white/10 rounded-lg border border-white/10 p-5 shadow-sm space-y-2"
          >
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ))}
      </div>

      {/* Audio Brief Section */}
      <div className="bg-white/10 rounded-lg border border-white/10 p-5 shadow-sm mb-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <Skeleton className="h-4 w-40 mb-2" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-5 w-40 rounded-full" />
        </div>

        <Skeleton className="h-4 w-full mb-4" />

        <Skeleton className="h-6 w-full mb-2" />
        <div className="flex justify-between text-xs mt-1">
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3 w-10" />
        </div>

        <div className="flex justify-between items-center mt-4">
          <Skeleton className="h-8 w-24 rounded-md" />
          <div className="flex items-center gap-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-8 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-4 w-12" />
        </div>

        <div className="mt-4 text-right">
          <Skeleton className="h-4 w-28 inline-block" />
        </div>
      </div>

      {/* Recent Messages Table */}
      <Skeleton className="h-6 w-40 mb-3" />
      <div className="bg-white/10 rounded-lg border border-white/10 shadow-sm overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              {[...Array(7)].map((_, i) => (
                <th
                  key={i}
                  className="py-3 px-4 text-left text-xs font-medium text-white/70"
                >
                  <Skeleton className="h-3 w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(3)].map((_, rowIdx) => (
              <tr key={rowIdx} className="border-b border-white/10">
                {[...Array(7)].map((_, colIdx) => (
                  <td key={colIdx} className="py-3 px-4">
                    <Skeleton className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
