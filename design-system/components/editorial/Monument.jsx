import React from 'react'

/**
 * Monument — the stacked issue-number corner block. The big tomato
 * numeral is the cover's serial anchor; the mono lines above and
 * below give it dateline + price context. Used bottom-right of every
 * cover and in the colophon.
 */
export function Monument({ number, month, year, price, className = '', ...rest }) {
  const classes = ['pop-monument', className].filter(Boolean).join(' ')
  return (
    <div className={classes} {...rest}>
      <span>ISSUE</span>
      <strong>{number}</strong>
      {(month || year) && <span>{[month, year].filter(Boolean).join(' ')}</span>}
      {price && <span>{price}</span>}
    </div>
  )
}
