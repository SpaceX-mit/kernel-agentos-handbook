import * as React from 'react'

export interface IssueMeta {
  number?: string
  month?: string
  year?: string
}

export interface ForecastProposition {
  /** Number shown in the tomato ring, e.g. "01". */
  n: string
  title: string
  titleJp?: string
  /** Prose paragraphs. */
  body?: string[]
}

/**
 * @startingPoint section="Spreads" subtitle="Numbered manifesto / forecast on ink" viewport="900x700"
 */
export interface ForecastSpreadProps extends React.HTMLAttributes<HTMLElement> {
  /** Bracketed kicker. Default "FORECAST · 予報". */
  kicker?: string
  title: string
  titleJp?: string
  deck?: string
  byline?: string
  intro?: string
  /** The numbered declarations. */
  propositions?: ForecastProposition[]
  outro?: string
  signoff?: string
  issue?: IssueMeta
  /** Paper stock. Default "ink". */
  stock?: 'cream' | 'butter' | 'kraft' | 'ivory' | 'ink' | 'ledger'
  /** Retint the rings/rules (e.g. "var(--pop-cobalt)"). */
  accent?: string
}

/** The numbered-manifesto / forecast feature tool. */
export function ForecastSpread(props: ForecastSpreadProps): React.JSX.Element
