import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { DayMoment, DaySpread, IssueRecord } from '../content/issues'
import { resolveAccentHex } from '../content/issues/accents'
import { PopShape } from './ornaments'
import './DayFeature.css'
import './IssueAccent.css'

interface DayFeatureProps {
  spread: DaySpread
  issue: IssueRecord
}

type Mark = 'ride' | 'step'

/**
 * DayFeature — an authored metropolitan day the reader marks,
 * moment by moment. The eighth interaction shape (ISSUE 418).
 *
 * ARIA pattern: one RADIOGROUP per moment, two radio buttons
 * (LET IT RIDE / STEP IN), none checked until the reader decides.
 * Both authored consequences are always in the DOM and always
 * legible (rule 4) — the mark selects which one is the reader's,
 * it never reveals or hides. Re-marking is allowed and counted as
 * a change of mind.
 *
 * The ledger meters ONLY real reader actions: marks, changes, and
 * the session clock (the 415 precedent — clock runs from mount).
 * All state is client-session only; nothing recorded, nothing
 * sent; reload erases the day. `ledgerNote` says so on-surface.
 *
 * Motion: ambient weather only (steam / train dash / crosswalk
 * pulse / window glow), CSS-only, ≤4px translate / ≤8% opacity;
 * the site-wide reduced-motion override collapses it.
 *
 * Print stacks every moment with both consequences and renders
 * the ledger as a snapshot — same print-shows-the-outcome pattern
 * as close/press/margin/galley.
 */
