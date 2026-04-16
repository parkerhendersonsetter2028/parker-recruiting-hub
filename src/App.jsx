import React from 'react';
import { AppProvider, useApp } from './context/AppContext.jsx';
import { AppShell } from './components/AppShell.jsx';
import { MasterView } from './views/MasterView.jsx';
import { DetailView } from './views/DetailView.jsx';
import { EmailTemplatesView } from './views/EmailTemplatesView.jsx';
import { GmailDraftsView } from './views/GmailDraftsView.jsx';
import { SettingsView } from './views/SettingsView.jsx';

function Router() {
  const { view, sel, allSchools, setView } = useApp();
  if (view === 'detail' && sel) return <DetailView />;
  if (view === 'gmail') return <GmailDraftsView allSchools={allSchools} onBack={() => setView('master')} />;
  if (view === 'email') return <EmailTemplatesView school={sel} onBack={() => sel ? setView('detail') : setView('master')} />;
  if (view === 'settings') return <SettingsView />;
  return <MasterView />;
}

export default function App() {
  return (
    <AppProvider>
      <AppShell>
        <Router />
      </AppShell>
    </AppProvider>
  );
}
