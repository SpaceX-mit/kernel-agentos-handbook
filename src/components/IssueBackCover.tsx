import type { BackCoverSpec, IssueStock } from '../content/issues'

interface IssueBackCoverProps {
  backCover: BackCoverSpec
  /** Dateline shown in the lower-right (e.g. "V·26"). Usually matches
   *  the front cover's monument year. */
  dateline: string
  /** Fallback stock used when backCover.stock is undefined. Typically
   *  the issue's front coverStock. */
  inheritedStock: IssueStock
}

/**
 * IssueBackCover — the verso surface, per docs/back-cover-spec.md.
 *
 * One still-life subject per issue, fixed layout, paper-stock-aware
 * background. Image is optional in v0.1; when absent, renders a
 * textured placeholder with the subject set across the centre — the
 * shape (1) fallback the spec describes for issues that ship before
 * the photograph is commissioned.
 *
 * Front/back symmetry: the ★ glyph mirrors the front's monument number
 * placement (lower-left), the dateline mirrors the front's date stamp
 * (lower-right). Open the issue flat and the anchors align.
 */
export function IssueBackCover({ backCover, dateline, inheritedStock }: IssueBackCoverProps) {
  const stock = backCover.stock ?? inheritedStock
  const stockClass = `pop-stock-${stock}`
  const hasImage = Boolean(backCover.image)

  return (
    <article
      className={`pop-back-cover pop-back-cover--${stock} ${stockClass}`}
      aria-label={`Back cover — ${backCover.subject}`}
    >
      <div className="pop-back-cover-inner">
        <div className="pop-back-cover-subject">
          {hasImage ? (
            <img
              src={backCover.image}
              alt={backCover.subject}
              className="pop-back-cover-image"
              loading="lazy"
            />
          ) : (
            <div className="pop-back-cover-placeholder" aria-hidden="true">
              <span className="pop-back-cover-placeholder-mark">{backCover.subjectJp}</span>
              <span className="pop-back-cover-placeholder-label">{backCover.subject}</span>
              <span className="pop-back-cover-placeholder-note">
                photograph forthcoming
              </span>
            </div>
          )}
        </div>

        <div className="pop-back-cover-caption">
          {hasImage && (
            <>
              <p className="pop-back-cover-caption-jp">{backCover.subjectJp}</p>
              <p className="pop-back-cover-caption-en">{backCover.subject}</p>
            </>
          )}
        </div>

        <div className="pop-back-cover-foot">
          <span className="pop-back-cover-glyph" aria-hidden="true">★</span>
          <span className="pop-back-cover-dateline">{dateline}</span>
        </div>
      </div>
    </article>
  )
}
