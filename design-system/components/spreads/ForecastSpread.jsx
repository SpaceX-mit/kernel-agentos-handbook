import React from 'react'

/**
 * ForecastSpread — the numbered-manifesto feature tool. Used when an
 * issue's thesis is a list of declarations (forecasts, principles,
 * predictions). Each proposition is a tomato number-ring + bold title
 * + prose body. Defaults to the ink stock (the cobalt-era forecast
 * register); pass an accent to retint the rings.
 */
export function ForecastSpread({
  kicker = 'FORECAST · 予報',
  title,
  titleJp,
  deck,
  byline,
  intro,
  propositions = [],
  outro,
  signoff,
  issue = {},
  stock = 'ink',
  accent,
  className = '',
  style,
  ...rest
}) {
  const onInk = stock === 'ink'
  const rootStyle = accent ? { '--issue-accent': accent, ...style } : style
  return (
    <section
      className={['pop-spread', `pop-stock-${stock}`, onInk ? 'pop-spread-on-ink' : '', className].filter(Boolean).join(' ')}
      style={rootStyle}
      {...rest}
    >
      <div className="pop-spread-inner">
        <header className="pop-spread-header">
          <span className="pop-kicker pop-kicker--tomato">{kicker}</span>
          <hr className="pop-rule pop-rule--short pop-rule--tomato" />
          <h2 className="pop-display pop-spread-title">{title}</h2>
          {titleJp && <p className="pop-feature-jp">{titleJp}</p>}
          {deck && <p className="pop-swash pop-spread-deck">{deck}</p>}
          {byline && <p className="pop-folio pop-spread-byline">{byline}</p>}
        </header>

        {intro && <p className="pop-spread-intro">{intro}</p>}

        <hr className="pop-rule pop-rule--tomato pop-spread-divider" />

        <ol className="pop-fc-list">
          {propositions.map((p) => (
            <li className="pop-fc-item" key={p.n}>
              <div className="pop-fc-head">
                <span className="pop-fc-ring">{p.n}</span>
                <div>
                  <h3 className="pop-fc-item-title">{p.title}</h3>
                  {p.titleJp && <p className="pop-fc-item-title-jp">{p.titleJp}</p>}
                </div>
              </div>
              <div className="pop-fc-item-body">
                {(p.body || []).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </li>
          ))}
        </ol>

        {outro && <p className="pop-spread-intro" style={{ marginTop: 28 }}>{outro}</p>}

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
    </section>
  )
}
