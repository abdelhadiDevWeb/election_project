// ────────────────────────────────────────────────────────────────
// Generic data-fetching hooks for the ANIE Electoral System.
// Provides useQuery (GET) and useMutation (POST/PUT/DELETE)
// with loading, error, and refetch capabilities.
// ────────────────────────────────────────────────────────────────

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { api, ApiError } from "@/lib/api";

export interface QueryState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useQuery<T>(
  endpoint: string | null,
  params?: Record<string, unknown>,
  deps: unknown[] = []
): QueryState<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    if (!endpoint) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.get<any>(endpoint, params);
      if (mountedRef.current) {
        // Handle both { ok, data } and direct array responses
        setData(result.data !== undefined ? result.data : result);
      }
    } catch (err: any) {
      if (mountedRef.current) {
        setError(err instanceof ApiError ? err.message : "Failed to fetch data");
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, JSON.stringify(params), ...deps]);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();
    return () => { mountedRef.current = false; };
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

// ── Mutation hook ────────────────────────────────────────────────

export interface MutationState {
  isLoading: boolean;
  error: string | null;
}

export function useMutation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async <T = unknown>(
    method: "POST" | "PUT" | "DELETE",
    endpoint: string,
    body?: unknown,
    options: { isFormData?: boolean } = {}
  ): Promise<T> => {
    setIsLoading(true);
    setError(null);
    try {
      const isFormData = options.isFormData || body instanceof FormData;
      let result: T;
      
      if (method === "DELETE") {
        result = await api.delete<T>(endpoint);
      } else {
        // Use generic request if FormData is detected
        const requestOptions = { method, body, isFormData };
        // We use a small hack here to access the internal request if needed, 
        // but api.post/put already call request. 
        // Let's just update api.post/put in api.ts instead or call api.upload if POST.
        
        // Actually, let's just make api.post/put smarter in api.ts
        if (method === "POST") {
          result = await api.post<T>(endpoint, body, { isFormData });
        } else {
          result = await api.put<T>(endpoint, body, { isFormData });
        }
      }
      return result;
    } catch (err: any) {
      const msg = err instanceof ApiError ? err.message : "Operation failed";
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const upload = useCallback(async <T = unknown>(
    endpoint: string,
    formData: FormData
  ): Promise<T> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.upload<T>(endpoint, formData);
      return result;
    } catch (err: any) {
      const msg = err instanceof ApiError ? err.message : "Upload failed";
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutate, upload, isLoading, error };
}
