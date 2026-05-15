import type { LabelHTMLAttributes, ReactNode } from "react";

interface Props extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
}

export function Label({ children, style, ...rest }: Props) {
  return (
    <label
      style={{
        display: "block",
        fontSize: 11,
        color: "var(--text-secondary)",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        marginBottom: 4,
        ...style,
      }}
      {...rest}
    >
      {children}
    </label>
  );
}
