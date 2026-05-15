import { useState } from "react";
import axios from "axios";
import { Modal, Button, Input, Label } from "@/components/ui";
import { useUpdateCurrencyRate } from "../hooks/useCurrencies";
import type { Currency } from "@/types/api";

interface Props {
  currency: Currency;
  onClose: () => void;
  onSuccess: () => void;
}

export function ModalEditarTaxa({ currency, onClose, onSuccess }: Props) {
  const [rate, setRate] = useState(currency.rate_to_brl);
  const [apiError, setApiError] = useState<string | null>(null);
  const { mutate, isPending } = useUpdateCurrencyRate();

  const isValid = !isNaN(parseFloat(rate)) && parseFloat(rate) > 0;

  const handleSubmit = () => {
    setApiError(null);
    mutate(
      { code: currency.code, rate },
      {
        onSuccess: () => onSuccess(),
        onError: (err) => {
          if (axios.isAxiosError(err) && err.response?.status === 422) {
            setApiError("Taxa inválida — informe um número positivo.");
          } else {
            setApiError("Erro inesperado. Verifique o servidor.");
          }
        },
      },
    );
  };

  return (
    <Modal
      title={`Editar taxa — ${currency.code}`}
      onClose={onClose}
      actions={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid || isPending}>
            {isPending ? "Salvando…" : "Salvar"}
          </Button>
        </>
      }
    >
      <div style={{ display: "grid", gap: 12 }}>
        <div>
          <Label>Taxa de câmbio (1 {currency.code} → BRL)</Label>
          <Input
            type="number"
            min="0"
            step="0.0001"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
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
