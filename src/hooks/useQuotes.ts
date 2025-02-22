import { useQuery } from "@tanstack/react-query";
import {
  getQuotes,
  getQuoteById,
  getQuotesByCustomerId,
  QUOTES_CACHE_KEY,
} from "../api/quotes";
import { useAuth } from "../context/AuthContext";
import type { Quote } from "../types/quote";

export function useQuotes() {
  const { auth } = useAuth();

  return useQuery<Quote[]>({
    queryKey: QUOTES_CACHE_KEY,
    queryFn: () => {
      if (!auth.apiKey) throw new Error("No API key available");
      return getQuotes(auth.apiKey);
    },
    enabled: !!auth.apiKey,
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: true, // Refetch when window regains focus
    placeholderData: (keepPreviousData) => keepPreviousData, // Show previous data while fetching
  });
}

export function useQuoteById(quoteId: string) {
  const { auth } = useAuth();

  return useQuery<Quote | undefined>({
    queryKey: ["quote", quoteId],
    queryFn: () => {
      if (!auth.apiKey) throw new Error("No API key available");
      return getQuoteById(auth.apiKey, quoteId);
    },
    enabled: !!quoteId && !!auth.apiKey,
  });
}

export function useQuotesByCustomerId(customerId: string) {
  const { auth } = useAuth();

  return useQuery<Quote[]>({
    queryKey: ["quotes", "customer", customerId],
    queryFn: () => {
      if (!auth.apiKey) throw new Error("No API key available");
      return getQuotesByCustomerId(auth.apiKey, customerId);
    },
    enabled: !!customerId && !!auth.apiKey,
  });
}
