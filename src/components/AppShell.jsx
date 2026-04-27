import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { FontStyle } from './FontStyle.jsx';
import { Sidebar } from './Sidebar.jsx';
import { useApp } from '../context/AppContext.jsx';

const PAGE_TITLES = {
  master: 'Schools',
  detail: 'School Detail',
  email: 'Email Templates',
  gmail: 'Gmail Drafts',
  settings: 'Settings',
};

export function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { view, sel } = useApp();
  const pageTitle = view === 'detail' && sel ? sel.name : PAGE_TITLES[view] || 'Recruiting Hub';

  return (
    <div className="min-h-screen flex bg-cc-bg">
      <FontStyle />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <div className="md:hidden bg-cc-surface border-b border-cc-border px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-cc-sm hover:bg-cc-bg text-cc-muted"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <img src="/brand/cc-monogram.png" alt="Campus Commit" className="w-6 h-6 flex-shrink-0" />
            <div className="font-display uppercase text-cc-fg text-sm tracking-cc-wide truncate">
              {pageTitle.toUpperCase()}
            </div>
          </div>
        </div>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
