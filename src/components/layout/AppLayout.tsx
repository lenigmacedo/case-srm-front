import type { ReactNode } from "react";
import { Button, Toast } from "@/components/ui";

export type TabId = "transacoes" | "cedentes" | "cambio" | "simulador";

const TABS: { id: TabId; label: string }[] = [
  { id: "simulador", label: "Simulador" },
  { id: "transacoes", label: "Transações" },
  { id: "cedentes", label: "Cedentes" },
  { id: "cambio", label: "Câmbio" },
];

interface Props {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onOpenReceivableModal: () => void;
  toast: string | null;
  children: ReactNode;
}

export function AppLayout({
  activeTab,
  onTabChange,
  onOpenReceivableModal,
  toast,
  children,
}: Props) {
  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: 24 }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>
            SRM Credit Engine
          </h1>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Painel do Operador
          </div>
        </div>
        <div>
          <Button variant="ghost" onClick={onOpenReceivableModal}>
            + Cadastrar tipo de recebível
          </Button>
        </div>
      </header>

      <div
        style={{
          display: "flex",
          gap: 2,
          borderBottom: "1px solid var(--border)",
          marginBottom: 20,
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              background: "none",
              border: "none",
              padding: "10px 16px",
              fontFamily: "inherit",
              fontSize: 13,
              cursor: "pointer",
              color:
                activeTab === tab.id ? "var(--text)" : "var(--text-secondary)",
              fontWeight: activeTab === tab.id ? 500 : 400,
              borderBottom: `2px solid ${activeTab === tab.id ? "#1a1a1a" : "transparent"}`,
              marginBottom: -1,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {children}

      {toast && <Toast message={toast} />}
    </div>
  );
}
