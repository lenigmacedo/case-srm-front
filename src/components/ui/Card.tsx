import type { ReactNode } from "react";

interface Props {
  title?: string;
  children: ReactNode;
  style?: React.CSSProperties;
}

export function Card({ title, children, style }: Props) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: 16,
        marginBottom: 16,
        ...style,
      }}
    >
      {title && (
        <h2 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600 }}>
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
