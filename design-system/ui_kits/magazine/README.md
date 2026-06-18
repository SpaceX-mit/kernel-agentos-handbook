# UI Kit — The Magazine

A faithful recreation of the kernel.chat editorial surface (the POPEYE-homage
landing / issue page). Source: `kernel-chat-site/src/pages/LandingPage.{tsx,css}`
and `src/components/IssueCover.tsx`.

## Files
- `index.html` — mounts the kit; carries the page `<style>` (the `mag-*` layout
  helpers). Loads the design-system bundle for editorial primitives.
- `MagazineIssue.jsx` — the screens: `Cover`, `Contents`, `Feature` (essay
  spread), `Colophon`. Two issues (360 cream/classic, 371 ink/after-hours)
  toggle from the colophon to show stock variants.

## Composes
`Kicker`, `Banner`, `Monument`, `CatalogRow`, `Terminal` from the design system,
plus the shipped `pop-*` grammar (wordmark, rules, stocks, folios, drop-cap).

## What it demonstrates
Masthead lockup · tomato spot discipline · bilingual JP/EN · numbered catalog ·
drop-cap essay spread · tomato pull-quote · the terminal "quiet utility core" ·
the asterisk system glyph in the dateline · warm paper stocks.

It is a recreation, not a redesign — the grammar and values are lifted from the
production site.
