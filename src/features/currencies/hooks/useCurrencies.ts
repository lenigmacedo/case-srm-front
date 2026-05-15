import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrencies, updateCurrencyRate } from "@/services/api/currencies";

export const CURRENCIES_KEY = ["currencies"] as const;

export function useCurrencies() {
  return useQuery({ queryKey: CURRENCIES_KEY, queryFn: getCurrencies });
}

export function useUpdateCurrencyRate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ code, rate }: { code: string; rate: string }) =>
      updateCurrencyRate(code, rate),
    onSuccess: () => qc.invalidateQueries({ queryKey: CURRENCIES_KEY }),
  });
}
