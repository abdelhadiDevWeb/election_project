"use client";
import { useQuery } from "./useApi";
import type { IMemberActif } from "@/lib/types";

export function useMembersActif(params?: Record<string, unknown>) {
  return useQuery<IMemberActif[]>("/members-actifs", params);
}

export function useMemberActif(id: string | null) {
  return useQuery<IMemberActif>(id ? `/members-actifs/${id}` : null);
}
