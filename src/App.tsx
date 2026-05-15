import { useState } from "react";
import { AppLayout, type TabId } from "@/components/layout/AppLayout";
import { useToast } from "@/hooks/useToast";
import { TabTransacoes } from "@/features/transactions";
import { TabCedentes } from "@/features/cedentes";
import { TabCambio } from "@/features/currencies";
import { TabSimulador } from "@/features/simulator";

function App() {
  const [activeTab, setActiveTab] = useState<TabId>("transacoes");
  const [showReceivableModal, setShowReceivableModal] = useState(false);
  const { toast, showToast } = useToast();

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onOpenReceivableModal={() => setShowReceivableModal(true)}
      toast={toast}
    >
      {activeTab === "transacoes" && <TabTransacoes />}
      {activeTab === "cedentes" && <TabCedentes />}
      {activeTab === "cambio" && <TabCambio />}
      {activeTab === "simulador" && <TabSimulador />}

      {showReceivableModal && (
        <div
          onClick={() => setShowReceivableModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "grid",
            placeItems: "center",
            zIndex: 50,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 8,
              padding: 20,
              maxWidth: 400,
              width: "100%",
            }}
          >
            <h2 style={{ margin: "0 0 12px", fontSize: 16 }}>
              Cadastrar tipo de recebível
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: 13, margin: 0 }}>
              Em breve — formulário de cadastro de tipo de recebível.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 16,
              }}
            >
              <button
                onClick={() => {
                  setShowReceivableModal(false);
                  showToast("Modal fechado");
                }}
                style={{
                  fontFamily: "inherit",
                  fontSize: 13,
                  padding: "7px 14px",
                  borderRadius: 5,
                  cursor: "pointer",
                  background: "#1a1a1a",
                  color: "#fff",
                  border: "none",
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default App;
