import { useState } from "react";
import { useQuotes, useCustomers, useProducts } from "../hooks/useData";
import type { Quote } from "../types";

export function Quotes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState<"all" | "pending" | "approved">(
    "all"
  );

  const {
    data: quotes = [],
    isLoading: quotesLoading,
    error: quotesError,
  } = useQuotes();
  const { data: customers = [] } = useCustomers();
  const { data: products = [] } = useProducts();

  if (quotesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (quotesError) {
    return (
      <div className="text-red-500 text-center">
        Error loading quotes: {quotesError.message}
      </div>
    );
  }

  const getCustomerName = (customerId: number): string => {
    return (
      customers.find((c) => c.id === customerId)?.name || "Unknown Customer"
    );
  };

  const getProductName = (productId: number): string => {
    return products.find((p) => p.id === productId)?.name || "Unknown Product";
  };

  const filteredQuotes = quotes.filter((quote: Quote) => {
    const matchesSearch =
      getCustomerName(quote.customerId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      quote.id.toString().includes(searchTerm);

    if (filterBy === "all") return matchesSearch;
    return matchesSearch && quote.status === filterBy;
  });

  return (
    <div>
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search quotes..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={filterBy}
            aria-label="Filter quotes"
            onChange={(e) =>
              setFilterBy(e.target.value as "all" | "pending" | "approved")
            }
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Quotes</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredQuotes.map((quote) => (
          <div
            key={quote.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Quote #{quote.id}
                </h3>
                <p className="text-gray-600">
                  Customer: {getCustomerName(quote.customerId)}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  quote.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
              </span>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Products
              </h4>
              <div className="space-y-2">
                {quote.products.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between items-center text-sm"
                  >
                    <span>{getProductName(item.productId)}</span>
                    <span className="text-gray-600">
                      Qty: {item.quantity} × ${item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
              <span className="text-gray-600">
                Date: {new Date(quote.date).toLocaleDateString()}
              </span>
              <span className="text-lg font-semibold text-blue-600">
                Total: ${quote.total}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
