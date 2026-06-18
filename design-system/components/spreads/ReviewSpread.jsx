import React from 'react'

/**
 * ReviewSpread — the graded-survey feature tool. Used when an issue
 * tests N things and commits to a verdict. A top-line italic verdict
 * (the loudest line), a numbered rubric of criteria, then a grid of
 * subject cards — each with a score monument, optional stars, pros/cons
 * columns, and a one-line per-subject verdict. The reader can stop at
 * the verdict and still have an answer.
 */
export function ReviewSpread({
  kicker = 'REVIEW · 評',
  title,
  titleJp,
  deck,
  byline,
  verdict,
  intro,
  criteria = [],
  subjects = [],
  outro,
  signoff,
  issue = {},
  stock = 'ivory',
  className = '',
  ...rest
}) {
  const Card = ({ s }) => {
    const rank = String(s.rank).padStart(2, '0')
    const stars = typeof s.stars === 'number' ? Math.max(0, Math.min(5, Math.round(s.stars))) : null
    return (
      <li className="pop-rv-card">
        <article className="pop-rv-card-inner">
          <div className="pop-rv-card-head">
            <span className="pop-rv-card-rank">{rank}</span>
            <div>
              <h3 className="pop-rv-card-name">{s.name}</h3>
              {s.read && <p className="pop-rv-card-read">{s.read}</p>}
              {stars !== null && (
                <span className="pop-rv-stars" role="img" aria-label={`${stars} of 5`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < stars ? 'pop-rv-star pop-rv-star--on' : 'pop-rv-star'} />
                  ))}
                </span>
              )}
            </div>
            <div className="pop-monument pop-rv-card-score">
              <span>SCORE</span>
              <strong>{s.score}</strong>
            </div>
          </div>
          <div className="pop-rv-cols">
            <section className="pop-rv-col pop-rv-col--pros">
              <span className="pop-folio pop-rv-col-kicker">PROS · 長所</span>
              <ul className="pop-rv-list">{(s.pros || []).map((p, i) => <li key={i}>{p}</li>)}</ul>
            </section>
            <section className="pop-rv-col pop-rv-col--cons">
              <span className="pop-folio pop-rv-col-kicker">CONS · 短所</span>
              <ul className="pop-rv-list">{(s.cons || []).map((c, i) => <li key={i}>{c}</li>)}</ul>
            </section>
          </div>
          {s.verdict && <p className="pop-rv-card-verdict">{s.verdict}</p>}
        </article>
      </li>
    )
  }

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

        {verdict && (
          <aside className="pop-rv-verdict">
            <span className="pop-folio pop-rv-verdict-kicker">VERDICT · 判定</span>
            <p className="pop-rv-verdict-text">{verdict}</p>
          </aside>
        )}

        {intro && <p className="pop-spread-intro">{intro}</p>}

        {criteria.length > 0 && (
          <aside className="pop-rv-rubric">
            <span className="pop-kicker pop-kicker--tomato">THE RUBRIC · 評価基準</span>
            <dl className="pop-rv-rubric-list">
              {criteria.map((c) => (
                <div className="pop-rv-rubric-row" key={c.n}>
                  <dt className="pop-rv-rubric-term">
                    <span className="pop-rv-rubric-n">{c.n}</span>
                    <span className="pop-rv-rubric-label">{c.label}</span>
                    {c.weight && <span className="pop-rv-rubric-weight">{c.weight}</span>}
                  </dt>
                  {c.description && <dd className="pop-rv-rubric-desc">{c.description}</dd>}
                </div>
              ))}
            </dl>
          </aside>
        )}

        <hr className="pop-rule pop-spread-divider" />

        <ol className="pop-rv-grid">
          {subjects.map((s) => <Card key={s.rank} s={s} />)}
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
