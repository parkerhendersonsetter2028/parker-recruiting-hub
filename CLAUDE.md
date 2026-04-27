# Campus Commit Hub — Project Context

## What this is

The **Campus Commit commercial fork** of the recruiting hub. Forked from Parker Henderson's personal hub on 2026-04-26 to become the prototype/working codebase for the Campus Commit SaaS — a multi-tenant product for high school volleyball families navigating college recruiting.

This is **not** Parker's personal tool. The original single-tenant personal hub still lives at the sibling path `~/Projects/Campus Commit/parker-recruiting-hub` and is unchanged. Tim continues to use it for Parker's actual recruiting; this repo is where the commercial product takes shape.

Brand: Campus Commit. Tagline: *Find Your Fit. Commit Your Future.* Initial sport scope at MVP: men's AND women's volleyball.

## Relationship to the broader project

- The full strategy / business plan / architecture spec / decisions log live in Tim's Google Drive at `My Drive/Campus Commit/` (sibling sections: `01_Strategy/`, `02_Architecture/`, `03_Product/`, `04_Operations/`, `05_Marketing/`).
- The Drive folder has its own `CLAUDE.md` that is the orientation map for the whole project; read `01_Strategy/Campus_Commit_Doc_Index.md` from there when working at the strategy/architecture level.
- This repo is the **app prototype** — UI, components, design system, frontend logic. Backend / multi-tenant / Stripe / RLS work has not yet started here; the canonical contract for that is `02_Architecture/Recruiting_Hub_Architecture_Spec_v0.1.pdf` + the v0.2 amendment in the Drive folder.

## Stack

- React 18 + Vite + Tailwind CSS 3.4 + lucide-react
- @dnd-kit/core, @dnd-kit/sortable for drag-and-drop reordering
- Netlify hosting + serverless functions (inherited from Parker hub; will be revisited for the commercial product)
- Netlify Blobs for storage in the prototype

## Design system

Lives at `handoff/` — vendored from `My Drive/Campus Commit/03_Product/design_system/handoff/`. Treat it as a drop-in kit (don't fork or edit `handoff/` files casually — they're the source of truth):

- `handoff/CLAUDE.md` + `handoff/README.md` — the rebrand instructions (read these for color/type/spacing rules)
- `handoff/tokens/colors_and_type.css` — CSS variables for both light and dark modes; imported in `src/index.css` before Tailwind
- `handoff/tailwind.preset.js` — extended via `tailwind.config.js` (gives `bg-cc-*`, `text-cc-*`, `font-display`, `rounded-cc-lg`, etc.)
- `handoff/components/` — reference React components — patterns to mirror, not a library to import
- `handoff/logos/` — brand marks (canonical copies in `public/brand/`)

### Token cheatsheet
- **Primary (interactive):** `bg-cc-accent` / `text-cc-accent` — flips light↔dark via CSS var. Use for CTAs, active states, badges.
- **Pure navy (literal hex):** `bg-cc-navy` / `cc-navy-700` — only for the deep-navy gradient hero panels (`bg-cc-grad-navy`) and their borders. Stays navy in both themes.
- **Surfaces:** `bg-cc-surface` (cards), `bg-cc-bg` (canvas), `bg-cc-surface-alt` (subtle), `border-cc-border`
- **Text:** `text-cc-fg` / `cc-muted` / `cc-subtle` / `cc-faint`
- **Tagging accents (personalization):** `cc-forest`, `cc-maroon`, `cc-purple`, `cc-orange`, `cc-light-blue` — never use these as primary brand color
- **Achievement only:** `cc-gold` — stars, AVCA rankings, brand crest accents
- **Type:** `font-display` (Oswald, ALL CAPS, +0.04em tracking) for headings, eyebrows, buttons, badges. `font-body` (Inter) is the default body font.
- **Radii:** `rounded-cc-sm` (6px buttons/badges), `rounded-cc-md` (12px inputs/tags), `rounded-cc-lg` (16px cards), `rounded-cc-xl` (24px hero cards)

