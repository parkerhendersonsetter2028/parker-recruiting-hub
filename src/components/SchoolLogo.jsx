import React, { useState } from 'react';
import { domainFromUrl } from '../lib/helpers.js';

// ─── LOGO COMPONENT (multi-source with fallback) ──────────────────────────────
export const SchoolLogo = ({ school, size = "md" }) => {
  const sizes = { xs: 32, sm: 40, md: 48, lg: 80 };
  const px = sizes[size];
  const cls = `flex-shrink-0 rounded-cc-md bg-cc-surface border border-cc-border shadow-cc-card overflow-hidden flex items-center justify-center`;
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
  // letter fallback — pick from cc tagging palette so it harmonizes with the rest of the app
  const colors = ["bg-cc-accent", "bg-cc-purple", "bg-cc-forest", "bg-cc-orange", "bg-cc-maroon", "bg-cc-light-blue"];
  const colorIdx = (school?.name?.charCodeAt(0) || 0) % colors.length;
  return (
    <div className={`${cls} ${colors[colorIdx]} border-0`} style={style}>
      <span
        className="font-display tracking-cc-wide text-white"
        style={{ fontSize: px * 0.45 }}
      >
        {school?.name?.charAt(0) || "?"}
      </span>
    </div>
  );
};
