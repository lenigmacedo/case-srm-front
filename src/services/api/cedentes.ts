import type { Cedente, RiskTier } from "@/types/api";
import client from "./client";

export interface CreateCedenteData {
  cnpj: string;
  name: string;
  risk_tier?: RiskTier;
}

export const getCedentes = async (): Promise<Cedente[]> => {
  const res = await client.get<Cedente[]>("/cedentes");
  return res.data;
};

export const getCedente = async (id: string): Promise<Cedente> => {
  const res = await client.get<Cedente>(`/cedentes/${id}`);
  return res.data;
};

export const createCedente = async (
  data: CreateCedenteData,
): Promise<Cedente> => {
  const res = await client.post<Cedente>("/cedentes", data);
  return res.data;
};
