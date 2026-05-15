import { useState } from "react";
import axios from "axios";
import { Modal, Button, Input, Label } from "@/components/ui";
import { maskPercent, stripPercent } from "@/lib/utils";
import { useCreateReceivableType } from "../hooks/useReceivableTypes";

interface Props {
  onClose: () => void;
  onSuccess: (name: string) => void;
}

export function ModalReceivableType({ onClose, onSuccess }: Props) {
  const [form, setForm] = useState({ code: "", name: "", spread: "" });
  const [apiError, setApiError] = useState<string | null>(null);
  const { mutate, isPending } = useCreateReceivableType();

  const spreadNum = parseFloat(stripPercent(form.spread));
  const isValid =
    form.code.trim().length > 0 &&
    form.name.trim().length > 0 &&
    !isNaN(spreadNum) &&
    spreadNum > 0;

  const handleSubmit = () => {
    setApiError(null);
    mutate(
      {
        code: form.code.trim().toUpperCase(),
        name: form.name.trim(),
        spread_monthly: (spreadNum / 100).toFixed(6),
      },
      {
        onSuccess: (rt) => {
          onSuccess(rt.name);
          onClose();
        },
        onError: (err) => {
          if (axios.isAxiosError(err) && err.response?.status === 409) {
            setApiError("Código já cadastrado no sistema.");
          } else {
            setApiError("Erro inesperado. Verifique o servidor.");
          }
        },
      },
    );
  };

  return (
    <Modal
      title="Cadastrar tipo de recebível"
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
          <Label>Código</Label>
          <Input
            placeholder="ex: NFE"
            value={form.code}
            onChange={(e) =>
              setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))
            }
            maxLength={50}
          />
        </div>

        <div>
          <Label>Nome</Label>
          <Input
            placeholder="ex: Nota Fiscal Eletrônica"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            maxLength={100}
          />
        </div>

        <div>
          <Label>Spread mensal (%)</Label>
          <Input
            inputMode="numeric"
            placeholder="0,00%"
            value={form.spread}
            onChange={(e) =>
              setForm((f) => ({ ...f, spread: maskPercent(e.target.value) }))
            }
          />
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
