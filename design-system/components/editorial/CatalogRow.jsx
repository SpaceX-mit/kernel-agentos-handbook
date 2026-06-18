import React from 'react'
import { Banner } from './Banner.jsx'

/**
 * CatalogRow — one numbered line of an editorial table of contents:
 * 001. · title (with JP subtitle) · section tag. A grid of these,
 * hairline-separated, is the magazine's "In this issue" list.
 */
export function CatalogRow({ n, en, jp, tag, tagVariant = 'kraft', className = '', ...rest }) {
  const classes = ['pop-row', className].filter(Boolean).join(' ')
  return (
    <div className={classes} {...rest}>
      <span className="pop-catalog-num">{n}.</span>
      <span className="pop-row-label">
        {en}
        {jp && <span className="pop-row-sub">{jp}</span>}
      </span>
      {tag && <Banner variant={tagVariant}>{tag}</Banner>}
    </div>
  )
}
