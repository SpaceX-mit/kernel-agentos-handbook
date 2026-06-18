/* global React */
const { MagazineFrame, Colophon, KernelLoading, Kicker } = window.KernelChatDesignSystem_52d084

/* ──────────────────────────────────────────────────────────────
   Inner page — a legal spread (Privacy) wrapped in MagazineFrame.
   Proves the inner-page system end to end: a brief loading splash
   (KernelLoading), then the framed page reads like a spread of the
   same issue — masthead, folio, prose, colophon. Source:
   kernel-chat-site/src/pages/PrivacyPage.tsx + MagazineFrame.tsx.
   ────────────────────────────────────────────────────────────── */

const ISSUE = { number: '377', month: 'APRIL', year: '2026', tagline: 'MAGAZINE FOR CITY CODERS · 街のコーダーのために' }

const SECTIONS = [
  {
    h: 'WHAT WE KEEP', jp: '保管するもの',
    p: [
      'Almost nothing. Your conversations live in your browser, not on our servers. The keys are yours — bring your own. We hold the wrapper; you hold the work.',
      'When you sign in, we store an email and a session so the magazine knows it is you between issues. That is the extent of the dossier.',
    ],
  },
  {
    h: 'WHAT WE NEVER DO', jp: '決してしないこと',
    p: [
      'We do not sell the catalog of what you read, ask, or build. There is no ad ledger, no shadow profile, no third-party pixel filing reports on your visit.',
      'The work the magazine reports on — provenance engineering — is the thing we sell. The reading is free because the work is the product.',
    ],
  },
  {
    h: 'YOUR CONTROL', jp: '管理',
    p: [
      'Export everything, or delete everything, from the account panel. A deletion is a deletion: the session, the email, the lot. No tombstone, no grace-period resurrection.',
    ],
  },
]

function LegalPage() {
  const [loading, setLoading] = React.useState(true)
  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400)
    return () => clearTimeout(t)
  }, [])

  if (loading) {
    return (
      <div className="lg-splash">
        <KernelLoading label="LOADING ISSUE 377 · PRIVACY" />
      </div>
    )
  }

  return (
    <div>
      <MagazineFrame
        kicker="PRIVACY"
        title="What we keep"
        titleJp="プライバシー"
        page={7}
        deck="The short version: almost nothing leaves your device. The long version is below, and it is not long."
        issue={ISSUE}
        onHome={() => { setLoading(true); setTimeout(() => setLoading(false), 1100) }}
      >
        <div className="lg-body">
          {SECTIONS.map((s, i) => (
            <section className="lg-section" key={i}>
              <h2 className="lg-head">
                <Kicker tomato jp={s.jp}>{s.h}</Kicker>
              </h2>
              {s.p.map((para, j) => (
                <p key={j} className={`lg-para${i === 0 && j === 0 ? ' lg-para--lead' : ''}`}>{para}</p>
              ))}
            </section>
          ))}
          <p className="lg-fine">MIT · kernel.chat group · Last revised with ISSUE 377. Questions go to the colophon.</p>
        </div>
      </MagazineFrame>
      <Colophon issue={ISSUE} />
    </div>
  )
}

window.LegalPage = LegalPage
