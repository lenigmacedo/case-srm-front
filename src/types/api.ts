export type RiskTier = "LOW" | "MEDIUM" | "HIGH";

export interface Cedente {
  id: string;
  cnpj: string;
  name: string;
  risk_tier: RiskTier;
  created_at: string;
}

export interface Currency {
  code: string;
  rate_to_brl: string;
  updated_at: string;
}

export interface ReceivableType {
  id: string;
  code: string;
  name: string;
  spread_monthly: string;
}

export interface Transaction {
  id: string;
  face_value: string;
  present_value: string;
  origin_currency: string;
  payment_currency: string;
  term_days: number;
  due_date: string;
  status: string;
  created_at: string;
  cedente?: Cedente;
  receivable_type?: ReceivableType;
}

export interface SimulateRequest {
  face_value: string;
  term_days: number;
  due_date: string;
  receivable_type_id: string;
  origin_currency?: string;
  payment_currency?: string;
}

export interface SimulateResponse {
  face_value: string;
  present_value: string;
  present_value_converted: string;
  spread_monthly: string;
  base_rate: string;
  discount_factor: string;
  discount_amount: string;
  fx_rate: string;
  origin_currency: string;
  payment_currency: string;
}

export interface LiquidateRequest {
  face_value: string;
  term_days: number;
  due_date: string;
  cedente_id: string;
  receivable_type_id: string;
  origin_currency?: string;
  payment_currency?: string;
}

export interface StatementFilter {
  cedente_id?: string;
  currency?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface StatementResponse {
  data: Transaction[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiError {
  statusCode: number;
  error: string;
  message: string;
  traceId?: string;
}
