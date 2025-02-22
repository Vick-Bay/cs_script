import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

type TableProps = {
  children: React.ReactNode;
  className?: string;
};

export function Table({ children, className = "" }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full ${className}`}>{children}</table>
    </div>
  );
}

export function Thead({ children }: { children: React.ReactNode }) {
  return <thead>{children}</thead>;
}

type ThProps = {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
  sortable?: boolean;
  sortDirection?: "asc" | "desc" | null;
  onClick?: () => void;
};

export function Th({
  children,
  className = "",
  align = "left",
  sortable = false,
  sortDirection = null,
  onClick,
}: ThProps) {
  return (
    <th
      className={`
        py-3 px-4
        bg-gray-50
        font-semibold
        text-gray-900
        border-b
        text-${align}
        ${sortable ? "cursor-pointer hover:bg-gray-100" : ""}
        ${className}
      `}
      onClick={sortable ? onClick : undefined}
    >
      <div className="flex items-center gap-2 justify-between">
        <span>{children}</span>
        {sortable && (
          <div className="flex flex-col -space-y-1">
            <ChevronUpIcon
              className={`h-4 w-4 ${
                sortDirection === "asc"
                  ? "text-blue-600"
                  : "text-gray-300 group-hover:text-gray-400"
              }`}
            />
            <ChevronDownIcon
              className={`h-4 w-4 ${
                sortDirection === "desc"
                  ? "text-blue-600"
                  : "text-gray-300 group-hover:text-gray-400"
              }`}
            />
          </div>
        )}
      </div>
    </th>
  );
}

export function Tbody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-gray-100">{children}</tbody>;
}

export function Tr({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <tr
      className={`transition-colors duration-150 hover:bg-blue-50/80 hover:shadow-sm cursor-pointer group ${className}`}
    >
      {children}
    </tr>
  );
}

export function Td({
  children,
  className = "",
  align = "left",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
}) {
  return (
    <td
      className={`py-3 px-4 text-${align} ${
        align === "left" ? "group-hover:text-blue-700" : "text-gray-600"
      } ${className}`}
    >
      {children}
    </td>
  );
}
