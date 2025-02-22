import { useQuery } from "@tanstack/react-query";
import {
  getProducts,
  getProductByItemNumber,
  getProductsByBranch,
} from "../api/products";
import type { Product } from "../types/product";

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts,
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
