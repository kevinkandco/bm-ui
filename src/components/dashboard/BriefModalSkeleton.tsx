import { Skeleton } from "@/components/ui/skeleton";

const BriefModalSkeleton = () => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 md:px-6 py-4 space-y-4">
        {/* Loading description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4 bg-gray-800/60" />
          <Skeleton className="h-4 w-1/2 bg-gray-800/60" />
        </div>

        {/* Summary Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="bg-gray-800/60 rounded-lg border border-gray-700/40 p-3 shadow-sm">
            <Skeleton className="h-3 w-24 mb-2 bg-gray-700/60" />
            <Skeleton className="h-8 w-16 mb-1 bg-gray-700/60" />
            <Skeleton className="h-3 w-32 bg-gray-700/60" />
          </div>

          <div className="bg-gray-800/60 rounded-lg border border-gray-700/40 p-3 shadow-sm">
            <Skeleton className="h-3 w-28 mb-2 bg-gray-700/60" />
            <Skeleton className="h-8 w-20 mb-1 bg-gray-700/60" />
            <div className="flex gap-1 mt-1">
              <Skeleton className="w-4 h-4 rounded-full bg-gray-700/60" />
              <Skeleton className="w-4 h-4 rounded-full bg-gray-700/60" />
              <Skeleton className="w-4 h-4 rounded-full bg-gray-700/60" />
            </div>
          </div>

          <div className="bg-gray-800/60 rounded-lg border border-gray-700/40 p-3 shadow-sm sm:col-span-2 lg:col-span-1">
            <Skeleton className="h-3 w-20 mb-2 bg-gray-700/60" />
            <Skeleton className="h-8 w-12 mb-1 bg-gray-700/60" />
            <Skeleton className="h-3 w-28 bg-gray-700/60" />
          </div>
        </div>

        {/* Audio Brief Section Skeleton */}
        <div className="bg-gray-800/60 rounded-lg border border-gray-700/40 p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
            <div className="space-y-1">
              <Skeleton className="h-4 w-48 bg-gray-700/60" />
              <Skeleton className="h-3 w-32 bg-gray-700/60" />
            </div>
            <Skeleton className="h-6 w-24 rounded-full bg-gray-700/60" />
          </div>

          <div className="space-y-2 mb-3">
            <Skeleton className="h-3 w-full bg-gray-700/60" />
            <Skeleton className="h-3 w-4/5 bg-gray-700/60" />
          </div>

          {/* Audio Wave Skeleton */}
          <div className="mb-3 relative">
            <Skeleton className="h-16 w-full rounded-lg bg-gray-700/60" />

            {/* Time labels skeleton */}
            <div className="flex justify-between mt-2">
              <Skeleton className="h-3 w-8 bg-gray-700/60" />
              <div className="hidden sm:flex flex-1 justify-around px-4 gap-4">
                <Skeleton className="h-3 w-16 bg-gray-700/60" />
                <Skeleton className="h-3 w-20 bg-gray-700/60" />
                <Skeleton className="h-3 w-14 bg-gray-700/60" />
              </div>
              <Skeleton className="h-3 w-8 bg-gray-700/60" />
            </div>

            {/* Mobile topic indicators skeleton */}
            <div className="sm:hidden flex justify-center space-x-4 mt-1">
              <Skeleton className="h-3 w-6 bg-gray-700/60" />
              <Skeleton className="h-3 w-12 bg-gray-700/60" />
              <Skeleton className="h-3 w-8 bg-gray-700/60" />
            </div>
          </div>

          {/* Audio controls skeleton */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <Skeleton className="h-7 w-20 bg-gray-700/60" />

            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 bg-gray-700/60" />
              <Skeleton className="h-6 w-6 bg-gray-700/60" />
              <Skeleton className="h-8 w-8 rounded-full bg-gray-700/60" />
              <Skeleton className="h-6 w-6 bg-gray-700/60" />
              <Skeleton className="h-6 w-6 bg-gray-700/60" />
            </div>

            <Skeleton className="h-3 w-12 bg-gray-700/60" />
          </div>

          <div className="mt-2 text-center sm:text-right">
            <Skeleton className="h-4 w-24 bg-gray-700/60 mx-auto sm:mx-0 sm:ml-auto" />
          </div>
        </div>

        {/* Recent Messages Skeleton */}
        <div>
          <Skeleton className="h-6 w-32 mb-3 bg-gray-700/60" />

          {/* Mobile: Compact card layout skeleton */}
          <div className="block md:hidden space-y-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-gradient-to-r from-gray-800/40 to-gray-700/40 border border-gray-700/40 p-3 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Skeleton className="w-5 h-5 bg-gray-700/60" />
                    <div className="min-w-0 flex-1 space-y-1">
                      <Skeleton className="h-3 w-3/4 bg-gray-700/60" />
                      <Skeleton className="h-3 w-1/2 bg-gray-700/60" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Skeleton className="h-5 w-12 rounded-full bg-gray-700/60" />
                    <Skeleton className="h-4 w-8 bg-gray-700/60" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Table layout skeleton */}
          <div className="hidden md:block bg-gray-800/40 rounded-lg border border-gray-700/40 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-700/40 bg-gray-800/60">
                    <th className="py-2 px-3 text-left">
                      <Skeleton className="h-3 w-16 bg-gray-700/60" />
                    </th>
                    <th className="py-2 px-3 text-left">
                      <Skeleton className="h-3 w-16 bg-gray-700/60" />
                    </th>
                    <th className="py-2 px-3 text-left">
                      <Skeleton className="h-3 w-12 bg-gray-700/60" />
                    </th>
                    <th className="py-2 px-3 text-left">
                      <Skeleton className="h-3 w-8 bg-gray-700/60" />
                    </th>
                    <th className="py-2 px-3 text-left">
                      <Skeleton className="h-3 w-12 bg-gray-700/60" />
                    </th>
                    <th className="py-2 px-3 text-left">
                      <Skeleton className="h-3 w-12 bg-gray-700/60" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(4)].map((_, i) => (
                    <tr key={i} className="border-b border-gray-700/40">
                      <td className="py-2 px-3">
                        <Skeleton className="w-5 h-5 bg-gray-700/60" />
                      </td>
                      <td className="py-2 px-3">
                        <Skeleton className="h-4 w-32 bg-gray-700/60" />
                      </td>
                      <td className="py-2 px-3">
                        <Skeleton className="h-4 w-20 bg-gray-700/60" />
                      </td>
                      <td className="py-2 px-3">
                        <Skeleton className="h-4 w-16 bg-gray-700/60" />
                      </td>
                      <td className="py-2 px-3">
                        <Skeleton className="h-5 w-12 rounded-full bg-gray-700/60" />
                      </td>
                      <td className="py-2 px-3">
                        <Skeleton className="h-4 w-16 bg-gray-700/60" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BriefModalSkeleton;
