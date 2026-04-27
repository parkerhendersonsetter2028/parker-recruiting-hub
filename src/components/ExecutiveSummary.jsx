import React from 'react';
import { ShieldCheck, Star, Plane, Church, Check, BarChart3, Target, Trophy } from 'lucide-react';

// ─── EXECUTIVE SUMMARY ───────────────────────────────────────────────────────
export const ExecutiveSummary = ({ school }) => {
  const fit = school.parkerFit;
  if (!fit) return null;
  const interests = [
    fit.business && { icon: <Star className="w-3.5 h-3.5" />, label: "Business",       chip: "bg-white/10 border-white/20 text-white" },
    fit.aviation && { icon: <Plane className="w-3.5 h-3.5" />, label: "Aviation",      chip: "bg-white/10 border-white/20 text-white" },
    fit.theology && { icon: <Church className="w-3.5 h-3.5" />, label: "Faith/Theology", chip: "bg-white/10 border-white/20 text-white" },
  ].filter(Boolean);

  const notFit = [
    !fit.business && "Business",
    !fit.aviation && "Aviation",
    !fit.theology && "Theology",
  ].filter(Boolean);

  return (
    <div className="rounded-cc-xl overflow-hidden shadow-cc-card border border-cc-navy-700 mb-8 bg-cc-grad-navy">
      <div className="px-6 pt-5 pb-2 flex items-center gap-3">
        <ShieldCheck className="text-cc-gold w-5 h-5 flex-shrink-0" />
        <div>
          <div className="text-cc-gold text-[10px] font-bold uppercase tracking-cc-widest">
            Parker Henderson · Brophy CP '29 · AZ Fear 17s · Setter
          </div>
          <div className="text-white font-display text-2xl uppercase tracking-cc-wide leading-tight">
            Why {school.name} is a fit
          </div>
        </div>
      </div>
      <div className="px-6 pb-5">
        <p className="text-white/80 text-cc-body leading-relaxed mb-4">{fit.notes}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {interests.map(({ icon, label, chip }) => (
            <span key={label} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-cc-wider ${chip}`}>
              {icon} {label} <Check className="w-3 h-3 text-cc-gold" />
            </span>
          ))}
          {notFit.map(label => (
            <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/40 text-xs font-semibold uppercase tracking-cc-wider">
              {label} —
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-white/70 border-t border-white/10 pt-3">
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> {school.divLevel} · {school.conference}</span>
          <span className="inline-flex items-center gap-1.5"><BarChart3 className="w-3.5 h-3.5" /> Setter Need: <strong className="text-white">{school.setterNeed}</strong></span>
          <span className="inline-flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> Priority: <strong className="text-white">{school.priority}</strong></span>
          {school.programRank && school.programRank !== "NR" && (
            <span className="inline-flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-cc-gold" /> AVCA <strong className="text-cc-gold">{school.programRank}</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
