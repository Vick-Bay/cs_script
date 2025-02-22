import type { Product, ProductsResponse } from "../types/product";

// Cache key for products
export const PRODUCTS_CACHE_KEY = ["products"] as const;

// Simulating API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(
    "https://prod-19.centralus.logic.azure.com/workflows/0e4953b745d04b13973d5d6652dc99d7/triggers/manual/paths/invoke/products?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=mUwBbcwCRWjaYCvpfr5uydn47aoRQxAAcZmim1oNmZU"
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data: ProductsResponse = await response.json();
  return data.Products || [];
}

export async function getProductByItemNumber(
  itemNumber: string
): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p: Product) => p.ItemNumber === itemNumber);
}

export async function getProductsByBranch(
  branchCode: string
): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p: Product) =>
    p.Branches.some((b: { Branch: string }) => b.Branch === branchCode)
  );
}

// New helper functions for dashboard
export async function getProductStats() {
  const products = await getProducts();

  // Filter out products with zero price or no quantity
  const activeProducts = products.filter(
    (p: Product) =>
      p.ListPrice > 0 &&
      p.Branches.some((b: { Quantity: number }) => b.Quantity > 0)
  );

  return {
    totalProducts: activeProducts.length,
    activeProducts,
    branchCodes: [
      ...new Set(
        activeProducts.flatMap((p: Product) =>
          p.Branches.map((b: { Branch: string }) => b.Branch)
        )
      ),
    ],
    metalFinishes: [
      ...new Set(
        activeProducts.map((p: Product) => p.MetalFinish).filter(Boolean)
      ),
    ],
    productTypes: [
      ...new Set(
        activeProducts.map((p: Product) => p.ProductType).filter(Boolean)
      ),
    ],
  };
}
