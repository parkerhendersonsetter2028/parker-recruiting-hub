// School card - main data display
function SchoolLogo({ initials = 'UM', color = '#0D1B3D' }) {
  return (
    <div style={{
      width: 44, height: 44, borderRadius: 10,
      background: color, color: '#D4AF37',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 16,
      letterSpacing: '.04em', flexShrink: 0,
    }}>{initials}</div>
  );
}

function SchoolCard({ school, onClick, saved, onToggleSave }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'left', cursor: 'pointer',
      background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16,
      padding: 16, boxShadow: '0 1px 2px rgb(0 0 0 / 0.04), 0 1px 3px rgb(0 0 0 / 0.06)',
      fontFamily: "'Inter', sans-serif", transition: 'all 180ms',
      display: 'block',
    }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 1px 2px rgb(0 0 0 / 0.04), 0 4px 12px rgb(0 27 61 / 0.10)'}
    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 2px rgb(0 0 0 / 0.04), 0 1px 3px rgb(0 0 0 / 0.06)'}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <SchoolLogo initials={school.initials} color={school.color}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700,
            fontSize: 16, color: '#0D1B3D', letterSpacing: '.02em',
            textTransform: 'uppercase', lineHeight: 1.1 }}>
            {school.name}
          </div>
          <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>
            {school.location} &middot; {school.conf}
          </div>
        </div>
        <div onClick={e => { e.stopPropagation(); onToggleSave?.(); }}
          style={{ padding: 4, cursor: 'pointer' }}>
          <i data-lucide={saved ? 'bookmark-check' : 'bookmark'} style={{
            width: 16, height: 16, color: saved ? '#D4AF37' : '#94A3B8',
          }}></i>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
        <MatchRing pct={school.match} size={64} stroke={6}/>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 8, fontFamily: "'Inter', sans-serif" }}>
          <div>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700,
              fontSize: 15, color: '#1E293B', lineHeight: 1 }}>{school.tuition}</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#94A3B8',
              letterSpacing: '.1em', textTransform: 'uppercase', marginTop: 2 }}>Tuition</div>
          </div>
          <div>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700,
              fontSize: 15, color: '#1E293B', lineHeight: 1 }}>{school.acceptance}</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#94A3B8',
              letterSpacing: '.1em', textTransform: 'uppercase', marginTop: 2 }}>Acceptance</div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
        <DivBadge div={school.div}/>
        <PriorityBadge kind={school.priority}/>
        {school.tags?.map(t => <FitBadge key={t} kind={t}/>)}
      </div>
    </button>
  );
}

window.SchoolCard = SchoolCard;
window.SchoolLogo = SchoolLogo;
