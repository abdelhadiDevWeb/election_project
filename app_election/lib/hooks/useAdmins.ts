"use client";
import { useQuery } from "./useApi";
import type { IAdminWilaya, IAdminCommun, ISuperAdmin } from "@/lib/types";

export function useAdminWilayas(params?: Record<string, unknown>) {
  return useQuery<IAdminWilaya[]>("/admin-wilayas", params);
}

export function useAdminCommuns(params?: Record<string, unknown>) {
  return useQuery<IAdminCommun[]>("/admin-communs", params);
}

export function useSuperAdmins(params?: Record<string, unknown>) {
  return useQuery<ISuperAdmin[]>("/super-admins", params);
}
