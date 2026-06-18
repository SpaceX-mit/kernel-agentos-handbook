import * as React from 'react'

export interface InterviewSubject {
  name: string
  nameJp?: string
  role: string
  roleJp?: string
  location?: string
}

export interface InterviewExchange {
  /** The question — set italic tomato. */
  q: string
  /** The answer — serif body. The last answer takes a drop cap. */
  a: string
}

export interface IssueMeta {
  number?: string
  month?: string
  year?: string
}

/**
 * @startingPoint section="Spreads" subtitle="Q&A profile — dossier + interview" viewport="900x700"
 */
export interface InterviewSpreadProps extends React.HTMLAttributes<HTMLElement> {
  /** Bracketed kicker. Default "INTERVIEW · 対談". */
  kicker?: string
  title: string
  titleJp?: string
  /** Italic standfirst. */
  deck?: string
  byline?: string
  /** The dossier card subject. */
  subject?: InterviewSubject
  /** Optional intro paragraph (drop-capped). */
  intro?: string
  /** Alternating Q/A exchanges. */
  exchanges?: InterviewExchange[]
  /** Closing italic sign-off. */
  signoff?: string
  issue?: IssueMeta
  /** Paper stock. Default "ivory". */
  stock?: 'cream' | 'butter' | 'kraft' | 'ivory' | 'ink' | 'ledger'
}

/** The Q&A profile feature tool. */
export function InterviewSpread(props: InterviewSpreadProps): React.JSX.Element
