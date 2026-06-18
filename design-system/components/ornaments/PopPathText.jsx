import React from 'react'

const PRESETS = {
  'arc-top': 'M 30 100 Q 200 10, 370 100',
  'arc-bottom': 'M 30 20 Q 200 110, 370 20',
  'wave': 'M 10 60 Q 110 10, 200 60 T 390 60',
}

let _pid = 0

/**
 * PopPathText — writing along a path. An SVG <textPath> primitive for
 * curved / arched headlines, set in italic EB Garamond. Three presets
 * (arc-top, arc-bottom, wave) or a custom `d` in the 0 0 400 120 box.
 * Use for cover ornaments, section transitions, sign-offs — never body.
 */
export function PopPathText({
  text,
  preset = 'arc-top',
  d,
  fontSize = 22,
  color = 'tomato',
  size = 'md',
  className = '',
  'aria-label': ariaLabel,
  ...rest
}) {
  const pathD = d || PRESETS[preset] || PRESETS['arc-top']
  const pathId = React.useMemo(() => `pop-path-${(_pid += 1)}`, [])
  const classes = ['pop-path-text', `pop-path-text--${size}`, `pop-path-text--${color}`, className].filter(Boolean).join(' ')
  return (
    <span className={classes} role="img" aria-label={ariaLabel || text} {...rest}>
      <svg viewBox="0 0 400 120" className="pop-path-text-svg" aria-hidden="true" focusable="false">
        <defs>
          <path id={pathId} d={pathD} fill="none" />
        </defs>
        <text className="pop-path-text-label" fontSize={fontSize}>
          <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">{text}</textPath>
        </text>
      </svg>
    </span>
  )
}
