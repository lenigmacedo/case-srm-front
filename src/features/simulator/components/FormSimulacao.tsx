import { useState, useEffect, useRef } from "react";
import { Input, Label, Select } from "@/components/ui";
import { maskBRL, stripBRL } from "@/lib/utils";
import type {
  Cedente,
  Currency,
  ReceivableType,
  SimulateRequest,
} from "@/types/api";

const grid2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 };
const field = { display: "grid", gap: 4 };
const hint = { fontSize: 11, color: "var(--text-muted)", marginTop: 2 };
const hintError = { fontSize: 11, color: "var(--pill-er-text)", marginTop: 2 };
const optionalLabel = {
  fontSize: 11,
  color: "var(--text-muted)",
  fontWeight: 400,
};

interface Props {
  cedentes: Cedente[];
  receivableTypes: ReceivableType[];
  currencies: Currency[];
  onSimulate: (data: SimulateRequest) => void;
  onCedenteChange: (cedenteId: string) => void;
}

function defaultDueDate() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
}

function calcTermDays(dueDate: string): number {
  if (!dueDate) return 0;
  const today = new Date(new Date().toISOString().slice(0, 10) + "T00:00:00");
  const due = new Date(dueDate + "T00:00:00");
  return Math.round((due.getTime() - today.getTime()) / 86400000);
}

function minDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function FormSimulacao({
  cedentes,
  receivableTypes,
  currencies,
  onSimulate,
  onCedenteChange,
}: Props) {
  const [form, setForm] = useState({
    face_value: "",
    cedente_id: "",
    receivable_type_id: "",
    due_date: defaultDueDate(),
    origin_currency: "",
    payment_currency: "",
  });

  const faceValueNum = parseFloat(stripBRL(form.face_value));
  const termDays = calcTermDays(form.due_date);
  const isValid = faceValueNum > 0 && !!form.receivable_type_id && termDays > 0;

  const onSimulateRef = useRef(onSimulate);
  const debounceTiming = 800;

  useEffect(() => {
    onSimulateRef.current = onSimulate;
  });

  useEffect(() => {
    if (!isValid) return;
    const timer = setTimeout(() => {
      const req: SimulateRequest = {
        face_value: faceValueNum.toFixed(2),
        term_days: termDays,
        due_date: form.due_date,
        receivable_type_id: form.receivable_type_id,
      };
      if (form.origin_currency) req.origin_currency = form.origin_currency;
      if (form.payment_currency) req.payment_currency = form.payment_currency;
      onSimulateRef.current(req);
    }, debounceTiming);
    return () => clearTimeout(timer);
  }, [
    form.face_value,
    form.receivable_type_id,
    form.due_date,
    form.origin_currency,
    form.payment_currency,
    faceValueNum,
    termDays,
    isValid,
  ]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={field}>
        <Label>Valor de face (R$)</Label>
        <Input
          inputMode="numeric"
          placeholder="0,00"
          value={form.face_value}
          onChange={(e) =>
            setForm((f) => ({ ...f, face_value: maskBRL(e.target.value) }))
          }
        />
      </div>

      <div style={field}>
        <Label>
          Cedente{" "}
          <span style={optionalLabel}>
            (opcional — obrigatório ao registrar)
          </span>
        </Label>
        <Select
          value={form.cedente_id}
          onChange={(e) => {
            const v = e.target.value;
            setForm((f) => ({ ...f, cedente_id: v }));
            onCedenteChange(v);
          }}
        >
          <option value="">Nenhum</option>
          {cedentes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>

      <div style={field}>
        <Label>Tipo de recebível</Label>
        <Select
          value={form.receivable_type_id}
          onChange={(e) =>
            setForm((f) => ({ ...f, receivable_type_id: e.target.value }))
          }
        >
          <option value="">Selecione…</option>
          {receivableTypes.map((rt) => (
            <option key={rt.id} value={rt.id}>
              {rt.name} — spread{" "}
              {(parseFloat(rt.spread_monthly) * 100).toFixed(2)}% a.m.
            </option>
          ))}
        </Select>
      </div>

      <div style={field}>
        <Label>Data de vencimento</Label>
        <Input
          type="date"
          value={form.due_date}
          min={minDate()}
          onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))}
        />
        {termDays > 0 && <span style={hint}>{termDays} dias</span>}
        {form.due_date && termDays <= 0 && (
          <span style={hintError}>A data de vencimento deve ser futura.</span>
        )}
      </div>

      <div style={grid2}>
        <div style={field}>
          <Label>Moeda de origem</Label>
          <Select
            value={form.origin_currency}
            onChange={(e) =>
              setForm((f) => ({ ...f, origin_currency: e.target.value }))
            }
          >
            <option value="">Padrão (BRL)</option>
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code}
              </option>
            ))}
          </Select>
        </div>

        <div style={field}>
          <Label>Moeda de pagamento</Label>
          <Select
            value={form.payment_currency}
            onChange={(e) =>
              setForm((f) => ({ ...f, payment_currency: e.target.value }))
            }
          >
            <option value="">Padrão (BRL)</option>
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}
