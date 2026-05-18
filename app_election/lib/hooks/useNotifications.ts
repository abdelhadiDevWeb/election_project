"use client";
import { useQuery } from "./useApi";
import type { INotification } from "@/lib/types";

export function useNotifications(params?: Record<string, unknown>) {
  return useQuery<INotification[]>("/notifications", params);
}
