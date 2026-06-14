// ────────────────────────────────────────────────────────────────
// Central API client for the Election Day Observer Dashboard.
// Handles JWT token management, auto-refresh, and typed requests.
// ────────────────────────────────────────────────────────────────

import type { LoginResponse, RefreshResponse, ApiResponse } from "./types";

const BASE_URL = "/api";
const TOKEN_KEY = "pvp_observer_token";

let accessToken: string | null = (typeof window !== "undefined") ? localStorage.getItem(TOKEN_KEY) : null;
let refreshPromise: Promise<string | null> | null = null;

// ── Token management ────────────────────────────────────────────

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (typeof window !== "undefined") {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }
}

export function getAccessToken(): string | null {
  return accessToken;
}

// ── Core fetch wrapper ──────────────────────────────────────────

async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      accessToken = null;
      return null;
    }
    const data: RefreshResponse = await res.json();
    if (data.ok && data.accessToken) {
      accessToken = data.accessToken;
      return data.accessToken;
    }
    return null;
  } catch {
    accessToken = null;
    return null;
  }
}

async function ensureToken(): Promise<string | null> {
  if (accessToken) return accessToken;
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export class ApiError extends Error {
  status: number;
  response: unknown;
  constructor(message: string, status: number, response?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.response = response;
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  isFormData?: boolean;
  noAuth?: boolean;
}

async function request<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, isFormData = false, noAuth = false } = options;
  const headers: Record<string, string> = { ...options.headers };

  if (!noAuth) {
    const token = await ensureToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  if (!isFormData && body) {
    headers["Content-Type"] = "application/json";
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
    credentials: "include",
  };

  if (body) {
    fetchOptions.body = isFormData ? (body as FormData) : JSON.stringify(body);
  }

  let res = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);

  // Auto-refresh on 401 and retry once
  if (res.status === 401 && !noAuth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      fetchOptions.headers = headers;
      res = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);
    }
  }

  // Redirect to login on final 401
  if (res.status === 401 && !noAuth) {
    accessToken = null;
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
      window.location.href = "/login";
    }
    throw new ApiError("Session expired", 401);
  }

  if (!res.ok) {
    let errorMessage = `Request failed (${res.status})`;
    let errorBody: unknown = null;
    try {
      errorBody = await res.json();
      const eb = errorBody as { details?: string[]; message?: string };
      if (Array.isArray(eb?.details) && eb.details.length > 0) {
        errorMessage = eb.details.join(" · ");
      } else if (eb?.message) {
        errorMessage = eb.message;
      }
    } catch { /* ignore parse error */ }
    throw new ApiError(errorMessage, res.status, errorBody);
  }

  if (res.status === 204) return {} as T;

  return res.json() as Promise<T>;
}

// ── Typed HTTP methods ──────────────────────────────────────────

export const api = {
  get<T = unknown>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.set(key, String(value));
        }
      });
      const qs = searchParams.toString();
      if (qs) url += `?${qs}`;
    }
    return request<T>(url);
  },

  post<T = unknown>(endpoint: string, body?: unknown, options: Partial<RequestOptions> = {}): Promise<T> {
    return request<T>(endpoint, { method: "POST", body, ...options });
  },

  put<T = unknown>(endpoint: string, body?: unknown, options: Partial<RequestOptions> = {}): Promise<T> {
    return request<T>(endpoint, { method: "PUT", body, ...options });
  },

  delete<T = unknown>(endpoint: string): Promise<T> {
    return request<T>(endpoint, { method: "DELETE" });
  },

  upload<T = unknown>(endpoint: string, formData: FormData): Promise<T> {
    return request<T>(endpoint, { method: "POST", body: formData, isFormData: true });
  },

  // Auth endpoints
  login(email: string, password: string): Promise<LoginResponse> {
    return request<LoginResponse>("/auth/login", {
      method: "POST",
      body: { email, password },
      noAuth: true,
    });
  },

  logout(): Promise<ApiResponse> {
    return request<ApiResponse>("/auth/logout", { method: "POST" });
  },

  me(): Promise<{ ok: boolean; user: Record<string, unknown> }> {
    return request("/auth/me");
  },

  // Observer Centre
  getCentreResults(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{ ok: boolean; data: any[]; total: number; page: number; limit: number; totalPages: number }> {
    return api.get("/observer/centre-results", params as Record<string, unknown>);
  },

  getDeskImageUrl(resultId: string): string {
    const token = getAccessToken() || "";
    return `/api/results/desk/${resultId}/image?token=${token}`;
  },
};
