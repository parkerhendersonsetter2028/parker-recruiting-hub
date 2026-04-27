// Onboarding - 4-step wizard
function Onboarding({ onComplete }) {
  const [step, setStep] = React.useState(1);
  const [data, setData] = React.useState({ sport: 'Volleyball', position: 'Setter', gpa: 3.85, budget: 30000 });

  const steps = ['Sport', 'Position', 'Academics', 'Preferences'];

  return (
    <div style={{ minHeight: '100vh', background: '#F1F4F9', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 32,
      fontFamily: "'Inter', sans-serif" }}>
      <div style={{ width: 520, background: '#fff', borderRadius: 20,
        padding: 32, boxShadow: '0 12px 32px rgb(0 27 61 / 0.10)',
        border: '1px solid #E2E8F0' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <img src="../../assets/cc-monogram.png" width="36" height="36"/>
          <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700,
            fontSize: 18, color: '#0D1B3D', letterSpacing: '.04em' }}>CAMPUS COMMIT</div>
        </div>

        {/* Stepper */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
          {steps.map((s, i) => {
            const idx = i + 1;
            const active = step === idx;
            const done = step > idx;
            return (
              <div key={s} style={{ flex: 1 }}>
                <div style={{ height: 4, borderRadius: 4,
                  background: done ? '#D4AF37' : active ? '#0D1B3D' : '#E2E8F0' }}/>
                <div style={{ fontSize: 10, fontWeight: 700, marginTop: 8,
                  color: active || done ? '#0D1B3D' : '#94A3B8',
                  letterSpacing: '.08em', textTransform: 'uppercase' }}>
                  {idx}. {s}
                </div>
              </div>
            );
          })}
        </div>

        <h2 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700,
          fontSize: 26, color: '#0D1B3D', letterSpacing: '.02em',
          textTransform: 'uppercase', margin: '0 0 6px', lineHeight: 1.1 }}>
          {step === 1 && 'Pick your sport'}
          {step === 2 && 'Your position'}
          {step === 3 && 'Academic profile'}
          {step === 4 && 'What matters most'}
        </h2>
        <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 24px' }}>
          {step === 1 && 'We\u2019ll match you against programs in your sport.'}
          {step === 2 && 'Position need is a major FitScore input.'}
          {step === 3 && 'GPA helps us match academic-fit schools.'}
          {step === 4 && 'Set your budget so we know what\u2019s realistic.'}
        </p>

        {step === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {['Volleyball','Basketball','Football','Soccer','Baseball','Track & Field'].map(s => (
              <button key={s} onClick={() => setData({ ...data, sport: s })} style={{
                padding: 14, borderRadius: 12,
                border: data.sport === s ? '2px solid #0D1B3D' : '1px solid #E2E8F0',
                background: data.sport === s ? '#F1F4F9' : '#fff',
                fontWeight: 700, fontSize: 13, color: '#0D1B3D',
                cursor: 'pointer', textAlign: 'left',
                fontFamily: "'Inter', sans-serif",
              }}>{s}</button>
            ))}
          </div>
        )}

        {step === 2 && (
          <select value={data.position} onChange={e => setData({...data, position: e.target.value})}
            style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid #E2E8F0',
              fontSize: 14, fontFamily: "'Inter', sans-serif" }}>
            {['Setter','Outside Hitter','Middle Blocker','Libero','Opposite'].map(p =>
              <option key={p}>{p}</option>)}
          </select>
        )}

        {step === 3 && (
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#64748B',
              letterSpacing: '.08em', textTransform: 'uppercase' }}>GPA</label>
            <input type="number" step="0.01" value={data.gpa}
              onChange={e => setData({...data, gpa: e.target.value})}
              style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid #E2E8F0',
                fontSize: 14, marginTop: 6, fontFamily: "'Inter', sans-serif" }}/>
          </div>
        )}

        {step === 4 && (
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#64748B',
              letterSpacing: '.08em', textTransform: 'uppercase' }}>Annual budget</label>
            <input type="range" min="0" max="80000" step="1000" value={data.budget}
              onChange={e => setData({...data, budget: e.target.value})}
              style={{ width: '100%', marginTop: 12 }}/>
            <div style={{ display: 'flex', justifyContent: 'space-between',
              fontSize: 11, color: '#94A3B8', marginTop: 6 }}>
              <span>$0</span>
              <span style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700,
                fontSize: 18, color: '#0D1B3D' }}>${Number(data.budget).toLocaleString()}</span>
              <span>$80k</span>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} style={{
              padding: '12px 20px', borderRadius: 10, border: '1px solid #E2E8F0',
              background: '#fff', fontWeight: 700, fontSize: 12,
              letterSpacing: '.08em', textTransform: 'uppercase',
              color: '#475569', cursor: 'pointer',
              fontFamily: "'Inter', sans-serif",
            }}>Back</button>
          )}
          <button onClick={() => step === 4 ? onComplete() : setStep(step + 1)} style={{
            marginLeft: 'auto', padding: '12px 24px', borderRadius: 10,
            background: 'linear-gradient(135deg, #1E3A8A, #0D1B3D)',
            color: '#fff', border: 'none', fontWeight: 700, fontSize: 12,
            letterSpacing: '.08em', textTransform: 'uppercase',
            cursor: 'pointer', fontFamily: "'Inter', sans-serif",
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            {step === 4 ? 'See My Matches' : 'Continue'}
            <i data-lucide="arrow-right" style={{ width: 14, height: 14 }}></i>
          </button>
        </div>
      </div>
    </div>
  );
}

window.Onboarding = Onboarding;
