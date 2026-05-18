"use client";
import { useQuery } from "./useApi";
import type { IResultDesk, IResultCenter, AggregateResponse } from "@/lib/types";

export function useResultsDesk(params?: Record<string, unknown>) {
  return useQuery<IResultDesk[]>("/results/desk", params);
}

export function useResultDesk(id: string | null) {
  return useQuery<IResultDesk>(id ? `/results/desk/${id}` : null);
}

export function useResultsCenter(params?: Record<string, unknown>) {
  return useQuery<IResultCenter[]>("/results/center", params);
}

export function useAggregateByCenter(centerId: string | null) {
  return useQuery<AggregateResponse>(centerId ? `/results/aggregate/center/${centerId}` : null);
}

export function useAggregateByWilaya(wilayaId: string | null) {
  return useQuery<AggregateResponse>(wilayaId ? `/results/aggregate/wilaya/${wilayaId}` : null);
}

export function useAggregateNational() {
  return useQuery<AggregateResponse>("/results/aggregate/national");
}
