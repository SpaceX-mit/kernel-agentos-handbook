/* global React */
const { Monument, Banner, Kicker, Colophon } = window.KernelChatDesignSystem_52d084

/* ──────────────────────────────────────────────────────────────
   The Issue Archive — the back catalog.
   A grid of issue spines (number monument + feature + stock + tags).
   Click a spine to open its detail panel. Data is the real issue
   identity catalog from docs/design-language.md (issues 360–378).
   ────────────────────────────────────────────────────────────── */

const ISSUES = [
  { n: '378', month: 'APRIL', year: '2026', feature: 'Five Terminals, One Desk', jp: '五つの端末', stock: 'ledger', spread: 'REVIEW', tags: ['REVIEW', 'AUDIT'], note: 'Graded survey — the review tool at full strength.' },
  { n: '377', month: 'APRIL', year: '2026', feature: 'The Convergence', jp: '収束', stock: 'ivory', spread: 'ESSAY', tags: ['ESSAY', 'STANDARDS'], note: 'WIRED references block, fired twice in a row.' },
  { n: '376', month: 'APRIL', year: '2026', feature: 'The Desktop Agent Ships', jp: 'デスクトップ制御', stock: 'ivory', spread: 'DISPATCH', tags: ['DISPATCH', 'SHIP'], note: 'Wire-style filing — numbered propositions.' },
  { n: '375', month: 'APRIL', year: '2026', feature: 'The Six Borrows', jp: '六つの借用', stock: 'cream', spread: 'ESSAY', tags: ['ESSAY', 'CREDITED'], note: 'Numbered-catalog layout; references as credit page.' },
  { n: '374', month: 'APRIL', year: '2026', feature: 'Against Viral Benchmarks', jp: 'ベンチ批判', stock: 'ivory', spread: 'ESSAY', tags: ['ESSAY', 'METHOD'], note: 'Numbers-with-methodology; asterisk-stamp ornament.' },
  { n: '373', month: 'APRIL', year: '2026', feature: 'The Editorial Neighbours', jp: '隣人たち', stock: 'cream', spread: 'ESSAY', tags: ['ESSAY'], note: 'First under-decorated cover — restraint by absence.' },
  { n: '372', month: 'APRIL', year: '2026', feature: 'The Audit (Room 503)', jp: '監査', stock: 'ledger', spread: 'ESSAY', tags: ['ESSAY', 'POSTMARK'], note: 'Postmark dateline mechanic fired; ledger-rule layout.' },
  { n: '371', month: 'APRIL', year: '2026', feature: 'After Hours', jp: '深夜', stock: 'ink', spread: 'INTERVIEW', tags: ['PROFILE', 'AFTER HOURS'], note: 'Cinematographer profile; flash-burn ornament.' },
  { n: '370', month: 'APRIL', year: '2026', feature: 'The Forecast', jp: '予報', stock: 'cream', spread: 'FORECAST', tags: ['FORECAST'], note: 'Monument-hero layout; the asterisk ★ ratified.' },
  { n: '369', month: 'APRIL', year: '2026', feature: 'The Specimen', jp: '標本', stock: 'cream', spread: 'DISPATCH', tags: ['DISPATCH', 'SHEDD'], note: 'Warty-spots ornament; brick ink seed.' },
  { n: '368', month: 'APRIL', year: '2026', feature: 'Anthropic Labs', jp: '研究所', stock: 'cream', spread: 'ESSAY', tags: ['PROFILE'], note: 'First asymmetric-left layout.' },
  { n: '367', month: 'APRIL', year: '2026', feature: 'The Sieve', jp: '篩', stock: 'ivory', spread: 'ESSAY', tags: ['ESSAY', 'SIEVE'], note: 'First preselection essay; ivory register.' },
  { n: '366', month: 'APRIL', year: '2026', feature: 'The Dispatch', jp: '発信', stock: 'cream', spread: 'DISPATCH', tags: ['DISPATCH'], note: 'Ink-spread ornament debut.' },
  { n: '365', month: 'APRIL', year: '2026', feature: 'The Craft Register', jp: '工芸', stock: 'kraft', spread: 'ESSAY', tags: ['CRAFT'], note: 'Kraft stock signal.' },
  { n: '364', month: 'APRIL', year: '2026', feature: 'The Forecast Spread', jp: '予報特集', stock: 'cream', spread: 'FORECAST', tags: ['FORECAST'], note: 'First forecast spread; cobalt accent.' },
  { n: '363', month: 'APRIL', year: '2026', feature: 'The Style Register', jp: 'スタイル', stock: 'cream', spread: 'ESSAY', tags: ['STYLE'], note: 'Style register.' },
  { n: '362', month: 'APRIL', year: '2026', feature: 'Vacation', jp: '休暇', stock: 'cream', spread: 'ESSAY', tags: ['QUIET'], note: 'Vacation / quiet.' },
  { n: '361', month: 'APRIL', year: '2026', feature: 'Summer Reading', jp: '夏の読書', stock: 'butter', spread: 'ESSAY', tags: ['READING'], note: 'Butter stock signal.' },
  { n: '360', month: 'APRIL', year: '2026', feature: 'The Urban Outdoors Review', jp: '都会のOS', stock: 'cream', spread: 'ESSAY', tags: ['FEATURE', 'ANCHOR'], note: 'The anchor identity — first issue.' },
]

