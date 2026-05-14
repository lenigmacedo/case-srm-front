import type { PillVariant } from "@/lib/utils";

interface Props {
  variant: PillVariant;
  children: React.ReactNode;
}

const styles: Record<PillVariant, React.CSSProperties> = {
  ok: { background: "var(--pill-ok-bg)", color: "var(--pill-ok-text)" },
  wn: { background: "var(--pill-wn-bg)", color: "var(--pill-wn-text)" },
  er: { background: "var(--pill-er-bg)", color: "var(--pill-er-text)" },
};

export function Pill({ variant, children }: Props) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 500,
        ...styles[variant],
      }}
    >
      {children}
    </span>
  );
}
