// School Detail - hero + tabs
function SchoolDetail({ school, onBack, saved, toggleSave }) {
  const [tab, setTab] = React.useState('Overview');
  const tabs = ['Overview', 'Athletics', 'Academics', 'Cost', 'Campus Life'];
  const s = school;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Hero */}
      <div style={{
        padding: '24px 32px 28px', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #1E3A8A 0%, #0D1B3D 100%)', color: '#fff',
      }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: '#B7C2DB',
          fontSize: 11, fontWeight: 700, letterSpacing: '.08em',
          textTransform: 'uppercase', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: 0, marginBottom: 14, fontFamily: "'Inter', sans-serif",
        }}>
          <i data-lucide="arrow-left" style={{ width: 14, height: 14 }}></i>
          Back to matches
        </button>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18 }}>
          <div style={{ width: 88, height: 88, borderRadius: 16,
            background: '#fff', color: s.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 32,
            border: '3px solid #D4AF37', flexShrink: 0,
          }}>{s.initials}</div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700,
              fontSize: 36, margin: 0, letterSpacing: '.02em',
              textTransform: 'uppercase', lineHeight: 1 }}>{s.name}</h1>
            <div style={{ marginTop: 6, fontSize: 13, color: '#B7C2DB',
              display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <span><i data-lucide="map-pin" style={{ width: 12, height: 12, verticalAlign: -1 }}></i> {s.location}</span>
              <span style={{ color: '#fff' }}>{s.conf} Conference</span>
            </div>
          </div>
          <MatchRing pct={s.match} size={84} stroke={8}/>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={toggleSave} style={{
              padding: '11px 16px', background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)', color: '#fff',
              borderRadius: 10, fontWeight: 700, fontSize: 11, letterSpacing: '.08em',
              textTransform: 'uppercase', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontFamily: "'Inter', sans-serif",
            }}>
              <i data-lucide={saved ? 'bookmark-check' : 'bookmark'} style={{ width: 14, height: 14, color: saved ? '#D4AF37' : '#fff' }}></i>
              {saved ? 'Saved' : 'Save'}
            </button>
            <button style={{
              padding: '11px 18px', background: '#D4AF37', color: '#0D1B3D',
              border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 11,
              letterSpacing: '.08em', textTransform: 'uppercase', cursor: 'pointer',
              fontFamily: "'Inter', sans-serif",
            }}>I\u2019m Interested</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid #E2E8F0', padding: '0 32px',
        display: 'flex', gap: 4, background: '#fff', position: 'sticky', top: 0, zIndex: 4 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '14px 16px', background: 'none', border: 'none',
            borderBottom: '2px solid ' + (tab === t ? '#0D1B3D' : 'transparent'),
            marginBottom: -1, fontWeight: 700, fontSize: 12,
            letterSpacing: '.08em', textTransform: 'uppercase',
            color: tab === t ? '#0D1B3D' : '#64748B', cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
          }}>{t}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '24px 32px', display: 'grid',
        gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div>
          {tab === 'Overview' && (
            <div style={{ background: '#fff', border: '1px solid #E2E8F0',
              borderRadius: 16, padding: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#64748B',
                letterSpacing: '.14em', textTransform: 'uppercase' }}>About</div>
              <p style={{ marginTop: 8, fontSize: 14, color: '#334155', lineHeight: 1.6 }}>
                A world-class research university with a rich athletic tradition. Competing at the highest level
                with a strong academic reputation, this program offers an excellent fit for setters with high
                academic standards and a desire to compete in the Big Ten.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 20 }}>
                {[
                  { v: s.tuition, l: 'In-State Tuition' },
                  { v: '44,718',   l: 'Total Enrollment' },
                  { v: s.acceptance, l: 'Acceptance Rate' },
                ].map(x => (
                  <div key={x.l} style={{ padding: 14, background: '#F8FAFC',
                    borderRadius: 12, border: '1px solid #E2E8F0' }}>
                    <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700,
                      fontSize: 22, color: '#0D1B3D', lineHeight: 1 }}>{x.v}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#64748B',
                      letterSpacing: '.1em', textTransform: 'uppercase', marginTop: 4 }}>{x.l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab !== 'Overview' && (
            <div style={{ background: '#fff', border: '1px solid #E2E8F0',
              borderRadius: 16, padding: 32, textAlign: 'center', color: '#94A3B8' }}>
              <i data-lucide="layout-grid" style={{ width: 24, height: 24, marginBottom: 8 }}></i>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700,
                fontSize: 16, color: '#0D1B3D', letterSpacing: '.04em',
                textTransform: 'uppercase' }}>{tab} \u2014 placeholder</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>
                Tab content per spec lives here in the production app.
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - FitScore breakdown */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0',
          borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#64748B',
            letterSpacing: '.14em', textTransform: 'uppercase' }}>FitScore Breakdown</div>
          {[
            { l: 'Academic Fit',    v: 92, c: '#16A34A' },
            { l: 'Athletic Need',   v: 78, c: '#D4AF37' },
            { l: 'Location Match',  v: 84, c: '#16A34A' },
            { l: 'Cost Alignment',  v: 71, c: '#D4AF37' },
            { l: 'Career Fit',      v: 88, c: '#16A34A' },
          ].map(b => (
            <div key={b.l} style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between',
                fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 5 }}>
                <span>{b.l}</span>
                <span style={{ fontFamily: "'Oswald', sans-serif", color: '#0D1B3D' }}>{b.v}</span>
              </div>
              <div style={{ height: 4, background: '#F1F4F9', borderRadius: 4 }}>
                <div style={{ width: b.v + '%', height: '100%', background: b.c, borderRadius: 4 }}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.SchoolDetail = SchoolDetail;
