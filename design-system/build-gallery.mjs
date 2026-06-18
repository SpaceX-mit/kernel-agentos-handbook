// build-gallery.mjs — generate index.html (the browsable gallery) from
// _ds_manifest.json. Faithful to the manifest: every card is embedded at
// its declared viewport, grouped by section. Run: `node build-gallery.mjs`.
import { readFileSync, writeFileSync } from 'node:fs'

const manifest = JSON.parse(readFileSync(new URL('./_ds_manifest.json', import.meta.url), 'utf8'))

// Section reading order — foundations first, surfaces last.
const ORDER = ['Brand', 'Colors', 'Type', 'Spacing', 'Motion', 'Components', 'Spreads', 'The Magazine']
const groups = [...new Set(manifest.cards.map((c) => c.group))]
  .sort((a, b) => {
    const ia = ORDER.indexOf(a), ib = ORDER.indexOf(b)
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib)
  })

const esc = (s = '') => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const wh = (vp = '700x200') => {
  const [w, h] = vp.split('x').map((n) => parseInt(n, 10) || 0)
  return { w: w || 700, h: h || 200 }
}

// Japanese subtitle per group — the bilingual register.
const JP = {
  Brand: 'ブランド', Colors: '色', Type: '書体', Spacing: '余白',
  Motion: '動き', Components: '部品', Spreads: '見開き', 'The Magazine': '雑誌',
}

function cardHtml(card) {
  const { w, h } = wh(card.viewport)
  // Cap the visible frame; tall/wide cards scroll inside their box.
  const boxH = Math.min(h, 620)
  return `        <figure class="card" id="${slug(card.group)}-${slug(card.name)}">
          <figcaption>
            <span class="card-name">${esc(card.name)}</span>
            <span class="card-vp">${esc(card.viewport)}</span>
            <p class="card-sub">${esc(card.subtitle || '')}</p>
          </figcaption>
          <div class="frame-scroll" style="max-height:${boxH + 2}px">
            <iframe loading="lazy" src="${esc(card.path)}" width="${w}" height="${h}"
                    title="${esc(card.name)}" style="width:${w}px;height:${h}px"></iframe>
          </div>
          <a class="card-open" href="${esc(card.path)}" target="_blank" rel="noopener">open standalone →</a>
        </figure>`
}

const sections = groups.map((g) => {
  const cards = manifest.cards.filter((c) => c.group === g)
  return `      <section class="group" id="g-${slug(g)}">
        <header class="group-head">
          <span class="pop-kicker pop-kicker--tomato">${esc(g.toUpperCase())} · ${esc(JP[g] || '')}</span>
          <hr class="pop-rule pop-rule--tomato pop-rule--short" />
          <span class="group-count">${cards.length} card${cards.length === 1 ? '' : 's'}</span>
        </header>
        <div class="card-grid">
${cards.map(cardHtml).join('\n')}
        </div>
      </section>`
}).join('\n')

const templates = (manifest.templates || []).map((t) =>
  `          <li><a href="${esc(t.entryPath)}" target="_blank" rel="noopener"><strong>${esc(t.name)}</strong> — ${esc(t.description)}</a></li>`
).join('\n')

