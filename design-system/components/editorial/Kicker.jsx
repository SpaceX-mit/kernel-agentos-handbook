import React from 'react'

/**
 * Kicker — the bracketed mono category label that heads every
 * editorial section: [ CATEGORY · 日本語 ]. Courier Prime, uppercase,
 * wide tracking. The brackets are drawn by CSS.
 */
export function Kicker({ children, jp, tomato = false, className = '', ...rest }) {
  const label = jp ? `${children} · ${jp}` : children
  const classes = ['pop-kicker', tomato ? 'pop-kicker--tomato' : '', className]
    .filter(Boolean)
    .join(' ')
  return (
    <span className={classes} {...rest}>
      {label}
    </span>
  )
}
