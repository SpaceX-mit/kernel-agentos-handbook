import React from 'react'

/**
 * Banner — a reversed tag box, feature-flag style. The tomato
 * default is the loudest small element in the system; ink and kraft
 * variants tag sections more quietly. Courier Prime, uppercase.
 */
export function Banner({ children, variant = 'tomato', className = '', ...rest }) {
  const classes = [
    'pop-banner',
    variant === 'ink' ? 'pop-banner--ink' : '',
    variant === 'kraft' ? 'pop-banner--kraft' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  )
}
