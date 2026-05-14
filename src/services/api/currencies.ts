import type { Currency } from "@/types/api";
import client from "./client";

export const getCurrencies = async (): Promise<Currency[]> => {
  const res = await client.get<Currency[]>("/currencies");
  return res.data;
};

export const updateCurrencyRate = async (
  code: string,
  rate: number,
): Promise<Currency> => {
  const res = await client.put<Currency>(`/currencies/${code}/rate`, { rate });
  return res.data;
};