const nav = groups.map((g) => `<a href="#g-${slug(g)}">${esc(g)}</a>`).join('\n          ')

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>kernel.chat — Design System</title>
<link rel="icon" href="assets/favicon.svg" />
<link rel="stylesheet" href="styles.css" />
<style>
  /* The gallery dogfoods the system: only design-system tokens, no literals
     beyond layout scaffolding. */
  body { margin: 0; background: var(--pop-cream); color: var(--pop-ink);
         font-family: var(--font-serif); -webkit-font-smoothing: antialiased; }
  .masthead { background: var(--rubin-ivory); border-bottom: 1px solid var(--pop-hairline);
              padding: var(--space-3xl) var(--space-xl) var(--space-xl); }
  .masthead .pop-wordmark { font-family: var(--font-serif); font-weight: 800;
                            font-size: var(--text-2xl); color: var(--pop-tomato);
                            letter-spacing: -0.04em; line-height: 1; }
  .masthead .tag { font-family: var(--font-mono); text-transform: uppercase;
                   letter-spacing: var(--letter-spacing-caps); font-size: var(--text-xs);
                   color: var(--rubin-slate-muted); margin-top: var(--space-md); }
  .masthead .dateline { font-family: var(--font-mono); font-size: var(--text-xs);
                        letter-spacing: var(--letter-spacing-caps); color: var(--pop-tomato);
                        margin-top: var(--space-lg); }
  .masthead .glyph { color: var(--pop-tomato); margin-right: 6px; }
  .navbar { position: sticky; top: 0; z-index: 9; background: var(--rubin-ivory);
            border-bottom: 1px solid var(--pop-hairline-soft); padding: var(--space-sm) var(--space-xl);
            display: flex; flex-wrap: wrap; gap: var(--space-md);
            font-family: var(--font-mono); font-size: var(--text-xs);
            text-transform: uppercase; letter-spacing: var(--letter-spacing-wide); }
  .navbar a { color: var(--rubin-slate); text-decoration: none; padding: 2px 4px; }
  .navbar a:hover { color: var(--pop-tomato); }
  main { max-width: 1080px; margin: 0 auto; padding: var(--space-3xl) var(--space-xl) var(--space-4xl); }
  .group { margin-bottom: var(--space-4xl); }
  .group-head { display: flex; align-items: center; gap: var(--space-lg); margin-bottom: var(--space-xl); }
  .group-head .pop-rule { flex: 1; max-width: none; margin: 0; }
  .group-count { font-family: var(--font-mono); font-size: var(--text-xs);
                 color: var(--rubin-slate-muted); letter-spacing: var(--letter-spacing-wide); white-space: nowrap; }
  .card-grid { display: grid; grid-template-columns: 1fr; gap: var(--space-2xl); }
  .card { margin: 0; border: 1px solid var(--pop-hairline-soft); background: var(--rubin-ivory); }
  figcaption { padding: var(--space-md) var(--space-lg); border-bottom: 1px solid var(--pop-hairline-soft);
               display: grid; grid-template-columns: 1fr auto; align-items: baseline; gap: 4px var(--space-md); }
  .card-name { font-family: var(--font-mono); font-size: var(--text-sm); text-transform: uppercase;
               letter-spacing: var(--letter-spacing-wide); color: var(--pop-ink); }
  .card-vp { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--rubin-slate-muted); }
  .card-sub { grid-column: 1 / -1; margin: 0; font-family: var(--font-serif);
              font-size: var(--text-sm); color: var(--rubin-slate-muted); font-style: italic; }
  .frame-scroll { overflow: auto; background: var(--rubin-ivory-warm); }
  iframe { border: 0; display: block; }
  .card-open { display: block; padding: var(--space-sm) var(--space-lg); font-family: var(--font-mono);
               font-size: var(--text-xs); text-transform: uppercase; letter-spacing: var(--letter-spacing-wide);
               color: var(--pop-tomato); text-decoration: none; border-top: 1px solid var(--pop-hairline-soft); }
  .card-open:hover { background: var(--pop-tomato-soft); }
  .templates { border: 1px solid var(--pop-hairline); background: var(--rubin-ivory); padding: var(--space-xl); }
  .templates ul { margin: var(--space-md) 0 0; padding-left: var(--space-lg); }
  .templates li { font-size: var(--text-base); margin-bottom: var(--space-sm); }
  .templates a { color: var(--pop-ink); text-decoration: none; }
  .templates a:hover { color: var(--pop-tomato); }
  .colophon { border-top: 1px solid var(--pop-hairline); margin-top: var(--space-4xl);
              padding: var(--space-xl); text-align: center; font-family: var(--font-mono);
              font-size: var(--text-xs); text-transform: uppercase; letter-spacing: var(--letter-spacing-caps);
              color: var(--rubin-slate-muted); }
  @media (min-width: 720px) { .card-grid { grid-template-columns: 1fr 1fr; } }
</style>
</head>
<body>
  <header class="masthead">
    <div class="pop-wordmark">kernel.chat</div>
    <div class="tag">Design System · デザインシステム</div>
    <div class="dateline"><span class="glyph">&#9733;</span>EDITORIAL GRAMMAR · ${manifest.cards.length} SPECIMEN CARDS · ${manifest.components.length} COMPONENTS</div>
  </header>
  <nav class="navbar">
          ${nav}
          <a href="#templates">Templates</a>
  </nav>
  <main>
${sections}
      <section class="group" id="templates">
        <header class="group-head">
          <span class="pop-kicker pop-kicker--tomato">TEMPLATES · ひな型</span>
          <hr class="pop-rule pop-rule--tomato pop-rule--short" />
        </header>
        <div class="templates">
          <ul>
${templates}
          </ul>
        </div>
      </section>
  </main>
  <footer class="colophon">
    kernel.chat — magazine for city coders · one tomato spot · two faces · one glyph &#9733;
  </footer>
</body>
</html>
`

writeFileSync(new URL('./index.html', import.meta.url), html)
console.log(`gallery written: ${groups.length} groups, ${manifest.cards.length} cards, ${manifest.templates.length} template(s)`)
