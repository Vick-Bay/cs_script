import type { AuthResponse } from "../types/auth";

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
  return data;
}
