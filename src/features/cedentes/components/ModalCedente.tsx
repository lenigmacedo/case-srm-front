import { useState } from "react";
import axios from "axios";
import { Modal, Button, Input, Select, Label } from "@/components/ui";
import { useCreateCedente } from "../hooks/useCedentes";
import { maskCNPJ, stripCNPJ } from "@/lib/utils";
import type { RiskTier } from "@/types/api";

interface Props {
  onClose: () => void;
  onSuccess: (name: string) => void;
}

const RISK_OPTIONS: { value: RiskTier; label: string }[] = [
  { value: "LOW", label: "LOW — Baixo risco" },
  { value: "MEDIUM", label: "MEDIUM — Risco médio" },
  { value: "HIGH", label: "HIGH — Alto risco" },
];

export function ModalCedente({ onClose, onSuccess }: Props) {
  const [form, setForm] = useState({
    cnpj: "",
    name: "",
    risk_tier: "MEDIUM" as RiskTier,
  });
  const [apiError, setApiError] = useState<string | null>(null);
  const { mutate, isPending } = useCreateCedente();

  const cnpjDigits = stripCNPJ(form.cnpj);
  const isValid = cnpjDigits.length === 14 && form.name.trim().length > 0;

  const handleSubmit = () => {
    setApiError(null);
    mutate(
      { cnpj: cnpjDigits, name: form.name.trim(), risk_tier: form.risk_tier },
      {
        onSuccess: (cedente) => {
          onSuccess(cedente.name);
          onClose();
        },
        onError: (err) => {
          if (axios.isAxiosError(err) && err.response?.status === 409) {
            setApiError("CNPJ já cadastrado no sistema.");
          } else if (axios.isAxiosError(err) && err.response?.status === 422) {
            setApiError("CNPJ inválido — informe os 14 dígitos numéricos.");
          } else {
            setApiError("Erro inesperado. Verifique o servidor.");
          }
        },
      },
    );
  };

  return (
    <Modal
      title="Cadastrar cedente"
      onClose={onClose}
      actions={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid || isPending}>
            {isPending ? "Salvando…" : "Cadastrar"}
          </Button>
        </>
      }
    >
      <div style={{ display: "grid", gap: 12 }}>
        <div>
          <Label>CNPJ</Label>
          <Input
            placeholder="00.000.000/0000-00"
            value={form.cnpj}
            onChange={(e) =>
              setForm((f) => ({ ...f, cnpj: maskCNPJ(e.target.value) }))
            }
            maxLength={18}
          />
          <div
            style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}
          >
            {cnpjDigits.length}/14 dígitos
          </div>
        </div>

        <div>
          <Label>Razão social</Label>
          <Input
            placeholder="Nome da empresa"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            maxLength={150}
          />
        </div>

        <div>
          <Label>Tier de risco</Label>
          <Select
            value={form.risk_tier}
            onChange={(e) =>
              setForm((f) => ({ ...f, risk_tier: e.target.value as RiskTier }))
            }
          >
            {RISK_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </div>

        {apiError && (
          <div
            style={{
              background: "var(--pill-er-bg)",
              color: "var(--pill-er-text)",
              padding: "8px 12px",
              borderRadius: "var(--radius-sm)",
              fontSize: 12,
            }}
          >
            {apiError}
          </div>
        )}
      </div>
    </Modal>
  );
}
