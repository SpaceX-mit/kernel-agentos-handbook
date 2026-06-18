# UI Kit — Inner Page (Legal)

A legal spread (Privacy) wrapped in `MagazineFrame`, proving the inner-page
system end to end: a brief `KernelLoading` splash, then the framed page reads
like a spread of the same issue — masthead strip, folio footer, drop-capped
prose, colophon. Source: `kernel-chat-site/src/pages/PrivacyPage.tsx` +
`MagazineFrame.tsx`.

## Files
- `index.html` — mounts the kit; carries the `lg-*` prose `<style>`.
- `LegalPage.jsx` — the `LegalPage` flow: splash → `MagazineFrame`(title/folio/
  deck) wrapping sectioned legal prose → `Colophon`.

## Composes
`MagazineFrame`, `Colophon`, `KernelLoading`, `Kicker` from the design system.

## Interaction
Loads with the ink-drop splash for ~1.4s, then reveals the framed page. Clicking
the wordmark / "← BACK TO COVER" replays the splash (stand-in for routing home).
