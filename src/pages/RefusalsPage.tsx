import { Link } from 'react-router-dom'
import { ISSUE } from '../content/issue'
import { MagazineFrame } from '../components/MagazineFrame'
import { MagazineRefusals } from '../components/MagazineRefusals'

/**
 * /refusals — the brand by negation, on its own route.
 *
 * The eight (or however many) refusals are inlined into every issue's
 * colophon in compact form. This page renders them at full size, with
 * the rationale Chris Do would underline: brands are defined more by
 * what they refuse than by what they do.
 *
 * Editorial commitment: editing the canonical list at
 * `src/content/refusals.ts` is the single source of truth — this page
 * just renders it. Add or remove refusals there.
 */
export function RefusalsPage() {
  return (
    <MagazineFrame kicker="★ THE REFUSALS · 拒否">
      <div className="pop-section-inner pop-refusals-page">
        <MagazineRefusals variant="feature" />
        <div className="pop-refusals-page-foot">
          <Link to="/" className="pop-folio">
            ← back to ISSUE {ISSUE.number}
          </Link>
          <Link to="/issues" className="pop-folio">
            back catalog →
          </Link>
        </div>
      </div>
    </MagazineFrame>
  )
}
