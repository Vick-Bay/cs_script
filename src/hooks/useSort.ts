import { useState, useMemo } from "react";

type SortDirection = "asc" | "desc" | null;
type SortConfig<T> = {
  key: keyof T | null;
  direction: SortDirection;
};

export function useSort<T>(
  items: T[],
  config: SortConfig<T>
): {
  sortedItems: T[];
  sortBy: (key: keyof T) => void;
  sortConfig: SortConfig<T>;
} {
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
    key: config.key,
    direction: config.direction,
  });

  const sortBy = (key: keyof T) => {
    let direction: SortDirection = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = null;
    }
    setSortConfig({ key, direction });
  };

  const sortedItems = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return items;

    return [...items].sort((a, b) => {
      const aVal = a[sortConfig.key!];
      const bVal = b[sortConfig.key!];

      if (aVal === bVal) return 0;

      const result = aVal < bVal ? -1 : 1;
      return sortConfig.direction === "asc" ? result : -result;
    });
  }, [items, sortConfig]);

  return { sortedItems, sortBy, sortConfig };
}
