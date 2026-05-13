# Revenue Paths for an Open-Source Substrate Builder

> A guide for the engineer who shipped a substrate-deep open-source
> project and now has to figure out how it pays. Written from the
> kernel.chat / kbot-finance trajectory; forkable into any similar
> path. CC BY 4.0.
>
> Not investment advice. Not legal advice. Not "5 hacks to monetize
> open source." The honest map.

---

## Who this is for

You shipped something. Maybe an npm package, a Rust crate, a Python
library, a CLI tool, a protocol RFC. The substrate is real. The code
is on GitHub, the package is on a registry, the demo runs in 30
seconds.

You haven't made money yet. The question is no longer *can I build
this?* — it's *how does this pay?*

This doc maps the ten realistic paths, with honest time-to-first-
dollar estimates, dollar ranges, activation costs, and tradeoffs.
Ranked roughly by speed.

---

## The pattern (read this before the list)

Most substrate-deep builders fail at revenue not because the paths
don't exist, but because of three structural mistakes:

1. **They keep all the paths "open" instead of picking two or
   three.** Every path you don't actively pursue still consumes
   energy as background optionality. Two paths run hard beat five
   paths run half.
2. **They optimize for the largest path before they have any
   path.** Building the SaaS for path 8 takes 9 months; consulting
   in path 1 pays this month. The cash from path 1 funds path 8.
3. **They never commit to the bet vs. the day job.** This is the
   single biggest predictor of failure. Half-time on your own
   thing for two years rarely beats full-time on your own thing
   for one year — the compound is in the focus.

Read the ten paths below, then read the **sequencing** section at
the end. The order matters more than the list.

---

## The ten paths

### 1. Consulting / fractional engineering — fastest

**Time to first dollar:** Days to weeks.
**Range:** $5-15K/month per client, $200-500/hour project work.
**Activation:** Two LinkedIn posts, three DMs to 2° connections,
one cold email. Total: 90 minutes.

You have substrate depth across rare disciplines and a working
public artefact that takes 30 seconds to demo. That combination
prices above market in 2026. Firms hiring AI engineers, regtech
engineers, infra engineers will pay above market for the rare-
overlap candidate.

**What it looks like in practice:**

- Fractional CTO at an early fintech: $8-15K/month, 10 hours/week
- AI compliance audit for a mid-size firm: $5-25K project work
- "Help us wire MCP into our agent stack": $200-400/hour,
  $5-20K per engagement
- Substrate review for a Series B startup: $10-30K project work
- Expert-network calls (GLG, AlphaSights): $300-1000/hour, paid
  to talk for 60 minutes

**Tradeoff:** Every consulting hour is a deep-focus hour you don't
spend on your own substrate. 10 hours/week ≈ 25% of available time
for ~$5-8K/month. Math is real but not catastrophic.

**When to use this path:** Always — at least in some quantity —
until one of paths 2, 6, or 8 is paying enough to fund the runway.
Consulting is the universal solvent.

---

### 2. Design-partner pilots for the substrate

**Time to first dollar:** 4-12 weeks from first validation call to
first signed pilot.
**Range:** $25-100K per pilot, with 60-day exclusive subscription
option afterward at $25-100K/year ARR.
**Activation:** Five validation calls (see
`docs/sales/validation-calls.md`).

If your substrate solves a real pain in a regulated or enterprise
industry, the design-partner pilot is the path from "open source"
to "named revenue." First three pilots are typically priced low
($25-50K) to anchor reference accounts; later pilots get priced
at the high end ($75-100K) once you have proof.

**Tradeoff:** Sales cycles run 30-90 days minimum. Pre-revenue you
can't predict timing. The pilots don't materialize unless you've
done the validation calls and have a champion inside the buyer's
firm.

**When to use this path:** When the substrate solves a problem at
firms with budget and compliance pressure. Skip if your substrate
serves indie developers only (those pay $0-99/month, not $25K
pilots).

---

### 3. Newsletter / publication sponsorship

**Time to first dollar:** 30-60 days.
**Range:** $500-3,000 per issue (single-sponsor model) or
$5-20K/year for a recurring back-cover slot. Larger publications:
$10-50K/year sponsorship deals.
**Activation:** Sponsor prospectus PDF (one page), reach out to 3-5
plausible sponsors per cycle.

