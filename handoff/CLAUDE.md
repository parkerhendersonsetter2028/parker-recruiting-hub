# Campus Commit — Rebrand Instructions

You are rebranding an existing app to the **Campus Commit** design system. The app's logic, routes, and component structure should stay intact. **Only the visual layer changes**: colors, type, spacing, radii, shadows, casing, copy voice, and brand marks.

> **Brand line:** *Find Your Fit. Commit Your Future.*
> **Positioning:** elite college athletics × modern AI platform. Confident, structured, aspirational. Never cute, never SaaS-jargony.

---

## How to use this folder

```
handoff/
├── CLAUDE.md                  ← this file (read first)
├── README.md                  ← human-friendly overview
├── tokens/
│   └── colors_and_type.css    ← all CSS variables (light + dark)
├── tailwind.preset.js         ← drop-in Tailwind theme extension
├── components/                ← reference React/JSX components
│   ├── _preview.html          ← open in a browser to see them
│   ├── Sidebar.jsx, TopBar.jsx, Dashboard.jsx, …
│   └── Badges.jsx, SchoolCard.jsx, MatchRing.jsx, …
└── logos/                     ← brand marks (varsity-collegiate set)
    ├── cc-primary-logo.png     ← canonical horizontal banner (mark + wordmark + tagline)
    ├── cc-horizontal-lockup    ← same as primary, for clarity
    ├── cc-banner               ← horizontal banner, NO tagline (for nav bars, mobile, social)
    ├── cc-banner-navy          ← banner in all-navy
    ├── cc-banner-white         ← banner reversed for dark backgrounds
    ├── cc-monogram             ← CC mark only
    ├── cc-stacked              ← monogram + wordmark + tagline, vertical
    ├── cc-wordmark             ← "CAMPUS COMMIT" only
    ├── cc-onecolor-navy        ← full lockup, all navy
    ├── cc-onecolor-white       ← full lockup, white on navy
    ├── cc-shield               ← CC inside athletic crest
    ├── cc-app-icon             ← navy rounded square w/ gold trim, white CC
    ├── cc-app-icon-{16..512}.png  ← raster sizes
    ├── cc-badge-stamp          ← circular varsity letter patch
    ├── cc-favicon.ico / .png   ← favicon
    ├── wave-motif.svg          ← hero background motif
    └── _preview.html           ← open to view all marks
```

---

## Step 1 — Detect the stack and install tokens

Inspect `package.json` and the existing styles. Then choose **one** path:

### A. Tailwind project
1. Copy `tokens/colors_and_type.css` to the app's global CSS entry (e.g. `src/index.css`, `app/globals.css`). Import it **before** Tailwind's `@tailwind base`.
2. Extend the Tailwind theme with `handoff/tailwind.preset.js`:
   ```js
   // tailwind.config.js
   const ccPreset = require('./handoff/tailwind.preset.js');
   module.exports = {
     presets: [ccPreset],
     content: [/* keep existing globs */],
   };
   ```
3. **Migrate utility classes** as you touch files:
   - `bg-white` → keep, but containers go `bg-[var(--surface)]` or `bg-cc-surface`
   - `bg-gray-50` / `bg-slate-50` → `bg-cc-bg`
   - `text-gray-900` → `text-cc-fg`
   - `text-gray-500/600` → `text-cc-muted`
   - `border-gray-200` → `border-cc-border`
   - `bg-blue-600` / primary actions → `bg-cc-navy text-white`
   - `rounded-lg` on cards → `rounded-cc-lg` (16px)
   - `rounded-md` on buttons → `rounded-cc-sm` (6px)
   - shadows: `shadow-sm` → `shadow-cc-card`, hover → `shadow-cc-hover`
   - fonts: headings → `font-display uppercase tracking-wide`; body stays `font-body`

### B. CSS Modules / plain CSS / styled-components
1. Copy `tokens/colors_and_type.css` to a global stylesheet imported once at the app root.
2. **Replace hard-coded values with CSS variables** in component styles:
   - `#fff` / `white` → `var(--surface)`
   - any `#f5...` / `#f8...` page bg → `var(--bg)`
   - any `#000` / `#111` / `#1a...` text → `var(--fg)`
   - greys for muted text → `var(--fg-muted)` or `var(--fg-subtle)`
   - existing brand/primary color → `var(--navy)`
   - any accent/star/featured color → `var(--gold)`
   - border greys → `var(--border)`
