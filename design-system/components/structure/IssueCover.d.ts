import * as React from 'react'

export interface CoverIssue {
  number: string
  month?: string
  year?: string
  price?: string
}

export interface CoverHeadline {
  prefix?: string
  /** The italic-tomato emphasis word — the cover's loudest type. */
  emphasis: string
  suffix?: string
  /** Italic swash subtitle. */
  swash?: string
}

export interface CoverSealSpec {
  /** Curved label along the top arc, e.g. "FORECAST". */
  label: string
  /** Centre date line, e.g. "IV·26". */
  date: string
}

/**
 * @startingPoint section="Structure" subtitle="The issue cover — the print object" viewport="1000x700"
 */
export interface IssueCoverProps extends React.HTMLAttributes<HTMLElement> {
  issue?: CoverIssue
  headline?: CoverHeadline
  /** Japanese feature subtitle. */
  featureJp?: string
  /** Latin banner tagline. */
  tagline?: string
  /** Drifting JP dateline tagline. */
  jpTagline?: string
  /** Paper stock. Default "cream". */
  stock?: 'cream' | 'butter' | 'kraft' | 'ivory' | 'ink' | 'ledger'
  /** Composition variant. Default "classic". */
  layout?: 'classic' | 'monument-hero' | 'asymmetric-left' | 'ledger-rule'
  /** Per-issue cover ornament. */
  ornament?: 'ink-spread' | 'warty-spots' | 'flash-burn'
  /** Optional wax press seal in the top-right corner. */
  seal?: CoverSealSpec
  /** Publication-level hash stats along the bottom. */
  stats?: string[]
}

/** The canonical issue cover — stock + layout + ornament + seal. */
export function IssueCover(props: IssueCoverProps): React.JSX.Element
