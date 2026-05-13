# Buyer Targets + Outreach Templates

> **Companion to `docs/sales/validation-calls.md`.** This is the
> who-to-call list and the messages that get them on the call.
> Designed so the friction from "open laptop" to "first outbound DM"
> is under 5 minutes.

---

## Tier 1 — Validation calls (week 1, target: 5 calls)

The first five conversations, one per buyer profile. Lead with people
you have a personal connection to (1° or 2° network); fall back to
cold outreach only if needed.

### Profile A — Mid-size hedge fund / family office

**What to look for:** $100M–$2B AUM, runs internal trading or
external manager allocations, has at least one tech person on staff,
recently put AI tooling into research workflow.

Concrete targets / archetypes (replace with actual names from your
network):

- [ ] CTO or head of tech at a single-family office in NYC / SF / Miami
- [ ] Quantitative analyst at a long/short equity fund with <$500M AUM
- [ ] Operations director at a multi-strategy fund
- [ ] Family office investment committee chair (slower cycle but big
      check)

How to reach:
- LinkedIn DM via 2° connection (best)
- Cold email if you have the address (decent)
- X DM if they're active (worth trying, low cost)
- Conference / event introduction (slower, higher quality)

### Profile B — EU MiFID II algo-trading firm

**What to look for:** Quant firm or sell-side desk in Frankfurt /
London / Paris / Amsterdam. RTS 6 compliance is already on their
roadmap; Annex IV documentation comes due August 2026.

Concrete archetypes:

- [ ] Head of algo-trading at a Tier-3 European broker
- [ ] CTO at a European prop trading firm
- [ ] Senior dev at a London-based market-maker
- [ ] Compliance officer at a German Wertpapierhandelsbank

How to reach:
- LinkedIn (Europeans use LinkedIn more than X)
- Cold email — the EU is more email-receptive than the US
- FINOS member-firm Slack or meetup (high signal-to-noise)

### Profile C — RIA managing client accounts

**What to look for:** Registered Investment Adviser, $1B–$50B AUM,
fee-only, uses AI tools (Hebbia / AlphaSense / Rogo / Bloomberg
Terminal AI) for research. SEC exam in last 24 months.

Concrete archetypes:

- [ ] Director of research at a regional RIA
- [ ] Compliance officer at a wealth-management firm in the
      $1-10B band
- [ ] CTO at a registered-adviser tech platform
- [ ] Chief Compliance Officer (CCO) at a roboadvisor

How to reach:
- LinkedIn with a careful opener (RIAs are conservative about
  inbound)
- Compliance officer's email if listed on Form ADV
- Through a custodian rep (Schwab, Fidelity, Pershing) if you
  have one

### Profile D — Fintech infrastructure company

**What to look for:** Series A-C startup building infrastructure
(payments, banking, lending, trading API) that's adding AI features.
Currently fighting audit questions from enterprise customers.

Concrete archetypes:

- [ ] Head of platform at a YC-backed fintech
- [ ] Founding engineer at a Stripe-shaped infra company
- [ ] Compliance lead at a banking-as-a-service vendor
- [ ] CTO at a wealth-tech B2B platform

How to reach:
- X / Bluesky — fintech founders are publicly active
- Founder-network introductions (your existing network compounds
  here)
- YC alumni list if relevant
- AngelList / Wellfound founder DM

### Profile E — Compliance consultancy

**What to look for:** Boutique (5-25 people) advising regulated
firms on AI policy, model risk management, or audit readiness.
They're meta-buyers — recommending you to ten clients each.

Concrete archetypes:

- [ ] Founder of a fintech-focused compliance consultancy
- [ ] Senior advisor at a model-risk firm
- [ ] Independent compliance consultant doing fractional-CCO work
- [ ] Partner at a Big Four risk practice (slow cycle but enterprise-shape)

How to reach:
- LinkedIn (most likely to be there)
- Conference / panel speakers from FinOps, Risk.net events
- Through their published writing (Substack, LinkedIn newsletter)

---

## Tier 2 — Adjacent reachable (week 2-3, target: 10 more conversations)

Once Tier 1 is in motion, broaden:

- [ ] FINOS members (Citi, NatWest, Morgan Stanley engineers
      contributing to AI Governance Framework)
