import React from 'react'

/**
 * KernelLoading — the "ink on paper" loading constellation. Four sepia
 * ink-drops on a square; the whole field drifts slowly (ink diffusing
 * in water) while each drop trembles fast (surface tension), and the
 * connecting threads breathe at a third rhythm. CSS-only, gated on
 * prefers-reduced-motion. The brand's signature loader.
 *
 * Optional `label` shows a mono caption beneath. `size` scales the
 * 120px constellation.
 */
export function KernelLoading({ size = 120, label, className = '', style, ...rest }) {
  const scale = size / 120
  return (
    <div
      className={['pop-loading', className].filter(Boolean).join(' ')}
      style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 18, ...style }}
      role="status"
      aria-label={label || 'Loading'}
      {...rest}
    >
      <div
        className="pop-constellation"
        style={{ width: 120, height: 120, transform: scale !== 1 ? `scale(${scale})` : undefined }}
      >
        <svg className="pop-constellation-thread" viewBox="0 0 120 120" aria-hidden="true">
          <line x1="30" y1="30" x2="90" y2="30" />
          <line x1="90" y1="30" x2="90" y2="90" />
          <line x1="90" y1="90" x2="30" y2="90" />
          <line x1="30" y1="90" x2="30" y2="30" />
        </svg>
        <span className="pop-constellation-drop" />
        <span className="pop-constellation-drop" />
        <span className="pop-constellation-drop" />
        <span className="pop-constellation-drop" />
      </div>
      {label && (
        <span
          className="pop-folio"
          style={{ fontSize: 11, letterSpacing: '0.14em', opacity: 0.6 }}
        >
          {label}
        </span>
      )}
    </div>
  )
}
