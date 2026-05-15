import { useState } from "react";
import { Card, Button, Toast } from "@/components/ui";
import { useCedentes } from "./hooks/useCedentes";
import { ModalCedente } from "./components/ModalCedente";
import { TabelaCedentes } from "./components/TabelaCedentes";
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

export function TabCedentes() {
  const { data, isLoading, isError } = useCedentes();
  const [showModal, setShowModal] = useState(false);
  const { toast, showToast } = useToast();

  return (
    <>
      <Card>
        <div style={header}>
          <h2 style={titleStyle}>Cedentes cadastrados</h2>
          <Button variant="ghost" onClick={() => setShowModal(true)}>
            + Cadastrar cedente
          </Button>
        </div>

        {isLoading && (
          <p style={{ ...statusMsg, color: "var(--text-muted)" }}>
            Carregando…
          </p>
        )}

        {isError && (
          <p style={{ ...statusMsg, color: "var(--pill-er-text)" }}>
            Não foi possível carregar os cedentes. Verifique se o backend está
            rodando.
          </p>
        )}

        {data && <TabelaCedentes data={data} />}
      </Card>

      {showModal && (
        <ModalCedente
          onClose={() => setShowModal(false)}
          onSuccess={(name) =>
            showToast(`Cedente "${name}" cadastrado com sucesso.`)
          }
        />
      )}

      {toast && <Toast message={toast} />}
    </>
  );
}
