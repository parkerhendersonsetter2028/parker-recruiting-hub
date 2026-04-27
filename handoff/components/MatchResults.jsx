// Match results - filterable card grid
function MatchResults({ onOpenSchool, saved, toggleSave }) {
  const [filter, setFilter] = React.useState('All');
  const filters = ['All', 'Best Fit', 'Reach', 'Target', 'Safety'];
  const list = SAMPLE_SCHOOLS;

  return (
    <div style={{ padding: '28px 32px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '8px 14px', borderRadius: 9999,
            background: filter === f ? '#0D1B3D' : '#fff',
            color: filter === f ? '#fff' : '#475569',
            border: '1px solid ' + (filter === f ? '#0D1B3D' : '#E2E8F0'),
            fontWeight: 700, fontSize: 11, letterSpacing: '.08em',
            textTransform: 'uppercase', cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
          }}>{f}</button>
        ))}
        <div style={{ marginLeft: 'auto', fontSize: 12, color: '#64748B' }}>
          Showing <strong>{list.length}</strong> matches
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {list.map(s => (
          <SchoolCard key={s.id} school={s}
            onClick={() => onOpenSchool(s)}
            saved={saved[s.id]}
            onToggleSave={() => toggleSave(s.id)}/>
        ))}
      </div>
    </div>
  );
}

window.MatchResults = MatchResults;
