import React, { useState } from 'react';
import { Menu, ShieldCheck } from 'lucide-react';
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
    <div className="min-h-screen flex" style={{ background: '#f1f4f9' }}>
      <FontStyle />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <div
              className="font-black text-slate-800 text-sm tracking-wide truncate"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              {pageTitle.toUpperCase()}
            </div>
          </div>
        </div>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