If you publish — whether a newsletter, a blog with regular cadence,
a paper magazine, a podcast — there are advertisers who would pay
for tasteful placement. The trick is **editorial discipline as
moat**: sponsors pay more for placement in publications that refuse
low-quality advertisers.

**Specific sponsor profiles for a developer/AI-engineering audience:**

- Boutique cloud or GPU rental (Fly.io, Modal, Vercel)
- Specialty B2B SaaS targeting your audience
- Hardware sellers (mechanical keyboards, monitors, niche dev gear)
- Coffee subscriptions, paper-goods, "thoughtful consumer brands"
- Recruitment firms targeting your reader profile
- Conference / event organizers

**Tradeoff:** Sponsorship revenue is steady but small. Not a
runway-funding path on its own. Compounds as the publication grows.

**When to use this path:** When you already publish regularly OR
when you can commit to a publishing cadence. Don't start a
newsletter *to* monetize — sponsorship is downstream of audience.

---

### 4. Workshops / cohort-based courses

**Time to first dollar:** 60-90 days from first announcement to
first cohort delivery.
**Range:** $1,000-$5,000 per seat × 10-30 seats per cohort =
$15-150K per cohort. Run 2-4 cohorts/year.
**Activation:** Define the curriculum (1 week), announce the
cohort with a waitlist (1 day), open registration when waitlist
hits 30 (variable), deliver the cohort (typically 4 weeks async
or 1-3 days in-person).

If your substrate represents a discipline that doesn't yet have a
curriculum, you are the natural teacher. Workshops or cohort
courses convert that authorship into recurring revenue at
high margins.

**Examples in the AI-infra space:**

- "How to build provenance infrastructure" — 4-week async cohort,
  $2K/seat, 20 seats = $40K
- "MCP servers from first principles" — 2-day in-person, $3K/seat,
  15 seats = $45K
- "Audit-grade AI for regulated industries" — corporate workshop,
  $25-75K flat fee, delivered to one firm's team

**Tradeoff:** Workshops require *committing publicly to teach*.
That commitment compounds (you become the named voice in the
field) but reduces your flexibility to pivot. Also requires real
delivery time (3-6 weeks of work per cohort).

**When to use this path:** After you've done 1-2 paid pilots so
the workshop has a credible teacher with reference accounts.
Don't run the first cohort empty-handed.

---

### 5. SaaS layer on top of the open-source substrate (open-core)

**Time to first dollar:** 3-9 months from start of build to first
paying customer.
**Range:** $99-$2,500/month per customer, multiplied by however
many you can land. $5K-$50K/month ARR realistic at 6-12 months;
$50K-$500K/month at 18-24 months if it lands.
**Activation:** Build the SaaS layer, deploy it, build a billing
flow, sign up customers. ~6 months of focused build.

The HashiCorp / MongoDB / Confluent / Snowflake shape. Open-source
core stays free; commercial premium funds the substrate. Common
paid tiers: hosted version of the substrate, SOC 2 attestation,
managed audit-log retention, certified deterministic compute,
priority support, custom rule libraries, white-glove implementation.

**Tradeoff:** This is a 6-12 month build commitment before the
first dollar. Much larger upside than consulting; much higher
activation cost. Usually requires a co-founder or first hire to
execute well.

**When to use this path:** After paths 1, 2, 3 are working enough
to fund 6 months of focused build. SaaS on a substrate is the
long-term ARR play; everything else is bridge funding to get
there.

---

### 6. Speaking / conferences

**Time to first dollar:** 90-180 days from first pitched talk to
first paid keynote.
**Range:** $0 (early talks) → $1-3K (mid-level conferences) →
$5-25K (named keynotes) per gig.
**Activation:** Submit CFPs to 5-10 conferences in your domain.
Most conferences open CFPs 3-6 months ahead.

Speaking compounds asymmetrically. The first 3-5 talks pay $0
but build the reputation; talks 6+ start paying real money;
talks 20+ get inbound and pay $5-25K each. Plus speaking opens
inbound for consulting, pilots, and SaaS customers.

**Tradeoff:** Travel-heavy, energy-heavy. The talks themselves
take 20-40 hours each to prepare well. Cumulative revenue is
real but each individual gig is small.

**When to use this path:** When the discipline you've named has
emerging conferences. AI engineering conferences in 2026-2028
will pay well to substrate-deep speakers; the supply is rare.

---

### 7. Day job + side build (the honest path)

