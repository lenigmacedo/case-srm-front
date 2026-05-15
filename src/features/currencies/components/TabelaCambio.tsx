import { Button } from "@/components/ui";
import { fmtDate } from "@/lib/utils";
import type { Currency } from "@/types/api";

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
  data: Currency[];
  onEdit: (currency: Currency) => void;
}

export function TabelaCambio({ data, onEdit }: Props) {
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
        Nenhuma moeda cadastrada.
      </p>
    );
  }

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr>
          <th style={th}>Moeda</th>
          <th style={th}>Taxa (→ BRL)</th>
          <th style={th}>Última atualização</th>
          <th style={th} />
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
            <tr key={c.code}>
              <td
                style={{
                  ...tdRow,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                }}
              >
                {c.code}
              </td>
              <td style={{ ...tdRow, fontFamily: "var(--font-mono)" }}>
                R$ {parseFloat(c.rate_to_brl).toFixed(4)}
              </td>
              <td style={{ ...tdRow, color: "var(--text-muted)" }}>
                {fmtDate(c.updated_at)}
              </td>
              <td style={{ ...tdRow, textAlign: "right" }}>
                <Button variant="ghost" onClick={() => onEdit(c)}>
                  Editar
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
