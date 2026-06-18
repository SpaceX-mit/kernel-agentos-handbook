import * as React from 'react'

export interface IssueMeta {
  number?: string
  month?: string
  year?: string
}

export interface ReviewCriterion {
  /** Criterion number, e.g. "01". */
  n: string
  label: string
  /** Optional weight tag, e.g. "30%". */
  weight?: string
  description?: string
}

export interface ReviewSubject {
  /** Rank — shown as the gutter number and used as key. */
  rank: number
  name: string
  /** One-line italic read under the name. */
  read?: string
  /** Score for the monument, e.g. "8.8". */
  score: string
  /** 0–5 stars (rounded). */
  stars?: number
  pros?: string[]
  cons?: string[]
  /** One-line per-subject verdict. */
  verdict?: string
}

/**
 * @startingPoint section="Spreads" subtitle="Graded survey — verdict + scored grid" viewport="900x760"
 */
export interface ReviewSpreadProps extends React.HTMLAttributes<HTMLElement> {
  /** Bracketed kicker. Default "REVIEW · 評". */
  kicker?: string
  title: string
  titleJp?: string
  deck?: string
  byline?: string
  /** The loud top-line italic verdict. */
  verdict?: string
  intro?: string
  /** Numbered rubric of criteria. */
  criteria?: ReviewCriterion[]
  /** Graded subject cards. */
  subjects?: ReviewSubject[]
  outro?: string
  signoff?: string
  issue?: IssueMeta
  /** Paper stock. Default "ivory". */
  stock?: 'cream' | 'butter' | 'kraft' | 'ivory' | 'ink' | 'ledger'
}

/** The graded-survey feature tool. */
export function ReviewSpread(props: ReviewSpreadProps): React.JSX.Element
