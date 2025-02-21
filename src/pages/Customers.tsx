import { useState } from "react";
import { useCustomers } from "../hooks/useData";
import type { Customer } from "../types";

export function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: customers = [], isLoading, error } = useCustomers();

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
        Error loading customers: {error.message}
      </div>
    );
  }

  const filteredCustomers = customers.filter((customer: Customer) =>
    customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search customers..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              {customer.name}
            </h3>
            <p className="text-gray-600">{customer.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
