import { ProductList } from "../components/ProductList";
import { useProducts } from "../hooks/useProducts";
import { TableSkeleton } from "../components/ui/TableSkeleton";

export function Products() {
  const { data, isLoading, error } = useProducts();

  if (isLoading) {
    return <TableSkeleton loadingText="Loading products..." />;
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error loading products:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  return <ProductList products={data} />;
}
