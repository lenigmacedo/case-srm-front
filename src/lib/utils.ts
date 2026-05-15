export const fmtCurrency = (
  value: number | string,
  currency: string,
): string => {
  const n = typeof value === "string" ? parseFloat(value) : value;
  const symbols: Record<string, string> = {
    BRL: "R$",
    USD: "US$",
    EUR: "€",
    GBP: "£",
    ARS: "AR$",
  };
  const symbol = symbols[currency] ?? currency;
  return `${symbol} ${n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const fmtBRL = (value: number | string): string =>
  fmtCurrency(value, "BRL");

export type PillVariant = "ok" | "wn" | "er";

export const pillVariant = (status: string): PillVariant => {
  const ok = ["liquidada", "ativo", "ACTIVE", "active"];
  const wn = ["pendente", "atenção", "MEDIUM", "medium"];
  if (ok.includes(status)) return "ok";
  if (wn.includes(status)) return "wn";
  return "er";
};

export const fmtDate = (iso: string): string =>
  new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

export const fmtPercent = (value: number | string): string => {
  const n = typeof value === "string" ? parseFloat(value) : value;
  return `${n.toFixed(2)}% a.m.`;
};

export const fmtCNPJ = (cnpj: string): string => {
  const d = cnpj.replace(/\D/g, "");
  if (d.length !== 14) return cnpj;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
};

export const stripCNPJ = (cnpj: string): string => cnpj.replace(/\D/g, "");

export const maskCNPJ = (value: string): string => {
  const d = value.replace(/\D/g, "").slice(0, 14);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12)
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
};
