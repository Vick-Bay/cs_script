import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import type { AuthState } from "../types/auth";

const AuthContext = createContext<{
  auth: AuthState;
  login: (apiKey: string, expiresAt: number, access_token: string) => void;
  logout: () => void;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.expiresAt > Date.now()) {
        return parsed;
      }
    }
    return { isAuthenticated: false };
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (auth.expiresAt && auth.expiresAt < Date.now()) {
      logout();
    }
  }, [auth.expiresAt]);

  const login = (apiKey: string, expiresAt: number, access_token: string) => {
    const authState = {
      isAuthenticated: true,
      apiKey,
      expiresAt,
      access_token,
    };
    setAuth(authState);
    localStorage.setItem("auth", JSON.stringify(authState));
  };

  const logout = () => {
    setAuth({ isAuthenticated: false });
    localStorage.removeItem("auth");
    // Clear all React Query caches
    queryClient.clear();
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
