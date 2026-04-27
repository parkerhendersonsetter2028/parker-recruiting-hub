# Campus Commit — Web App UI Kit

The product UI kit for Campus Commit. Recreates the dashboard, match results, school detail, compare, and onboarding screens at high fidelity.

## Structure

- `index.html` — interactive click-thru demo
- `Sidebar.jsx`, `TopBar.jsx` — chrome
- `SchoolCard.jsx`, `MatchRing.jsx`, `Badges.jsx` — data display
- `Onboarding.jsx`, `Dashboard.jsx`, `MatchResults.jsx`, `SchoolDetail.jsx`, `Compare.jsx` — screens
- `App.jsx` — wires the screens together

Components consume design tokens from `/colors_and_type.css`. Lucide icons are loaded via CDN.

## What's interactive

- Onboarding flow: 4-step wizard, Next/Back actually advances
- Sidebar nav: switches between Dashboard / Schools / Compare / Profile
- School cards: click to open Detail
- Detail: tabs (Overview / Athletics / Academics / Cost) switch content
- Compare: shows two schools side-by-side
- Saved/unsaved heart toggles
