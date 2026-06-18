import React from 'react'

const Asterisk = () => (
  <span className="pop-system-glyph">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      <line x1="12" y1="3" x2="12" y2="21" /><line x1="4.1" y1="7.5" x2="19.9" y2="16.5" /><line x1="4.1" y1="16.5" x2="19.9" y2="7.5" />
    </svg>
  </span>
)

const InkSpread = () => (
  <svg className="pop-cover-ornament pop-cover-ornament--ink-spread" viewBox="0 0 420 420" aria-hidden="true">
    <g fill="currentColor">
      <path d="M 210 110 C 155 95, 105 135, 110 200 C 95 250, 120 290, 150 315 C 170 355, 230 360, 275 330 C 320 325, 360 295, 355 240 C 380 195, 345 140, 285 135 C 255 100, 230 100, 210 110 Z" />
      <path d="M 300 310 Q 340 320 380 340 Q 395 350 410 348 L 408 362 Q 365 362 330 348 Q 315 336 300 310 Z" />
      <circle cx="380" cy="245" r="5" /><circle cx="360" cy="380" r="7" /><circle cx="250" cy="400" r="3.5" />
    </g>
  </svg>
)

const WartySpots = () => (
  <svg className="pop-cover-ornament pop-cover-ornament--warty-spots" viewBox="0 0 420 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g fill="currentColor">
      <ellipse cx="58" cy="46" rx="7" ry="6" /><ellipse cx="348" cy="62" rx="9" ry="7.5" /><ellipse cx="400" cy="198" rx="8" ry="7" />
      <ellipse cx="48" cy="288" rx="5" ry="4" /><ellipse cx="402" cy="322" rx="11" ry="9" /><ellipse cx="72" cy="430" rx="12" ry="9" />
      <ellipse cx="156" cy="502" rx="14" ry="11" /><ellipse cx="334" cy="518" rx="13" ry="10" /><ellipse cx="402" cy="538" rx="16" ry="12" />
      <circle cx="270" cy="268" r="2.2" /><circle cx="210" cy="340" r="1.6" /><circle cx="90" cy="350" r="2.4" />
    </g>
  </svg>
)

const FlashBurn = () => (
  <svg className="pop-cover-ornament pop-cover-ornament--flash-burn" viewBox="0 0 420 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <radialGradient id="pop-flash-burn" cx="100%" cy="0%" r="85%" fx="100%" fy="0%">
        <stop offset="0%" stopColor="#FFF" stopOpacity="1" /><stop offset="22%" stopColor="#FFF" stopOpacity="0.92" />
        <stop offset="46%" stopColor="#FFF" stopOpacity="0.55" /><stop offset="72%" stopColor="#FFF" stopOpacity="0.18" /><stop offset="100%" stopColor="#FFF" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect x="0" y="0" width="420" height="560" fill="url(#pop-flash-burn)" />
  </svg>
)

const ORNAMENTS = { 'ink-spread': InkSpread, 'warty-spots': WartySpots, 'flash-burn': FlashBurn }

function CoverSeal({ label, date }) {
  return (
    <div className="pop-cover-seal" aria-label={`${label} — ${date}`}>
      <svg viewBox="0 0 120 120" className="pop-cover-seal-svg" aria-hidden="true">
        <defs><path id="pop-seal-arc" d="M 16 60 A 44 44 0 0 1 104 60" /></defs>
        <circle cx="60" cy="60" r="55" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="60" cy="60" r="48" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.7" />
        <text className="pop-cover-seal-label" fill="currentColor"><textPath href="#pop-seal-arc" startOffset="50%" textAnchor="middle">{label}</textPath></text>
        <text x="60" y="66" className="pop-cover-seal-date" textAnchor="middle" fill="currentColor">{date}</text>
        <polygon points="60,82 62.2,86.8 67.5,87.4 63.5,91 64.7,96.2 60,93.4 55.3,96.2 56.5,91 52.5,87.4 57.8,86.8" fill="currentColor" />
      </svg>
    </div>
  )
}

/**
 * IssueCover — the canonical cover, the print object. Reads its paper
 * stock + composition variant from `stock` / `layout`, so every issue
 * keeps its authored identity. Optional per-issue `ornament`
 * (ink-spread / warty-spots / flash-burn) and a wax `seal`.
 *
 * Layouts: classic (centred), monument-hero (the number is the art),
 * asymmetric-left (flush-left), ledger-rule (graph-ruled audit).
 */
export function IssueCover({
  issue = { number: '360', month: 'APRIL', year: '2026', price: '¥0 · BYOK' },
  headline = { prefix: 'The', emphasis: 'Urban Outdoors', suffix: 'Review', swash: 'A terminal companion for city coders.' },
  featureJp,
  tagline = 'MAGAZINE FOR CITY CODERS',
  jpTagline = '都会に住んで、コードで遊ぶための、自由なスタイルを作ろう。',
  stock = 'cream',
  layout = 'classic',
  ornament,
  seal,
  stats = ['independent', 'open-source', 'mit-licensed', 'published-monthly'],
  className = '',
  ...rest
}) {
  const Ornament = ornament ? ORNAMENTS[ornament] : null
  const isHero = layout === 'monument-hero'
  return (
    <section
      className={['pop-cover', `pop-stock-${stock}`, `pop-cover--${layout}`, className].filter(Boolean).join(' ')}
      {...rest}
    >
      {Ornament && <Ornament />}
      {seal && <CoverSeal label={seal.label} date={seal.date} />}
      <div className="pop-cover-inner">
        <div className="pop-cover-dateline">
          <span className="pop-folio">{jpTagline}</span>
          <span className="pop-folio"><Asterisk />ISSUE {issue.number} · {issue.month} {issue.year}</span>
        </div>
        <hr className="pop-rule" />

        <div className="pop-cover-masthead">
          <h1 className="pop-wordmark">kernel<span className="pop-wordmark-dot">.</span>chat</h1>
          <div className="pop-cover-masthead-meta">
            <span className="pop-banner">{tagline}</span>
            <span className="pop-price">{issue.price}</span>
          </div>
        </div>
        <hr className="pop-rule pop-rule--tomato" />

        {isHero && (
          <div className="pop-cover-hero-monument">
            <span>ISSUE</span>
            <strong>{issue.number}</strong>
          </div>
        )}

        <div className="pop-cover-feature">
          <span className="pop-kicker pop-kicker--tomato">FEATURE · {issue.number}</span>
          <h2 className="pop-display pop-cover-feature-title">
            {headline.prefix} <em>{headline.emphasis}</em><br />{headline.suffix}
          </h2>
          {headline.swash && <p className="pop-swash pop-cover-swash">{headline.swash}</p>}
          {featureJp && <p className="pop-feature-jp">{featureJp}</p>}
        </div>

        <div className="pop-cover-bottom">
          {!isHero && <div className="pop-monument"><span>ISSUE</span><strong>{issue.number}</strong><span>{issue.month} {issue.year}</span><span>{issue.price}</span></div>}
          <div className="pop-cover-stats">
            {stats.map((s) => <span key={s} className="pop-hash">{s}</span>)}
          </div>
        </div>
      </div>
    </section>
  )
}