const STOCK_HEX = { cream: '#F3E9D2', butter: '#EFD9A0', kraft: '#C8A97E', ivory: '#FAF9F6', ink: '#1F1E1D', ledger: '#F2EFE2' }

function Spine({ issue, active, onClick }) {
  const onInk = issue.stock === 'ink'
  return (
    <button
      className={`arc-spine${active ? ' is-active' : ''}`}
      style={{ background: STOCK_HEX[issue.stock], color: onInk ? 'var(--pop-ivory)' : 'var(--pop-ink)' }}
      onClick={onClick}
    >
      <div className="arc-spine-top">
        <span className="arc-spine-num" style={{ color: 'var(--pop-tomato)' }}>{issue.n}</span>
        <span className="arc-spine-spread" style={{ color: onInk ? 'var(--pop-sepia)' : 'var(--pop-coffee)' }}>{issue.spread}</span>
      </div>
      <div className="arc-spine-feature">{issue.feature}</div>
      <div className="arc-spine-jp" style={{ color: onInk ? 'var(--pop-sepia)' : 'var(--pop-coffee)' }}>{issue.jp}</div>
      <div className="arc-spine-foot" style={{ color: onInk ? 'var(--pop-sepia)' : 'var(--pop-coffee)' }}>{issue.month} {issue.year}</div>
    </button>
  )
}

function Detail({ issue }) {
  return (
    <div className="arc-detail">
      <div className="arc-detail-mono">
        <Monument number={issue.n} month={issue.month} year={issue.year} />
      </div>
      <div className="arc-detail-body">
        <Kicker tomato jp="特集">FEATURE · {issue.n}</Kicker>
        <h3 className="arc-detail-feature">{issue.feature}</h3>
        <p className="arc-detail-jp">{issue.jp}</p>
        <p className="arc-detail-note">{issue.note}</p>
        <div className="arc-detail-tags">
          <Banner variant="kraft">{issue.stock.toUpperCase()} STOCK</Banner>
          {issue.tags.map((t) => <Banner key={t} variant={t === issue.tags[0] ? 'tomato' : 'ink'}>{t}</Banner>)}
        </div>
      </div>
    </div>
  )
}

function Archive() {
  const [active, setActive] = React.useState('371')
  const current = ISSUES.find((i) => i.n === active)
  return (
    <div className="arc-root">
      <header className="arc-head">
        <div className="arc-head-inner">
          <Kicker jp="バックカタログ">BACK CATALOG</Kicker>
          <hr className="pop-rule pop-rule--short pop-rule--tomato" />
          <h1 className="pop-display arc-title">The Back Issues</h1>
          <p className="pop-swash arc-deck">Every release, frozen at the moment of publication. {ISSUES.length} issues in the catalog.</p>
        </div>
      </header>

      <div className="arc-body">
        <Detail issue={current} />
        <div className="arc-grid">
          {ISSUES.map((i) => (
            <Spine key={i.n} issue={i} active={i.n === active} onClick={() => setActive(i.n)} />
          ))}
        </div>
      </div>

      <Colophon issue={{ number: current.n, month: current.month, year: current.year }} />
    </div>
  )
}

window.Archive = Archive
