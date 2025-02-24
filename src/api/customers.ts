import type { Customer, CustomersResponse } from "../types/customer";

// Cache key for customers
export const CUSTOMERS_CACHE_KEY = ["customers"] as const;

export async function getCustomers(apiKey: string): Promise<Customer[]> {
  const response = await fetch(
    `https://prod-19.centralus.logic.azure.com/workflows/0e4953b745d04b13973d5d6652dc99d7/triggers/manual/paths/invoke/customers?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=${apiKey}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: CustomersResponse = await response.json();
  return data.Customers || [];
}
