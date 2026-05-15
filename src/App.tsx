import { useState } from "react";
import { AppLayout, type TabId } from "@/components/layout/AppLayout";
import { useToast } from "@/hooks/useToast";
import { TabTransacoes } from "@/features/transactions";
import { TabCedentes } from "@/features/cedentes";
import { TabCambio } from "@/features/currencies";
import { TabSimulador } from "@/features/simulator";
import { TabReceivableTypes } from "@/features/receivable-types";

function App() {
  const [activeTab, setActiveTab] = useState<TabId>("simulador");

  const { toast } = useToast();

  return (
    <AppLayout activeTab={activeTab} onTabChange={setActiveTab} toast={toast}>
      {activeTab === "simulador" && <TabSimulador />}
      {activeTab === "transacoes" && <TabTransacoes />}
      {activeTab === "cedentes" && <TabCedentes />}
      {activeTab === "cambio" && <TabCambio />}
      {activeTab === "recebiveis" && <TabReceivableTypes />}
    </AppLayout>
  );
}

export default App;
