type PaginationProps = {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

export function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="px-6 py-4 border-t border-gray-200">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{startItem}</span> to{" "}
          <span className="font-medium">{endItem}</span> of{" "}
          <span className="font-medium">{totalItems}</span> results
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium
              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50
              enabled:hover:bg-gray-50 enabled:hover:text-blue-600 enabled:hover:border-blue-600
              enabled:active:bg-gray-100
              transition-colors duration-150"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium
              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50
              enabled:hover:bg-gray-50 enabled:hover:text-blue-600 enabled:hover:border-blue-600
              enabled:active:bg-gray-100
              transition-colors duration-150"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
