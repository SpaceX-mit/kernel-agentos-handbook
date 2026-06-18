import * as React from 'react'

export interface ColophonIssue {
  number: string
  month?: string
  year?: string
}

export interface ColophonLink {
  label: string
  href?: string
}

export interface ColophonProps extends React.HTMLAttributes<HTMLElement> {
  /** Issue shown in the monument. */
  issue?: ColophonIssue
  /** Publication tagline under the wordmark. */
  tagline?: string
  /** Discovery link row. */
  links?: ColophonLink[]
  /** Sign-off / copyright line. */
  signoff?: string
}

/** The magazine's shared footer — wordmark, monument, links, sign-off. */
export function Colophon(props: ColophonProps): React.JSX.Element
