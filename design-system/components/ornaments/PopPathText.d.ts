import * as React from 'react'

export interface PopPathTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The phrase that rides the curve. Keep it short. */
  text: string
  /** Preset path. Ignored when `d` is set. Default "arc-top". */
  preset?: 'arc-top' | 'arc-bottom' | 'wave'
  /** Custom SVG path in the 0 0 400 120 box — overrides `preset`. */
  d?: string
  /** Font size in px on desktop (scales down). Default 22. */
  fontSize?: number
  /** Token colour. Default "tomato". */
  color?: 'tomato' | 'ink' | 'coffee' | 'ivory' | 'current'
  /** Width tier. Default "md". */
  size?: 'sm' | 'md' | 'lg'
  'aria-label'?: string
}

/** Text-on-a-path ornament (arched / waved headlines) — set in italic serif. */
export function PopPathText(props: PopPathTextProps): React.JSX.Element
