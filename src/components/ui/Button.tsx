import type { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  children: ReactNode;
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: Props) {
  const base: React.CSSProperties = {
    fontFamily: "inherit",
    fontSize: 13,
    padding: "7px 14px",
    borderRadius: "var(--radius-sm)",
    cursor: "pointer",
    border: "1px solid",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    whiteSpace: "nowrap" as const,
    transition: "background 0.12s",
  };

  const variants = {
    primary: { background: "#1a1a1a", color: "#fff", borderColor: "#1a1a1a" },
    ghost: {
      background: "#fff",
      color: "#1a1a1a",
      borderColor: "var(--border-input)",
    },
  };

  return (
    <button
      style={{
        ...base,
        ...variants[variant],
        opacity: rest.disabled ? 0.4 : 1,
      }}
      className={className}
      {...rest}
    >
      {children}
    </button>
  );
}
