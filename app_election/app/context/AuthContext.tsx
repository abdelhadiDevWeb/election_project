"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { api, setAccessToken, getAccessToken } from "@/lib/api";
import type { AuthUser } from "@/lib/types";

// ────────────────────────────────────────────────────────────────
// AuthContext — JWT authentication provider for the ANIE system.
// Manages login, logout, token refresh, and user state.
// ────────────────────────────────────────────────────────────────

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Try to restore session on mount (via refresh token cookie)
  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      try {
        // If we have no access token, try refreshing
        if (!getAccessToken()) {
          const refreshRes = await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          });
          if (refreshRes.ok) {
            const data = await refreshRes.json();
            if (data.ok && data.accessToken) {
              setAccessToken(data.accessToken);
            }
          }
        }

        // If we now have a token, fetch user profile
        if (getAccessToken()) {
          const meRes = await api.me();
          if (!cancelled && meRes.ok && meRes.user) {
            setUser(meRes.user);
          }
        }
      } catch {
        // No valid session — that's fine
        setAccessToken(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    restoreSession();
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.login(email, password);
      if (result.ok && result.accessToken) {
        setAccessToken(result.accessToken);
        setUser(result.user);
      } else {
        throw new Error("Login failed");
      }
    } catch (err: any) {
      const message = err?.message || "An error occurred during login";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch {
      // Ignore errors during logout
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
