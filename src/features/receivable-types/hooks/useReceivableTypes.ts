import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getReceivableTypes,
  createReceivableType,
} from "@/services/api/receivable-types";

export const RECEIVABLE_TYPES_KEY = ["receivable-types"] as const;

export function useReceivableTypes() {
  return useQuery({
    queryKey: RECEIVABLE_TYPES_KEY,
    queryFn: getReceivableTypes,
  });
}

export function useCreateReceivableType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createReceivableType,
    onSuccess: () => qc.invalidateQueries({ queryKey: RECEIVABLE_TYPES_KEY }),
  });
}