When restyling components, sweep utility classes to use these tokens instead of raw Tailwind colors. Read `handoff/CLAUDE.md` for the full sweep checklist.

## Dark mode

A toggle (sun/moon icon in the sidebar header) flips the theme. Implementation:

- `src/lib/useTheme.js` — hook that reads localStorage (`cc-theme` key), falls back to `prefers-color-scheme`, persists on change, sets `document.documentElement.dataset.theme`
- `tailwind.config.js` has `darkMode: ['class', '[data-theme="dark"]']` — `dark:` variants resolve against the data attribute, not media query
- `src/index.css` has a CSS block that brightens the cc tagging text colors in dark mode (text-cc-forest → emerald-300, etc.) so dark-saturated hues stay readable on dark backgrounds
- Colored badge backgrounds use `bg-X-50 dark:bg-X-500/15` style pairs (translucent dark tints over the dark canvas)

When adding new colored elements, follow that pattern: the light-mode pale background gets a translucent (`/15` or `/20`) dark companion.

## Source layout

- `src/App.jsx` — composition root (~27 lines)
- `src/components/` — AppShell, Sidebar (with theme toggle), SchoolRow, CoachCard, ExecutiveSummary, MobileSchoolCard, SchoolLogo, Badges, FontStyle (now a no-op — tokens own type)
- `src/views/` — MasterView, DetailView, EmailTemplatesView, GmailDraftsView, SettingsView
- `src/lib/` — api.js, helpers.js, useTheme.js
- `src/data/` — schools.js, emailTemplates.js, coachPhotos.js, constants.js
- `src/context/` — React context providers
- `public/brand/` — Campus Commit brand marks (PNG + SVG); `public/favicon.ico` etc. are the cc favicons
- `handoff/` — vendored design-system kit (see above)

## Dev server

```
cd ~/Projects/Campus\ Commit/campus-commit-hub
npm run dev
```

Or via Claude Code's preview tools: `preview_start` with name `campus-commit-hub` (config in `.claude/launch.json`, port 5180). Note: launch.json is also registered in the Drive folder's `.claude/launch.json` so it's available from a Cowork session opened in the Drive root.

Node was installed via homebrew on 2026-04-26. If npm isn't on PATH, `/opt/homebrew/bin/npm` is the absolute path.

## Git remote

The cloned repo's `origin` was deliberately removed because it pointed at the local `parker-recruiting-hub` folder — pushing would have written this rebrand into Parker's repo. Add a real remote when the Campus Commit GitHub repo is created. Until then, all commits stay local.

## What's intentionally NOT done yet

- No multi-tenant auth, RLS, or Stripe — those are scoped in `02_Architecture/Recruiting_Hub_Architecture_Spec_v0.1.pdf` and haven't started here
- No women's volleyball data — schema/UI assumes men's at the moment, even though MVP scope per Decisions Log DE1 is both sports
- The Netlify Functions (Gmail OAuth, Discovery Engine via Anthropic, coach verification) are inherited from Parker hub and will be revisited for the commercial product — the Memory entry "project_template_only_outreach" notes that Campus Commit will be templates+mailto only, no in-app send / no Gmail OAuth at MVP. The current Gmail Drafts view is leftover Parker functionality that will eventually be removed or gated.
- Mobile sidebar slide-in styling hasn't been QA'd at small viewports

## Critical rules

- **Never** put `ANTHROPIC_API_KEY` client-side. Server-side via `claude-discovery.js` only.
- **Never** push to `origin` if you re-add it pointing at parker-recruiting-hub.
- Don't edit files inside `handoff/` casually — that's the vendored design system. If you need to change tokens, do it in the upstream Drive folder and re-vendor.
- Make targeted, surgical edits. Avoid wholesale rewrites that risk breaking working features.
- When restyling, sweep against the design system token cheatsheet above. Don't introduce raw Tailwind colors when a `cc-*` token exists.
