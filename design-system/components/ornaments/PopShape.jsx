import React from 'react'

/**
 * PopShape — the geometric ornament primitive (the "Illustrator
 * layer"). A small tokenized mark — circle, ring, dot, square,
 * lozenge, triangle, star, slash — rendered as inline SVG that takes
 * currentColor. Optional centered mono `label` makes it an editorial
 * badge. Use sparingly: ornament, not UI chrome.
 */
function ShapePath({ name }) {
  switch (name) {
    case 'circle':   return <circle cx="12" cy="12" r="11" fill="currentColor" />
    case 'ring':     return <circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    case 'dot':      return <circle cx="12" cy="12" r="5" fill="currentColor" />
    case 'square':   return <rect x="2" y="2" width="20" height="20" fill="currentColor" />
    case 'lozenge':  return <polygon points="12,1 23,12 12,23 1,12" fill="currentColor" />
    case 'triangle': return <polygon points="12,2 22,21 2,21" fill="currentColor" />
    case 'star':     return <polygon points="12,1 14.9,8.6 23,9.2 16.8,14.4 18.9,22.2 12,17.8 5.1,22.2 7.2,14.4 1,9.2 9.1,8.6" fill="currentColor" />
    case 'slash':    return <line x1="2" y1="22" x2="22" y2="2" stroke="currentColor" strokeWidth="2" />
    default:         return null
  }
}

export function PopShape({ name, size = 'md', color = 'tomato', label, className = '', ...rest }) {
  const classes = [
    'pop-shape',
    `pop-shape--${name}`,
    `pop-shape--${size}`,
    `pop-shape--${color}`,
    label ? 'pop-shape--has-label' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <span className={classes} {...rest}>
      <svg viewBox="0 0 24 24" className="pop-shape-svg" aria-hidden="true" focusable="false">
        <ShapePath name={name} />
      </svg>
      {label && <span className="pop-shape-label">{label}</span>}
    </span>
  )
}
