import React from 'react';
import { DIV_CONFIG, STATUSES } from '../data/constants.js';

// ─── BADGE COMPONENTS ─────────────────────────────────────────────────────────
export const DivBadge = ({ divLevel, size = "sm" }) => {
  const cfg = DIV_CONFIG[divLevel] || DIV_CONFIG["NAIA"];
  return size === "lg"
    ? <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase ${cfg.bg} ${cfg.text}`} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{cfg.label}</span>
    : <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${cfg.bg} ${cfg.text}`} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{cfg.label}</span>;
};

export const PriorityBadge = ({ priority }) => {
  const map = { Reach: "bg-red-50 text-red-600 border-red-200", Target: "bg-sky-50 text-sky-600 border-sky-200", Safety: "bg-green-50 text-green-600 border-green-200" };
  return <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${map[priority] || "bg-slate-100 text-slate-500 border-slate-200"}`}>{priority}</span>;
};

export const StatusBadge = ({ statusKey }) => {
  const s = STATUSES.find(x => x.key === statusKey) || STATUSES[0];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${s.bg} ${s.text}`}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.dot }} />
      {s.label}
    </span>
  );
};

export const NeedBadge = ({ need }) => {
  const map = { High: "bg-rose-50 text-rose-600", Med: "bg-amber-50 text-amber-600", Low: "bg-slate-100 text-slate-400" };
  return <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${map[need] || "bg-slate-100 text-slate-400"}`}>{need || "?"} need</span>;
};
