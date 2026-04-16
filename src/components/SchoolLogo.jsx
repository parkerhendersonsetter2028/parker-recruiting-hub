import React, { useState } from 'react';
import { domainFromUrl } from '../lib/helpers.js';

// ─── LOGO COMPONENT (multi-source with fallback) ──────────────────────────────
export const SchoolLogo = ({ school, size = "md" }) => {
  const sizes = { xs: 32, sm: 40, md: 48, lg: 80 };
  const px = sizes[size];
  const cls = `flex-shrink-0 rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden flex items-center justify-center`;
  const style = { width: px, height: px, minWidth: px };

  const domain = domainFromUrl(school?.logoUrl || school?.url || "");
  const [srcIdx, setSrcIdx] = useState(0);

  const sources = domain ? [
    `https://logo.clearbit.com/${domain}`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
  ] : [];

  if (sources.length && srcIdx < sources.length) {
    return (
      <div className={cls} style={style}>
        <img
          src={sources[srcIdx]}
          alt={school?.name}
          style={{ width: "85%", height: "85%", objectFit: "contain" }}
          onError={() => setSrcIdx(i => i + 1)}
        />
      </div>
    );
  }
  // letter fallback
  const colors = ["bg-blue-600","bg-violet-600","bg-emerald-600","bg-orange-500","bg-slate-600","bg-rose-600"];
  const colorIdx = (school?.name?.charCodeAt(0) || 0) % colors.length;
  return (
    <div className={`${cls} ${colors[colorIdx]} border-0`} style={style}>
      <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, color: "white", fontSize: px * 0.45 }}>
        {school?.name?.charAt(0) || "?"}
      </span>
    </div>
  );
};
