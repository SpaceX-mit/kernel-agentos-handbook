/* global React */
const { Kicker, Banner, Monument, CatalogRow, Terminal, InterviewSpread, ForecastSpread, DispatchSpread, ReviewSpread } = window.KernelChatDesignSystem_52d084

/* ──────────────────────────────────────────────────────────────
   The Magazine — kernel.chat editorial surface.
   A faithful recreation of an issue: cover → contents → feature
   spread → colophon. Two issues toggle to show stock variants
   (cream/classic vs ink/after-hours). Composes the editorial
   primitives from the design system; layout via the pop-* grammar.
   ────────────────────────────────────────────────────────────── */

const ISSUES = {
  360: {
    number: '360', month: 'APRIL', year: '2026', price: '¥0 · BYOK',
    stock: 'cream', accent: 'var(--pop-tomato)',
    jpTagline: '都会に住んで、コードで遊ぶための、自由なスタイルを作ろう。',
    headline: { prefix: 'The', emphasis: 'Urban Outdoors', suffix: 'Review' },
    swash: 'A terminal companion for city coders.',
    featureJp: '都会のコードと、自然のOS',
    contents: [
      { n: '001', en: 'Computer-use desktop agent', jp: 'デスクトップ制御', tag: 'FEATURE', tagVariant: 'tomato' },
      { n: '002', en: 'Max 4 Live device pack (×9)', jp: 'M4L デバイス', tag: 'SOUND' },
      { n: '003', en: 'DJ Set Builder', jp: 'DJ セット', tag: 'SOUND' },
      { n: '005', en: 'Session isolation fix', jp: 'セッション分離', tag: 'SHIP' },
      { n: '006', en: 'SSRF protection via dns.lookup()', jp: 'SSRF 対策', tag: 'SECURITY' },
    ],
    feature: {
      kicker: 'FIELD REPORT', kickerJp: '実地報告',
      title: 'A day with the desktop agent',
      titleJp: 'デスクトップ・エージェントと過ごす一日',
      deck: 'We gave the Kernel a mouse and a Tuesday. It kept its own field notes.',
      body: [
        'The agent opens at eight, before the coffee. It reads the calendar, not because it was asked to, but because that is where the day starts. By nine it has drafted three replies, flagged one as "you will regret sending this," and quietly archived the rest.',
        'What surprises you is not the competence. It is the restraint. A lesser tool fills every silence. The Kernel waits — sharp, present, on your side — and answers the question you actually asked.',
      ],
      pull: 'It kept its own field notes. We only had to read them.',
      signoff: 'Filed from a fifth-floor walk-up, with the window open.',
      terminal: {
        title: 'kbot — desktop agent',
        lines: [
          { prompt: '$', text: 'kbot watch --calendar' },
          { agent: '[kernel]', text: 'reading today… 3 events, 1 conflict', dim: true },
          { prompt: '>', text: 'drafted 3 replies. 1 held for review.' },
          { agent: '[kernel]', text: 'archived 11 threads. inbox at zero.', dim: true },
        ],
      },
    },
  },
  371: {
    number: '371', month: 'APRIL', year: '2026', price: '¥0 · BYOK',
    stock: 'ink', accent: 'var(--pop-tomato)',
    jpTagline: '夜のコード、タングステンの光。街が眠っても、端末は起きている。',
    headline: { prefix: 'After', emphasis: 'Hours', suffix: 'in the Terminal' },
    swash: 'A cinematographer profiles the night shift.',
    featureJp: '深夜の端末、タングステンの記録',
    contents: [
      { n: '001', en: 'Cinematographer profile — the night shift', jp: '夜勤の撮影監督', tag: 'PROFILE', tagVariant: 'tomato' },
      { n: '002', en: 'Flash-burn cover ornament', jp: 'フラッシュ装飾', tag: 'DESIGN' },
      { n: '004', en: 'Tungsten colour grade preset', jp: 'タングステン補正', tag: 'SOUND' },
      { n: '007', en: 'Voice loop latency fix', jp: '音声遅延修正', tag: 'SHIP' },
    ],
    feature: {
      kicker: 'PROFILE', kickerJp: '人物',
      title: 'The night shift',
      titleJp: '夜勤',
      deck: 'A cinematographer who shoots in the dark explains why the best light is the one you almost cannot see.',
      body: [
        'She works tungsten — warm, low, forgiving. The screen is the only thing that has to be sharp. Everything else can fall into shadow, and most of it should.',
        'The Kernel runs on the second monitor all night, a quiet pool-blue cursor in the corner. "It is the only crew member who never asks to break," she says. "And the only one who remembers the shot list."',
      ],
      pull: 'The best light is the one you almost cannot see.',
      signoff: 'Filed at 4am, between setups, with the tungsten still warm.',
      terminal: {
        title: 'kbot — after hours',
        lines: [
          { prompt: '$', text: 'kbot grade --tungsten' },
          { agent: '[coder]', text: 'applying warm low-key curve…', dim: true },
          { prompt: '>', text: 'preset saved. 4 looks exported.' },
        ],
      },
    },
  },
}