3. Replace ad-hoc px values for radii/shadows with the tokens (`--r-sm`, `--r-lg`, `--shadow-card`).

### C. UI library (MUI / Chakra / shadcn)
1. Still copy `tokens/colors_and_type.css` for the type scale and gold accents.
2. Open the library's theme config and overwrite:
   - `primary.main` → `#0D1B3D` (navy)
   - `secondary.main` → `#D4AF37` (gold) — use sparingly
   - `background.default` → `#F1F4F9`
   - `background.paper` → `#FFFFFF`
   - typography: heading family `'Oswald', sans-serif` (uppercase, +0.04em tracking), body `'Inter', sans-serif`
   - shape: card radius `16`, button radius `6`
3. Keep the library's components — just restyled.

> **If you're unsure which stack the app uses, stop and ask the user before guessing.**

---

## Step 2 — Apply the visual system

These rules are non-negotiable. Sweep every screen.

### Color
- **Navy `#0D1B3D` is the workhorse** — primary buttons, headings, sidebar, brand chrome.
- **Gold `#D4AF37` is sparing** — stars, achievement badges, the gold ring on the brand crest, dark-mode highlights. **Never** use gold as a primary action color or as a default heading color.
- Page canvas is **`#F1F4F9` (cool slate)**, not pure white.
- Cards are `#FFFFFF` with a 1px `#E2E8F0` border + soft shadow.
- **Accent gray `#6B7A90`** — used for the tagline beneath the wordmark (and only for muted descriptive text adjacent to the brand mark; for general body copy use the slate scale below).
- Secondary accents (forest, maroon, purple, orange, light blue) are **only for personalization tags**: priority levels, status states, division badges, team cards. Never as primary brand color.
- Dark mode canvas is **deep navy `#04112A`**, never pure black. Cards are charcoal `#0B1B3A`.

### Type
- **Headings**: `Oswald` (loaded via Google Fonts in the tokens file). **ALL CAPS**, `letter-spacing: 0.04em` (or `tracking-wide` in Tailwind). Title-case when not all caps.
- **Body**: `Inter`, sentence case, normal tracking.
- **Eyebrows / nav / tabs / buttons / badges**: ALL CAPS, `letter-spacing: 0.06–0.08em`.
- **Big stat numerals**: `font-display`, tabular numerals.
- Type scale: H1 48/52, H2 36/42, H3 28/34, body 15/22. Don't invent sizes — pick from the scale in `tokens/colors_and_type.css`.

### Spacing & layout
- 8pt grid: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.
- Card padding: 20–32px.
- Generous whitespace, especially around stat numerals.
- Sticky sidebar `w-64` on desktop, sticky top bar on mobile.

### Borders & radii
- Buttons & badges: `6px`
- Inputs & tags: `12px`
- Cards: `16px`
- Hero cards: `24px`
- Pills: full-rounded
- Borders: 1px `#E2E8F0`. Cards usually use border + small shadow rather than border alone.

### Shadows
- Card: `0 1px 2px rgb(0 0 0 / 0.04), 0 1px 3px rgb(0 0 0 / 0.06)`
- Hover lift: same + `0 4px 12px rgb(0 27 61 / 0.10)`
- Modals/popovers: `0 12px 32px rgb(0 27 61 / 0.16)`

### Hover & press
- Hover: subtle bg tint, icon shifts from slate-400 → navy/blue-600, button fill 4–6% darker.
- Press: `active:scale-[0.99]` on cards, `active:translate-y-px` on buttons.
- Focus: 2px navy ring, offset 2px.
- **No bouncy springs. No parallax. No glassmorphism.**

### Animation
- 150–220ms ease-out for state transitions. That's it.
- The wave motif may fade in once on hero load (800ms ease-out).

