import React from 'react'

/**
 * InterviewSpread — the Q&A profile feature tool. A subject dossier
 * card (tomato lozenge badge, name/role/location) sets up a person,
 * then alternating italic-tomato questions and serif answers. The
 * last answer takes a drop cap. Used when an issue is carried by a
 * subject.
 */
export function InterviewSpread({
  kicker = 'INTERVIEW · 対談',
  title,
  titleJp,
  deck,
  byline,
  subject,
  intro,
  exchanges = [],
  signoff,
  issue = {},
  stock = 'ivory',
  className = '',
  ...rest
}) {
  return (
    <section className={['pop-spread', `pop-stock-${stock}`, className].filter(Boolean).join(' ')} {...rest}>
      <div className="pop-spread-inner">
        <header className="pop-spread-header">
          <span className="pop-kicker pop-kicker--tomato">{kicker}</span>
          <hr className="pop-rule pop-rule--short pop-rule--tomato" />
          <h2 className="pop-display pop-spread-title">{title}</h2>
          {titleJp && <p className="pop-feature-jp">{titleJp}</p>}
          {deck && <p className="pop-swash pop-spread-deck">{deck}</p>}
          {byline && <p className="pop-folio pop-spread-byline">{byline}</p>}
        </header>

        {subject && (
          <aside className="pop-iv-subject">
            <div className="pop-iv-frame">
              <span className="pop-iv-badge" style={{ width: 18, height: 18, background: 'var(--pop-tomato)', display: 'block', transform: 'rotate(45deg)' }} />
              <span className="pop-folio pop-iv-kicker">THE SUBJECT · 対象</span>
              <h3 className="pop-iv-name">
                {subject.name}
                {subject.nameJp && <span className="pop-iv-name-jp">{subject.nameJp}</span>}
              </h3>
              <div className="pop-iv-meta">
                <span className="pop-iv-role">{subject.role}</span>
                {subject.roleJp && <span className="pop-iv-role-jp">{subject.roleJp}</span>}
              </div>
              {subject.location && (
                <div className="pop-iv-location">
                  <span className="pop-folio">LOCATION</span>
                  <span className="pop-iv-location-value">{subject.location}</span>
                </div>
              )}
            </div>
          </aside>
        )}

        {intro && <p className="pop-spread-intro">{intro}</p>}

        <hr className="pop-rule" />

        <article className="pop-iv-body">
          {exchanges.map((x, i) => {
            const isLast = i === exchanges.length - 1
            return (
              <div className="pop-iv-exchange" key={i}>
                <p className="pop-iv-q">
                  <span className="pop-iv-q-mark">Q.</span>
                  <span className="pop-iv-q-text">{x.q}</span>
                </p>
                <p className={`pop-iv-a${isLast ? ' pop-iv-a--last' : ''}`}>
                  <span className="pop-iv-a-mark">A.</span>
                  <span className="pop-iv-a-text">{x.a}</span>
                </p>
                {!isLast && <hr className="pop-rule pop-rule--soft pop-iv-divider" />}
              </div>
            )
          })}
        </article>

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
