import React from 'react'

const Asterisk = () => (
  <span className="pop-system-glyph">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      <line x1="12" y1="3" x2="12" y2="21" />
      <line x1="4.1" y1="7.5" x2="19.9" y2="16.5" />
      <line x1="4.1" y1="16.5" x2="19.9" y2="7.5" />
    </svg>
  </span>
)

/**
 * MagazineFrame — wraps any inner page (Privacy, Security, a feature)
 * with the publication masthead strip (wordmark + ISSUE folio + page
 * kicker) and a folio footer ("← BACK TO COVER"), so every route reads
 * like a spread of the same issue. Pass `title` for a full editorial
 * head block, or omit it for pages that bring their own hero.
 */
export function MagazineFrame({
  kicker,
  title,
  titleJp,
  page,
  deck,
  stock = 'ivory',
  dark = false,
  issue = { number: '360', month: 'APRIL', year: '2026', tagline: 'MAGAZINE FOR CITY CODERS · 街のコーダーのために' },
  onHome,
  children,
  className = '',
  ...rest
}) {
  const folio = page === undefined ? kicker : `${kicker} · P. ${String(page).padStart(2, '0')}`
  const home = onHome || (() => {})
  return (
    <div className={['pop-frame', dark ? 'pop-frame--dark' : '', className].filter(Boolean).join(' ')} {...rest}>
      <header className={`pop-frame-masthead pop-stock-${stock}`}>
        <div className="pop-frame-inner">
          <div className="pop-frame-row">
            <button type="button" className="pop-frame-brand" onClick={home} aria-label="Return to cover">
              <span className="pop-wordmark-sm">kernel<span className="pop-wordmark-dot">.</span>chat</span>
              <span className="pop-folio">{issue.tagline}</span>
            </button>
            <div className="pop-frame-issue">
              <span className="pop-folio"><Asterisk />ISSUE {issue.number} · {issue.month} {issue.year}</span>
              <span className="pop-folio pop-frame-folio">{folio}</span>
            </div>
          </div>
          <hr className="pop-rule pop-rule--tomato" />
          {title && (
            <div className="pop-frame-head">
              <span className="pop-kicker pop-kicker--tomato">{kicker} · 目次</span>
              <h1 className="pop-display pop-frame-title">{title}</h1>
              {titleJp && <p className="pop-frame-title-jp">{titleJp}</p>}
              {deck && <p className="pop-swash pop-frame-deck">{deck}</p>}
            </div>
          )}
        </div>
      </header>

      <div className="pop-frame-body">{children}</div>

      <footer className="pop-frame-footer">
        <div className="pop-frame-inner">
          <hr className="pop-rule pop-rule--soft" />
          <div className="pop-frame-row pop-frame-footer-row">
            <span className="pop-folio">{issue.tagline}</span>
            <div className="pop-frame-footer-actions">
              <button type="button" className="pop-folio pop-frame-back" onClick={home}>← BACK TO COVER</button>
              <span className="pop-folio pop-frame-back pop-frame-back--alt">ISSUES →</span>
            </div>
            <span className="pop-folio"><Asterisk />ISSUE {issue.number} · {issue.month} {issue.year}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
