import type { Product, ProductsResponse } from "../types/product";

// Simulating API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getProducts(): Promise<Product[]> {
  await delay(500); // Simulate network delay
  const response = await fetch("/data/products.json");
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
