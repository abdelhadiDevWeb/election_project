"use client";
import { useQuery } from "./useApi";
import type { IWilaya, ICommune } from "@/lib/types";

export function useWilayas() {
  return useQuery<IWilaya[]>("/wilayas");
}

export function useWilaya(id: string | null) {
  return useQuery<IWilaya>(id ? `/wilayas/${id}` : null);
}

export function useWilayaCommunes(wilayaId: string | null) {
  return useQuery<ICommune[]>(wilayaId ? `/wilayas/${wilayaId}/communes` : null);
}