function Cover({ data, onJump }) {
  const onInk = data.stock === 'ink'
  return (
    <section className={`mag-cover pop-stock-${data.stock}`} style={{ '--issue-accent': data.accent }}>
      <div className="mag-inner">
        <div className="mag-dateline">
          <span className="pop-folio" style={onInk ? { color: 'var(--pop-sepia)', opacity: 0.85 } : null}>
            {data.jpTagline}
          </span>
          <span className="pop-folio" style={onInk ? { color: 'var(--pop-sepia)', opacity: 0.9 } : null}>
            <span className="pop-system-glyph">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                <line x1="12" y1="3" x2="12" y2="21" /><line x1="4.1" y1="7.5" x2="19.9" y2="16.5" /><line x1="4.1" y1="16.5" x2="19.9" y2="7.5" />
              </svg>
            </span>
            ISSUE {data.number} · {data.month} {data.year}
          </span>
        </div>
        <hr className="pop-rule" style={onInk ? { background: 'rgba(250,249,246,0.3)' } : null} />

        <div className="mag-masthead pop-anim-settle">
          <h1 className="pop-wordmark mag-wordmark" style={onInk ? { textShadow: '2px 2px 0 #000, -1px -1px 0 rgba(255,255,255,0.15)' } : null}>
            kernel<span className="pop-wordmark-dot" style={onInk ? { color: 'var(--pop-ivory)' } : null}>.</span>chat
          </h1>
          <div className="mag-masthead-meta">
            <Banner>MAGAZINE FOR CITY CODERS</Banner>
            <span className="pop-price" style={onInk ? { color: 'var(--pop-sepia)' } : null}>{data.price}</span>
          </div>
        </div>

        <hr className="pop-rule pop-rule--tomato" />

        <div className="mag-feature pop-anim-settle pop-anim-d2">
          <Kicker tomato jp="特集">FEATURE · {data.number}</Kicker>
          <h2 className="pop-display mag-feature-title" style={onInk ? { color: 'var(--pop-ivory)' } : null}>
            {data.headline.prefix} <em>{data.headline.emphasis}</em><br />{data.headline.suffix}
          </h2>
          <p className="pop-swash mag-swash" style={onInk ? { color: 'var(--pop-sepia)' } : null}>{data.swash}</p>
          <p className="pop-feature-jp" style={onInk ? { color: 'var(--pop-sepia)' } : null}>{data.featureJp}</p>
        </div>

        <div className="mag-bottom pop-anim-fade-up pop-anim-d4">
          <Monument number={data.number} month={data.month} year={data.year} price={data.price} />
          <div className="mag-stats">
            <span className="pop-hash">independent</span>
            <span className="pop-hash">open-source</span>
            <span className="pop-hash">mit-licensed</span>
            <span className="pop-hash">published-monthly</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function Contents({ data }) {
  return (
    <section className="mag-section mag-reveal pop-stock-ivory">
      <div className="mag-section-inner">
        <header className="pop-section-header">
          <Kicker jp="目次">CONTENTS</Kicker>
          <hr className="pop-rule pop-rule--short pop-rule--tomato" />
          <h2 className="pop-display pop-section-title">In this issue</h2>
        </header>
        <div className="mag-toc">
          {data.contents.map((c) => (
            <CatalogRow key={c.n} n={c.n} en={c.en} jp={c.jp} tag={c.tag} tagVariant={c.tagVariant} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Feature({ data }) {
  const f = data.feature
  return (
    <section className="mag-section mag-reveal pop-stock-cream">
      <div className="mag-section-inner mag-feature-spread">
        <header className="mag-feature-head">
          <Kicker tomato jp={f.kickerJp}>{f.kicker}</Kicker>
          <h2 className="pop-display mag-spread-title">{f.title}</h2>
          <p className="pop-feature-jp">{f.titleJp}</p>
          <p className="pop-swash mag-deck">{f.deck}</p>
          <p className="mag-byline">{f.signoff ? 'Field report' : ''}</p>
        </header>

        <div className="mag-spread-grid">
          <div className="mag-prose">
            {f.body.map((p, i) => (
              <p key={i} className={i === 0 ? 'mag-para mag-para--lead' : 'mag-para'}>{p}</p>
            ))}
            <p className="mag-signoff">{f.signoff}</p>
          </div>
          <aside className="mag-aside">
            <p className="mag-pull">"{f.pull}"</p>
            <Terminal title={f.terminal.title} lines={f.terminal.lines} />
          </aside>
        </div>
      </div>
    </section>
  )
}

function Colophon({ data, onJump, current }) {
  return (
    <footer className="mag-section pop-stock-ink mag-colophon">
      <div className="mag-section-inner">
        <div className="mag-colophon-row">
          <div>
            <div className="mag-wordmark-sm">kernel.chat</div>
            <p className="pop-folio" style={{ color: 'var(--pop-sepia)', marginTop: 6 }}>MAGAZINE FOR CITY CODERS · 街のコーダーのために</p>
          </div>
          <Monument number={data.number} month={data.month} year={data.year} />
        </div>
        <hr className="pop-rule" style={{ background: 'rgba(250,249,246,0.2)', margin: '20px 0' }} />
        <div className="mag-issue-switch">
          <span className="pop-folio" style={{ color: 'var(--pop-sepia)' }}>BACK CATALOG —</span>
          {Object.keys(ISSUES).map((num) => (
            <button
              key={num}
              className={`mag-switch-btn ${current === num ? 'is-active' : ''}`}
              onClick={() => onJump(num)}
            >
              ISSUE {num}
            </button>
          ))}
        </div>
      </div>
    </footer>
  )
}

/* Sample data for the four component spreads — so the kit demonstrates
   every editorial tool, not just the essay. */
const SPREAD_DATA = {
  interview: (issue) => (
    <InterviewSpread
      title="The night shift" titleJp="夜勤"
      deck="A cinematographer who shoots in the dark explains the best light."
      byline="Interview · THE EDITORS · 4,200 words"
      subject={{ name: 'A. Mori', nameJp: '森', role: 'Cinematographer', roleJp: '撮影監督', location: 'Setagaya, Tokyo' }}
      intro="She works tungsten — warm, low, forgiving. The screen is the only thing that has to be sharp; everything else can fall into shadow."
      exchanges={[
        { q: 'Why shoot in the dark?', a: 'Because most of the frame should fall into shadow, and most of it wants to. You light the one thing that carries the shot and let the rest go.' },
        { q: 'And the Kernel runs on the second monitor?', a: 'A quiet pool-blue cursor in the corner, all night. It is the only crew member who never asks to break — and the only one who remembers the shot list.' },
      ]}
      signoff="Filed at 4am, between setups, with the tungsten still warm."
      issue={issue} stock="ivory"
    />
  ),
  forecast: (issue) => (
    <ForecastSpread
      title="Six things that happen next" titleJp="次に起こる六つのこと"
      deck="The forward projection — signals, horizons, and where we'd put our money."
      byline="Forecast · THE EDITORS"
      propositions={[
        { n: '01', title: 'Agents file their own field notes', titleJp: '自己記録', body: ['The tool stops asking for instructions and starts logging what it did. The day becomes legible after the fact.'] },
        { n: '02', title: 'The terminal becomes the cover', titleJp: '端末が表紙に', body: ['Quiet utility, loud frame. The command line is the product; the magazine is the wrapper around it.'] },
        { n: '03', title: 'Restraint ships as a feature', titleJp: '抑制', body: ['The next tool wins by saying less. The silence is the product decision.'] },
      ]}
      signoff="Filed against the next quarter, with low confidence and high conviction."
      issue={issue} stock="ink"
    />
  ),
  dispatch: (issue) => (
    <DispatchSpread
      slug="WIRE · COMPUTE-USE SHIPS · 速報"
      title="The desktop agent ships" titleJp="デスクトップ制御、出荷"
      deck="Filed the night it landed, before the takes industrialised."
      dateline="TOKYO — APRIL 12, 04:00 JST" byline="Dispatch · THE EDITORS"
      status="SHIPPED" filedAt="04:00 JST"
      propositions={[
        { n: '01', overline: 'WHAT HAPPENED', title: 'It opened at eight, before the coffee', body: ['And read the calendar unasked, because that is where the day starts.'] },
        { n: '02', overline: 'WHAT IT MEANS', title: 'The restraint is the feature', body: ['A lesser tool fills every silence. This one waits, and answers the question you actually asked.'] },
      ]}
      bulletin="It kept its own field notes. We only had to read them."
      terminator="end of dispatch · kernel.chat wire"
      signoff="Filed from a fifth-floor walk-up, with the window open."
      issue={issue} stock="ledger"
    />
  ),
  review: (issue) => (
    <ReviewSpread
      title="Five terminals, one desk" titleJp="五つの端末、一つの机"
      deck="We tested the field and committed to a verdict."
      byline="Review · THE EDITORS"
      verdict="If you only run one, run the quiet one."
      criteria={[
        { n: '01', label: 'Restraint', weight: '30%', description: 'Does it fill the silence, or wait for you?' },
        { n: '02', label: 'Memory', weight: '40%', description: 'Does it remember the shot list?' },
        { n: '03', label: 'Footprint', weight: '30%' },
      ]}
      subjects={[
        { rank: 1, name: 'kbot', read: 'The quiet utility core', score: '9.2', stars: 5, pros: ['Keeps its own field notes', 'Never asks to break'], cons: ['Too modest to demo well'], verdict: 'The one to keep.' },
        { rank: 2, name: 'synth-prog', read: 'Loud, capable, tiring', score: '7.4', stars: 4, pros: ['Fast device packs'], cons: ['Fills every silence', 'Forgets the list'], verdict: 'Brilliant for an hour.' },
      ]}
      signoff="Filed from the lab bench, with the screen still warm."
      issue={issue} stock="ivory"
    />
  ),
}

const SPREAD_TYPES = [
  ['essay', 'Essay'],
  ['interview', 'Interview'],
  ['forecast', 'Forecast'],
  ['dispatch', 'Dispatch'],
  ['review', 'Review'],
]

function SpreadPicker({ value, onPick }) {
  return (
    <div className="mag-spread-picker">
      <span className="pop-folio" style={{ opacity: 0.6 }}>SPREAD —</span>
      {SPREAD_TYPES.map(([k, label]) => (
        <button key={k} className={`mag-spread-btn ${value === k ? 'is-active' : ''}`} onClick={() => onPick(k)}>
          {label}
        </button>
      ))}
    </div>
  )
}

function MagazineIssue() {
  const [current, setCurrent] = React.useState('360')
  const [spread, setSpread] = React.useState('essay')
  const data = ISSUES[current]
  const issueMeta = { number: data.number, month: data.month, year: data.year }
  const jump = (num) => {
    setCurrent(num)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return (
    <div className="mag-root">
      <Cover data={data} onJump={jump} />
      <Contents data={data} />
      {spread === 'essay' ? <Feature data={data} /> : <div className="mag-reveal">{SPREAD_DATA[spread](issueMeta)}</div>}
      <Colophon data={data} onJump={jump} current={current} />
      <SpreadPicker value={spread} onPick={setSpread} />
    </div>
  )
}

window.MagazineIssue = MagazineIssue
