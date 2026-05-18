"use client";
import { useQuery } from "./useApi";
import type { IParty } from "@/lib/types";

export function useParties(params?: Record<string, unknown>) {
  return useQuery<IParty[]>("/parties", params);
}

export function useParty(id: string | null) {
  return useQuery<IParty>(id ? `/parties/${id}` : null);
}
