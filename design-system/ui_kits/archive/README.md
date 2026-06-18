# UI Kit — The Issue Archive

The back-catalog surface: a grid of issue "spines" (number monument + feature +
stock + spread type + tags). Click any spine to open its identity sheet. Source:
`kernel-chat-site/src/pages/IssuesPage.{tsx,css}` and the issue identity catalog
in `docs/design-language.md`.

## Files
- `index.html` — mounts the kit; carries the `arc-*` layout `<style>`.
- `Archive.jsx` — the `Archive` surface, `Spine` cards, and the `Detail` panel.
  Issue data (360–378) is the real catalog: per-issue stock, spread type,
  ornament/mechanic notes.

## Composes
`Monument`, `Banner`, `Kicker`, `Colophon` from the design system, plus the
`pop-*` grammar. Each spine is tinted with its real paper-stock hex.

## Interaction
Click a spine → the detail panel updates with that issue's monument, feature,
JP subtitle, identity note, and tags. The colophon monument tracks the selected
issue.
