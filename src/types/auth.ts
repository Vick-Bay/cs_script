export type AuthResponse = {
  access_token: string;
};

export type TokenResponse = {
  token_type: string;
  expires_in: string;
  ext_expires_in: string;
  expires_on: string;
  not_before: string;
  resource: string;
  access_token: string;
};

export type AuthState = {
  isAuthenticated: boolean;
  apiKey?: string;
  expiresAt?: number;
  clientId?: string;
  clientSecret?: string;
  resource?: string;
  access_token?: string;
};
