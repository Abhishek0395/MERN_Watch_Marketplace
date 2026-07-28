export default function DialMark({ size = 28, animated = false }) {
  const ticks = Array.from({ length: 12 }, (_, i) => i);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="46" stroke="var(--brass)" strokeWidth="3" />
      {ticks.map((i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const isCardinal = i % 3 === 0;
        const outer = 46;
        const inner = isCardinal ? 37 : 41;
        const x1 = 50 + outer * Math.sin(angle);
        const y1 = 50 - outer * Math.cos(angle);
        const x2 = 50 + inner * Math.sin(angle);
        const y2 = 50 - inner * Math.cos(angle);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="var(--brass)"
            strokeWidth={isCardinal ? 3 : 1.5}
            strokeLinecap="round"
          />
        );
      })}
      <line
        x1="50"
        y1="50"
        x2="50"
        y2="24"
        stroke="var(--cream)"
        strokeWidth="3"
        strokeLinecap="round"
        style={
          animated
            ? { transformOrigin: '50px 50px', animation: 'spin 8s linear infinite' }
            : { transform: 'rotate(35deg)', transformOrigin: '50px 50px' }
        }
      />
      <circle cx="50" cy="50" r="3.5" fill="var(--brass-bright)" />
      <style>{`
        @keyframes spin { to { transform: rotate(395deg); } }
      `}</style>
    </svg>
  );
}