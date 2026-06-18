import * as React from 'react'

export interface CatalogRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Padded catalog number, e.g. "001". */
  n: string
  /** English title. */
  en: string
  /** Japanese subtitle. */
  jp?: string
  /** Section tag, uppercase, e.g. "FEATURE". */
  tag?: string
  /** Tag box colour. Default "kraft". */
  tagVariant?: 'tomato' | 'ink' | 'kraft'
}

/** One numbered line of an editorial table of contents. */
export function CatalogRow(props: CatalogRowProps): React.JSX.Element