### Iconography
- **`lucide-react`** is the icon library. Stroke 1.5–2px, sized 14/16/20/24. Color inherits from `currentColor` — slate-400 default, navy or gold active.
- Common icons: `ShieldCheck`, `Sparkles`, `Trophy`, `Star`, `Target`, `Compass`, `LayoutDashboard`, `Search`, `Mail`, `Send`, `Settings`, `MapPin`, `GraduationCap`, `TrendingUp`, `Users`, `Calendar`, `ChevronRight`.
- **No emoji.** Replace any 🎉 / ✨ / 🚀 with a lucide icon or the gold star motif.
- Allowed unicode: `↗` (external), `↑↓→` (trends), `·` (separator). That's it.

### Brand marks

The canonical brand mark is **`cc-primary-logo.png`** — a horizontal varsity-collegiate banner: interlocking navy + gold "CC" monogram on the left, a gold star + vertical rule, and "CAMPUS COMMIT" wordmark stacked on the right with the **"FIND YOUR FIT."** tagline (centered under "COMMIT", flanked by short gold rules). All variants in `handoff/logos/` are derived from it. Open `handoff/_preview.html` to see them all.

**Variants shipped:**
- `cc-primary-logo` / `cc-horizontal-lockup` — full horizontal banner (mark + wordmark + tagline). Same artwork.
- `cc-banner` — **horizontal banner without tagline.** Use for mobile headers, nav bars, social profile banners, app top bars — anywhere the full lockup would be too small to read.
- `cc-banner-navy` — `cc-banner` in all-navy.
- `cc-banner-white` — `cc-banner` reversed (white on navy) for dark backgrounds.
- `cc-monogram` — interlocking CC mark only.
- `cc-stacked` — monogram on top of "CAMPUS COMMIT" wordmark, tagline beneath. Use in tall/square spaces.
- `cc-wordmark` — "CAMPUS COMMIT" type only, no mark, no tagline.
- `cc-onecolor-navy` — full lockup, all navy. Use on light backgrounds where the gold would clash with surrounding accents.
- `cc-onecolor-white` — full lockup, all white on navy. For dark-mode hero areas, navy footers, swag.
- `cc-shield` — CC inside an athletic crest, for achievement / "verified" contexts.
- `cc-app-icon` — navy rounded square with gold trim, white CC inside. iOS / Android / PWA / OS.
- `cc-badge-stamp` — circular varsity letter patch. Use for "Top Match" / "Verified" stickers.
- `cc-favicon.ico` + `cc-app-icon-{16,32,64,128,256,512}.png` — favicon set.

**Size tier rules — pick the variant by available width:**

| Available width | Use this variant |
|---|---|
| ≥ 300px | `cc-primary-logo` (full lockup with tagline) |
| 120–300px | `cc-banner` (no tagline) — **this is the right call for almost every app header, nav bar, and mobile top bar** |
| < 120px | `cc-monogram` (icon only) |

Below 120px the wordmark stops being readable; don't try to scale `cc-banner` smaller — switch to the monogram.

**Use the right variant for the right context:**

- **Mobile header / app top bar / nav bar / website header / social banner** → `cc-banner.svg` — this is the workhorse for every small horizontal placement
- **Sidebar collapsed / favicon-style chrome** → `cc-monogram.svg` at 32–40px (or `cc-shield.svg` for achievement contexts)
- **Marketing splash / login / wide hero** → `cc-primary-logo.png` (full banner with tagline)
- **Tall headers, login splash, square social tiles** → `cc-stacked.svg`
- **On a dark/navy hero or footer (with tagline)** → `cc-onecolor-white.svg`; **without tagline** → `cc-banner-white.svg`
- **On a busy color background where gold would conflict** → `cc-onecolor-navy.svg` or `cc-banner-navy.svg`
- **Footer where icon already appears elsewhere** → `cc-wordmark.svg`
- **Favicon** → `cc-favicon.ico` (link in `<head>`); for high-DPI / PWA also link `cc-app-icon-{192,256,512}.png`
- **OS app icon / iOS / Android** → `cc-app-icon.svg` (or the matching PNG size)
- **"Top Match" / "Verified Profile" / achievement stamp** → `cc-badge-stamp.svg`
- **Hero background** → `wave-motif.svg` at low contrast (5–10% opacity over navy)