**Time to first dollar:** Already paying if you have a job.
**Range:** $200-500K/year salary at AI labs / fintech / Big Tech
for someone with substrate-deep AI engineering skills.
**Activation:** Reply to the inbound recruiter emails you're
probably ignoring.

The honest truth: many substrate-deep builders are better off
keeping a senior engineering job and building their substrate on
nights/weekends than going all-in pre-revenue. Day jobs at
Anthropic, OpenAI, Cloudflare, Stripe, Vercel pay $300-500K all-in
and give you insider context that compounds back into the
substrate.

**Tradeoff:** Half-time on your own work for 2-3 years rarely
beats full-time for 12 months. The compound is in the focus, not
the runway. But for builders with families, mortgages, or
risk-aversion, the day job is the right answer and there's no
shame in it.

**When to use this path:** When the substrate isn't proven yet
AND the financial cost of going full-time is severe (kids,
mortgage, no savings). Take the day job, build to 5 paid
customers on nights/weekends, then decide whether to go
full-time.

**The decision-making framework** — required reading whether you
take this path or not — see "The Single Decision" section below.

---

### 8. Acquisition / acqui-hire

**Time to first dollar:** 12-36 months from project start to
acquisition close.
**Range:** $5-50M acqui-hire (pre-revenue, just talent+IP) →
$50-500M strategic acquisition (with $1-10M ARR) → $1B+ outlier
(if the spec ratifies and a major incumbent decides to buy
rather than build).
**Activation:** Build a credible team, ship reference accounts,
get on the strategic-acquirer radar via writing/speaking/RFC
authorship.

Acquisition is rarely a *path you optimize for* — it's a side
effect of building real revenue and a real team. But knowing the
realistic numbers helps frame the bet.

**Plausible acquirers in the AI-infra space (May 2026):**

- Anthropic, OpenAI (model labs adding substrate primitives)
- Cloudflare, Vercel, Fly.io (developer-platform consolidation)
- Datadog, New Relic, Splunk (observability ⊕ audit)
- Palantir, Snowflake, Databricks (data platforms adding AI)
- Stripe, Plaid (fintech infra expanding into audit)
- Bloomberg, Refinitiv (financial-data incumbents)

**Tradeoff:** Acquisition optimizes around buyer interest, not
your interest. Most builders who take acqui-hires before they
have revenue regret it within 18 months. Wait until you have
$1-3M ARR before this conversation gets serious.

**When to use this path:** Don't aim for it. Build paths 2, 3, 5
hard and an acquisition conversation will find you if it's
the right shape.

---

### 9. Open-source sponsorship / Patreon / membership

**Time to first dollar:** 30-90 days from launching the
sponsorship surface to first meaningful revenue.
**Range:** $50-5,000/month from individual sponsors, $5-100K/year
from corporate sponsors. Most projects: $200-2,000/month total.
**Activation:** Enable GitHub Sponsors / Patreon / Polar /
Buymeacoffee. Mention it in README + colophon.

The "open-source sustainability" path. Smaller than consulting or
pilots, but recurring and doesn't require active outbound. Best
for projects with broad developer audience (where many people
will give $5-25/month).

**Tradeoff:** Almost never enough to fund full-time work alone.
Compounds slowly. Some corporate sponsors balk at "donation"
framing — frame as "sponsorship" or "support tier" instead.

**When to use this path:** Always — set it up early, treat it
as bonus. Don't depend on it.

---

### 10. Productized services — kit / template / bootstrap

**Time to first dollar:** 1-3 months from idea to first
purchase.
**Range:** $99-$2,000 per unit, sold many times. $5-50K/month if
the product fits its niche. Realistic small-builder revenue.
**Activation:** Package an existing thing you've built into a
buyable form. Write the sales page. Use Gumroad / Lemon Squeezy
/ Stripe Payment Links for checkout.

Examples:
- A starter template (Next.js + Stripe + Auth + a specific feature):
  $99-$499 per purchase
- A book or course bundle: $49-$199 per purchase
- A "kit" of pre-built components or scripts: $199-$999 per
  purchase
- A whitelabel version of your tool: $1-5K per license

**Tradeoff:** Per-unit revenue is small. Requires marketing energy
(landing page, social posts, launch sequence). Best for builders
with audience already.

