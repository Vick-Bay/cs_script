import { ProductList } from "../components/ProductList";
import { useProducts } from "../hooks/useData";
import { TableSkeleton } from "../components/ui/TableSkeleton";

export function Products() {
  const { isLoading, isError } = useProducts();

  if (isError) {
    return <div className="text-red-500">Error loading products</div>;
  }

  if (isLoading) {
    return (
      <TableSkeleton columns={6} rows={8} loadingText="Loading products..." />
    );
  }

  return <ProductList />;
}
