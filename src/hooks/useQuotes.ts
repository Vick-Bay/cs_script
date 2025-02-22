import { useQuery } from "@tanstack/react-query";
import { getQuotes, QUOTES_CACHE_KEY } from "../api/quotes";
import type { Quote } from "../types/quote";

export function useQuotes() {
  return useQuery<Quote[]>({
    queryKey: QUOTES_CACHE_KEY,
    queryFn: getQuotes,
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: true, // Refetch when window regains focus
    placeholderData: (keepPreviousData) => keepPreviousData, // Show previous data while fetching
  });
}

export function useQuoteById(quoteId: string) {
  return useQuery({
    queryKey: ["quote", quoteId],
    queryFn: () => getQuoteById(quoteId),
    enabled: !!quoteId,
  });
}

export function useQuotesByCustomerId(customerId: string) {
  return useQuery({
    queryKey: ["quotes", "customer", customerId],
    queryFn: () => getQuotesByCustomerId(customerId),
    enabled: !!customerId,
  });
}
