import { ProductList } from "../components/ProductList";
import { useProducts } from "../hooks/useData";

export function Products() {
  const { isLoading, isError } = useProducts();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {isError ? (
          <div className="text-red-500">Error loading products</div>
        ) : isLoading ? (
          <div className="animate-pulse">Loading products...</div>
        ) : (
          <ProductList />
        )}
      </div>
    </div>
  );
}
