interface Props {
  size?: number;
}

export function Spinner({ size = 28 }: Props) {
  const cx = size / 2;
  const r = size / 2 - 3;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <circle cx={cx} cy={cx} r={r} stroke="#e4e4e0" strokeWidth="3" />
      <path
        d={`M${cx} ${cx - r}a${r} ${r} 0 0 1 ${r} ${r}`}
        stroke="#888"
        strokeWidth="3"
        strokeLinecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from={`0 ${cx} ${cx}`}
          to={`360 ${cx} ${cx}`}
          dur="0.75s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}
