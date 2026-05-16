"use client";
import { useQuery } from "./useApi";
import type { IRoleElectionDay } from "@/lib/types";

export function useRolesElection(params?: Record<string, unknown>) {
  return useQuery<IRoleElectionDay[]>("/roles-election-day", params);
}

export function useRoleElection(id: string | null) {
  return useQuery<IRoleElectionDay>(id ? `/roles-election-day/${id}` : null);
}
