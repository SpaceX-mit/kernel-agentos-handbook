import { useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
import type { IssueRecord, PressSpread, PressLayout } from '../content/issues'
import type { IssueStock } from '../content/issues'
import { INK_SEEDS, resolveAccentHex } from '../content/issues/accents'
import type { InkSeedName } from '../content/issues/accents'
import { PopShape } from './ornaments'
import './PressFeature.css'
import './IssueAccent.css'

interface PressFeatureProps {
  spread: PressSpread
  issue: IssueRecord
}

/**
 * PressFeature — the composing instrument.
 *
 * Editorial tool #13, the sixth interaction shape (ISSUE 413), and
 * the first ARTIFACT control: the reader operates the magazine's
 * real production grammar — the actual stock cabinet, the actual
 * Ink Cabinet seeds, the actual cover layouts, a headline lockup
 * and seal in their own words — and a cover assembles live under
 * their hands. Every prior shape produced a reading; this one
 * produces a thing, printable and theirs.
 *
 * The law travels with the instruments: the choice sets ARE the
 * system constants (IssueStock, INK_SEEDS, the three main
 * layouts), so an off-grammar cover cannot be composed — one spot
 * color, two faces, POPEYE-safe seeds only, enforced by
 * construction rather than validation. isPopeyeSafe() ran when the
 * cabinet was curated; the reader inherits the curation.
 *
 * Controls: three roving radiogroups (stock / seed / layout) and
 * labelled text inputs (prefix, emphasis, suffix, seal, number) —
 * all established patterns (rule 5). Composition is session React
 * state: nothing recorded, nothing sent (rule 6, both directions).
 * Print renders the reader's cover and its colophon and hides the
 * instruments — the artifact leaves with the reader.
 */

const STOCKS: { id: IssueStock; label: string }[] = [
  { id: 'cream', label: 'CREAM' },
  { id: 'butter', label: 'BUTTER' },
  { id: 'kraft', label: 'KRAFT' },
  { id: 'ivory', label: 'IVORY' },
  { id: 'ink', label: 'INK' },
  { id: 'ledger', label: 'LEDGER' },
]

const LAYOUTS: { id: PressLayout; label: string }[] = [
  { id: 'classic', label: 'CLASSIC' },
  { id: 'monument-hero', label: 'MONUMENT' },
  { id: 'asymmetric-left', label: 'ASYM-LEFT' },
]

const SEEDS = Object.keys(INK_SEEDS) as InkSeedName[]

/** A generic roving radiogroup row — one tab stop, arrows move
 *  selection and focus (the dial's own keyboard grammar). */
function InstrumentRow<T extends string>(props: {
  label: string
  labelJp?: string
  options: { id: T; label: string; swatch?: string }[]
  value: T
  onChange: (v: T) => void
}) {
  const { label, labelJp, options, value, onChange } = props
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const activeIndex = Math.max(0, options.findIndex((o) => o.id === value))

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    let next = -1
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = Math.min(options.length - 1, activeIndex + 1)
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = Math.max(0, activeIndex - 1)
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = options.length - 1
    if (next >= 0 && next !== activeIndex) {
      e.preventDefault()
      onChange(options[next].id)
      refs.current[next]?.focus()
    }
  }

  return (
    <div className="pop-press-instrument">
      <span className="pop-folio pop-press-instrument-label">
        {label}
        {labelJp && <span className="pop-press-instrument-jp" aria-hidden="true"> · {labelJp}</span>}
      </span>
      <div className="pop-press-options" role="radiogroup" aria-label={label} onKeyDown={onKeyDown}>
        {options.map((o, i) => (
          <button
            key={o.id}
            ref={(el) => { refs.current[i] = el }}
            type="button"
            role="radio"
            aria-checked={o.id === value}
            tabIndex={o.id === value ? 0 : -1}
            className={`pop-press-option${o.id === value ? ' pop-press-option--active' : ''}`}
            onClick={() => onChange(o.id)}
          >
            {o.swatch && (
              <span className="pop-press-swatch" style={{ background: o.swatch }} aria-hidden="true" />
            )}
            <span className="pop-folio pop-press-option-label">{o.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function PressFeature({ spread, issue }: PressFeatureProps) {
  const stockClass = `pop-stock-${spread.stock ?? 'cream'}`
  const accentHex = resolveAccentHex(issue.accent, spread.type)
  const accentStyle = { '--issue-accent-base': accentHex } as CSSProperties

  const d = spread.defaults
  const [stock, setStock] = useState<IssueStock>(d.stock)
  const [seed, setSeed] = useState<InkSeedName>(
    (d.accent in INK_SEEDS ? d.accent : 'tomato') as InkSeedName,
  )
  const [layout, setLayout] = useState<PressLayout>(d.layout)
  const [prefix, setPrefix] = useState(d.prefix)
  const [emphasis, setEmphasis] = useState(d.emphasis)
  const [suffix, setSuffix] = useState(d.suffix)
  const [seal, setSeal] = useState(d.seal)
  const [number, setNumber] = useState(d.number)

  const coverAccent = { '--issue-accent-base': INK_SEEDS[seed].hex } as CSSProperties

  const renderSections = (sections?: typeof spread.intro) =>
    sections?.map((section, i) => (
      <section key={i} className="pop-press-section">
        <h3 className="pop-press-section-heading">
          {section.heading}
          {section.headingJp && (
            <span className="pop-press-section-heading-jp">{section.headingJp}</span>
          )}
        </h3>
        {section.paragraphs.map((p, pi) => (
          <p key={pi} className="pop-press-paragraph">{p}</p>
        ))}
      </section>
    ))

  return (
    <section className={`pop-press ${stockClass}`} style={accentStyle} aria-labelledby="pop-press-title">
      <div className="pop-press-inner">

        {/* ── Head ───────────────────────────────────────── */}
        <header className="pop-press-header">
          <span className="pop-kicker pop-kicker--tomato">{spread.kicker}</span>
          <hr className="pop-rule pop-rule--short pop-rule--tomato" />
          <h2 id="pop-press-title" className="pop-display pop-press-title">
            {spread.title}
          </h2>
          <p className="pop-feature-jp pop-press-title-jp">{spread.titleJp}</p>
          <p className="pop-swash pop-press-deck">{spread.deck}</p>
          <p className="pop-folio pop-press-byline">{spread.byline}</p>
        </header>

        {/* ── The spec — dossier (optional, reused module) ── */}
        {spread.dossier && (
          <aside className="pop-press-spec" aria-label={spread.dossier.kicker}>
            <div className="pop-press-spec-frame">
              <PopShape
                name="lozenge"
                size="md"
                color="tomato"
                className="pop-press-spec-badge"
                aria-label="spec badge"
              />
              <span className="pop-folio pop-press-spec-kicker">{spread.dossier.kicker}</span>
              {spread.dossier.note && (
                <p className="pop-press-spec-note">{spread.dossier.note}</p>
              )}
              <dl className="pop-press-spec-list">
                {spread.dossier.items.map((item, i) => (
                  <div key={i} className="pop-press-spec-row">
                    <dt className="pop-folio pop-press-spec-label">{item.label}</dt>
                    <dd className="pop-press-spec-value">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        )}

        {/* ── Intro prose ─────────────────────────────────── */}
        {spread.intro && (
          <article className="pop-press-prose">{renderSections(spread.intro)}</article>
        )}

        <hr className="pop-rule pop-press-rule" />

        {/* ── THE PRESS ────────────────────────────────────── */}
        <div className="pop-press-apparatus">
          {spread.pressKicker && (
            <p className="pop-folio pop-press-apparatus-kicker">{spread.pressKicker}</p>
          )}

          {/* The reader's cover — assembles live. */}
          <div
            className={`pop-press-cover pop-stock-${stock} pop-press-cover--${layout}`}
            style={coverAccent}
            aria-label="Your cover, as composed"
          >
            <div className="pop-press-cover-dateline">
              <span className="pop-press-cover-star" aria-hidden="true">★</span>
              <span>ISSUE {number || '001'} · JUL 2026</span>
            </div>
            <div className="pop-press-cover-masthead">kernel.chat</div>
            <hr className="pop-press-cover-rule" />
            {layout === 'monument-hero' ? (
              <div className="pop-press-cover-heronum">{number || '001'}</div>
            ) : null}
            <div className="pop-press-cover-headline">
              {prefix && <span>{prefix} </span>}
              <em className="pop-press-cover-emphasis">{emphasis || '…'}</em>
              {suffix && <span> {suffix}</span>}
            </div>
            {seal.trim() && (
              <div className="pop-press-cover-seal" aria-label={`Seal: ${seal}`}>
                <span>{seal}</span>
                <span className="pop-press-cover-seal-date">VII·26</span>
              </div>
            )}
            <div className="pop-press-cover-monument">
              <span>ISSUE</span>
              <strong>{number || '001'}</strong>
              <span>¥0 · BYOK</span>
            </div>
          </div>

          {/* The instruments. */}
          <div className="pop-press-instruments">
            <InstrumentRow
              label="STOCK"
              labelJp="紙"
              options={STOCKS.map((s) => ({ id: s.id, label: s.label }))}
              value={stock}
              onChange={setStock}
            />
            <InstrumentRow
              label="INK"
              labelJp="インク"
              options={SEEDS.map((s) => ({
                id: s,
                label: INK_SEEDS[s].name.toUpperCase(),
                swatch: INK_SEEDS[s].hex,
              }))}
              value={seed}
              onChange={setSeed}
            />
            <InstrumentRow
              label="LAYOUT"
              labelJp="組版"
              options={LAYOUTS.map((l) => ({ id: l.id, label: l.label }))}
              value={layout}
              onChange={setLayout}
            />

            <div className="pop-press-fields">
              <label className="pop-press-field">
                <span className="pop-folio pop-press-field-label">HEADLINE · PREFIX</span>
                <input type="text" maxLength={24} value={prefix} onChange={(e) => setPrefix(e.target.value)} />
              </label>
              <label className="pop-press-field">
                <span className="pop-folio pop-press-field-label">EMPHASIS · 強調</span>
                <input type="text" maxLength={18} value={emphasis} onChange={(e) => setEmphasis(e.target.value)} />
              </label>
              <label className="pop-press-field">
                <span className="pop-folio pop-press-field-label">SUFFIX</span>
                <input type="text" maxLength={24} value={suffix} onChange={(e) => setSuffix(e.target.value)} />
              </label>
              <label className="pop-press-field">
                <span className="pop-folio pop-press-field-label">SEAL · 印 (EMPTY = NONE)</span>
                <input type="text" maxLength={32} value={seal} onChange={(e) => setSeal(e.target.value)} />
              </label>
              <label className="pop-press-field pop-press-field--short">
                <span className="pop-folio pop-press-field-label">NUMBER</span>
                <input type="text" maxLength={4} value={number} onChange={(e) => setNumber(e.target.value)} />
              </label>
            </div>
          </div>

          {/* The colophon of the reader's cover — states the
              composition, claims nothing else. */}
          <p className="pop-press-colophon" aria-live="polite">
            YOUR COLOPHON · STOCK {stock.toUpperCase()} · INK {INK_SEEDS[seed].name.toUpperCase()} · {layout.replace('-', ' ').toUpperCase()}
          </p>
          <p className="pop-press-colophon-note">{spread.pressNote}</p>
        </div>

        <hr className="pop-rule pop-press-rule" />

        {/* ── Outro prose ─────────────────────────────────── */}
        {spread.outro && (
          <article className="pop-press-prose">{renderSections(spread.outro)}</article>
        )}

        {/* ── Pull quote (optional) ───────────────────────── */}
        {spread.pullQuote && (
          <blockquote className="pop-press-pullquote">
            <p className="pop-press-pullquote-text">{spread.pullQuote.text}</p>
            <cite className="pop-folio pop-press-pullquote-cite">{spread.pullQuote.attribution}</cite>
          </blockquote>
        )}

        {/* ── Sign-off ────────────────────────────────────── */}
        <footer className="pop-press-signoff">
          <hr className="pop-rule pop-rule--short pop-rule--tomato" />
          <p className="pop-swash pop-press-signoff-text">{spread.signoff}</p>
          <div className="pop-monument pop-press-monument">
            <span>ISSUE</span>
            <strong>{issue.number}</strong>
            <span>{issue.month} {issue.year}</span>
          </div>
        </footer>

      </div>
    </section>
  )
}
