import { useParams, Link } from 'react-router-dom'
import { ALL_ISSUES } from '../content/issues'
import { IssueBackCover } from '../components/IssueBackCover'
import { MagazineFrame } from '../components/MagazineFrame'

/**
 * /issues/:number/back — the verso route.
 *
 * Renders the back cover full-bleed on its own page. Suitable for
 * direct linking, sharing, and the print stylesheet (where the back
 * is the second physical page).
 *
 * If the issue has no `backCover` field set, redirects gently to the
 * front of the issue with a small "no back cover" note. We don't 404
 * — the absence of a back is a deliberate editorial state, not an
 * error.
 */
export function IssueBackCoverPage() {
  const params = useParams<{ number: string }>()
  const issue = ALL_ISSUES.find((i) => i.number === params.number)

  if (!issue) {
    return (
      <MagazineFrame kicker="★ VERSO · 裏面">
        <div className="ka-page-empty">
          <p className="pop-folio">ISSUE {params.number} — not found in the archive.</p>
          <Link to="/issues" className="pop-folio">← back to the catalog</Link>
        </div>
      </MagazineFrame>
    )
  }

  if (!issue.backCover) {
    return (
      <MagazineFrame kicker="★ VERSO · 裏面">
        <div className="ka-page-empty pop-stock-cream">
          <p className="pop-kicker">★ NO VERSO · 裏面なし</p>
          <p className="pop-folio" style={{ marginTop: '1rem' }}>
            ISSUE {issue.number} did not earn a back cover. The verso is a
            recurring surface, not a default — some issues are filed
            without one. See <code>docs/back-cover-spec.md</code> for
            the discipline.
          </p>
          <Link to={`/issues/${issue.number}`} className="pop-folio" style={{ display: 'inline-block', marginTop: '1.5rem' }}>
            ← front of ISSUE {issue.number}
          </Link>
        </div>
      </MagazineFrame>
    )
  }

  const dateline = `${monthRoman(issue.month)}·${issue.year.slice(-2)}`
  const inheritedStock = issue.coverStock ?? 'cream'

  return (
    <MagazineFrame kicker="★ VERSO · 裏面">
      <div className="pop-back-cover-route">
        <IssueBackCover
          backCover={issue.backCover}
          dateline={dateline}
          inheritedStock={inheritedStock}
        />
        <div className="pop-back-cover-route-foot">
          <Link to={`/issues/${issue.number}`} className="pop-folio">
            ← front of ISSUE {issue.number}
          </Link>
          <Link to="/refusals" className="pop-folio">
            the refusals →
          </Link>
        </div>
      </div>
    </MagazineFrame>
  )
}

/** Convert a month label ("MAY") to its Roman-numeral form ("V"). */
function monthRoman(month: string): string {
  const map: Record<string, string> = {
    JAN: 'I', FEB: 'II', MAR: 'III', APR: 'IV', MAY: 'V', JUN: 'VI',
    JUL: 'VII', AUG: 'VIII', SEP: 'IX', OCT: 'X', NOV: 'XI', DEC: 'XII',
  }
  return map[month.slice(0, 3).toUpperCase()] ?? month.slice(0, 3)
}
