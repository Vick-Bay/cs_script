import { CustomerList } from "../components/CustomerList";
import { useCustomers } from "../hooks/useCustomers";
import { TableSkeleton } from "../components/ui/TableSkeleton";

export function Customers() {
  const { isLoading } = useCustomers();

  if (isLoading) {
    return <TableSkeleton loadingText="Loading customers..." />;
  }

  return <CustomerList />;
}
