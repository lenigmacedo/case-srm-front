import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReceivableTypes } from "@/services/api/receivable-types";
import { getCurrencies } from "@/services/api/currencies";
import { getCedentes } from "@/services/api/cedentes";
import {
  simulateTransaction,
  liquidateTransaction,
} from "@/services/api/transactions";

export function useReceivableTypes() {
  return useQuery({
    queryKey: ["receivable-types"],
    queryFn: getReceivableTypes,
  });
}

export function useCurrencies() {
  return useQuery({ queryKey: ["currencies"], queryFn: getCurrencies });
}

export function useCedentes() {
  return useQuery({ queryKey: ["cedentes"], queryFn: getCedentes });
}

export function useSimulate() {
  return useMutation({ mutationFn: simulateTransaction });
}

export function useLiquidate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: liquidateTransaction,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
  });
}
