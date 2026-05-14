import type { ReceivableType } from "@/types/api";
import client from "./client";

export interface CreateReceivableTypeData {
  code: string;
  name: string;
  spread_monthly: number;
}

export const getReceivableTypes = async (): Promise<ReceivableType[]> => {
  const res = await client.get<ReceivableType[]>("/receivable-types");
  return res.data;
};

export const getReceivableType = async (
  id: string,
): Promise<ReceivableType> => {
  const res = await client.get<ReceivableType>(`/receivable-types/${id}`);
  return res.data;
};

export const createReceivableType = async (
  data: CreateReceivableTypeData,
): Promise<ReceivableType> => {
  const res = await client.post<ReceivableType>("/receivable-types", data);
  return res.data;
};
