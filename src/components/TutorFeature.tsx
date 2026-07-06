import { useMemo, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, ReactNode } from 'react'
import type {
  IssueRecord,
  TutorSpread,
  TutorLesson,
  TutorDialLesson,
  TutorSwitchLesson,
  TutorSequenceLesson,
  TutorGalleyLesson,
} from '../content/issues'
import { resolveAccentHex } from '../content/issues/accents'
import { PopShape } from './ornaments'
import './TutorFeature.css'
import './IssueAccent.css'

interface TutorFeatureProps {
  spread: TutorSpread
  issue: IssueRecord
}

/**
 * TutorFeature — the manual for the interaction language.
 *
 * Editorial tool #11, and the magazine's first spread whose purpose
 * is capability rather than claim: the reader OPERATES a stakes-free
 * version of each of the four interaction shapes (dial, switch,
 * sequence, galley) and, in doing so, becomes literate in the
 * grammar every future interactive spread will use.
 *
 * Teach by CONSEQUENCE, never by grade. Each practice control shows
 * what the reader's choice produced; no control is ever "wrong."
 * The magazine could grade a keystroke honestly (unlike 410's
 * feeling, a correct answer is auditable) and refuses to anyway —
 * that refusal is the issue's ethic.
 *
 * Composition without extraction (rule 7): the four mini-controls
 * are reimplemented inline rather than imported from the full
 * feature components. The tutor is instance one of a new story;
 * shared machinery waits for a second tutor before anything is
 * pulled out. Each control uses the SAME ARIA pattern as its full
 * shape — radiogroup, switch, tablist, aria-pressed toggles — so
 * the reader learns the real grammar, not a toy of it. All states
 * stay in the DOM; print shows every reading and hides every
 * control, so the manual degrades to a written explanation on paper.
 */
