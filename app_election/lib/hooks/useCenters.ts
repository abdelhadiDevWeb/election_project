"use client";
import { useQuery } from "./useApi";
import type { ICenter } from "@/lib/types";

export function useCenters(params?: Record<string, unknown>) {
  return useQuery<ICenter[]>("/centers", params);
}

export function useCenter(id: string | null) {
  return useQuery<ICenter>(id ? `/centers/${id}` : null);
}
