import React from 'react'

/**
 * EssaySpread — the long-form prose feature tool (editorial tool #1).
 * Used when the issue is carried by writing. Kicker + title + italic
 * standfirst + byline, sectioned prose with a drop cap on the lead
 * paragraph, a tomato pull-quote dropped after the second section, an
 * optional works-cited block, and a sign-off. No images.
 */
export function EssaySpread({
  kicker = 'ESSAY · 随筆',
  title,
  titleJp,
  deck,
  byline,
  sections = [],
  pullQuote,
  references,
  signoff,
  issue = {},
  stock = 'kraft',
  className = '',
  ...rest
}) {
  const onInk = stock === 'ink'
  return (
    <section className={['pop-spread', `pop-stock-${stock}`, onInk ? 'pop-spread-on-ink' : '', className].filter(Boolean).join(' ')} {...rest}>
      <div className="pop-spread-inner">
        <header className="pop-spread-header">
          <span className="pop-kicker pop-kicker--tomato">{kicker}</span>
          <hr className="pop-rule pop-rule--short pop-rule--tomato" />
          <h2 className="pop-display pop-spread-title">{title}</h2>
          {titleJp && <p className="pop-feature-jp">{titleJp}</p>}
          {deck && <p className="pop-swash pop-spread-deck">{deck}</p>}
          {byline && <p className="pop-folio pop-spread-byline">{byline}</p>}
        </header>

        <hr className="pop-rule pop-spread-divider" />

        <article className="pop-es-body">
          {sections.map((section, sIdx) => (
            <div className="pop-es-section" key={sIdx}>
              {section.heading && (
                <h3 className="pop-es-section-head">
                  <span>{section.heading}</span>
                  {section.headingJp && <span className="pop-es-section-head-jp">· {section.headingJp}</span>}
                </h3>
              )}
              {(section.paragraphs || []).map((para, pIdx) => {
                const isLead = sIdx === 0 && pIdx === 0
                return <p key={pIdx} className={`pop-es-para${isLead ? ' pop-es-para--lead' : ''}`}>{para}</p>
              })}
              {sIdx === 1 && pullQuote && (
                <aside className="pop-es-pullquote">
                  <p className="pop-es-pullquote-text">&ldquo;{pullQuote.text}&rdquo;</p>
                  {pullQuote.attribution && <p className="pop-folio pop-es-pullquote-attr">{pullQuote.attribution}</p>}
                </aside>
              )}
            </div>
          ))}
        </article>

        {references && references.items && references.items.length > 0 && (
          <aside className="pop-es-refs">
            <span className="pop-kicker pop-kicker--tomato">{references.kicker || 'WORKS CITED · 引用'}</span>
            <ol className="pop-es-refs-list">
              {references.items.map((ref, i) => (
                <li className="pop-es-refs-item" key={i}>
                  <span className="pop-es-refs-n">{String(i + 1).padStart(2, '0')}</span>
                  <span>
                    <span>{ref.authors} </span>
                    {ref.year && <span>({ref.year}). </span>}
                    <span className="pop-es-refs-title">{ref.title}</span>
                    {ref.journal && <span>. {ref.journal}</span>}.
                  </span>
                </li>
              ))}
            </ol>
          </aside>
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
    </section>
  )
}
