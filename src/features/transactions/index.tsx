import { useState } from "react";
import { Card, Spinner } from "@/components/ui";
import { useCedentes } from "@/features/cedentes/hooks/useCedentes";
import { useCurrencies } from "@/features/currencies/hooks/useCurrencies";
import { useStatement } from "./hooks/useTransactions";
import { FiltrosTransacoes } from "./components/FiltrosTransacoes";
import { TabelaTransacoes } from "./components/TabelaTransacoes";
import type { StatementFilter } from "@/types/api";

const LIMIT = 20;

const statusMsg = {
  fontSize: 13,
  textAlign: "center" as const,
  padding: "24px 0",
  margin: 0,
};

const emptyBox = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "48px 0",
};

export function TabTransacoes() {
  const [filters, setFilters] = useState<StatementFilter>({
    page: 1,
    limit: LIMIT,
  });

  const { data: cedentes } = useCedentes();
  const { data: currencies } = useCurrencies();
  const { data, isLoading, isError, isFetching } = useStatement(filters);

  const handleFilterChange = (updates: Partial<StatementFilter>) => {
    setFilters((f) => ({ ...f, ...updates, page: 1 }));
  };

  const handleClear = () => setFilters({ page: 1, limit: LIMIT });

  const handlePageChange = (page: number) => {
    setFilters((f) => ({ ...f, page }));
  };

  return (
    <Card title="Histórico de transações">
      <FiltrosTransacoes
        filters={filters}
        cedentes={cedentes ?? []}
        currencies={currencies ?? []}
        onChange={handleFilterChange}
        onClear={handleClear}
      />

      {isLoading && (
        <div style={emptyBox}>
          <Spinner />
        </div>
      )}

      {isError && (
        <p style={{ ...statusMsg, color: "var(--pill-er-text)" }}>
          Não foi possível carregar as transações. Verifique o backend.
        </p>
      )}

      {!isLoading && !isError && data && (
        <TabelaTransacoes
          data={data}
          onPageChange={handlePageChange}
          isFetching={isFetching}
        />
      )}
    </Card>
  );
}