export function TutorFeature({ spread, issue }: TutorFeatureProps) {
  const stockClass = `pop-stock-${spread.stock ?? 'butter'}`
  const accentHex = resolveAccentHex(issue.accent, spread.type)
  const accentStyle = { '--issue-accent-base': accentHex } as CSSProperties

  const renderSections = (sections?: typeof spread.intro) =>
    sections?.map((section, i) => (
      <section key={i} className="pop-tutor-section">
        <h3 className="pop-tutor-section-heading">
          {section.heading}
          {section.headingJp && (
            <span className="pop-tutor-section-heading-jp">{section.headingJp}</span>
          )}
        </h3>
        {section.paragraphs.map((p, pi) => (
          <p key={pi} className="pop-tutor-paragraph">{p}</p>
        ))}
      </section>
    ))

  return (
    <section className={`pop-tutor ${stockClass}`} style={accentStyle} aria-labelledby="pop-tutor-title">
      <div className="pop-tutor-inner">

        {/* ── Head ───────────────────────────────────────── */}
        <header className="pop-tutor-header">
          <span className="pop-kicker pop-kicker--tomato">{spread.kicker}</span>
          <hr className="pop-rule pop-rule--short pop-rule--tomato" />
          <h2 id="pop-tutor-title" className="pop-display pop-tutor-title">
            {spread.title}
          </h2>
          <p className="pop-feature-jp pop-tutor-title-jp">{spread.titleJp}</p>
          <p className="pop-swash pop-tutor-deck">{spread.deck}</p>
          <p className="pop-folio pop-tutor-byline">{spread.byline}</p>
        </header>

        {/* ── The spec — dossier (optional, reused module) ── */}
        {spread.dossier && (
          <aside className="pop-tutor-spec" aria-label={spread.dossier.kicker}>
            <div className="pop-tutor-spec-frame">
              <PopShape
                name="lozenge"
                size="md"
                color="tomato"
                className="pop-tutor-spec-badge"
                aria-label="spec badge"
              />
              <span className="pop-folio pop-tutor-spec-kicker">{spread.dossier.kicker}</span>
              {spread.dossier.note && (
                <p className="pop-tutor-spec-note">{spread.dossier.note}</p>
              )}
              <dl className="pop-tutor-spec-list">
                {spread.dossier.items.map((item, i) => (
                  <div key={i} className="pop-tutor-spec-row">
                    <dt className="pop-folio pop-tutor-spec-label">{item.label}</dt>
                    <dd className="pop-tutor-spec-value">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        )}

        {/* ── Intro prose ─────────────────────────────────── */}
        {spread.intro && (
          <article className="pop-tutor-prose">{renderSections(spread.intro)}</article>
        )}

        <hr className="pop-rule pop-tutor-rule" />

        {/* ── THE LESSONS ──────────────────────────────────── */}
        <div className="pop-tutor-lessons">
          {spread.lessons.map((lesson, i) => (
            <LessonBlock key={lesson.id} lesson={lesson} index={i} />
          ))}
        </div>

        <hr className="pop-rule pop-tutor-rule" />

        {/* ── Outro prose ─────────────────────────────────── */}
        {spread.outro && (
          <article className="pop-tutor-prose">{renderSections(spread.outro)}</article>
        )}

        {/* ── Pull quote (optional) ───────────────────────── */}
        {spread.pullQuote && (
          <blockquote className="pop-tutor-pullquote">
            <p className="pop-tutor-pullquote-text">{spread.pullQuote.text}</p>
            <cite className="pop-folio pop-tutor-pullquote-cite">{spread.pullQuote.attribution}</cite>
          </blockquote>
        )}

        {/* ── Sign-off ────────────────────────────────────── */}
        <footer className="pop-tutor-signoff">
          <hr className="pop-rule pop-rule--short pop-rule--tomato" />
          <p className="pop-swash pop-tutor-signoff-text">{spread.signoff}</p>
          <div className="pop-monument pop-tutor-monument">
            <span>ISSUE</span>
            <strong>{issue.number}</strong>
            <span>{issue.month} {issue.year}</span>
          </div>
        </footer>

      </div>
    </section>
  )
}

/* ── One lesson: heading + what-it-teaches + intro + the operable
      practice control + the consequence line (always visible, so
      the page reads complete untouched — rule 1). ──────────────── */
function LessonBlock({ lesson, index }: { lesson: TutorLesson; index: number }) {
  let practice: ReactNode
  switch (lesson.shape) {
    case 'dial':
      practice = <DialPractice lesson={lesson} />
      break
    case 'switch':
      practice = <SwitchPractice lesson={lesson} />
      break
    case 'sequence':
      practice = <SequencePractice lesson={lesson} />
      break
    case 'galley':
      practice = <GalleyPractice lesson={lesson} />
      break
    default: {
      const _exhaustive: never = lesson
      practice = _exhaustive
    }
  }

  return (
    <section className="pop-tutor-lesson">
      <header className="pop-tutor-lesson-head">
        <span className="pop-folio pop-tutor-lesson-num" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className="pop-tutor-lesson-label">
          {lesson.label}
          {lesson.labelJp && (
            <span className="pop-tutor-lesson-jp">{lesson.labelJp}</span>
          )}
        </h3>
        <p className="pop-tutor-lesson-teaches">{lesson.teaches}</p>
      </header>
      <p className="pop-tutor-lesson-intro">{lesson.intro}</p>
      <div className="pop-tutor-practice">{practice}</div>
      <p className="pop-tutor-consequence">
        <span className="pop-folio pop-tutor-consequence-tag" aria-hidden="true">
          WHAT YOUR HAND SHOWS · 結果
        </span>
        {lesson.consequence}
      </p>
    </section>
  )
}

/* ── Dial practice — a roving radiogroup (rule 5). ─────────────── */
function DialPractice({ lesson }: { lesson: TutorDialLesson }) {
  const [activeId, setActiveId] = useState(lesson.defaultStop ?? lesson.stops[0]?.id)
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const activeIndex = Math.max(0, lesson.stops.findIndex((s) => s.id === activeId))

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    let next = -1
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = Math.min(lesson.stops.length - 1, activeIndex + 1)
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = Math.max(0, activeIndex - 1)
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = lesson.stops.length - 1
    if (next >= 0 && next !== activeIndex) {
      e.preventDefault()
      setActiveId(lesson.stops[next].id)
      refs.current[next]?.focus()
    }
  }

  return (
    <div className="pop-tutor-dial-wrap">
      <p className="pop-tutor-prompt">{lesson.prompt}</p>
      <div className="pop-tutor-dial" role="radiogroup" aria-label={lesson.label} onKeyDown={onKeyDown}>
        <span className="pop-tutor-dial-track" aria-hidden="true" />
        {lesson.stops.map((s, i) => (
          <button
            key={s.id}
            ref={(el) => { refs.current[i] = el }}
            type="button"
            role="radio"
            aria-checked={s.id === activeId}
            tabIndex={s.id === activeId ? 0 : -1}
            className={`pop-tutor-stop${s.id === activeId ? ' pop-tutor-stop--active' : ''}`}
            onClick={() => setActiveId(s.id)}
          >
            <span className="pop-tutor-stop-mark" aria-hidden="true" />
            <span className="pop-folio pop-tutor-stop-label">{s.label}</span>
            {s.labelJp && <span className="pop-tutor-stop-jp" aria-hidden="true">{s.labelJp}</span>}
          </button>
        ))}
      </div>
      <div className="pop-tutor-readout" aria-live="polite">
        {lesson.stops.map((s) => (
          <p
            key={s.id}
            className={`pop-tutor-reading${s.id === activeId ? ' pop-tutor-reading--active' : ''}`}
            aria-hidden={s.id !== activeId}
          >
            <span className="pop-folio pop-tutor-reading-tag">{s.label}</span>
            {s.reading}
          </p>
        ))}
      </div>
    </div>
  )
}

/* ── Switch practice — a two-state ARIA switch (rule 5). ───────── */
function SwitchPractice({ lesson }: { lesson: TutorSwitchLesson }) {
  const [lensA, lensB] = lesson.lenses
  const [activeId, setActiveId] = useState(lesson.defaultLens ?? lensA.id)
  const isB = activeId === lensB.id

  return (
    <div className="pop-tutor-switch-wrap">
      <p className="pop-tutor-fact">{lesson.fact}</p>
      <button
        type="button"
        role="switch"
        aria-checked={isB}
        aria-label={`Reading — ${isB ? lensB.label : lensA.label}`}
        className="pop-tutor-switch"
        onClick={() => setActiveId(isB ? lensA.id : lensB.id)}
      >
        <span className={`pop-tutor-switch-side${!isB ? ' pop-tutor-switch-side--active' : ''}`}>
          <span className="pop-folio pop-tutor-switch-label">{lensA.label}</span>
          {lensA.labelJp && <span className="pop-tutor-switch-jp" aria-hidden="true">{lensA.labelJp}</span>}
        </span>
        <span className="pop-tutor-switch-track" aria-hidden="true">
          <span className={`pop-tutor-switch-knob${isB ? ' pop-tutor-switch-knob--b' : ''}`} />
        </span>
        <span className={`pop-tutor-switch-side${isB ? ' pop-tutor-switch-side--active' : ''}`}>
          <span className="pop-folio pop-tutor-switch-label">{lensB.label}</span>
          {lensB.labelJp && <span className="pop-tutor-switch-jp" aria-hidden="true">{lensB.labelJp}</span>}
        </span>
      </button>
      <div className="pop-tutor-readout" aria-live="polite">
        <p className={`pop-tutor-reading${!isB ? ' pop-tutor-reading--active' : ''}`} aria-hidden={isB}>
          <span className="pop-tutor-reading-tag">{lensA.label}</span>
          {lesson.readingA}
        </p>
        <p className={`pop-tutor-reading${isB ? ' pop-tutor-reading--active' : ''}`} aria-hidden={!isB}>
          <span className="pop-tutor-reading-tag">{lensB.label}</span>
          {lesson.readingB}
        </p>
      </div>
    </div>
  )
}

/* ── Sequence practice — an ordered tablist (rule 5). ──────────── */
function SequencePractice({ lesson }: { lesson: TutorSequenceLesson }) {
  const [activeId, setActiveId] = useState(lesson.defaultStage ?? lesson.stages[0]?.id)
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const activeIndex = Math.max(0, lesson.stages.findIndex((s) => s.id === activeId))

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    let next = -1
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = Math.min(lesson.stages.length - 1, activeIndex + 1)
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = Math.max(0, activeIndex - 1)
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = lesson.stages.length - 1
    if (next >= 0 && next !== activeIndex) {
      e.preventDefault()
      setActiveId(lesson.stages[next].id)
      refs.current[next]?.focus()
    }
  }

  return (
    <div className="pop-tutor-seq-wrap">
      <div className="pop-tutor-rail" role="tablist" aria-label={lesson.label} onKeyDown={onKeyDown}>
        <span className="pop-tutor-rail-track" aria-hidden="true" />
        {lesson.stages.map((s, i) => (
          <button
            key={s.id}
            ref={(el) => { refs.current[i] = el }}
            type="button"
            role="tab"
            id={`pop-tutor-tab-${lesson.id}-${s.id}`}
            aria-selected={s.id === activeId}
            aria-controls={`pop-tutor-panel-${lesson.id}-${s.id}`}
            tabIndex={s.id === activeId ? 0 : -1}
            className={`pop-tutor-stage${s.id === activeId ? ' pop-tutor-stage--active' : ''}${i < activeIndex ? ' pop-tutor-stage--past' : ''}`}
            onClick={() => setActiveId(s.id)}
          >
            <span className="pop-tutor-stage-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <span className="pop-folio pop-tutor-stage-label">{s.label}</span>
            {s.labelJp && <span className="pop-tutor-stage-jp" aria-hidden="true">{s.labelJp}</span>}
          </button>
        ))}
      </div>
      <div className="pop-tutor-readout">
        {lesson.stages.map((s) => (
          <section
            key={s.id}
            role="tabpanel"
            id={`pop-tutor-panel-${lesson.id}-${s.id}`}
            aria-labelledby={`pop-tutor-tab-${lesson.id}-${s.id}`}
            className={`pop-tutor-reading${s.id === activeId ? ' pop-tutor-reading--active' : ''}`}
            aria-hidden={s.id !== activeId}
          >
            <span className="pop-tutor-reading-tag">{s.label}</span>
            {s.detail}
          </section>
        ))}
      </div>
    </div>
  )
}

/* ── Galley practice — aria-pressed toggles + a tally that counts
      only the marks (rule 6). ─────────────────────────────────── */
function GalleyPractice({ lesson }: { lesson: TutorGalleyLesson }) {
  const [struck, setStruck] = useState<Record<string, boolean>>({})
  const wordCounts = useMemo(
    () => lesson.passages.map((p) => p.text.trim().split(/\s+/).length),
    [lesson.passages],
  )
  const totalWords = wordCounts.reduce((a, b) => a + b, 0)
  const keptWords = lesson.passages.reduce(
    (sum, p, i) => (struck[p.id] ? sum : sum + wordCounts[i]),
    0,
  )
  const struckCount = lesson.passages.filter((p) => struck[p.id]).length

  return (
    <div className="pop-tutor-galley-wrap">
      {lesson.passages.map((p, i) => {
        const isStruck = !!struck[p.id]
        return (
          <div key={p.id} className={`pop-tutor-passage${isStruck ? ' pop-tutor-passage--struck' : ''}`}>
            <p className="pop-tutor-passage-text">{p.text}</p>
            <button
              type="button"
              aria-pressed={isStruck}
              aria-label={`Cut passage ${i + 1}`}
              className="pop-tutor-knife"
              onClick={() => setStruck((prev) => ({ ...prev, [p.id]: !prev[p.id] }))}
            >
              <span className="pop-tutor-knife-mark" aria-hidden="true" />
              <span className="pop-folio pop-tutor-knife-label" aria-hidden="true">
                {isStruck ? 'STET' : 'CUT'}
              </span>
            </button>
          </div>
        )
      })}
      <p className="pop-tutor-tally" aria-live="polite">
        <span>KEPT {keptWords} OF {totalWords} WORDS</span>
        <span aria-hidden="true">·</span>
        <span>{struckCount} OF {lesson.passages.length} STRUCK</span>
      </p>
      <p className="pop-tutor-tally-note">{lesson.tallyNote}</p>
    </div>
  )
}
