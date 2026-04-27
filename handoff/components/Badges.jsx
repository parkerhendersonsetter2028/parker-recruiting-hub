// Badges & Tags - re-usable pill components
const Pill = ({ children, bg, fg, family, ...rest }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '4px 10px', borderRadius: 9999,
    fontSize: 10, fontWeight: 700, letterSpacing: '.08em',
    textTransform: 'uppercase', background: bg, color: fg,
    fontFamily: family || "'Inter', sans-serif", lineHeight: 1.2,
    whiteSpace: 'nowrap',
  }} {...rest}>{children}</span>
);

const FitBadge = ({ kind = 'best' }) => {
  const map = {
    best:    { bg: '#DCFCE7', fg: '#166534', label: 'Best Fit' },
    reach:   { bg: '#FEE2E2', fg: '#991B1B', label: 'Reach' },
    safety:  { bg: '#DBEAFE', fg: '#1E40AF', label: 'Safety' },
    top:     { bg: '#EDE9FE', fg: '#5B21B6', label: 'Top Academic' },
    low:     { bg: '#FEF3C7', fg: '#92400E', label: 'Low Cost' },
  };
  const c = map[kind] || map.best;
  return <Pill bg={c.bg} fg={c.fg}>{c.label}</Pill>;
};

const DivBadge = ({ div = 'D-I' }) => (
  <Pill bg="#0D1B3D" fg="#D4AF37" family="'Oswald', 'Barlow Condensed', sans-serif">
    {div}
  </Pill>
);

const PriorityBadge = ({ kind = 'Target' }) => {
  const map = {
    Reach: { bg: '#FEE2E2', fg: '#991B1B' },
    Target:{ bg: '#DBEAFE', fg: '#1E40AF' },
    Safety:{ bg: '#DCFCE7', fg: '#166534' },
  };
  const c = map[kind] || map.Target;
  return <Pill bg={c.bg} fg={c.fg}>{kind}</Pill>;
};

window.Pill = Pill;
window.FitBadge = FitBadge;
window.DivBadge = DivBadge;
window.PriorityBadge = PriorityBadge;
