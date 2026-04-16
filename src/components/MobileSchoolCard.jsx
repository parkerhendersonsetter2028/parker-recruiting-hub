import React from 'react';
import { ChevronRight, MapPin } from 'lucide-react';
import { SchoolLogo } from './SchoolLogo.jsx';
import { DivBadge, PriorityBadge, StatusBadge, NeedBadge } from './Badges.jsx';
import { useApp } from '../context/AppContext.jsx';

// Compact card layout used below the md breakpoint (where a table is unusable)
export function MobileSchoolCard({ school }) {
  const { statuses, navigate } = useApp();
  const s = school;
  const sStatus = statuses[s.id] || 'None';
  const headCoach = s.coaches?.[0];
  return (
    <button
      onClick={() => navigate(s)}
      className="w-full text-left bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow transition-all active:scale-[0.99]"
    >
      <div className="flex items-start gap-3">
        <SchoolLogo school={s} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="font-bold text-slate-900 text-sm leading-tight">{s.name}</div>
              <div className="flex items-center gap-1 mt-0.5 text-[11px] text-slate-500">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{s.city}, {s.state}</span>
                {s.conference && <span className="truncate">· {s.conference}</span>}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 mt-1 flex-shrink-0" />
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            <DivBadge divLevel={s.divLevel} />
            <PriorityBadge priority={s.priority} />
            <NeedBadge need={s.setterNeed} />
          </div>
          <div className="flex items-center justify-between mt-2.5">
            <StatusBadge statusKey={sStatus} />
            {headCoach?.name && headCoach.name !== 'Head Coach TBD' && (
              <span className="text-[11px] text-slate-500 truncate">{headCoach.name}</span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
