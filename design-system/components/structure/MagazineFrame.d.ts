import * as React from 'react'

export interface FrameIssue {
  number: string
  month?: string
  year?: string
  tagline?: string
}

/**
 * @startingPoint section="Structure" subtitle="Inner-page masthead + folio frame" viewport="1000x640"
 */
export interface MagazineFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Section kicker, e.g. "PRIVACY", "SECURITY". */
  kicker: string
  /** Display title — omit to skip the editorial head block. */
  title?: string
  titleJp?: string
  /** Page number → rendered as a folio (e.g. "PRIVACY · P. 07"). */
  page?: number
  /** Standfirst paragraph. */
  deck?: string
  /** Masthead strip stock. Default "ivory". */
  stock?: 'ivory' | 'cream' | 'butter' | 'kraft' | 'ink'
  /** Render on the ink ground for dark inner pages. */
  dark?: boolean
  /** Issue shown in the masthead + footer. */
  issue?: FrameIssue
  /** Click handler for the wordmark / "back to cover". */
  onHome?: () => void
  children: React.ReactNode
}

/** Wraps an inner page with the publication masthead + folio footer. */
export function MagazineFrame(props: MagazineFrameProps): React.JSX.Element
