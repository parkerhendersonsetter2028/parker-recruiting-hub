// Dashboard - personalized home
const SAMPLE_SCHOOLS = [
  { id: 'um',  name: 'University of Michigan', initials: 'UM', color: '#0D1B3D', location: 'Ann Arbor, MI', conf: 'Big Ten', match: 85, tuition: '$30,023', acceptance: '18%', div: 'D-I', priority: 'Target', tags: ['best'] },
  { id: 'tcu', name: 'TCU',                    initials: 'TCU',color: '#4D1979', location: 'Fort Worth, TX',conf: 'Big 12',  match: 78, tuition: '$28,315', acceptance: '36%', div: 'D-I', priority: 'Target', tags: ['top'] },
  { id: 'uof', name: 'University of Illinois', initials: 'UI', color: '#13294B', location: 'Champaign, IL', conf: 'Big Ten', match: 72, tuition: '$17,138', acceptance: '47%', div: 'D-I', priority: 'Reach',  tags: ['low'] },
  { id: 'pep', name: 'Pepperdine',             initials: 'PEP',color: '#00205B', location: 'Malibu, CA',    conf: 'WCC',     match: 68, tuition: '$59,108', acceptance: '49%', div: 'D-I', priority: 'Safety', tags: [] },
];

function Dashboard({ onOpenSchool, saved, toggleSave }) {
  const top = SAMPLE_SCHOOLS.slice(0, 4);
  return (
    <div style={{ padding: '28px 32px', fontFamily: "'Inter', sans-serif" }}>
      {/* Welcome + progress */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20, marginBottom: 24 }}>
        <div style={{
          padding: 24, borderRadius: 20, color: '#fff', position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(135deg, #1E3A8A 0%, #0D1B3D 100%)',
        }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.14em',
            textTransform: 'uppercase', color: '#D4AF37' }}>Welcome back</div>
          <h2 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700,
            fontSize: 32, margin: '6px 0 4px', letterSpacing: '.02em',
            textTransform: 'uppercase', lineHeight: 1 }}>Alex, here\u2019s your week.</h2>
          <p style={{ fontSize: 14, color: '#B7C2DB', margin: '0 0 18px' }}>
            4 new matches, 2 coach replies, 1 questionnaire to fill.
          </p>
          <button style={{
            padding: '10px 18px', background: '#D4AF37', color: '#0D1B3D',
            border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 12,
            letterSpacing: '.08em', textTransform: 'uppercase', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: "'Inter', sans-serif",
          }}>
            <i data-lucide="sparkles" style={{ width: 14, height: 14 }}></i>
            Run new match
          </button>
        </div>
        <div style={{ padding: 24, borderRadius: 20, background: '#fff',
          border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgb(0 0 0 / 0.05)' }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B',
            letterSpacing: '.14em', textTransform: 'uppercase' }}>Profile Complete</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
            <span style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700,
              fontSize: 44, color: '#0D1B3D', lineHeight: 1 }}>72%</span>
            <span style={{ fontSize: 12, color: '#16A34A', fontWeight: 700 }}>+8 this week</span>
          </div>
          <div style={{ height: 6, background: '#F1F4F9', borderRadius: 4, marginTop: 14 }}>
            <div style={{ width: '72%', height: '100%', borderRadius: 4,
              background: 'linear-gradient(90deg, #1E3A8A, #0D1B3D)' }}/>
          </div>
          <div style={{ marginTop: 14, fontSize: 12, color: '#64748B' }}>
            Add highlight reel &middot; Verify GPA &middot; Add 2 references
          </div>
        </div>
      </div>

      {/* Top recommendations */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 14 }}>
        <h3 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700,
          fontSize: 20, color: '#0D1B3D', letterSpacing: '.04em',
          textTransform: 'uppercase', margin: 0 }}>Top Recommendations</h3>
        <button style={{ background: 'none', border: 'none', color: '#0D1B3D',
          fontWeight: 700, fontSize: 12, letterSpacing: '.08em',
          textTransform: 'uppercase', cursor: 'pointer',
          fontFamily: "'Inter', sans-serif" }}>View All \u2192</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {top.map(s => (
          <SchoolCard key={s.id} school={s}
            onClick={() => onOpenSchool(s)}
            saved={saved[s.id]}
            onToggleSave={() => toggleSave(s.id)}/>
        ))}
      </div>
    </div>
  );
}

window.Dashboard = Dashboard;
window.SAMPLE_SCHOOLS = SAMPLE_SCHOOLS;
