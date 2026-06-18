import * as React from 'react'

export interface KickerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The Latin category label, e.g. "FEATURE" or "CONTENTS". */
  children: React.ReactNode
  /** Optional Japanese subtitle appended after a middot. */
  jp?: string
  /** Tint the label tomato (or the issue accent). Default false. */
  tomato?: boolean
}

/** Bracketed mono category label that heads every editorial section. */
export function Kicker(props: KickerProps): React.JSX.Element
