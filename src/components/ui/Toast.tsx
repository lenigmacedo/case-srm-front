interface Props {
  message: string;
}

export function Toast({ message }: Props) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#1a1a1a",
        color: "#fff",
        padding: "9px 16px",
        borderRadius: "var(--radius-sm)",
        fontSize: 13,
        zIndex: 100,
        whiteSpace: "nowrap",
      }}
    >
      ✓ {message}
    </div>
  );
}
