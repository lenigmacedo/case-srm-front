import type {
  SimulateRequest,
  SimulateResponse,
  LiquidateRequest,
  Transaction,
  StatementFilter,
  StatementResponse,
} from "@/types/api";
import client from "./client";

export const simulateTransaction = async (
  data: SimulateRequest,
): Promise<SimulateResponse> => {
  const res = await client.post<SimulateResponse>(
    "/transactions/simulate",
    data,
  );
  return res.data;
};

export const liquidateTransaction = async (
  data: LiquidateRequest,
): Promise<Transaction> => {
  const res = await client.post<Transaction>("/transactions/liquidate", data);
  return res.data;
};

export const getStatement = async (
  filter: StatementFilter = {},
): Promise<StatementResponse> => {
  const res = await client.get<StatementResponse>("/transactions/statement", {
    params: filter,
  });
  return res.data;
};
