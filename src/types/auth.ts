export type AuthResponse = {
  apiKey: string;
  expiresAt: number;
};

export type AuthState = {
  isAuthenticated: boolean;
  apiKey?: string;
  expiresAt?: number;
};