- [ ] Anthropic + OpenAI customer-success folks at financial accounts
- [ ] Quant Twitter (@nick_maggiulli's network shape)
- [ ] Authors of MIT Sloan / Risk.net AI-in-finance research papers
- [ ] HN / Lobsters AI-in-finance commenters (read their bios for
      employer)
- [ ] Speakers at QuantStrats, Quantum Foundations, FinOpsX

---

## Outreach templates

### Template 1 — Warm intro request (to a 1° connection)

```
Subject: Quick ask — would you intro me to <Name>?

<First name>,

Shipped my first commercial package last week — open-source audit
infrastructure for AI agents in finance. Trying to do five validation
calls this month with people running real AI workflows at <type of
firm>.

<Name at target firm> seems like exactly the right read. Would you
feel comfortable making a quick intro? I'll send a forwardable email
that does most of the work — you just hit Forward.

Happy to grab coffee / catch up either way. No pressure on the intro.

— Isaac
```

Then the forwardable:

```
<Friend's name> mentioned you'd be a useful sanity-check on something
I'm building, so I'm writing in case it's interesting.

I shipped @kernel.chat/kbot-finance last week — open-source audit
infrastructure for AI agents in regulated industries. Content-addressed
envelopes, hash-chained audit log, jurisdiction-aware compliance
verifier, MCP server. The architectural rule: AI never produces the
source-of-truth number; deterministic engines do; everything is
replayable byte-for-byte under audit.

I'm doing five validation calls this month to make sure I'm building
for the right pain. Twenty minutes of your time would be a real gift —
I'd love to understand how you're thinking about AI accountability at
<firm>, and I'll share what I'm hearing across the other calls.

30-second demo if you want a look first:
  npx -y @kernel.chat/kbot-finance demo

GitHub: github.com/isaacsight/kbot-finance
npm:    npmjs.com/package/@kernel.chat/kbot-finance

Happy to send a Calendly link if useful, or just pick a time that works.

— Isaac Hernandez
  isaacsight@gmail.com
  kernel.chat
```

### Template 2 — Cold LinkedIn DM (200 char limit-friendly)

```
Hi <name> — shipped open-source AI-audit infra last week
(@kernel.chat/kbot-finance on npm). Doing 5 validation calls this
month with people running AI at firms like <theirs>. 20 min,
genuinely useful for both of us. Worth a chat?
```

Follow-up if they reply:

```
Thanks for getting back. Here's a 30-second look:
  npx -y @kernel.chat/kbot-finance demo

The thesis: AI never produces the source-of-truth number; engines
do; everything is replayable under audit. Open-source core, Apache
2.0, built for regulated industries.

I'm trying to understand the gap between "AI in audit-ready
production" and "AI in pilot" at firms your size. Would 20 minutes
this week or next work? I'll come with five specific questions.

— Isaac
```

### Template 3 — Cold X / Bluesky DM (the shortest version)

```
Hey — shipped audit-grade AI infra on npm last week.
npx -y @kernel.chat/kbot-finance demo

Doing 5 validation calls with people running AI in regulated
shops. Worth 20 min for your take?
```

If they want context:

```
Open-source. Apache 2.0. The architectural rule is that AI never
produces the number; engines do. Hash-chained audit log, regulatory
verifier, MCP server. Built for the EU AI Act / SR 26-02 / RTS 6
crossover.

github.com/isaacsight/kbot-finance

I'm trying to learn what's actually broken before I commit 18 months.
```

### Template 4 — HN / Lobsters / discussion comment

When you reply to AI-in-finance threads, lead with the substance, not
the pitch:

```
On <specific point in the thread>: this is exactly what I just spent
the last 90 days building — open-source audit infra that says AI
never produces the source-of-truth number, the deterministic engine
does, every step is content-addressed and replayable.

Reference impl + RFC here: github.com/isaacsight/kbot-finance

Trying to do five validation calls this month with people running
AI in regulated shops; happy to compare notes if you're doing any of
this in production.
```

### Template 5 — The follow-up (regardless of how the first one went)

If they didn't reply in a week:

```
<First name> — quick follow-up. Five validation calls this month, two
done, three to go, and I wanted to see if you had 20 minutes to be one
of them.

The TL;DR: I shipped open-source audit infra for AI agents in
regulated industries. I'm trying to figure out whether the thing
I built solves a problem you actually have, before I commit another
year to building it.

If you're underwater, no worries — would still love a quick "no"
or "ask me in a month" so I know whether to circle back.

— Isaac
```

---

## What "yes" looks like (and what to do)

When someone replies "happy to chat":

1. **Reply within 90 minutes** with a Calendly link OR three concrete
   time slots.
2. **Confirm the call in their format** (Zoom, Google Meet, phone — let
   them pick).
3. **Send the demo link + a one-line agenda** 24 hours before.

> *"Looking forward to Thursday. Quick look beforehand if useful —
> demo is one command:*
> *  npx -y @kernel.chat/kbot-finance demo*
> *Five questions on my side, mostly about your current AI-audit
> setup. I'll listen more than I talk."*

The day-before-confirmation email is the lowest-effort trick that
takes show rates from ~60% to ~85%. Always send it.

---

## What "no" looks like (and what to do)

- **"Now's not a good time"** → ask permission to reach back out in 30
  or 60 days. They've signaled it's a *no* not a *never*.
- **"We don't have AI in production yet"** → keep them in the loop;
  they'll be a buyer in 6-12 months.
- **"We use Palantir for this"** → ask what they wish Palantir did
  differently. Useful market intel even if not a sale.
- **No reply after 2 outreach attempts** → drop them; circle back
  in 3 months.

---

## Track everything in one place

A simple `validation-tracker.csv` or Notion table:

```
date_contacted, name, firm, channel, intro_via, reply, scheduled, notes
```

You'll want to look back in 90 days and see the pattern: which
channels worked, which profiles bit, which questions surfaced the
sharpest reactions. The data compounds.

---

*Targets + templates v0.1 · May 2026 · Update as you learn what
actually works. Skip the templates verbatim — they're easier to
adapt than they are to invent.*
