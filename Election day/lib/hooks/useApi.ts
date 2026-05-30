"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "@/lib/api";

// ── useQuery ────────────────────────────────────────────────────
export function useQuery<T = unknown>(
  endpoint: string | null,
  params?: Record<string, unknown>,
  deps: unknown[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(!!endpoint);
  const [error, setError] = useState<string | null>(null);
  const cancelRef = useRef(false);

  const fetchData = useCallback(async () => {
    if (!endpoint) {
      setData(null);
      setIsLoading(false);
      return;
    }
    cancelRef.current = false;
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get<{ ok: boolean; data: T }>(endpoint, params);
      if (!cancelRef.current) {
        setData((res as { data: T }).data ?? (res as unknown as T));
      }
    } catch (err: unknown) {
      if (!cancelRef.current) {
        setError(err instanceof Error ? err.message : "Fetch error");
      }
    } finally {
      if (!cancelRef.current) setIsLoading(false);
    }
  }, [endpoint, JSON.stringify(params), ...deps]);

  useEffect(() => {
    void fetchData();
    return () => { cancelRef.current = true; };
  }, [fetchData]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch, setData };
}

// ── useMutation ─────────────────────────────────────────────────
export function useMutation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async <T = unknown>(
      method: "POST" | "PUT" | "DELETE",
      endpoint: string,
      body?: unknown
    ): Promise<T> => {
      setIsLoading(true);
      setError(null);
      try {
        let result: T;
        if (method === "POST") result = await api.post<T>(endpoint, body);
        else if (method === "PUT") result = await api.put<T>(endpoint, body);
        else result = await api.delete<T>(endpoint);
        return result;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Mutation failed";
        setError(msg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { mutate, isLoading, error };
}
