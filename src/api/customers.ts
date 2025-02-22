import type { Customer, CustomersResponse } from "../types/customer";

// Simulating API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getCustomers(): Promise<Customer[]> {
  await delay(500); // Simulate network delay
  const response = await fetch("/data/customers.json");
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
