// Compare - side-by-side
function Compare() {
  const [a, b] = [SAMPLE_SCHOOLS[0], SAMPLE_SCHOOLS[1]];
  const rows = [
    { label: 'Match', av: a.match + '%', bv: b.match + '%' },
    { label: 'Location', av: a.location, bv: b.location },
    { label: 'Conference', av: a.conf, bv: b.conf },
    { label: 'Tuition (In-State)', av: a.tuition, bv: b.tuition },
    { label: 'Acceptance Rate', av: a.acceptance, bv: b.acceptance },
    { label: 'Roster Need', av: 'Medium', bv: 'High' },
    { label: 'Academic Fit', av: 'High', bv: 'High' },
    { label: 'Distance From Home', av: '642 mi', bv: '1,182 mi' },
  ];

  return (
    <div style={{ padding: '28px 32px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 18 }}>
        <h3 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700,
          fontSize: 20, color: '#0D1B3D', letterSpacing: '.04em',
          textTransform: 'uppercase', margin: 0 }}>Compare Schools</h3>
        <button style={{
          padding: '9px 14px', background: '#0D1B3D', color: '#fff',
          border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 11,
          letterSpacing: '.08em', textTransform: 'uppercase', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: "'Inter', sans-serif",
        }}>
          <i data-lucide="plus" style={{ width: 14, height: 14 }}></i>
          Add School
        </button>
      </div>

      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16,
        overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 1fr',
          background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
          <div/>
          {[a, b].map(s => (
            <div key={s.id} style={{ padding: '20px 18px', display: 'flex',
              flexDirection: 'column', alignItems: 'center', gap: 10,
              borderLeft: '1px solid #E2E8F0' }}>
              <SchoolLogo initials={s.initials} color={s.color}/>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700,
                fontSize: 15, color: '#0D1B3D', letterSpacing: '.02em',
                textTransform: 'uppercase', textAlign: 'center' }}>{s.name}</div>
            </div>
          ))}
        </div>
        {rows.map(r => (
          <div key={r.label} style={{ display: 'grid',
            gridTemplateColumns: '180px 1fr 1fr',
            borderBottom: '1px solid #F1F4F9' }}>
            <div style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700,
              color: '#64748B', letterSpacing: '.08em', textTransform: 'uppercase' }}>
              {r.label}
            </div>
            <div style={{ padding: '14px 18px', fontSize: 14, fontWeight: 600,
              color: '#1E293B', borderLeft: '1px solid #E2E8F0' }}>{r.av}</div>
            <div style={{ padding: '14px 18px', fontSize: 14, fontWeight: 600,
              color: '#1E293B', borderLeft: '1px solid #E2E8F0' }}>{r.bv}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.Compare = Compare;
