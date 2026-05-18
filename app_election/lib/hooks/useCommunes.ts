"use client";
import { useQuery } from "./useApi";
import type { ICommune } from "@/lib/types";

export function useCommunes(params?: Record<string, unknown>) {
  return useQuery<ICommune[]>("/communes", params);
}

export function useCommune(id: string | null) {
  return useQuery<ICommune>(id ? `/communes/${id}` : null);
}
