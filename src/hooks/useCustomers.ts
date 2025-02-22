import { useQuery } from "@tanstack/react-query";
import { getCustomers, CUSTOMERS_CACHE_KEY } from "../api/customers";
import { useAuth } from "../context/AuthContext";
import type { Customer } from "../types/customer";

export function useCustomers() {
  const { auth } = useAuth();

  return useQuery<Customer[]>({
    queryKey: CUSTOMERS_CACHE_KEY,
    queryFn: () => {
      if (!auth.apiKey) throw new Error("No API key available");
      return getCustomers(auth.apiKey);
    },
    enabled: !!auth.apiKey,
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}
