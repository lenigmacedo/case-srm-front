import { Button, Input, Label, Select } from "@/components/ui";
import type { Cedente, Currency, StatementFilter } from "@/types/api";

const bar = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
  gap: 12,
  alignItems: "end",
  marginBottom: 16,
};
const field = { display: "grid", gap: 4 };

interface Props {
  filters: StatementFilter;
  cedentes: Cedente[];
  currencies: Currency[];
  onChange: (updates: Partial<StatementFilter>) => void;
  onClear: () => void;
}

export function FiltrosTransacoes({
  filters,
  cedentes,
  currencies,
  onChange,
  onClear,
}: Props) {
  const hasFilters =
    !!filters.cedente_id ||
    !!filters.currency ||
    !!filters.from ||
    !!filters.to;

  return (
    <div style={bar}>
      <div style={field}>
        <Label>Cedente</Label>
        <Select
          value={filters.cedente_id ?? ""}
          onChange={(e) =>
            onChange({ cedente_id: e.target.value || undefined })
          }
        >
          <option value="">Todos</option>
          {cedentes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>

      <div style={field}>
        <Label>Moeda</Label>
        <Select
          value={filters.currency ?? ""}
          onChange={(e) => onChange({ currency: e.target.value || undefined })}
        >
          <option value="">Todas</option>
          {currencies.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code}
            </option>
          ))}
        </Select>
      </div>

      <div style={field}>
        <Label>De</Label>
        <Input
          type="date"
          value={filters.from ?? ""}
          onChange={(e) => onChange({ from: e.target.value || undefined })}
        />
      </div>

      <div style={field}>
        <Label>Até</Label>
        <Input
          type="date"
          value={filters.to ?? ""}
          onChange={(e) => onChange({ to: e.target.value || undefined })}
        />
      </div>

      <Button variant="ghost" onClick={onClear} disabled={!hasFilters}>
        Limpar
      </Button>
    </div>
  );
}
