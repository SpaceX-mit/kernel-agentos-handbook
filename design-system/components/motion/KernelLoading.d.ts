import * as React from 'react'

/**
 * @startingPoint section="Motion" subtitle="Ink-drop loading constellation" viewport="240x240"
 */
export interface KernelLoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Diameter of the 120px constellation, in px. Default 120. */
  size?: number
  /** Optional mono caption beneath the loader. */
  label?: string
}

/** The "ink on paper" loading constellation — the brand's signature loader. */
export function KernelLoading(props: KernelLoadingProps): React.JSX.Element
