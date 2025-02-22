import { useQuery } from "@tanstack/react-query";
import {
  getProducts,
  getProductByItemNumber,
  getProductsByBranch,
  PRODUCTS_CACHE_KEY,
} from "../api/products";
import { useAuth } from "../context/AuthContext";
import type { Product } from "../types/product";

export function useProducts() {
  const { auth } = useAuth();

  return useQuery<Product[]>({
    queryKey: PRODUCTS_CACHE_KEY,
    queryFn: () => {
      if (!auth.apiKey) throw new Error("No API key available");
      return getProducts(auth.apiKey);
    },
    enabled: !!auth.apiKey,
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });
}

export function useProduct(itemNumber: string) {
  const { auth } = useAuth();

  return useQuery<Product | undefined>({
    queryKey: ["product", itemNumber],
    queryFn: () => {
      if (!auth.apiKey) throw new Error("No API key available");
      return getProductByItemNumber(auth.apiKey, itemNumber);
    },
    enabled: !!itemNumber && !!auth.apiKey,
  });
}

export function useProductsByBranch(branchCode: string) {
  const { auth } = useAuth();

  return useQuery<Product[]>({
    queryKey: ["products", "branch", branchCode],
    queryFn: () => {
      if (!auth.apiKey) throw new Error("No API key available");
      return getProductsByBranch(auth.apiKey, branchCode);
    },
    enabled: !!branchCode && !!auth.apiKey,
  });
}
