"use client";
import { useQuery } from "./useApi";
import type { IAdmin } from "@/lib/types";

export function useAdmins(params?: Record<string, unknown>) {
  return useQuery<IAdmin[]>("/admins", params);
}

export function useAdmin(id: string | null) {
  return useQuery<IAdmin>(id ? `/admins/${id}` : null);
}
