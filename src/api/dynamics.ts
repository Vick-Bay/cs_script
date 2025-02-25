import type { AuthResponse } from "../types/auth";

export async function getCustomerOrders(
  auth: AuthResponse,
  customerCodes: string[] = ["C000000996", "C000002098"]
) {
  const response = await fetch("https://csscript.vickramb.workers.dev/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: auth.access_token,
      customerCodes,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get orders");
  }

  return response.json();
}