**When to use this path:** When you have an existing audience
(newsletter, Twitter, GitHub stars) that would buy a $99-$499
product. Skip if you don't yet have audience reach.

---

## The matrix (skim for sequencing)

| Path | Time to $1 | Realistic $ | Activation cost | Effort to maintain |
|---|---|---|---|---|
| 1. Consulting | Days-weeks | $5-15K/mo per client | 90 min | High (per-hour) |
| 2. Design partner pilots | 4-12 weeks | $25-100K per pilot | Validation calls + SOW | Medium (project-shaped) |
| 3. Newsletter sponsorship | 30-60 days | $500-20K/yr | One-page prospectus | Low (recurring) |
| 4. Workshops | 60-90 days | $15-150K per cohort | Curriculum + announce | High (cohort-shaped) |
| 5. SaaS layer | 3-9 months | $50K-$500K/mo ARR | 6 months focused build | High (product) |
| 6. Speaking | 90-180 days | $1-25K per gig | CFP submissions | Medium (per-talk prep) |
| 7. Day job + side | Immediate | $200-500K/yr salary | Reply to recruiters | High (40+ hrs/wk) |
| 8. Acquisition | 12-36 months | $5M-$1B+ | Don't optimize for | N/A |
| 9. OSS sponsorship | 30-90 days | $200-2K/mo total | Enable Sponsors | Low |
| 10. Productized service | 1-3 months | $5-50K/mo if hits | Package + landing page | Medium (marketing) |

---

## The single decision

Before you pick a sequencing, answer this one question explicitly:

> *Am I committing to this substrate as my primary work, or is it a
> serious side build with a day job funding it?*

Both answers are valid. The wrong answer is leaving it implicit.

**If "primary work":** sequencing is 1 → 2 → 3 → 5, with 4 and 6
as compounding revenue. Skip 7.

**If "serious side build":** sequencing is 7 → 9 → 3 → eventually 2.
Skip 5 until you've committed.

**If "I haven't decided":** that's the actual blocker. Pick a date
by which you decide (30-60 days max), then act on whichever
sequencing your decision unlocks.

The single biggest predictor of substrate-builder failure: keeping
this decision implicit for 18+ months. Most fail not because the
substrate is wrong but because the focus is split.

---

## Recommended sequencing (for the full-time builder)

Month 1-2:
- **Path 1 (consulting):** 2 clients at $5-8K/month = $10-16K/month
  of runway funding
- **Path 2 (pilots):** Five validation calls. Decide pilot vs
  no-pilot at end of month 2.
- **Path 9 (OSS sponsorship):** Enable GitHub Sponsors, mention in
  README. Background revenue.

Month 3-4:
- **Path 2:** First paid pilot signed if validation calls succeeded.
- **Path 1:** Reduce to 1 client (~$5K/month) to preserve focus.
- **Path 3:** Draft sponsor prospectus, reach out to 3 plausible
  sponsors for the newsletter/magazine.

Month 5-6:
- **Path 2:** Second pilot in negotiation. First pilot delivering.
- **Path 6 (speaking):** Submit CFPs to 3-5 conferences. Goal: 1
  named talk in the next 6 months.
- **Path 3:** First sponsor signed if any said yes.

Month 7-9:
- **Path 5 (SaaS):** Start building the hosted layer if 2-3 pilots
  validated demand. Sequence consulting down to support the focus
  shift.
- **Path 6:** First paid speaking gig.

Month 10-12:
- **Path 5:** Hosted layer in beta with first 3-5 customers
  ($5-25K/month MRR).
- **Path 4 (workshop):** Announce first cohort.

This is the open-core company shape. Year 1 revenue mix: 40-60%
consulting/pilots (bridging), 20-30% sponsorship/speaking
(compounding), 10-20% SaaS (long-term). Year 2: 20-30% consulting,
40-60% SaaS, 10-20% speaking/workshop.

---

## What to skip

- **YouTube / TikTok content creation.** Long-tail compounding but
  rarely pays before month 18-24. If you love it, do it. If you're
  doing it for revenue, skip.
- **NFTs / crypto-based monetization.** Aligned only with
  crypto-adjacent substrates. Skip for everyone else.
- **Affiliate marketing.** Tiny revenue. Damages the editorial
  voice. Skip.
- **Dropshipping or "passive income" plays.** Not what
  substrate-deep builders do well at. Skip.
- **Display ads on the website.** Cents per visit. Skip unless
  you have millions of pageviews already.
