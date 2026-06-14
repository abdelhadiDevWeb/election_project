import { useCallback } from "react";
import { useQuery, useMutation } from "./useApi";

export interface ElectionDaySettings {
  is_election_day_open: boolean;
}

export function useSettings() {
  const { data, isLoading, error, refetch } = useQuery<{ ok: boolean; is_election_day_open: boolean }>("/settings/public");
  
  const { mutate, isLoading: isUpdating, error: updateError } = useMutation();

  const updateSettingsAsync = useCallback(async (is_election_day_open: boolean) => {
    try {
      await mutate<{ ok: boolean; data: ElectionDaySettings }>("PUT", "/settings", { is_election_day_open });
      await refetch();
    } catch (err) {
      console.error("Failed to update settings", err);
    }
  }, [mutate, refetch]);

  return {
    data,
    isLoading,
    error,
    updateSettingsAsync,
    isUpdating,
    updateError
  };
}
