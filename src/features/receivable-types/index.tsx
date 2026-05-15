import { useState } from "react";
import { Card, Button, Toast } from "@/components/ui";
import { useReceivableTypes } from "./hooks/useReceivableTypes";
import { TabelaReceivableTypes } from "./components/TabelaReceivableTypes";
import { ModalReceivableType } from "./components/ModalReceivableType";
import { useToast } from "@/hooks/useToast";

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12,
};
const titleStyle = { margin: 0, fontSize: 14, fontWeight: 600 };
const statusMsg = {
  fontSize: 13,
  textAlign: "center" as const,
  padding: "24px 0",
  margin: 0,
};

export function TabReceivableTypes() {
  const { data, isLoading, isError } = useReceivableTypes();
  const [showModal, setShowModal] = useState(false);
  const { toast, showToast } = useToast();

  return (
    <>
      <Card>
        <div style={header}>
          <h2 style={titleStyle}>Tipos de recebível</h2>
          <Button variant="ghost" onClick={() => setShowModal(true)}>
            + Cadastrar tipo
          </Button>
        </div>

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

        {data && <TabelaReceivableTypes data={data} />}
      </Card>

      {showModal && (
        <ModalReceivableType
          onClose={() => setShowModal(false)}
          onSuccess={(name) =>
            showToast(`Tipo "${name}" cadastrado com sucesso.`)
          }
        />
      )}

      {toast && <Toast message={toast} />}
    </>
  );
}
