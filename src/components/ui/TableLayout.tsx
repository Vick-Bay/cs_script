import { ReactNode } from "react";

type Column<T> = {
  header: string;
  accessor: keyof T;
  cell?: (value: T[keyof T]) => string;
};

export type TableLayoutProps<T> = {
  title?: string;
  description?: string;
  filters?: ReactNode;
  children: ReactNode;
};

export function TableLayout<T>({
  title,
  description,
  filters,
  children,
}: TableLayoutProps<T>) {
  return (
    <div className="space-y-6">
      {title && (
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            {description && (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
          </div>
        </div>
      )}
      {filters && <div className="space-y-4">{filters}</div>}
      {children}
    </div>
  );
}