**Color rule for the marks:** never recolor them. Navy = `#0D1B3D`, gold = `#D4AF37`, tagline gray = `#6B7A90`. If you need the mark on a navy background, use `cc-onecolor-white` — don't try to invert the colored versions yourself.

**Clear space:** keep at least the height of the gold inner C on all sides of any mark. Don't crop, rotate, skew, add drop shadows, or place over busy imagery.

**Min width for the horizontal banner:** see size-tier table above. Don't push `cc-primary-logo` below 300px or `cc-banner` below 120px — switch tiers instead.

---

## Step 3 — Rewrite copy in the brand voice

While reskinning, sweep user-facing strings:

**Voice rules**
- Confident and declarative. Statements, not questions.
- Aspirational but grounded. Family-facing.
- Never ironic, never winking, never cute.
- Tagline cadence on hero/CTA: short two- or three-beat phrases. *"Find Your Fit. Commit Your Future."* *"Strong. Focused. Committed."*

**Casing**
- Nav, tabs, eyebrows, buttons, badges → **ALL CAPS** with wide tracking.
- Page titles, school/section names → often UPPERCASE in Oswald.
- Body → sentence case.

**Word bank — use:** fit, match, commit, future, journey, pipeline, target, reach, safety, roster, depth chart, division, conference, season, stage, signing, offer.

**Word bank — avoid:** "unlock," "supercharge," "magic," "AI-powered" (in body — fine in marketing hero only), generic SaaS verbs, anything that sounds like a productivity tool.

**Examples**
- ✅ *"85% MATCH — Great academics, strong athletic opportunity, and good cultural match."*
- ✅ *"Excellent Fit"* (badge)
- ❌ *"Ready to crush your recruiting? 🚀"*
- ❌ *"AI-powered recruiting magic ✨"*

---

## Step 4 — Reference components

The files in `handoff/components/` are **reference implementations**, not a library to import as-is. Open `components/_preview.html` in a browser to see them rendered. When restyling the existing app's analogous component, mirror the **patterns** shown there:

- `Sidebar.jsx` — sticky w-64 sidebar with brand crest at top, athlete card at bottom
- `TopBar.jsx` — search + notifications + user, sticky on mobile
- `Dashboard.jsx` — `grid-cols-5` stat strip, sectioned cards
- `SchoolCard.jsx` — card anatomy (header eyebrow + lucide icon + ALL-CAPS Oswald title + content + actions)
- `Badges.jsx` — pill badges, status colors, division badges
- `MatchRing.jsx` — the FitScore circular indicator (achievement moment)
- `MatchResults.jsx`, `Compare.jsx`, `SchoolDetail.jsx`, `Onboarding.jsx` — page-level patterns

Don't import these into the existing app. Read them, copy the styling approach, restyle the app's existing components.

---

## Step 5 — Sweep checklist

Before you call the rebrand done, verify on every screen:

- [ ] Page bg is `#F1F4F9`, not white
- [ ] All headings are Oswald, ALL CAPS, wide-tracked
- [ ] Body is Inter, sentence case
- [ ] Primary buttons are navy `#0D1B3D`, white text
- [ ] Gold appears only on stars / achievement / brand crest accents
- [ ] No emoji anywhere in the UI
- [ ] All icons are lucide, stroke 1.5–2px
- [ ] Card radius is 16px, button radius is 6px
- [ ] Cards have 1px slate-200 border + soft shadow
- [ ] Nav/tabs/buttons/badges are ALL CAPS with wide tracking
- [ ] Brand mark (`cc-monogram.svg`, `cc-shield.svg`, or `cc-horizontal-lockup.svg`) is in the sidebar / nav
- [ ] Favicon is `cc-favicon.ico`, with `cc-app-icon-*.png` linked for high-DPI / PWA
- [ ] No glassmorphism, no bouncy springs, no parallax
- [ ] Copy uses the word bank — no "unlock," "supercharge," "magic"
- [ ] Dark mode (if supported) uses `#04112A` canvas, not black

If something in the existing app doesn't have a token equivalent, **ask before inventing**. Do not introduce new colors, type sizes, or radii.
