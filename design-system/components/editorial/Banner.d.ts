import * as React from 'react'

export interface BannerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The tag label, uppercase. */
  children: React.ReactNode
  /** Box colour. tomato = the loud default; ink/kraft = quieter tags. */
  variant?: 'tomato' | 'ink' | 'kraft'
}

/** Reversed tag box, feature-flag style. The loudest small element. */
export function Banner(props: BannerProps): React.JSX.Element
