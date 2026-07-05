import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import type { IssueRecord, GalleySpread } from '../content/issues'
import { resolveAccentHex } from '../content/issues/accents'
import { PopShape } from './ornaments'
import './GalleyFeature.css'
import './IssueAccent.css'

interface GalleyFeatureProps {
  spread: GalleySpread
  issue: IssueRecord
}

/**
 * GalleyFeature — a text the reader marks up.
 *
 * Editorial tool #10 in the IssueFeature family, and the magazine's
 * fourth interactive shape (ISSUE 410): N independent two-state
 * strike/keep marks applied to the prose itself. Not positions on
 * one variable (Dial), not two lenses (Compare), not ordered stages
 * (Sequence) — the reader performs an editorial act on the text.
 *
 * ARIA pattern: one toggle button per passage, `aria-pressed`, with
 * a STABLE accessible name ("Cut passage N") — screen readers
 * announce the pressed state; the name never swaps. Buttons are
 * natively tabbable; Enter/Space toggle. No roving tabindex —
 * the marks are independent controls, not one composite widget.
 *
 * Honesty boundary (rule 6, argued in the 410 header comment):
 * the tally counts the reader's marks on this page and nothing
 * else — words kept, passages struck. It makes no claim about any
 * internal state. Marks are client-session React state: nothing is
 * recorded, nothing is sent. Struck text stays in the DOM and
 * stays legible — a manuscript strikethrough, never a removal.
 * Print hides the knives and the tally and keeps the reader's
 * marks: you print your own galley.
 */
export function GalleyFeature({ spread, issue }: GalleyFeatureProps) {
  const stockClass = `pop-stock-${spread.stock ?? 'cream'}`
  const accentHex = resolveAccentHex(issue.accent, spread.type)
  const accentStyle = { '--issue-accent-base': accentHex } as CSSProperties

  const [struck, setStruck] = useState<Record<string, boolean>>({})

  const wordCounts = useMemo(
    () => spread.passages.map((p) => p.text.trim().split(/\s+/).length),
    [spread.passages],
  )
  const totalWords = useMemo(() => wordCounts.reduce((a, b) => a + b, 0), [wordCounts])
  const struckCount = spread.passages.filter((p) => struck[p.id]).length
  const keptWords = spread.passages.reduce(
    (sum, p, i) => (struck[p.id] ? sum : sum + wordCounts[i]),
    0,
  )

  const toggle = (id: string) =>
    setStruck((prev) => ({ ...prev, [id]: !prev[id] }))

  const renderSections = (sections?: typeof spread.intro) =>
    sections?.map((section, i) => (
      <section key={i} className="pop-galley-section">
        <h3 className="pop-galley-section-heading">
          {section.heading}
          {section.headingJp && (
            <span className="pop-galley-section-heading-jp">{section.headingJp}</span>
          )}
        </h3>
        {section.paragraphs.map((p, pi) => (
          <p key={pi} className="pop-galley-paragraph">{p}</p>
        ))}
      </section>
    ))

  return (
    <section className={`pop-galley ${stockClass}`} style={accentStyle} aria-labelledby="pop-galley-title">
      <div className="pop-galley-inner">

        {/* ── Head ───────────────────────────────────────── */}
        <header className="pop-galley-header">
          <span className="pop-kicker pop-kicker--tomato">{spread.kicker}</span>
          <hr className="pop-rule pop-rule--short pop-rule--tomato" />
          <h2 id="pop-galley-title" className="pop-display pop-galley-title">
            {spread.title}
          </h2>
          <p className="pop-feature-jp pop-galley-title-jp">{spread.titleJp}</p>
          <p className="pop-swash pop-galley-deck">{spread.deck}</p>
          <p className="pop-folio pop-galley-byline">{spread.byline}</p>
        </header>

        {/* ── The spec — dossier (optional, reused module) ── */}
        {spread.dossier && (
          <aside className="pop-galley-spec" aria-label={spread.dossier.kicker}>
            <div className="pop-galley-spec-frame">
              <PopShape
                name="lozenge"
                size="md"
                color="tomato"
                className="pop-galley-spec-badge"
                aria-label="spec badge"
              />
              <span className="pop-folio pop-galley-spec-kicker">{spread.dossier.kicker}</span>
              {spread.dossier.note && (
                <p className="pop-galley-spec-note">{spread.dossier.note}</p>
              )}
              <dl className="pop-galley-spec-list">
                {spread.dossier.items.map((item, i) => (
                  <div key={i} className="pop-galley-spec-row">
                    <dt className="pop-folio pop-galley-spec-label">{item.label}</dt>
                    <dd className="pop-galley-spec-value">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        )}

        {/* ── Intro prose ─────────────────────────────────── */}
        {spread.intro && (
          <article className="pop-galley-prose">{renderSections(spread.intro)}</article>
        )}

        <hr className="pop-rule pop-galley-rule" />

        {/* ── THE GALLEY ───────────────────────────────────── */}
        <div className="pop-galley-apparatus">
          {spread.galleyKicker && (
            <p className="pop-folio pop-galley-apparatus-kicker">{spread.galleyKicker}</p>
          )}

          <div className="pop-galley-passages">
            {spread.passages.map((passage, i) => {
              const isStruck = !!struck[passage.id]
              return (
                <div
                  key={passage.id}
                  className={`pop-galley-passage${isStruck ? ' pop-galley-passage--struck' : ''}`}
                >
                  <p className="pop-galley-passage-text">{passage.text}</p>
                  <button
                    type="button"
                    aria-pressed={isStruck}
                    aria-label={`Cut passage ${i + 1}`}
                    className="pop-galley-knife"
                    onClick={() => toggle(passage.id)}
                  >
                    <span className="pop-galley-knife-mark" aria-hidden="true" />
                    <span className="pop-folio pop-galley-knife-label" aria-hidden="true">
                      {isStruck ? 'STET' : 'CUT'}
                    </span>
                  </button>
                </div>
              )
            })}
          </div>

          {/* The tally — a real count of the reader's marks, and
              nothing else. aria-live announces it as marks change. */}
          <p className="pop-galley-tally" aria-live="polite">
            <span>KEPT {keptWords} OF {totalWords} WORDS</span>
            <span aria-hidden="true">·</span>
            <span>{struckCount} OF {spread.passages.length} PASSAGES STRUCK</span>
          </p>
          <p className="pop-galley-tally-note">{spread.tallyNote}</p>
        </div>

        <hr className="pop-rule pop-galley-rule" />

        {/* ── Outro prose ─────────────────────────────────── */}
        {spread.outro && (
          <article className="pop-galley-prose">{renderSections(spread.outro)}</article>
        )}

        {/* ── Pull quote (optional) ───────────────────────── */}
        {spread.pullQuote && (
          <blockquote className="pop-galley-pullquote">
            <p className="pop-galley-pullquote-text">{spread.pullQuote.text}</p>
            <cite className="pop-folio pop-galley-pullquote-cite">{spread.pullQuote.attribution}</cite>
          </blockquote>
        )}

        {/* ── Sign-off ────────────────────────────────────── */}
        <footer className="pop-galley-signoff">
          <hr className="pop-rule pop-rule--short pop-rule--tomato" />
          <p className="pop-swash pop-galley-signoff-text">{spread.signoff}</p>
          <div className="pop-monument pop-galley-monument">
            <span>ISSUE</span>
            <strong>{issue.number}</strong>
            <span>{issue.month} {issue.year}</span>
          </div>
        </footer>

      </div>
    </section>
  )
}
