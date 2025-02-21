import { useQuery } from "@tanstack/react-query";
import type { Customer, Product, Quote } from "../types";

export function useCustomers() {
  return useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: async () => {
      const response = await fetch("/data/customers.json");
      const data = await response.json();
      return Array.isArray(data) ? data : Object.values(data);
    },
  });
}

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("/data/products.json");
      const data = await response.json();
      return Array.isArray(data) ? data : Object.values(data);
    },
  });
}

export function useQuotes() {
  return useQuery<Quote[]>({
    queryKey: ["quotes"],
    queryFn: async () => {
      const response = await fetch("/data/quotes.json");
      const data = await response.json();
      return Array.isArray(data) ? data : Object.values(data);
    },
  });
}
