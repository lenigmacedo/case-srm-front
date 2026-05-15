import { Button } from "@/components/ui";
import { fmtCurrency } from "@/lib/utils";
import type { SimulateResponse } from "@/types/api";

const resultBox = {
  background: "#f6f6f4",
  border: "1px solid #e4e4e0",
  borderRadius: 6,
  padding: 16,
};

const resultLabel = {
  fontSize: 11,
  color: "#888",
  textTransform: "uppercase" as const,
  letterSpacing: "0.04em",
  marginBottom: 4,
};

const resultValue = {
  fontSize: 28,
  fontWeight: 600,
  fontFamily: "var(--font-mono)",
};

const cL = {
  padding: "6px 0",
  borderBottom: "1px dashed #e4e4e0",
  fontSize: 12,
  color: "#888",
};
const cR = {
  padding: "6px 0",
  borderBottom: "1px dashed #e4e4e0",
  fontSize: 12,
  textAlign: "right" as const,
  fontFamily: "var(--font-mono)",
};
const cLastL = { padding: "10px 0 4px", fontSize: 12, fontWeight: 600 };
const cLastR = {
  padding: "10px 0 4px",
  fontSize: 12,
  fontWeight: 600,
  textAlign: "right" as const,
  fontFamily: "var(--font-mono)",
};

const fmtRate = (v: string) => `${(parseFloat(v) * 100).toFixed(2)}% a.m.`;

interface Props {
  resultado: SimulateResponse;
  onLiquidar: () => void;
  isLiquidating: boolean;
}

export function ResultadoSimulacao({
  resultado,
  onLiquidar,
  isLiquidating,
}: Props) {
  const isCrossCurrency = resultado.fx_rate !== null;
  const prazoMeses = (resultado.term_days / 30).toFixed(2);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={resultBox}>
        <div style={resultLabel}>Valor presente líquido</div>
        <div style={resultValue}>
          {fmtCurrency(resultado.present_value_brl, resultado.origin_currency)}
        </div>

        <table
          style={{ width: "100%", marginTop: 16, borderCollapse: "collapse" }}
        >
          <tbody>
            <tr>
              <td style={cL}>Valor de face</td>
              <td style={cR}>
                {fmtCurrency(resultado.face_value, resultado.origin_currency)}
              </td>
            </tr>
            <tr>
              <td style={cL}>Taxa base</td>
              <td style={cR}>{fmtRate(resultado.base_rate_monthly)}</td>
            </tr>
            <tr>
              <td style={cL}>Spread</td>
              <td style={cR}>{fmtRate(resultado.spread_monthly)}</td>
            </tr>
            <tr>
              <td style={cL}>Prazo</td>
              <td style={cR}>
                {resultado.term_days}d ({prazoMeses} meses)
              </td>
            </tr>
            <tr>
              <td style={cL}>Deságio</td>
              <td style={cR}>
                −
                {fmtCurrency(
                  resultado.discount_amount,
                  resultado.origin_currency,
                )}
              </td>
            </tr>
            {isCrossCurrency && (
              <>
                <tr>
                  <td style={cL}>Taxa câmbio</td>
                  <td style={cR}>
                    1 {resultado.origin_currency} ={" "}
                    {parseFloat(resultado.fx_rate!).toFixed(4)}{" "}
                    {resultado.payment_currency}
                  </td>
                </tr>
                <tr>
                  <td style={cL}>VP em {resultado.payment_currency}</td>
                  <td style={cR}>
                    {fmtCurrency(
                      resultado.present_value,
                      resultado.payment_currency,
                    )}
                  </td>
                </tr>
              </>
            )}
            <tr>
              <td style={cLastL}>Valor presente</td>
              <td style={cLastR}>
                {isCrossCurrency
                  ? fmtCurrency(
                      resultado.present_value,
                      resultado.payment_currency,
                    )
                  : fmtCurrency(
                      resultado.present_value_brl,
                      resultado.origin_currency,
                    )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={onLiquidar} disabled={isLiquidating}>
          {isLiquidating ? "Liquidando…" : "Registrar transação"}
        </Button>
      </div>
    </div>
  );
}
