import React from 'react';
import { LayoutDashboard, Mail, Send, Settings, ShieldCheck, X, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { PARKER } from '../data/constants.js';

const NAV_ITEMS = [
  { id: 'master',   label: 'Schools',         icon: LayoutDashboard, description: 'Program pipeline' },
  { id: 'email',    label: 'Email Templates', icon: Mail,            description: 'Outreach copy' },
  { id: 'gmail',    label: 'Gmail Drafts',    icon: Send,            description: 'Bulk drafting' },
  { id: 'settings', label: 'Settings',        icon: Settings,        description: 'Profile & preferences' },
];

export function Sidebar({ open, onClose }) {
  const { view, setView, allSchools, contacted, setOpenDiscovery } = useApp();

  const isActive = (id) => {
    if (id === 'master') return view === 'master' || view === 'detail';
    return view === id;
  };

  const handleNav = (id) => {
    setView(id);
    onClose?.();
  };

  const initials = PARKER.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <>
      {/* Mobile backdrop */}
      {open && <div className="md:hidden fixed inset-0 bg-black/40 z-30" onClick={onClose} />}

      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 flex-shrink-0 border-r border-slate-200 bg-white transform transition-transform md:transform-none ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Brand header */}
          <div className="px-5 py-5 border-b border-slate-100 flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #1e3a8a, #0f172a)' }}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div
                className="font-black text-slate-900 text-sm leading-tight truncate"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.02em' }}
              >
                RECRUITING HUB
              </div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                Men's Volleyball
              </div>
            </div>
            <button
              onClick={onClose}
              className="ml-auto md:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Primary CTA — Discovery Engine */}
          <div className="px-3 pt-3">
            <button
              onClick={() => { setOpenDiscovery(true); handleNav('master'); }}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-white text-sm font-bold transition-all shadow-sm hover:shadow"
              style={{ background: 'linear-gradient(135deg, #2563eb, #1e3a8a)' }}
            >
              <Sparkles className="w-4 h-4" />
              <span>Discover a Program</span>
            </button>
          </div>

          {/* Nav list */}
          <nav className="flex-1 overflow-y-auto px-3 pt-4 pb-3 space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Workspace
            </div>
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const active = isActive(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                    active ? 'bg-blue-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                  <div className="min-w-0 flex-1">
                    <div className={`text-sm font-bold leading-tight ${active ? 'text-blue-700' : 'text-slate-700'}`}>
                      {item.label}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">{item.description}</div>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Athlete card at bottom */}
          <div className="px-3 pb-4">
            <div className="rounded-xl p-3 border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50/40">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {initials}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-900 leading-tight truncate">{PARKER.name}</div>
                  <div className="text-[10px] text-slate-500 font-medium truncate">
                    {PARKER.pos} · Class of {PARKER.grad}
                  </div>
                </div>
              </div>
              <div className="mt-2.5 grid grid-cols-2 gap-1.5 text-center">
                <div className="bg-white rounded-lg py-1.5 border border-slate-100">
                  <div
                    className="text-sm font-black text-slate-800 leading-none"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    {allSchools.length}
                  </div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-wide mt-0.5">Tracked</div>
                </div>
                <div className="bg-white rounded-lg py-1.5 border border-slate-100">
                  <div
                    className="text-sm font-black text-emerald-600 leading-none"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    {contacted}
                  </div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-wide mt-0.5">Active</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
