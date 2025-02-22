import type { Customer, CustomersResponse } from "../types/customer";

// Cache key for customers
export const CUSTOMERS_CACHE_KEY = ["customers"] as const;

export async function getCustomers(): Promise<Customer[]> {
  const response = await fetch(
    "https://prod-19.centralus.logic.azure.com/workflows/0e4953b745d04b13973d5d6652dc99d7/triggers/manual/paths/invoke/customers?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=mUwBbcwCRWjaYCvpfr5uydn47aoRQxAAcZmim1oNmZU"
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data: CustomersResponse = await response.json();
  return data.Customers || [];
}

export async function getCustomerById(
  customerId: string
): Promise<Customer | undefined> {
  const customers = await getCustomers();
  return customers.find((c) => c.CustomerId === customerId);
}

export async function getCustomersByBranch(
  branchCode: string
): Promise<Customer[]> {
  const customers = await getCustomers();
  return customers.filter((c) => c.DefaultBranch === branchCode);
}

export async function getCustomerStats() {
  const customers = await getCustomers();

  const activeCustomers = customers.filter((c) => c.IsActive);

  return {
    totalCustomers: customers.length,
    activeCustomers: activeCustomers.length,
    branches: [...new Set(customers.map((c) => c.DefaultBranch))],
    topCustomers: activeCustomers
      .sort((a, b) => b.PriceMultiplier - a.PriceMultiplier)
      .slice(0, 10),
  };
}
