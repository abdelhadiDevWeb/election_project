"use client";
import { useQuery } from "./useApi";
import type { ICandidat } from "@/lib/types";

export function useCandidats(params?: Record<string, unknown>) {
  return useQuery<ICandidat[]>("/candidats", params);
}

export function useCandidat(id: string | null) {
  return useQuery<ICandidat>(id ? `/candidats/${id}` : null);
}
