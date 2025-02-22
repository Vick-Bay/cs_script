import { CustomerList } from "../components/CustomerList";
import { useCustomers } from "../hooks/useCustomers";
import { TableSkeleton } from "../components/ui/TableSkeleton";

export function Customers() {
  const { data, isLoading, error } = useCustomers();

  if (isLoading) {
    return <TableSkeleton loadingText="Loading customers..." />;
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error loading customers: {error.message}
      </div>
    );
  }

  return <CustomerList customers={data} />;
}
