type TableSkeletonProps = {
  columns?: number;
  rows?: number;
  showFilters?: boolean;
  showPagination?: boolean;
  loadingText?: string;
};

export function TableSkeleton({
  columns = 4,
  rows = 5,
  showFilters = true,
  showPagination = true,
  loadingText = "Loading...",
}: TableSkeletonProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-lg shadow">
        {/* Header Skeleton with Loading Text */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse" />
          <div className="text-gray-500 font-medium">{loadingText}</div>
        </div>

        {/* Filters Skeleton */}
        {showFilters && (
          <div className="p-4 flex gap-4">
            <div className="h-10 bg-gray-200 rounded w-48 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded w-48 animate-pulse" />
          </div>
        )}

        {/* Table Skeleton */}
        <div className="overflow-x-auto">
          <div className="min-w-full divide-y divide-gray-200">
            {/* Table Header */}
            <div className="bg-gray-50">
              {Array.from({ length: columns }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-gray-200 rounded m-2 w-32 inline-block animate-pulse"
                />
              ))}
            </div>

            {/* Table Rows */}
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <div key={rowIndex} className="border-t border-gray-200">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <div
                    key={colIndex}
                    className="h-10 bg-gray-100 rounded m-2 w-32 inline-block animate-pulse"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Skeleton */}
        {showPagination && (
          <div className="p-4 flex justify-between items-center border-t border-gray-200">
            <div className="h-8 bg-gray-200 rounded w-24 animate-pulse" />
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}
