// Sidebar nav - left rail
function Sidebar({ view, onNav }) {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
    { id: 'schools',   label: 'Schools',   icon: 'school' },
    { id: 'compare',   label: 'Compare',   icon: 'git-compare-arrows' },
    { id: 'favorites', label: 'Favorites', icon: 'heart' },
    { id: 'messages',  label: 'Messages',  icon: 'mail' },
    { id: 'profile',   label: 'Profile',   icon: 'user' },
  ];
  return (
    <aside style={{
      width: 240, flexShrink: 0, background: '#fff',
      borderRight: '1px solid #E2E8F0',
      display: 'flex', flexDirection: 'column',
      position: 'sticky', top: 0, height: '100vh',
    }}>
      {/* Brand */}
      <div style={{ padding: '20px 18px', borderBottom: '1px solid #F1F4F9',
        display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src="../../assets/cc-monogram.png" width="36" height="36" alt="" style={{ flexShrink: 0 }}/>
        <div>
          <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700,
            fontSize: 16, color: '#0D1B3D', letterSpacing: '.04em', lineHeight: 1 }}>
            CAMPUS COMMIT
          </div>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#94A3B8',
            letterSpacing: '.12em', textTransform: 'uppercase', marginTop: 3 }}>
            Find Your Fit
          </div>
        </div>
      </div>

      {/* Primary CTA */}
      <div style={{ padding: '14px 14px 6px' }}>
        <button style={{
          width: '100%', padding: '11px 14px',
          background: 'linear-gradient(135deg, #1E3A8A 0%, #0D1B3D 100%)',
          color: '#fff', border: 'none', borderRadius: 10,
          fontWeight: 700, fontSize: 12, letterSpacing: '.08em',
          textTransform: 'uppercase', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontFamily: "'Inter', sans-serif",
        }}>
          <i data-lucide="sparkles" style={{ width: 14, height: 14 }}></i>
          New Match Run
        </button>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 10px', flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '6px 10px 8px', fontSize: 9, fontWeight: 800,
          color: '#94A3B8', letterSpacing: '.14em', textTransform: 'uppercase' }}>
          Workspace
        </div>
        {items.map(it => {
          const active = view === it.id;
          return (
            <button key={it.id} onClick={() => onNav(it.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 10, marginBottom: 2,
              background: active ? '#F1F4F9' : 'transparent',
              border: 'none', cursor: 'pointer', textAlign: 'left',
              fontFamily: "'Inter', sans-serif",
              color: active ? '#0D1B3D' : '#475569',
              fontWeight: active ? 700 : 500, fontSize: 13,
              transition: 'all 150ms',
            }}>
              <i data-lucide={it.icon} style={{ width: 16, height: 16,
                color: active ? '#0D1B3D' : '#94A3B8' }}></i>
              {it.label}
              {active && <span style={{ marginLeft: 'auto', width: 4, height: 18,
                background: '#D4AF37', borderRadius: 4 }}/>}
            </button>
          );
        })}
      </nav>

      {/* Athlete card */}
      <div style={{ padding: 12, borderTop: '1px solid #F1F4F9' }}>
        <div style={{ background: 'linear-gradient(135deg, #F8FAFC, #EFF6FF)',
          border: '1px solid #E2E8F0', borderRadius: 12, padding: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9999,
              background: '#0D1B3D', color: '#D4AF37',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 14 }}>AK</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#0D1B3D',
                lineHeight: 1.2 }}>Alex Kim</div>
              <div style={{ fontSize: 10, color: '#64748B', marginTop: 2 }}>
                Setter &middot; Class of 2027
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

window.Sidebar = Sidebar;
