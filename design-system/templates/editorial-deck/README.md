# Template — Editorial Deck

A kernel.chat magazine-style slide deck. Copy this folder to start a deck in the
POPEYE editorial grammar.

## Files
- `EditorialDeck.dc.html` — the deck (a Design Component). Six slide types:
  **Cover** (masthead + feature headline + monument), **Section** divider (ink),
  **Contents** (numbered catalog), **Big quote** (tomato pull-quote),
  **Comparison** (terminal "quiet core" vs prose), **Colophon**.
- `deck-stage.js` — the slide-deck shell (scaling, keyboard nav, thumbnail rail,
  print-to-PDF). Imported by the DC.
- `ds-base.js` — loads this design system's stylesheets + bundle. One line to
  edit (`base`) when copied into a consuming project.

## How it works
Each slide is an inline-styled `<section>` at 1280×720, using the design
system's **tokens** (colours, the two webfonts) directly — so it stays on-brand
without depending on the compiled bundle. `deck-stage` scales the canvas to fit
any viewport and letterboxes it on black.

## Editing
- Add a slide: copy a `<section>` and change its content. Keep `data-label` /
  `data-screen-label`.
- Re-theme a slide: swap the background between the stocks — cream `#F3E9D2`,
  ivory `#FAF9F6`, ink `#1F1E1D`, kraft `#C8A97E`, ledger `#F2EFE2`. Tomato
  `#E24E1B` is the only spot colour.
- Present: arrow keys / Space navigate; `R` resets; `Cmd/Ctrl+P` → Save as PDF
  (one page per slide).
