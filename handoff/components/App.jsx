// App - root component, wires screens together
function App() {
  const [onboarded, setOnboarded] = React.useState(true);
  const [view, setView] = React.useState('dashboard');
  const [openSchool, setOpenSchool] = React.useState(null);
  const [saved, setSaved] = React.useState({ um: true });

  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });

  const toggleSave = (id) => setSaved(s => ({ ...s, [id]: !s[id] }));
  const handleOpenSchool = (s) => setOpenSchool(s);
  const handleBack = () => setOpenSchool(null);

  if (!onboarded) {
    return <Onboarding onComplete={() => setOnboarded(true)}/>;
  }

  if (openSchool) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#F1F4F9' }}>
        <Sidebar view={view} onNav={(v) => { setView(v); setOpenSchool(null); }}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <SchoolDetail school={openSchool} onBack={handleBack}
            saved={saved[openSchool.id]} toggleSave={() => toggleSave(openSchool.id)}/>
        </div>
      </div>
    );
  }

  const titles = {
    dashboard: { title: 'Dashboard', subtitle: 'Class of 2027 \u00b7 Setter' },
    schools:   { title: 'Schools',   subtitle: '24 matches \u00b7 sorted by FitScore' },
    compare:   { title: 'Compare',   subtitle: 'Side-by-side analysis' },
    favorites: { title: 'Favorites', subtitle: 'Saved programs' },
    messages:  { title: 'Messages',  subtitle: 'Coach inbox' },
    profile:   { title: 'Profile',   subtitle: 'Athlete settings' },
  };
  const t = titles[view] || titles.dashboard;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F1F4F9' }}>
      <Sidebar view={view} onNav={setView}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <TopBar title={t.title} subtitle={t.subtitle}/>
        {view === 'dashboard' && <Dashboard onOpenSchool={handleOpenSchool} saved={saved} toggleSave={toggleSave}/>}
        {view === 'schools'   && <MatchResults onOpenSchool={handleOpenSchool} saved={saved} toggleSave={toggleSave}/>}
        {view === 'compare'   && <Compare/>}
        {(view === 'favorites' || view === 'messages' || view === 'profile') && (
          <div style={{ padding: 60, textAlign: 'center', color: '#94A3B8',
            fontFamily: "'Inter', sans-serif" }}>
            <i data-lucide="inbox" style={{ width: 32, height: 32 }}></i>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700,
              fontSize: 18, color: '#0D1B3D', letterSpacing: '.04em',
              textTransform: 'uppercase', marginTop: 12 }}>{t.title} \u2014 coming up</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>This screen would live here in the production app.</div>
          </div>
        )}
      </div>
    </div>
  );
}

window.App = App;
