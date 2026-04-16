import React from 'react';
import { ShieldCheck, Star, Plane, Church, Check, BarChart3, Target, Trophy } from 'lucide-react';

// ─── EXECUTIVE SUMMARY ───────────────────────────────────────────────────────
export const ExecutiveSummary = ({ school }) => {
  const fit = school.parkerFit;
  if (!fit) return null;
  const interests = [
    fit.business && { icon: <Star className="w-3.5 h-3.5" />, label: "Business", color: "bg-blue-50 border-blue-200 text-blue-700" },
    fit.aviation && { icon: <Plane className="w-3.5 h-3.5" />, label: "Aviation", color: "bg-sky-50 border-sky-200 text-sky-700" },
    fit.theology && { icon: <Church className="w-3.5 h-3.5" />, label: "Faith/Theology", color: "bg-purple-50 border-purple-200 text-purple-700" },
  ].filter(Boolean);

  const notFit = [
    !fit.business && "Business",
    !fit.aviation && "Aviation",
    !fit.theology && "Theology",
  ].filter(Boolean);

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 mb-8"
      style={{ background: "linear-gradient(135deg, #0f2044 0%, #1e3a8a 100%)" }}>
      <div className="px-6 pt-5 pb-2 flex items-center gap-3">
        <ShieldCheck className="text-blue-300 w-5 h-5 flex-shrink-0" />
        <div>
          <div className="text-blue-300 text-[10px] font-bold uppercase tracking-widest">Parker Henderson · Brophy CP '29 · AZ Fear 17s · Setter</div>
          <div className="text-white font-black text-lg leading-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            WHY {school.name.toUpperCase()} IS A FIT
          </div>
        </div>
      </div>
      <div className="px-6 pb-5">
        <p className="text-blue-100 text-sm leading-relaxed mb-4">{fit.notes}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {interests.map(({ icon, label, color }) => (
            <span key={label} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${color}`}>
              {icon} {label} <Check className="w-3 h-3" />
            </span>
          ))}
          {notFit.map(label => (
            <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-600 bg-white/5 text-slate-400 text-xs font-bold">
              {label} —
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-blue-300 border-t border-white/10 pt-3">
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> {school.divLevel} · {school.conference}</span>
          <span className="inline-flex items-center gap-1.5"><BarChart3 className="w-3.5 h-3.5" /> Setter Need: <strong className="text-white">{school.setterNeed}</strong></span>
          <span className="inline-flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> Priority: <strong className="text-white">{school.priority}</strong></span>
          {school.programRank && school.programRank !== "NR" && <span className="inline-flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5" /> AVCA <strong className="text-amber-300">{school.programRank}</strong></span>}
        </div>
      </div>
    </div>
  );
};
