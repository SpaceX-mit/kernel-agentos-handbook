import { useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
import type { IssueRecord, ProofLine, ProofSpread } from '../content/issues'
import { resolveAccentHex } from '../content/issues/accents'
import { PopShape } from './ornaments'
import './ProofFeature.css'
import './IssueAccent.css'

interface ProofFeatureProps {
  spread: ProofSpread
  issue: IssueRecord
}

type Fate = 'machine' | 'hand' | 'strike'

const FATES: { id: Fate; label: string }[] = [
  { id: 'machine', label: 'Keep machine' },
  { id: 'hand', label: 'Take the hand' },
  { id: 'strike', label: 'Strike' },
]

/**
 * ProofFeature — the correction pass. The eighth interaction shape
 * (ISSUE 417): a machine-completed draft screen, adjudicated line
 * by line — KEEP MACHINE / TAKE THE HAND / STRIKE — composing a
 * resolved screen and a provenance ledger.
 *
 * ARIA pattern: one ROVING-TABINDEX RADIOGROUP per line, three
 * radios (the fates). One tab stop per line; arrow keys move and
 * select among the fates (standard radio behaviour).
 *
 * Rule 1: every line defaults to KEEP MACHINE — the untouched page
 * is the machine's finished screen. Rule 4: all three versions of
 * every line stay in the DOM at all times; selection is visibility
 * of emphasis, never presence; print stacks everything. Rule 6,
 * doubled: the ledger counts only the reader's marks (session
 * React state, unrecorded — `ledgerNote` printed); the machine
 * lines are real local-model output, disclosed in `machineNote`.
 * Rule 7: instance one — no machinery extracted from Galley/Press.
 */
export function ProofFeature({ spread, issue }: ProofFeatureProps) {
  const stockClass = `pop-stock-${spread.stock ?? 'ivory'}`
  const accentHex = resolveAccentHex(issue.accent, spread.type)
  const accentStyle = { '--issue-accent-base': accentHex } as CSSProperties

  const [fates, setFates] = useState<Record<string, Fate>>(() =>
    Object.fromEntries(spread.lines.map((l) => [l.id, 'machine' as Fate]))
  )

  const setFate = (lineId: string, fate: Fate) =>
    setFates((prev) => (prev[lineId] === fate ? prev : { ...prev, [lineId]: fate }))

  const onRadioKeyDown = (e: KeyboardEvent, lineId: string) => {
    const current = fates[lineId]
    const idx = FATES.findIndex((f) => f.id === current)
    let next: number | null = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (idx + 1) % FATES.length
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (idx + FATES.length - 1) % FATES.length
    if (next !== null) {
      e.preventDefault()
      setFate(lineId, FATES[next].id)
      const group = (e.currentTarget as HTMLElement).closest('[role="radiogroup"]')
      const radios = group?.querySelectorAll<HTMLButtonElement>('[role="radio"]')
      radios?.[next]?.focus()
    }
  }

  const machineCount = spread.lines.filter((l) => fates[l.id] === 'machine').length
  const handCount = spread.lines.filter((l) => fates[l.id] === 'hand').length
  const struckCount = spread.lines.filter((l) => fates[l.id] === 'strike').length

  const resolvedText = (line: ProofLine): string | null => {
    const fate = fates[line.id]
    if (fate === 'machine') return line.machine
    if (fate === 'hand') return line.hand
    return null
  }

  const renderSections = (sections?: typeof spread.intro) =>
    sections?.map((section, i) => (
      <section key={i} className="pop-proof-section">
        <h3 className="pop-proof-section-heading">
          {section.heading}
          {section.headingJp && (
            <span className="pop-proof-section-heading-jp">{section.headingJp}</span>
          )}
        </h3>
        {section.paragraphs.map((p, pi) => (
          <p key={pi} className="pop-proof-paragraph">{p}</p>
        ))}
      </section>
    ))

  const renderLine = (line: ProofLine) => {
    const fate = fates[line.id]
    return (
      <li key={line.id} className="pop-proof-line">
        <div className="pop-proof-line-head">
          <span className="pop-folio pop-proof-line-slot">
            {line.slot}
            {line.slotJp && <span className="pop-proof-line-slot-jp"> · {line.slotJp}</span>}
          </span>
          <span className="pop-folio pop-proof-line-fate">
            {fate === 'machine' ? 'MACHINE STANDS' : fate === 'hand' ? 'THE HAND STANDS' : 'STRUCK — BLANK RETURNS'}
          </span>
        </div>

        {/* Rule 4: all three versions live in the DOM at all times.
            Selection is emphasis, never presence. */}
        <div className="pop-proof-versions">
          <p className={`pop-proof-version pop-proof-version--machine ${fate === 'machine' ? 'pop-proof-version--stands' : ''}`}>
            <span className="pop-folio pop-proof-version-tag">MACHINE</span>
            {line.machine}
          </p>
          <p className={`pop-proof-version pop-proof-version--hand ${fate === 'hand' ? 'pop-proof-version--stands' : ''}`}>
            <span className="pop-folio pop-proof-version-tag">THE HAND</span>
            {line.hand}
          </p>
          <p className={`pop-proof-version pop-proof-version--blank ${fate === 'strike' ? 'pop-proof-version--stands' : ''}`}>
            <span className="pop-folio pop-proof-version-tag">BLANK</span>
            <span className="pop-proof-blank-rule" aria-hidden="true" />
            <span className="pop-proof-blank-word">the empty canvas, returned</span>
          </p>
        </div>

        <div
          className="pop-proof-fates"
          role="radiogroup"
          aria-label={`${line.slot}: keep machine, take the hand, or strike`}
        >
          {FATES.map((f) => (
            <button
              key={f.id}
              type="button"
              role="radio"
              aria-checked={fate === f.id}
              tabIndex={fate === f.id ? 0 : -1}
              className="pop-proof-radio"
              onClick={() => setFate(line.id, f.id)}
              onKeyDown={(e) => onRadioKeyDown(e, line.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </li>
    )
  }

  return (
    <section className={`pop-proof ${stockClass}`} style={accentStyle} aria-labelledby="pop-proof-title">
      <div className="pop-proof-inner">

        <header className="pop-proof-header">
          <span className="pop-kicker pop-kicker--tomato">{spread.kicker}</span>
          <hr className="pop-rule pop-rule--short pop-rule--tomato" />
          <h2 id="pop-proof-title" className="pop-display pop-proof-title">
            {spread.title}
          </h2>
          <p className="pop-feature-jp pop-proof-title-jp">{spread.titleJp}</p>
          <p className="pop-swash pop-proof-deck">{spread.deck}</p>
          <p className="pop-folio pop-proof-byline">{spread.byline}</p>
        </header>

        {spread.dossier && (
          <aside className="pop-proof-spec" aria-label={spread.dossier.kicker}>
            <div className="pop-proof-spec-frame">
              <PopShape
                name="lozenge"
                size="md"
                color="tomato"
                className="pop-proof-spec-badge"
                aria-label="spec badge"
              />
              <span className="pop-folio pop-proof-spec-kicker">{spread.dossier.kicker}</span>
              {spread.dossier.note && (
                <p className="pop-proof-spec-note">{spread.dossier.note}</p>
              )}
              <dl className="pop-proof-spec-list">
                {spread.dossier.items.map((item, i) => (
                  <div key={i} className="pop-proof-spec-row">
                    <dt className="pop-folio pop-proof-spec-label">{item.label}</dt>
                    <dd className="pop-proof-spec-value">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        )}

        {spread.intro && (
          <article className="pop-proof-prose">{renderSections(spread.intro)}</article>
        )}

        <hr className="pop-rule pop-proof-rule" />

        {spread.proofKicker && (
          <p className="pop-folio pop-proof-kicker-line">{spread.proofKicker}</p>
        )}

        <ol className="pop-proof-lines">
          {spread.lines.map(renderLine)}
        </ol>

        <p className="pop-proof-machine-note">{spread.machineNote}</p>

        {/* The resolved screen — composes live from the reader's fates. */}
        <div className="pop-proof-screen" aria-label="The resolved screen">
          <span className="pop-folio pop-proof-screen-kicker">THE RESOLVED SCREEN · 仕上がり</span>
          <div className="pop-proof-screen-frame">
            {spread.lines.map((line) => {
              const text = resolvedText(line)
              return (
                <div key={line.id} className={`pop-proof-screen-slot pop-proof-screen-slot--${line.id}`}>
                  <span className="pop-folio pop-proof-screen-slot-tag">{line.slot}</span>
                  {text !== null ? (
                    <span className="pop-proof-screen-text">{text}</span>
                  ) : (
                    <span className="pop-proof-screen-blank" aria-label={`${line.slot}: struck — blank`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="pop-proof-ledger" aria-live="polite">
          <span className="pop-folio pop-proof-ledger-kicker">THE PROVENANCE LEDGER · 台帳</span>
          <p className="pop-proof-ledger-line">
            <span>{machineCount} MACHINE</span>
            <span aria-hidden="true">·</span>
            <span>{handCount} HAND</span>
            <span aria-hidden="true">·</span>
            <span>{struckCount} STRUCK</span>
          </p>
          <p className="pop-proof-ledger-note">{spread.ledgerNote}</p>
        </div>

        <hr className="pop-rule pop-proof-rule" />

        {spread.outro && (
          <article className="pop-proof-prose">{renderSections(spread.outro)}</article>
        )}

        {spread.pullQuote && (
          <blockquote className="pop-proof-pullquote">
            <p className="pop-proof-pullquote-text">{spread.pullQuote.text}</p>
            <cite className="pop-folio pop-proof-pullquote-cite">{spread.pullQuote.attribution}</cite>
          </blockquote>
        )}

        <footer className="pop-proof-signoff">
          <hr className="pop-rule pop-rule--short pop-rule--tomato" />
          <p className="pop-swash pop-proof-signoff-text">{spread.signoff}</p>
          <div className="pop-monument pop-proof-monument">
            <span>ISSUE</span>
            <strong>{issue.number}</strong>
            <span>{issue.month} {issue.year}</span>
          </div>
        </footer>

      </div>
    </section>
  )
}
