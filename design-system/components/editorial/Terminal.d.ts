import * as React from 'react'

export interface TerminalLine {
  /** Prompt glyph rendered in tomato, e.g. "$" or ">". */
  prompt?: string
  /** Agent label rendered in pool blue, e.g. "[coder]". */
  agent?: string
  /** The line text. */
  text: React.ReactNode
  /** Dim the text (output / secondary). */
  dim?: boolean
}

/**
 * @startingPoint section="Editorial" subtitle="Terminal window on ink with tomato block shadow" viewport="640x320"
 */
export interface TerminalProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Window-bar title. Default "kbot — kernel.chat". */
  title?: string
  /** Structured lines for the body. Omit to pass children instead. */
  lines?: TerminalLine[]
  /** Arbitrary body content when `lines` is not used. */
  children?: React.ReactNode
}

/** Mac-chrome terminal on ink ground — the quiet utility core. */
export function Terminal(props: TerminalProps): React.JSX.Element
