import * as React from 'react'

export interface IssueMeta {
  number?: string
  month?: string
  year?: string
}

export interface EssaySection {
  heading?: string
  headingJp?: string
  paragraphs?: string[]
}

export interface EssayPullQuote {
  text: string
  attribution?: string
}

export interface EssayReference {
  authors: string
  year?: string
  title: string
  journal?: string
}

/**
 * @startingPoint section="Spreads" subtitle="Long-form prose essay — drop cap + pull-quote" viewport="900x760"
 */
export interface EssaySpreadProps extends React.HTMLAttributes<HTMLElement> {
  /** Bracketed kicker. Default "ESSAY · 随筆". */
  kicker?: string
  title: string
  titleJp?: string
  deck?: string
  byline?: string
  /** Sectioned prose. The first paragraph of the first section drop-caps. */
  sections?: EssaySection[]
  /** Tomato pull-quote, dropped after the second section. */
  pullQuote?: EssayPullQuote
  /** Optional works-cited block (WIRED-style numbered references). */
  references?: { kicker?: string; items: EssayReference[] }
  signoff?: string
  issue?: IssueMeta
  /** Paper stock. Default "kraft". */
  stock?: 'cream' | 'butter' | 'kraft' | 'ivory' | 'ink' | 'ledger'
}

/** The long-form prose essay feature tool. */
export function EssaySpread(props: EssaySpreadProps): React.JSX.Element
