import * as React from 'react'

export type PopIconName =
  | 'arrow' | 'asterisk' | 'sparkle' | 'leaf' | 'coffee' | 'sun' | 'moon'
  | 'book' | 'pin' | 'quote' | 'thread' | 'pilcrow'

export interface PopIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Which pictogram to draw. `asterisk` is the system glyph. */
  name: PopIconName
  /** Size step. Default "md". */
  size?: 'sm' | 'md' | 'lg'
  /** Optional explicit colour (otherwise inherits currentColor). */
  color?: string
  'aria-label'?: string
}

/** Editorial pictogram primitive — 1.75px hand-tuned strokes, not Feather/Lucide. */
export function PopIcon(props: PopIconProps): React.JSX.Element
