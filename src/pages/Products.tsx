import { useState } from "react";
import { useProducts } from "../hooks/useData";
import type { Product } from "../types";

export function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: products = [], isLoading, error } = useProducts();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        Error loading products: {error.message}
      </div>
    );
  }

  const filteredProducts = products.filter((product: Product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <input
          type="text"
          placeholder="Search products..."
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {product.name}
              </h3>
              <p className="text-gray-600 mt-2">{product.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-blue-600 font-semibold">
                  ${product.price}
                </span>
                <span className="text-sm text-gray-500">
                  Stock: {product.stock}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
