# Validation Calls — The Week-1 Script

> **Purpose:** Five 30-minute calls in seven days. By the end of the
> week you know whether to keep building the audit-grade architecture
> kbot-finance v0.2 ships, or to pivot to log-and-attest only.
>
> **Hard-gate decision:** if ≥3/5 buyers say byte-identical replay is
> **must-have**, the architecture is on the right side of demand;
> keep building. If <2/5, the architectural premium isn't pricing in
> and you should simplify the substrate.
>
> Don't skip these calls. Building for 18 months on an unvalidated
> demand signal is the modal failure mode of substrate-deep founders.

---

## Who to call (five distinct buyer profiles)

Aim for **one buyer per profile**. The point is breadth, not density.

1. **Mid-size hedge fund / family office** ($100M-$2B AUM) with internal trading + a compliance officer who's getting twitchy about AI. Most likely to have a real "we got asked by our auditor" story.
2. **MiFID II algo-trading firm in EU** with engineering staff. They're already drafting Annex IV documentation for the August 2026 deadline; the question is whether they'd buy the substrate or roll their own.
3. **RIA managing client accounts** ($1B-$50B AUM) using AI tools in research workflows. SEC exam season makes this a tense conversation.
4. **Fintech infrastructure company** — a Stripe/Plaid/Mercury-shaped vendor that's adding AI features and getting pulled into audit questions by enterprise customers.
5. **Compliance consultancy** — small boutique (5-25 people) advising tier-2 financial firms on AI policy. They're the meta-buyer; if they recommend kbot-finance, ten of their clients do too.

