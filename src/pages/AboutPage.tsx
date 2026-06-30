import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ISSUE } from '../content/issue'
import { MagazineFrame } from '../components/MagazineFrame'
import './AboutPage.css'

/**
 * /about — the founding statement.
 *
 * Not a description of features but a statement of purpose: why
 * this editorial exists and what it's for. Built from the project's
 * standing positions — the four-rule discipline, the provenance
 * wager, and the bet that taste survives a glut of cheap output.
 * Set as a framed inner spread of the same magazine.
 */
export function AboutPage() {
  useEffect(() => {
    document.body.classList.add('ka-scrollable-page')
    return () => { document.body.classList.remove('ka-scrollable-page') }
  }, [])

  return (
    <MagazineFrame
      kicker="ABOUT"
      title="Why this exists."
      titleJp="発刊の辞"
      deck="A magazine is a claim about what’s worth a reader’s time. This is ours — and the reasoning behind it."
      stock="cream"
    >
      <div className="pop-section-inner">
        <div className="pop-about">

          <h2>The premise.</h2>
          <p>
            The cost of making things fell to almost nothing this year — first
            drafts, first mockups, a thousand options before lunch. What did not
            get cheaper is knowing which of them matters. Generation is free now;
            discernment is the scarce thing, and getting scarcer. kernel.chat
            exists to spend a reader’s attention on the second thing.
          </p>

          <h2>What it’s for.</h2>
          <p>
            The subject is applied AI — the practice, not the press release.
            Where an agent earns its place and where it doesn’t; which model
            behind a headline number is the one your work depends on; what a
            launch actually changes for the person who has to ship on Monday.
            One feature an issue, held like a printed object and finished — no
            feed, no infinite scroll, nothing competing for the same minute. The
            scarce resource in the room is attention, and the magazine is built
            to be worth it.
          </p>

          <h2>The discipline.</h2>
          <p>
            Count what gets read. Cut what doesn’t. File the audit in public.
            Keep the manuscripts in the drawer. The same four rules hold whether
            the surface is a table of contents or a tool registry — numbers and
            reasoning ship with the work, the cuts are explained rather than
            hidden, and what the magazine won’t do is written down as{' '}
            <Link to="/refusals">The Refusals</Link>.
          </p>

          <div className="pop-about-monument">
            <div className="pop-monument pop-monument--sm">
              <span>MAGAZINE FOR CITY CODERS</span>
              <strong>発刊の辞</strong>
              <span>TASTE SURVIVES</span>
            </div>
          </div>

          <h2>Made in the open.</h2>
          <p>
            The magazine is drafted on an agent floor; the editor signs off by
            hand — and it says so. Most of the world treats “AI-made” as
            something to disguise. The wager here is the opposite: AI-made is a
            mark of rigour when the provenance is auditable, and a publication
            that argues this had better turn the argument on itself first. So
            the chain is published, not hidden. That conviction — provenance as
            the thing that earns trust — is why the magazine exists at all.
          </p>

          <div className="pop-about-foot">
            <Link to="/" className="pop-folio">← back to ISSUE {ISSUE.number}</Link>
            <Link to="/refusals" className="pop-folio">the refusals →</Link>
          </div>

        </div>
      </div>
    </MagazineFrame>
  )
}
