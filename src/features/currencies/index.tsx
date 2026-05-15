import { useState } from "react";
import { Card, Toast } from "@/components/ui";
import { useCurrencies } from "./hooks/useCurrencies";
import { TabelaCambio } from "./components/TabelaCambio";
import { ModalEditarTaxa } from "./components/ModalEditarTaxa";
import { useToast } from "@/hooks/useToast";
import type { Currency } from "@/types/api";

const statusMsg = {
  fontSize: 13,
  textAlign: "center" as const,
  padding: "24px 0",
  margin: 0,
};

export function TabCambio() {
  const { data, isLoading, isError } = useCurrencies();
  const [editing, setEditing] = useState<Currency | null>(null);
  const { toast, showToast } = useToast();

  return (
    <>
      <Card title="Taxas de câmbio">
        {isLoading && (
          <p style={{ ...statusMsg, color: "var(--text-muted)" }}>
            Carregando…
          </p>
        )}

        {isError && (
          <p style={{ ...statusMsg, color: "var(--pill-er-text)" }}>
            Não foi possível carregar as taxas. Verifique se o backend está
            rodando.
          </p>
        )}

        {data && <TabelaCambio data={data} onEdit={setEditing} />}
      </Card>

      {editing && (
        <ModalEditarTaxa
          currency={editing}
          onClose={() => setEditing(null)}
          onSuccess={() => {
            showToast(`Taxa de ${editing.code} atualizada com sucesso.`);
            setEditing(null);
          }}
        />
      )}

      {toast && <Toast message={toast} />}
    </>
  );
}
