"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { api, setAccessToken, getAccessToken } from "@/lib/api";
import { normalizeAuthUser, isDashboardUser } from "@/lib/auth-user";
import type { AuthUser } from "@/lib/types";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    full_name: string;
    email: string;
    password: string;
    phone: string;
    nin: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      try {
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

        if (getAccessToken()) {
          const meRes = await api.me();
          if (!cancelled && meRes.ok && meRes.user) {
            const normalized = normalizeAuthUser(meRes.user as any);
            setUser(normalized);
          }
        }
      } catch {
        setAccessToken(null);
        setUser(null);
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
      if (result.ok && result.accessToken && result.user) {
        const normalized = normalizeAuthUser(result.user as unknown as Record<string, unknown>);
        if (!normalized) {
          throw new Error("This account is not authorized for dashboard access");
        }
        setAccessToken(result.accessToken);
        setUser(normalized);
      } else {
        throw new Error("Login failed");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred during login";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: {
    full_name: string;
    email: string;
    password: string;
    phone: string;
    nin: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.registerSuperAdmin(data);
      if (result.ok && result.accessToken && result.user) {
        const normalized = normalizeAuthUser(result.user as unknown as Record<string, unknown>);
        if (!normalized) {
          throw new Error("Registration succeeded but account is not authorized for dashboard access");
        }
        setAccessToken(result.accessToken);
        setUser(normalized);
      } else {
        throw new Error("Registration failed");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred during registration";
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

  const refreshUser = useCallback(async () => {
    const meRes = await api.me();
    if (meRes.ok && meRes.user) {
      const normalized = normalizeAuthUser(meRes.user as unknown as Record<string, unknown>);
      setUser(normalized);
    }
  }, []);

  const setUserState = useCallback((next: AuthUser | null) => {
    setUser(next);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: isDashboardUser(user),
        isLoading,
        error,
        login,
        register,
        logout,
        refreshUser,
        setUser: setUserState,
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
