import type { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
}

const inputStyle: React.CSSProperties = {
  fontFamily: "inherit",
  fontSize: 13,
  padding: "7px 10px",
  border: "1px solid var(--border-input)",
  borderRadius: "var(--radius-sm)",
  background: "#fff",
  color: "var(--text)",
  outline: "none",
};

export function Input({ fullWidth = true, style, ...rest }: Props) {
  return (
    <input
      style={{ width: fullWidth ? "100%" : undefined, ...inputStyle, ...style }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "#1a1a1a")}
      onBlur={(e) =>
        (e.currentTarget.style.borderColor = "var(--border-input)")
      }
      {...rest}
    />
  );
}
