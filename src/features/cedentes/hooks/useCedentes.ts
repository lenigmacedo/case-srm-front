import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCedentes, createCedente } from "@/services/api/cedentes";

export const CEDENTES_KEY = ["cedentes"] as const;

export function useCedentes() {
  return useQuery({ queryKey: CEDENTES_KEY, queryFn: getCedentes });
}

export function useCreateCedente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCedente,
    onSuccess: () => qc.invalidateQueries({ queryKey: CEDENTES_KEY }),
  });
}
