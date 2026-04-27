// Top bar - search + actions
function TopBar({ title, subtitle }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '18px 32px', borderBottom: '1px solid #E2E8F0',
      background: '#fff', position: 'sticky', top: 0, zIndex: 5,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: 9999, background: '#D4AF37' }}/>
          <span style={{ fontSize: 10, fontWeight: 800, color: '#64748B',
            letterSpacing: '.14em', textTransform: 'uppercase' }}>{subtitle}</span>
        </div>
        <h1 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700,
          fontSize: 28, color: '#0D1B3D', letterSpacing: '.02em',
          textTransform: 'uppercase', margin: '4px 0 0', lineHeight: 1 }}>
          {title}
        </h1>
      </div>
      <div style={{ position: 'relative', width: 280 }}>
        <i data-lucide="search" style={{ position: 'absolute', left: 12, top: '50%',
          transform: 'translateY(-50%)', width: 14, height: 14, color: '#94A3B8' }}></i>
        <input placeholder="Search schools, conferences..." style={{
          width: '100%', padding: '10px 12px 10px 34px', border: '1px solid #E2E8F0',
          borderRadius: 10, fontSize: 13, background: '#F8FAFC', outline: 'none',
          fontFamily: "'Inter', sans-serif",
        }}/>
      </div>
      <button style={{
        width: 38, height: 38, border: '1px solid #E2E8F0', borderRadius: 10,
        background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: '#475569',
      }}>
        <i data-lucide="bell" style={{ width: 16, height: 16 }}></i>
      </button>
    </div>
  );
}

window.TopBar = TopBar;