export function DayFeature({ spread, issue }: DayFeatureProps) {
  const stockClass = `pop-stock-${spread.stock ?? 'butter'}`
  const accentHex = resolveAccentHex(issue.accent, spread.type)
  const accentStyle = { '--issue-accent-base': accentHex } as CSSProperties

  const [marks, setMarks] = useState<Record<string, Mark | undefined>>({})
  const [markedAt, setMarkedAt] = useState<Record<string, number>>({})
  const [changes, setChanges] = useState(0)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const startRef = useRef<number>(Date.now())

  // The clock runs from mount — the reader is already "in" the day
  // before they touch anything (the 415 precedent).
  useEffect(() => {
    const id = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startRef.current) / 1000))
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  const mark = (momentId: string, next: Mark) => {
    setMarks((prev) => {
      const current = prev[momentId]
      if (current === next) return prev
      if (current !== undefined) setChanges((n) => n + 1)
      if (current === undefined) {
        setMarkedAt((at) => ({
          ...at,
          [momentId]: Math.floor((Date.now() - startRef.current) / 1000),
        }))
      }
      return { ...prev, [momentId]: next }
    })
  }

  const total = spread.moments.length
  const rideCount = spread.moments.filter((m) => marks[m.id] === 'ride').length
  const stepCount = spread.moments.filter((m) => marks[m.id] === 'step').length
  const undecided = total - rideCount - stepCount

  const minutes = Math.floor(elapsedSeconds / 60)
  const seconds = elapsedSeconds % 60
  const clock = `${minutes}:${seconds.toString().padStart(2, '0')}`

  const formatAt = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  const renderSections = (sections?: typeof spread.intro) =>
    sections?.map((section, i) => (
      <section key={i} className="pop-day-section">
        <h3 className="pop-day-section-heading">
          {section.heading}
          {section.headingJp && (
            <span className="pop-day-section-heading-jp">{section.headingJp}</span>
          )}
        </h3>
        {section.paragraphs.map((p, pi) => (
          <p key={pi} className="pop-day-paragraph">{p}</p>
        ))}
      </section>
    ))

  const renderMoment = (moment: DayMoment, index: number) => {
    const current = marks[moment.id]
    const at = markedAt[moment.id]
    // Depth of the day, 0 (dawn) → 1 (after midnight): tints each
    // moment's band from pale to dense ink via the CSS custom prop.
    const depth = total > 1 ? index / (total - 1) : 0
    const bandStyle = { '--day-depth': depth } as CSSProperties

    return (
      <li key={moment.id} className="pop-day-moment" style={bandStyle}>
        <div className={`pop-day-vignette pop-day-vignette--${moment.vignette}`} aria-hidden="true">
          <span className="pop-day-vignette-sky" />
          <span className="pop-day-vignette-skyline" />
          <span className="pop-day-vignette-mark pop-day-vignette-mark--a" />
          <span className="pop-day-vignette-mark pop-day-vignette-mark--b" />
          <span className="pop-day-vignette-mark pop-day-vignette-mark--c" />
        </div>

        <div className="pop-day-moment-head">
          <span className="pop-folio pop-day-moment-time">{moment.time}</span>
          <span className="pop-folio pop-day-moment-label">
            {moment.label}
            {moment.labelJp && (
              <span className="pop-day-moment-label-jp"> · {moment.labelJp}</span>
            )}
          </span>
        </div>

        <p className="pop-day-moment-situation">{moment.situation}</p>

        <div
          className="pop-day-choice"
          role="radiogroup"
          aria-label={`${moment.time} — ${moment.label}: let it ride, or step in`}
        >
          <div className={`pop-day-branch ${current === 'ride' ? 'pop-day-branch--yours' : ''}`}>
            <button
              type="button"
              role="radio"
              aria-checked={current === 'ride'}
              className="pop-day-radio"
              onClick={() => mark(moment.id, 'ride')}
            >
              Let it ride
            </button>
            <p className="pop-day-consequence">{moment.ride}</p>
          </div>
          <div className={`pop-day-branch ${current === 'step' ? 'pop-day-branch--yours' : ''}`}>
            <button
              type="button"
              role="radio"
              aria-checked={current === 'step'}
              className="pop-day-radio"
              onClick={() => mark(moment.id, 'step')}
            >
              Step in <span className="pop-day-cost">{moment.cost}</span>
            </button>
            <p className="pop-day-consequence">{moment.stepIn}</p>
          </div>
        </div>

        <p className="pop-folio pop-day-moment-mark">
          {current === undefined
            ? 'UNMARKED'
            : `MARKED ${current === 'ride' ? 'RIDE' : 'STEP IN'}${at !== undefined ? ` AT ${formatAt(at)}` : ''}`}
        </p>
      </li>
    )
  }

  return (
    <section className={`pop-day ${stockClass}`} style={accentStyle} aria-labelledby="pop-day-title">
      <div className="pop-day-inner">

        <header className="pop-day-header">
          <span className="pop-kicker pop-kicker--tomato">{spread.kicker}</span>
          <hr className="pop-rule pop-rule--short pop-rule--tomato" />
          <h2 id="pop-day-title" className="pop-display pop-day-title">
            {spread.title}
          </h2>
          <p className="pop-feature-jp pop-day-title-jp">{spread.titleJp}</p>
          <p className="pop-swash pop-day-deck">{spread.deck}</p>
          <p className="pop-folio pop-day-byline">{spread.byline}</p>
        </header>

        {spread.dossier && (
          <aside className="pop-day-spec" aria-label={spread.dossier.kicker}>
            <div className="pop-day-spec-frame">
              <PopShape
                name="lozenge"
                size="md"
                color="tomato"
                className="pop-day-spec-badge"
                aria-label="spec badge"
              />
              <span className="pop-folio pop-day-spec-kicker">{spread.dossier.kicker}</span>
              {spread.dossier.note && (
                <p className="pop-day-spec-note">{spread.dossier.note}</p>
              )}
              <dl className="pop-day-spec-list">
                {spread.dossier.items.map((item, i) => (
                  <div key={i} className="pop-day-spec-row">
                    <dt className="pop-folio pop-day-spec-label">{item.label}</dt>
                    <dd className="pop-day-spec-value">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        )}

        {spread.intro && (
          <article className="pop-day-prose">{renderSections(spread.intro)}</article>
        )}

        <hr className="pop-rule pop-day-rule" />

        {spread.dayKicker && (
          <p className="pop-folio pop-day-kicker-line">{spread.dayKicker}</p>
        )}

        <ol className="pop-day-moments">
          {spread.moments.map(renderMoment)}
        </ol>

        <div className="pop-day-ledger" aria-live="polite">
          <span className="pop-folio pop-day-ledger-kicker">THE LEDGER · 台帳</span>
          <p className="pop-day-ledger-line">
            <span>{rideCount} LET RIDE</span>
            <span aria-hidden="true">·</span>
            <span>{stepCount} STEPPED IN</span>
            <span aria-hidden="true">·</span>
            <span>{undecided} UNMARKED</span>
            <span aria-hidden="true">·</span>
            <span>{changes} {changes === 1 ? 'CHANGE' : 'CHANGES'} OF MIND</span>
            <span aria-hidden="true">·</span>
            <span>{clock}</span>
          </p>
          {/* Print-only snapshot — honest whether or not the day was marked. */}
          <p className="pop-day-print-snapshot" aria-hidden="true">
            PRINTED MID-SESSION — {rideCount} RIDE · {stepCount} STEP IN · {undecided} UNMARKED AT {clock}
          </p>
          <p className="pop-day-ledger-note">{spread.ledgerNote}</p>
        </div>

        <hr className="pop-rule pop-day-rule" />

        {spread.outro && (
          <article className="pop-day-prose">{renderSections(spread.outro)}</article>
        )}

        {spread.pullQuote && (
          <blockquote className="pop-day-pullquote">
            <p className="pop-day-pullquote-text">{spread.pullQuote.text}</p>
            <cite className="pop-folio pop-day-pullquote-cite">{spread.pullQuote.attribution}</cite>
          </blockquote>
        )}

        {spread.references && (
          <aside className="pop-day-references" aria-label={spread.references.kicker}>
            <span className="pop-folio pop-day-references-kicker">{spread.references.kicker}</span>
            {spread.references.note && (
              <p className="pop-day-references-note">{spread.references.note}</p>
            )}
            <ul className="pop-day-references-list">
              {spread.references.items.map((ref, i) => (
                <li key={i} className="pop-day-reference">
                  {ref.authors} ({ref.year}). <em>{ref.title}</em>{ref.journal ? `. ${ref.journal}.` : '.'}
                </li>
              ))}
            </ul>
          </aside>
        )}

        <footer className="pop-day-signoff">
          <hr className="pop-rule pop-rule--short pop-rule--tomato" />
          <p className="pop-swash pop-day-signoff-text">{spread.signoff}</p>
          <div className="pop-monument pop-day-monument">
            <span>ISSUE</span>
            <strong>{issue.number}</strong>
            <span>{issue.month} {issue.year}</span>
          </div>
        </footer>

      </div>
    </section>
  )
}
