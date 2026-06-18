import React from 'react'

/**
 * Colophon — the magazine's shared footer. Publication wordmark +
 * tagline on the left, the issue monument on the right, a discovery
 * link row, and a sign-off line. Appears at the foot of every surface.
 */
export function Colophon({
  issue = { number: '360', month: 'APRIL', year: '2026' },
  tagline = 'MAGAZINE FOR CITY CODERS · 街のコーダーのために',
  links = [
    { label: 'Back Issues', href: '#' },
    { label: 'The Wall', href: '#' },
    { label: 'The Refusals', href: '#' },
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
  ],
  signoff = 'MIT · kernel.chat group · Published monthly.',
  className = '',
  ...rest
}) {
  return (
    <footer className={['pop-colophon', 'pop-stock-ivory', className].filter(Boolean).join(' ')} {...rest}>
      <div className="pop-section-inner">
        <hr className="pop-rule" />
        <div className="pop-colophon-row">
          <div className="pop-colophon-masthead">
            <span className="pop-wordmark-sm">kernel<span className="pop-wordmark-dot">.</span>chat</span>
            <span className="pop-folio">{tagline}</span>
          </div>
          <div className="pop-monument pop-monument--sm">
            <span>ISSUE</span>
            <strong>{issue.number}</strong>
            <span>{[issue.month, issue.year].filter(Boolean).join(' ')}</span>
          </div>
        </div>
        <hr className="pop-rule pop-rule--soft" />
        <div className="pop-colophon-links">
          {links.map((l) => (
            <a key={l.label} href={l.href}>{l.label}</a>
          ))}
        </div>
        <p className="pop-folio pop-colophon-copy">{signoff}</p>
      </div>
    </footer>
  )
}
