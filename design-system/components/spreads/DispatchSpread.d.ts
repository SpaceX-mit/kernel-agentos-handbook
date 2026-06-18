import * as React from 'react'

export interface IssueMeta {
  number?: string
  month?: string
  year?: string
}

export interface DispatchProposition {
  /** Item number shown under the checkbox, e.g. "01". */
  n: string
  /** Courier overline above the title. */
  overline?: string
  title: string
  /** Prose paragraphs. */
  body?: string[]
}

/**
 * @startingPoint section="Spreads" subtitle="Wire-style news dispatch" viewport="900x760"
 */
export interface DispatchSpreadProps extends React.HTMLAttributes<HTMLElement> {
  /** Repeating Courier slug-band text. Default "WIRE · DISPATCH · 速報". */
  slug?: string
  /** Bracketed kicker. Default "DISPATCH · 速報". */
  kicker?: string
  title: string
  titleJp?: string
  deck?: string
  /** Newspaper dateline (tomato), e.g. "TOKYO — APRIL 12, 04:00". */
  dateline?: string
  byline?: string
  /** Dossier STATUS stamp. Default "FILED". */
  status?: string
  /** Dossier FILED value. */
  filedAt?: string
  /** Checkbox-numbered propositions. */
  propositions?: DispatchProposition[]
  /** Mid-spread BULLETIN pull line. */
  bulletin?: string
  /** "— 30 —" terminator caption. */
  terminator?: string
  signoff?: string
  issue?: IssueMeta
  /** Paper stock. Default "ivory". */
  stock?: 'cream' | 'butter' | 'kraft' | 'ivory' | 'ink' | 'ledger'
}

/** The wire-style news dispatch feature tool. */
export function DispatchSpread(props: DispatchSpreadProps): React.JSX.Element
