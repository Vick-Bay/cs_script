import type { AuthResponse } from "../types/auth";
import { getCustomerOrders } from "./dynamics";

export async function authenticate(password: string): Promise<AuthResponse> {
  const response = await fetch("https://csscript.vickramb.workers.dev", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    throw new Error("Authentication failed");
  }

  const data = await response.json();
  console.log("auth data", data);

  // Test orders
  await getCustomerOrders(data, ["C000000996", "C000002098"]);

  return {
    apiKey: data.apiKey,
    access_token: data.access_token,
    expiresAt: data.expiresAt,
  };
}
