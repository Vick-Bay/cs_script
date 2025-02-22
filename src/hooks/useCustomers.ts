import { useQuery } from "@tanstack/react-query";
import { getCustomers, CUSTOMERS_CACHE_KEY } from "../api/customers";
import type { Customer } from "../types/customer";

export function useCustomers() {
  return useQuery<Customer[]>({
    queryKey: CUSTOMERS_CACHE_KEY,
    queryFn: getCustomers,
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: true, // Refetch when window regains focus
    placeholderData: (keepPreviousData) => keepPreviousData, // Show previous data while fetching
  });
}
