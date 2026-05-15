import type { ReceivableType } from "@/types/api";

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
  data: ReceivableType[];
}

export function TabelaReceivableTypes({ data }: Props) {
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
        Nenhum tipo de recebível cadastrado.
      </p>
    );
  }

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr>
          <th style={th}>Código</th>
          <th style={th}>Nome</th>
          <th style={{ ...th, textAlign: "right" as const }}>Spread mensal</th>
        </tr>
      </thead>
      <tbody>
        {data.map((rt, i) => {
          const isLast = i === data.length - 1;
          const td = {
            ...tdBase,
            borderBottom: isLast ? "none" : "1px solid #efefea",
          };
          return (
            <tr key={rt.id}>
              <td
                style={{ ...td, fontFamily: "var(--font-mono)", fontSize: 12 }}
              >
                {rt.code}
              </td>
              <td style={td}>{rt.name}</td>
              <td
                style={{
                  ...td,
                  textAlign: "right" as const,
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                }}
              >
                {(parseFloat(rt.spread_monthly) * 100).toFixed(2)}% a.m.
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
