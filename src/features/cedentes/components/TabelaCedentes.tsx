import { Pill } from "@/components/ui";
import { fmtCNPJ } from "@/lib/utils";
import type { Cedente, RiskTier } from "@/types/api";

const TIER_LABEL: Record<RiskTier, string> = {
  LOW: "Baixo",
  MEDIUM: "Médio",
  HIGH: "Alto",
};

const tierVariant = (tier: RiskTier) => {
  if (tier === "LOW") return "ok" as const;
  if (tier === "MEDIUM") return "wn" as const;
  return "er" as const;
};

const th = {
  textAlign: "left" as const,
  padding: "8px 10px",
  fontSize: 11,
  textTransform: "uppercase" as const,
  color: "var(--text-muted)",
  fontWeight: 500,
  letterSpacing: "0.04em",
  borderBottom: "1px solid var(--border)",
};

const tdBase = { padding: "8px 10px", fontSize: 13 };

interface Props {
  data: Cedente[];
}

export function TabelaCedentes({ data }: Props) {
  if (data.length === 0) {
    return (
      <p
        style={{
          fontSize: 13,
          textAlign: "center",
          color: "var(--text-muted)",
          padding: "28px 0",
          margin: 0,
        }}
      >
        Nenhum cedente cadastrado.
      </p>
    );
  }

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr>
          <th style={th}>ID</th>
          <th style={th}>Razão social</th>
          <th style={th}>CNPJ</th>
          <th style={th}>Risco</th>
        </tr>
      </thead>
      <tbody>
        {data.map((c, i) => {
          const isLast = i === data.length - 1;
          const tdRow = {
            ...tdBase,
            borderBottom: isLast ? "none" : "1px solid #efefea",
          };
          return (
            <tr key={c.id}>
              <td
                style={{
                  ...tdRow,
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                }}
              >
                {c.id.slice(0, 8)}…
              </td>
              <td style={tdRow}>{c.name}</td>
              <td
                style={{
                  ...tdRow,
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                }}
              >
                {fmtCNPJ(c.cnpj)}
              </td>
              <td style={tdRow}>
                <Pill variant={tierVariant(c.risk_tier)}>
                  {TIER_LABEL[c.risk_tier]}
                </Pill>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
