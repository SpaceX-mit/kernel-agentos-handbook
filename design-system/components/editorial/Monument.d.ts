import * as React from 'react'

/**
 * @startingPoint section="Editorial" subtitle="Stacked issue-number monument" viewport="280x200"
 */
export interface MonumentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The issue serial, e.g. "360". Rendered as the big tomato numeral. */
  number: string
  /** Month label, e.g. "APRIL". */
  month?: string
  /** Year label, e.g. "2026". */
  year?: string
  /** Price line, e.g. "¥0 · BYOK". */
  price?: string
}

/** Stacked issue-number corner block — the cover's serial anchor. */
export function Monument(props: MonumentProps): React.JSX.Element
