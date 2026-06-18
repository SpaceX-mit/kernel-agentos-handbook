import React from 'react'

/**
 * DispatchSpread — the wire-style news dispatch feature tool. Reactive,
 * filed-the-night-of grammar borrowed from the newswire: a repeating
 * Courier slug marquee, a newspaper dateline, a rotated gummed dossier
 * card (STATUS stamp + FILED/ISSUE fields), checkbox-numbered
 * propositions, an optional mid-spread BULLETIN, and a "— 30 —"
 * terminator. Used when an issue reacts to a specific event.
 */
export function DispatchSpread({
  slug = 'WIRE · DISPATCH · 速報',
  kicker = 'DISPATCH · 速報',
  title,
  titleJp,
  deck,
  dateline,
  byline,
  status = 'FILED',
  filedAt,
  propositions = [],
  bulletin,
  terminator,
  signoff,
  issue = {},
  stock = 'ivory',
  className = '',
  ...rest
}) {
  const splitAt = Math.min(3, propositions.length)
  const first = propositions.slice(0, splitAt)
  const second = propositions.slice(splitAt)

  const Item = ({ p }) => (
    <li className="pop-dp-item">
      <div className="pop-dp-item-head">
        <span className="pop-dp-check">
          <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <rect x="3" y="3" width="42" height="42" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M 11 26 Q 15 29 20 34 Q 26 26 38 12" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="pop-dp-check-num">{p.n}</span>
        </span>
        <div>
          {p.overline && <span className="pop-dp-item-overline">{p.overline} · {p.n}</span>}
          <h3 className="pop-dp-item-title">{p.title}</h3>
        </div>
      </div>
      <div className="pop-dp-item-body">
        {(p.body || []).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </li>
  )

  return (
    <section className={['pop-spread', `pop-stock-${stock}`, className].filter(Boolean).join(' ')} {...rest}>
      <div className="pop-dp-slug">
        <div className="pop-dp-slug-track">
          {[0, 1, 2, 3].map((i) => (
            <span key={i}>
              <span className="pop-dp-slug-text">{slug}</span>
              <span className="pop-dp-slug-dot">●</span>
            </span>
          ))}
        </div>
      </div>

      <div className="pop-spread-inner">
        <header className="pop-spread-header">
          <span className="pop-kicker pop-kicker--tomato">{kicker}</span>
          <hr className="pop-rule pop-rule--short pop-rule--tomato" />
          <h2 className="pop-display pop-spread-title">{title}</h2>
          {titleJp && <p className="pop-feature-jp">{titleJp}</p>}
          {deck && <p className="pop-swash pop-spread-deck">{deck}</p>}
          {dateline && <p className="pop-folio pop-dp-dateline">{dateline}</p>}
          {byline && <p className="pop-folio pop-spread-byline">{byline}</p>}
        </header>

        <aside className="pop-dp-dossier">
          <div className="pop-dp-stamp">
            <span className="pop-dp-stamp-label">STATUS</span>
            <strong>{status}</strong>
          </div>
          <dl className="pop-dp-fields">
            {filedAt && <div><dt>FILED</dt><dd>{filedAt}</dd></div>}
            <div><dt>ISSUE</dt><dd>{issue.number} · {[issue.month, issue.year].filter(Boolean).join(' ')}</dd></div>
            <div><dt>BYLINE</dt><dd>THE EDITORS</dd></div>
          </dl>
        </aside>

        <hr className="pop-rule pop-rule--tomato pop-spread-divider" />

        <ol className="pop-dp-list">
          {first.map((p) => <Item key={p.n} p={p} />)}
        </ol>

        {bulletin && (
          <figure className="pop-dp-bulletin">
            <span className="pop-dp-bulletin-label">— BULLETIN —</span>
            <blockquote className="pop-dp-bulletin-text">— {bulletin} —</blockquote>
          </figure>
        )}

        {second.length > 0 && (
          <ol className="pop-dp-list">
            {second.map((p) => <Item key={p.n} p={p} />)}
          </ol>
        )}

        <footer className="pop-spread-signoff">
          <hr className="pop-rule pop-rule--short pop-rule--tomato" />
          {signoff && <p className="pop-swash pop-spread-signoff-text">{signoff}</p>}
          <div className="pop-monument">
            <span>ISSUE</span>
            <strong>{issue.number}</strong>
            <span>{[issue.month, issue.year].filter(Boolean).join(' ')}</span>
          </div>
        </footer>
      </div>

      {terminator && (
        <div className="pop-dp-terminator">
          <span className="pop-dp-terminator-mark">— 30 —</span>
          <span className="pop-dp-terminator-text">{terminator}</span>
        </div>
      )}
    </section>
  )
}
