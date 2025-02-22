import { useQuery } from "@tanstack/react-query";
import {
  getProducts,
  getProductByItemNumber,
  getProductsByBranch,
  PRODUCTS_CACHE_KEY,
} from "../api/products";
import type { Product } from "../types/product";

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: PRODUCTS_CACHE_KEY,
    queryFn: getProducts,
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: true, // Refetch when window regains focus
    placeholderData: (keepPreviousData) => keepPreviousData, // Show previous data while fetching
  });
}

export function useProduct(itemNumber: string) {
  return useQuery<Product | undefined>({
    queryKey: ["product", itemNumber],
    queryFn: () => getProductByItemNumber(itemNumber),
    enabled: !!itemNumber,
  });
}

export function useProductsByBranch(branchCode: string) {
  return useQuery<Product[]>({
    queryKey: ["products", "branch", branchCode],
    queryFn: () => getProductsByBranch(branchCode),
    enabled: !!branchCode,
  });
}
