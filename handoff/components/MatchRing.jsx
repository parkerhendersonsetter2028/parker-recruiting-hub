// FitScore ring (the signature visual)
function MatchRing({ pct = 85, size = 80, stroke = 8, label = true }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct / 100);
  const color = pct >= 80 ? '#16A34A' : pct >= 60 ? '#D97706' : '#DC2626';
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E2E8F0" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 600ms ease' }}/>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700,
          fontSize: size * 0.32, color: '#0D1B3D', lineHeight: 1 }}>
          {pct}%
        </div>
        {label && (
          <div style={{ fontSize: size * 0.11, fontWeight: 700, letterSpacing: '.1em',
            textTransform: 'uppercase', color: '#64748B', marginTop: 2 }}>
            Match
          </div>
        )}
      </div>
    </div>
  );
}

window.MatchRing = MatchRing;
