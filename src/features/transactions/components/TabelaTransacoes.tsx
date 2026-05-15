import { Button, Pill, Spinner } from "@/components/ui";
import { fmtCurrency, fmtDate } from "@/lib/utils";
import type { PillVariant } from "@/lib/utils";
import type { StatementResponse } from "@/types/api";

const th = {
  textAlign: "left" as const,
  padding: "8px 10px",
  fontSize: 11,
  textTransform: "uppercase" as const,
  color: "var(--text-muted)",
  fontWeight: 500,
  letterSpacing: "0.04em",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap" as const,
};
const thR = { ...th, textAlign: "right" as const };
const tdBase = { padding: "8px 10px", fontSize: 13 };

const STATUS_LABEL: Record<string, string> = {
  LIQUIDATED: "Liquidada",
  PENDING: "Pendente",
  CANCELLED: "Cancelada",
};

const STATUS_VARIANT: Record<string, PillVariant> = {
  LIQUIDATED: "ok",
  PENDING: "wn",
  CANCELLED: "er",
};

const pagination = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 16,
  fontSize: 12,
  color: "var(--text-muted)",
};

interface Props {
  data: StatementResponse;
  onPageChange: (page: number) => void;
  isFetching: boolean;
}

export function TabelaTransacoes({ data, onPageChange, isFetching }: Props) {
  const { items, total, page, pages, limit } = data;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  if (items.length === 0) {
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
        Nenhuma transação encontrada.
      </p>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      {isFetching && (
        <div
          style={{
            position: "absolute" as const,
            inset: 0,
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          <Spinner />
        </div>
      )}

      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
      >
        <thead>
          <tr>
            <th style={th}>ID</th>
            <th style={th}>Cedente</th>
            <th style={th}>Tipo</th>
            <th style={thR}>Valor face</th>
            <th style={thR}>VP</th>
            <th style={th}>Moeda</th>
            <th style={th}>Vencimento</th>
            <th style={th}>Status</th>
            <th style={th}>Data</th>
          </tr>
        </thead>
        <tbody>
          {items.map((tx, i) => {
            const isLast = i === items.length - 1;
            const td = {
              ...tdBase,
              borderBottom: isLast ? "none" : "1px solid #efefea",
            };
            const isCross = tx.origin_currency !== tx.payment_currency;
            const moeda = isCross
              ? `${tx.origin_currency}→${tx.payment_currency}`
              : tx.payment_currency;

            return (
              <tr key={tx.id}>
                <td
                  style={{
                    ...td,
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--text-muted)",
                  }}
                >
                  {tx.id.slice(0, 8)}…
                </td>
                <td style={td}>{tx.cedente?.name ?? "—"}</td>
                <td
                  style={{
                    ...td,
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                  }}
                >
                  {tx.receivable_type?.code ?? "—"}
                </td>
                <td
                  style={{
                    ...td,
                    textAlign: "right" as const,
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                  }}
                >
                  {fmtCurrency(tx.face_value, tx.origin_currency)}
                </td>
                <td
                  style={{
                    ...td,
                    textAlign: "right" as const,
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                  }}
                >
                  {fmtCurrency(tx.present_value, tx.payment_currency)}
                </td>
                <td
                  style={{
                    ...td,
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                  }}
                >
                  {moeda}
                </td>
                <td style={{ ...td, fontSize: 12 }}>{tx.due_date}</td>
                <td style={td}>
                  <Pill variant={STATUS_VARIANT[tx.status] ?? "wn"}>
                    {STATUS_LABEL[tx.status] ?? tx.status}
                  </Pill>
                </td>
                <td style={{ ...td, fontSize: 12, color: "var(--text-muted)" }}>
                  {fmtDate(tx.created_at)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={pagination}>
        <span>
          {total === 0
            ? "Sem resultados"
            : `Mostrando ${start}–${end} de ${total}`}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Button
            variant="ghost"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            ← Anterior
          </Button>
          <span style={{ minWidth: 80, textAlign: "center" }}>
            Página {page} de {pages}
          </span>
          <Button
            variant="ghost"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= pages}
          >
            Próxima →
          </Button>
        </div>
      </div>
    </div>
  );
}
