import { useState } from "react";
import { Card, Toast, Spinner } from "@/components/ui";
import { useToast } from "@/hooks/useToast";
import {
  useReceivableTypes,
  useCurrencies,
  useCedentes,
  useSimulate,
  useLiquidate,
} from "./hooks/useSimulator";
import { FormSimulacao } from "./components/FormSimulacao";
import { ResultadoSimulacao } from "./components/ResultadoSimulacao";
import type { SimulateRequest, SimulateResponse } from "@/types/api";

const simGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 20,
  alignItems: "start",
};

const emptyBox = {
  background: "#f6f6f4",
  border: "1px solid #e4e4e0",
  borderRadius: 6,
  padding: "40px 16px",
  textAlign: "center" as const,
  fontSize: 13,
  color: "var(--text-muted)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 120,
};

const loadingOverlay = {
  position: "absolute" as const,
  inset: 0,
  backdropFilter: "blur(3px)",
  WebkitBackdropFilter: "blur(3px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 6,
};

const statusMsg = {
  fontSize: 13,
  textAlign: "center" as const,
  padding: "24px 0",
  margin: 0,
};

export function TabSimulador() {
  const {
    data: receivableTypes,
    isLoading: rtLoading,
    isError: rtError,
  } = useReceivableTypes();
  const {
    data: currencies,
    isLoading: currLoading,
    isError: currError,
  } = useCurrencies();
  const {
    data: cedentes,
    isLoading: cedLoading,
    isError: cedError,
  } = useCedentes();
  const { mutate: simulate, isPending: isSimulating } = useSimulate();
  const { mutate: liquidate, isPending: isLiquidating } = useLiquidate();
  const { toast, showToast } = useToast();

  const [resultado, setResultado] = useState<SimulateResponse | null>(null);
  const [lastRequest, setLastRequest] = useState<SimulateRequest | null>(null);
  const [lastCedenteId, setLastCedenteId] = useState("");
  const [formKey, setFormKey] = useState(0);

  const handleSimulate = (data: SimulateRequest) => {
    setLastRequest(data);
    simulate(data, {
      onSuccess: (res) => setResultado(res),
      onError: () =>
        showToast("Erro ao simular. Verifique os dados e tente novamente."),
    });
  };

  const handleLiquidar = () => {
    if (!lastRequest) return;
    if (!lastCedenteId) {
      showToast("Selecione um cedente antes de registrar a transação.");
      return;
    }
    liquidate(
      {
        face_value: lastRequest.face_value,
        term_days: lastRequest.term_days,
        due_date: lastRequest.due_date,
        cedente_id: lastCedenteId,
        receivable_type_id: lastRequest.receivable_type_id,
        origin_currency: lastRequest.origin_currency,
        payment_currency: lastRequest.payment_currency,
      },
      {
        onSuccess: (tx) => {
          showToast(`Transação ${tx.id.slice(0, 8)}… liquidada com sucesso.`);
          setResultado(null);
          setLastRequest(null);
          setLastCedenteId("");
          setFormKey((k) => k + 1);
        },
        onError: () => showToast("Erro ao liquidar. Tente novamente."),
      },
    );
  };

  const isLoading = rtLoading || currLoading || cedLoading;
  const isError = rtError || currError || cedError;
  const formReady = !isLoading && !isError;

  return (
    <>
      <Card title="Simulador de precificação">
        {isLoading && (
          <p style={{ ...statusMsg, color: "var(--text-muted)" }}>
            Carregando…
          </p>
        )}
        {isError && (
          <p style={{ ...statusMsg, color: "var(--pill-er-text)" }}>
            Não foi possível carregar os dados. Verifique o backend.
          </p>
        )}

        {formReady && (
          <div style={simGrid}>
            <FormSimulacao
              key={formKey}
              cedentes={cedentes ?? []}
              receivableTypes={receivableTypes ?? []}
              currencies={currencies ?? []}
              onSimulate={handleSimulate}
              onCedenteChange={setLastCedenteId}
            />

            <div>
              {resultado ? (
                <div style={{ position: "relative" }}>
                  <ResultadoSimulacao
                    resultado={resultado}
                    onLiquidar={handleLiquidar}
                    isLiquidating={isLiquidating}
                  />
                  {isSimulating && (
                    <div style={loadingOverlay}>
                      <Spinner />
                    </div>
                  )}
                </div>
              ) : (
                <div style={emptyBox}>
                  {isSimulating ? (
                    <Spinner />
                  ) : (
                    "Preencha o formulário para ver a simulação."
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </Card>

      {toast && <Toast message={toast} />}
    </>
  );
}