- **Reddit / Discord paid memberships.** Niche communities can
  sustain this; substrate builders' audiences usually can't yet.
  Skip until you have a real community.

---

## The honest truth about all of this

Most substrate builders make less money than they expect for the
first 12-18 months and then make more than they expected after the
spec freezes around them. The compound is non-linear. The temptation
in months 1-12 is to take a day-job offer that pays today; the
temptation in months 18-36 is to optimize for an acquisition that
caps the upside.

The builders who get rich on substrate are the ones who:
1. **Funded themselves with consulting** during months 1-12 so they
   didn't burn out or take a day job
2. **Shipped reference accounts** in months 6-18 so the substrate
   became real to buyers
3. **Authored the spec** by month 18-24 so the discipline they're
   in carries their name
4. **Built the SaaS layer** in months 18-36 so the ARR compound
   started
5. **Refused early acquisition** in months 24-48 so the equity
   curve had time to grow

That's the shape. Five steps, three years. Not five different bets
— one bet, five sequential paths to fund it.

---

## Templates / scripts to use

For the consulting outreach (Path 1):

```
LinkedIn post:

Taking on 2 fractional AI engineering / substrate work clients for
the next 6 months. Substrate depth: <your specialties>. Recent
ship: <link to npm package or repo>.

If you're at a fintech, regtech, or AI-infra startup and you need
someone who's already done this work, DM. No agency fees, no
recruiter middleware. $<X>/hour or $<Y>/month retainer.

Limited spots. Reply by <date>.

— <your name>
```

For the cold consulting email:

```
Subject: Fractional engineering — <specific thing your firm does>

<First name>,

I'm <name>; I publish <link to substrate package> — open-source
audit infrastructure for AI agents in regulated industries. Recent
focus: <one specific thing relevant to their firm>.

I'm taking on 2 fractional clients this quarter. Reading <firm
name>'s recent <thing> — looks like you'd benefit from <specific
thing>.

Open to a 20-minute call to see if it fits? I can come with three
specific things I'd ship in the first 30 days.

— <name>
   <github / npm / linkedin>
```

For the speaking CFP (Path 6):

```
Title: <Sharp specific title — not "Introduction to X">

Abstract:
<3-4 sentences, lead with the structural claim, not the topic>

Speaker bio:
<Name>, <2-3 sentences identifying substrate depth + recent ship>

Why this talk now:
<1-2 sentences naming the urgency / window>
```

For the sponsor prospectus (Path 3, one-page PDF):

```
<Publication name>: Issue Sponsorship · 2026

Audience: <specific reader demographic>
Cadence: <weekly / monthly / quarterly>
Recent issues: <3 specific issue titles>
Reach: <subscriber count, average issue opens, social reach>

Available slots:
- Back-cover sponsor (single per issue): $<X>
- Inside-back-cover: $<X>
- Footer sponsor: $<X>

What the sponsor gets:
- <Specific deliverable: logo placement, one-line copy review,
  link in colophon, etc.>

What the sponsor doesn't get:
- <Specific refusals: no programmatic ads, no tracking, no
  invasive copy, etc.>

Editorial discipline:
- <Brief paragraph about the refusal-led editorial register
  that makes the placement worth more than a generic ad>

Apply: <email>
```

---

## What this doc is not

- **Not a guarantee.** These ranges are typical, not promised.
  Your individual results vary.
- **Not a substitute for an accountant or lawyer.** Get advice on
  tax shape, business structure, contracts.
- **Not a recipe.** It's a map. The decisions are yours.
- **Not aimed at every reader.** Written for substrate-deep
  builders specifically. The advice changes shape for app
  developers, content creators, agency owners, or open-source
  maintainers of libraries-without-substrate.

---

## Sources / influences

- Joel Spolsky's writing on the "soul" of a software company
- Patrick McKenzie (patio11) on consulting + productized services
- Sandi Metz on the cadence of refactoring (translates to
  refactoring how you make money over a career)
- The HashiCorp / MongoDB / Confluent open-core public material
- Sahil Lavingia (Gumroad) on small-business shape and bootstrapping
- Justin Jackson, Jason Cohen, Rob Walling on the SaaS-from-zero
  shape

---

*v0.1 · May 2026 · CC BY 4.0 · Forkable into your own context.
The honest map is more useful than the perfect one.*