A second-tier list (if the first five aren't reachable in week 1):
- Family-office tech advisor
- Small prop shop's CTO
- Tier-3 hedge-fund (10-100M AUM, more accessible)
- A FINOS member-firm engineer working on AI governance
- A regulatory consultant at a Big Four firm

---

## The call structure (30 minutes, five questions)

### Opening (2 min)

> *"Thanks for taking the call. Quick context: I'm building open-source
> audit infrastructure for AI agents in regulated industries — published
> last week, real npm package, working demo against Polymarket. I'm doing
> five validation calls this week with people running real AI workflows
> at firms like yours. The goal is to make sure we're building the right
> substrate before we go heads-down for 18 months. I'd love to hear how
> you're thinking about this; I'll share what I've learned. Twenty
> minutes for your half, ten for mine. Sound good?"*

### Question 1 — Current state (5 min)

> *"Today, when an AI agent at your firm touches a decision that could
> end up in front of a regulator — a trade, a recommendation, a
> filing — how do you record what happened?"*

Listen for:

- "We don't, really" → urgent buyer, ripe.
- "We have audit logs but they're not great" → match the substrate's
  exact pitch.
- "We have a vendor handling that" → ask *who* (probably Palantir,
  Bloomberg, or in-house). Then dig into pain points.
- "Our compliance team would know better than me" → ask for the intro
  to that person; you've found a champion-shaped role but wrong
  altitude.

### Question 2 — The hard question (5 min)

> *"If your auditor came back six months later and said 'show me
> exactly what the AI saw when it made this trade,' could you replay
> it byte-for-byte? Or would you reconstruct from logs?"*

This is the **byte-identical replay** question — the architectural
crux of the substrate.

Listen for:

- **"Reconstruct from logs"** + *"and that worries me"* → must-have. ★★★
- **"Reconstruct from logs"** + *"and that's fine"* → nice-to-have. ★
- **"Replay byte-for-byte"** → you've found someone who already has
  the substrate; ask what they're using and what's wrong with it.
- *"That's never come up"* → blue-sky buyer, less urgent. ★

Tally: how many of the five say ★★★? That's the gate.

### Question 3 — Adverse-action / refusal codes (5 min)

> *"When the AI agent decides *not* to do something — refuses a trade,
> blocks an action — does the system tell you *why* in a way you could
> hand a regulator?"*

Listen for:

- "We don't have a 'refusal' concept" → educate; they'd value the
  verifier's reason-code pattern once they see it.
- "Sort of, but it's brittle" → match the kbot-finance verifier-rule
  pattern.
- "We log the refusal but not the reason" → exact fit; this is what
  the verifier's adverse-action codes are for.

### Question 4 — The compliance buyer (5 min)

> *"Who at your firm gets paged when a regulator asks for AI-decision
> evidence? Are they technical? Do they know what 'replay' would
> mean if I described it to them?"*

This identifies the **decision-maker shape**. Compliance officers vs
CTOs vs general counsel — each has different language, different
budget, different urgency.

Listen for:

- Named technical compliance lead → ask for an intro; that's the
  champion.
- "General counsel" or "external auditor" → harder buyer; longer cycle.
- Cross-functional ("CTO + compliance jointly") → ideal champion shape.

### Question 5 — Budget shape (5 min)

> *"If we showed you a substrate that solved this — open-source core,
> commercial premium for SOC 2 and hosted retention — what would the
> conversation about budget look like at your firm? Is it an
> engineering line item, a compliance line item, or somewhere neither
> wants to own?"*

Listen for:

- **"Compliance has budget"** → easier sale, slower cycle, larger contracts.
- **"Engineering would just install it"** → developer-led adoption,
  smaller initial spend, faster.
- **"Neither has budget; we'd have to make a case"** → real, but a
  longer engagement. Useful — they'll write the business case if
  you give them the language.

### Demo + close (5 min)

If energy is high:

> *"Want to see it run? Thirty seconds, no setup. Open a terminal."*

```
npx -y @kernel.chat/kbot-finance demo
```

Watch them watch it. Their face on the audit log scrolling is the
real signal. The demo command IS the sales pitch.

Then:

> *"If this were a 30-day free pilot — your environment, your data,
> your audit log path — and we made it our priority to get you a
> regulator-exportable Annex IV bundle out the other end, would
> you be interested?"*

The "yes" doesn't have to be definitive. The "let me talk to X first"
is itself useful — it tells you who X is.

---

## The follow-up email (send within 90 minutes)

```
Subject: Notes from our call · kbot-finance

Thanks for the conversation. Three things:

1. The most useful thing you said: <one specific quote that maps to a
   product decision>

2. Here's the demo: npx -y @kernel.chat/kbot-finance demo
   Repo: github.com/isaacsight/kbot-finance
   30 seconds, no setup. Try it on your machine.

3. The thing you flagged about <their specific concern>: that's
   exactly what <specific substrate primitive> is built for. Worth
   a 15-minute follow-up next week if useful.

If a 30-day pilot makes sense, I have a one-page SOW I can send you.

— Isaac
```

The "most useful thing you said" line is the hardest part. It signals
you listened. Don't fake it; if you couldn't pull a specific quote,
that means the conversation didn't go deep enough — note that and
plan the next call differently.

---

## The 5-call scoreboard

Track in a small private doc as calls happen:

| # | Buyer | Profile | Byte-replay verdict | Champion identified | Pilot interest | Next step |
|---|---|---|---|---|---|---|
| 1 |   |   | ★★★ / ★★ / ★ |   |   |   |
| 2 |   |   |   |   |   |   |
| 3 |   |   |   |   |   |   |
| 4 |   |   |   |   |   |   |
| 5 |   |   |   |   |   |   |

After call 5, count the ★★★ tallies. That's the gate.

---

## What ≥3 of 5 must-have means

- Keep building the audit-grade architecture.
- Negotiate one paid design partner from the five (even $25-50K).
- Ship v0.3 (QuantLib pricing adapter, MCP RFC engagement, Annex IV
  exporter improvements) in the next 60 days.
- Reach out to 10 more buyers in week 2-3. The pattern is
  repeatable now.

## What <2 of 5 must-have means

- The byte-identical replay primitive is over-engineered for the
  market.
- Pivot kbot-finance toward **log-and-attest** — hash-chained audit
  log + adverse-action codes + Annex IV export, but drop the
  "deterministic engine" architectural pretensions.
- Cuts dev work by ~40%; the substrate becomes cheaper to maintain
  and easier to sell to non-engineering buyers.
- Ship v0.3 around the simpler core; revisit the audit-grade
  architecture only if a future buyer's regulator demands it.

Either path is fine. Both involve continued investment. What you
*can't* afford is to build 18 months for the wrong audience.

---

## What this script protects against

- **Confirmation bias.** Asking "would you buy this?" is useless; asking
  "what happens when X" surfaces real friction.
- **Anchoring on the first buyer.** Five calls, five profiles, breadth
  before depth.
- **Cherry-picked anecdata.** The scoreboard is the gate; opinions are
  not.
- **Falling in love with the architecture.** Byte-identical replay is
  technically beautiful and possibly the wrong product. Five real
  conversations decide which.

---

*Script v0.1 · May 2026 · CC BY 4.0 · Forkable into any
infrastructure-product validation cycle.*
