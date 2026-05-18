"use client";
import { useQuery } from "./useApi";
import type { IDesk } from "@/lib/types";

export function useDesks(params?: Record<string, unknown>) {
  return useQuery<IDesk[]>("/desks", params);
}

export function useDesk(id: string | null) {
  return useQuery<IDesk>(id ? `/desks/${id}` : null);
}
