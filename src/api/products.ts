import type { Product, ProductsResponse } from "../types/product";

// Cache key for products
export const PRODUCTS_CACHE_KEY = ["products"] as const;

export async function getProducts(apiKey: string): Promise<Product[]> {
  try {
    const response = await fetch(
      `https://prod-19.centralus.logic.azure.com/workflows/0e4953b745d04b13973d5d6652dc99d7/triggers/manual/paths/invoke/products?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=${apiKey}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ProductsResponse = await response.json();
    return data.Products || [];
  } catch (error) {
    throw error;
  }
}

export async function getProductByItemNumber(
  apiKey: string,
  itemNumber: string
): Promise<Product | undefined> {
  const products = await getProducts(apiKey);
  return products.find((p) => p.ItemNumber === itemNumber);
}

export async function getProductsByBranch(
  apiKey: string,
  branchCode: string
): Promise<Product[]> {
  const products = await getProducts(apiKey);
  return products.filter((p) =>
    p.Branches.some((b) => b.Branch === branchCode)
  );
}
