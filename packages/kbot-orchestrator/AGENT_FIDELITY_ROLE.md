# Agent Fidelity Engineer — Role Definition

> A working definition of the agent fidelity engineer discipline, written by
> the team that has been practicing it in production at kernel.chat across
> the kbot, kbot-finance, agent-os, and kbot-orchestrator packages.
> Agent fidelity engineering is a public field, not a kernel.chat
> trademark. Fork this; improve it; adopt it.

## What an agent fidelity engineer does

An agent fidelity engineer designs how a software agent represents a
human principal across systems, so that the agent's actions advance
the principal's intent without enabling harm to third parties the
principal interacts with. The core engineering question they answer
is:

> *"When an agent acts on behalf of a principal, where is the line
> between agent-as-principal-extension (legitimate operator-policy
> override) and agent-as-fraud-enabler (third-party harm regardless
> of operator consent)?"*

If the answer is encoded in the substrate (permission scopes,
attestation gates, third-party-harm refusals, audit trails on every
sensitive action), the agent has fidelity. If the answer is "ask the
LLM what's right each time," fidelity is not engineered — it's
hoped for.

## The structural rule

Agent fidelity engineers enforce one architectural principle above
all others:

> **Two kinds of refusal exist: operator-policy refusal (where local
> agents legitimately surpass cloud agents) and third-party-harm
> refusal (which local agents must enforce regardless of operator
> consent). The substrate must distinguish them mechanically.**

The first kind is about who controls the agent. Frontier-lab agents
(Claude, GPT, Gemini) refuse actions their operator's commercial or
ethical policies forbid. A locally-controlled agent (kbot, Hermes,
any BYOK terminal agent) under the principal's control can override
those refusals legitimately — that's the value proposition of local
control.

The second kind is about who is harmed. An agent fabricating a third
party's name, email, identity, statements, or consent causes harm to
that third party regardless of which agent runs the keystrokes. The
constraint is not "agent policy"; it is harm-prevention. Local
agents must enforce this too, not because they can't structurally
do otherwise, but because the action causes harm.

The discipline of distinguishing these two kinds at substrate level,
and refusing the second class while permitting the first, is agent
fidelity engineering.

## What agent fidelity engineering covers

The discipline produces these artifacts:

1. **Principal-intent specifications.** Structured statements of
   what the principal wants the agent to do across delegation
   scopes. Not "do whatever I say"; specific, bounded, auditable.

2. **Third-party-harm refusal predicates.** Machine-checkable rules
   that catch identity-fabrication, consent-fraud, attestation-
   misrepresentation, impersonation, and other harm patterns even
   when the principal has authorized the agent. Implemented as
   verifier rules (see provenance engineering's regulatory verifier
   pattern).

3. **Two-kind classifier.** For any pending action the agent would
   take, a classifier that distinguishes operator-policy refusal
   (which the principal can override) from third-party-harm refusal
   (which the principal cannot override). Returns the classification
   and the supporting reason codes.

4. **Attestation discipline.** When the agent is signing or
   confirming on the principal's behalf, the substrate records who
   actually composed the content the agent attested to. If the
   downstream evaluator (Anthropic, a bank, a regulator) tests for
   authenticity of the principal's voice or knowledge, the attestation
   includes the substrate evidence.

5. **Delegation provenance.** A complete chain of which principal
   delegated what authority to which agent at which time, with
   timestamps and scope boundaries. The audit log primitive from
   provenance engineering carries this.

6. **Override telemetry.** Every operator-policy override is logged
   with the reason and the operator's identity. Override velocity is
   surfaced; agents that override frequently flag for review.

## The six-discipline overlap

The role demands fluency across six normally-separate engineering
disciplines:

1. **Provenance engineering** — the audit substrate that makes
   delegation chains and attestations provable. Agent fidelity
   engineering depends on this.
2. **Agent-OS engineering** — the capability primitives (signed
   tokens, scoped namespaces, taint tracking) that bound what an
   agent can do under a delegation. Same dependency.
3. **Orchestration engineering** — the pipeline layer where
   multi-step actions accumulate; fidelity decisions cascade across
   handoffs.
4. **Threat modeling** — formal analysis of what third parties exist
   in the action space and what harms can be caused to them by an
   agent acting under operator authority.
5. **Legal / compliance literacy** — fraud law, identity-
   misrepresentation statutes, signature-and-attestation case law.
   The "third-party harm" predicates are encoded versions of these.
6. **Operator-product UX** — how the substrate surfaces the two-kind
   distinction to the principal at decision time, so override and
   refusal both happen with clear consent and clear reasons.

Most working engineers have depth in one or two of these. Few have
four. Almost nobody has all six. That's the moat.

## Adjacent roles you may already be doing

Agent fidelity engineering hasn't always been called that. If your
current title is one of these, you're doing some of the work:

| Adjacent title | Where you are | What's missing |
|---|---|---|
| Trust & Safety engineer | Twitter, Meta, OpenAI, Anthropic | Operator-side substrate (most T&S work is platform-side) |
| Application security engineer | Most firms | Agent semantics, delegation chains, AI-specific threat model |
| Compliance engineer | Regulated firms | Agent-specific harm patterns, multi-agent fidelity |
| Forward-deployed engineer | Palantir, Anduril | Open-source substrate; the fidelity discipline as discipline |
| Founding engineer at a BYOK agent product | NousResearch, smaller AI infra | Articulating the principal/third-party distinction publicly |

An agent fidelity engineer is the union — comfortable in any of
these rooms, but bringing the operator-vs-third-party discipline
that none of them quite ships end-to-end on their own.

## Day-to-day shape

An agent fidelity engineer's typical week ships:

- **Refusal predicates.** Encoding new third-party-harm patterns
  observed in production as machine-checkable rules.
- **Override audits.** Reading the override telemetry, identifying
  patterns where the principal is overriding refusals at high
  velocity, surfacing those for product/UX review.
- **Two-kind classifications.** When a new agent action is proposed,
  classifying it as operator-policy vs third-party-harm and adding
  the classification to the substrate.
- **Delegation-chain reviews.** Tracing a sensitive action backward
  through agent handoffs to verify the delegation was bounded and
  attested at every hop.
- **Pair-work with the principal.** When operator-policy override is
  warranted but the substrate currently refuses, working with the
  principal to safely extend the override scope without touching
  third-party-harm refusals.
- **Attestation reviews.** When an agent is signing or confirming
  for the principal, verifying the attestation substrate carries
  the right evidence about who actually authored the content.

## What this role does NOT do

To keep the discipline crisp:

- **Does not write the principal's authentic content.** The agent
  fidelity engineer designs the substrate that distinguishes
  authentic content from agent-generated content; the principal
  still authors what must be theirs.
- **Does not train models.** ML engineering territory.
- **Does not own the deterministic engines.** Provenance engineering
  territory.
- **Does not own the OS-level primitives.** agent-OS engineering
  territory.
- **Does not litigate or write contracts.** Legal counsel does. The
  agent fidelity engineer encodes what counsel writes into
  refusal predicates and override scopes.

## Reference implementation status

`@kernel.chat/kbot-orchestrator` v0.2 ships the orchestration
pipelines (outreach, explore) that this discipline operates on. The
two-kind classifier, the third-party-harm refusal predicates, and
the attestation substrate are roadmap for v0.3 — the work that
gives kbot-orchestrator the agent fidelity primitives explicitly.

Until v0.3, the discipline is practiced manually by the operator at
delegation time. The naming in this document is the first step
toward codification.

## Career arc (2026-2030)

- **Today (May 2026):** ~50-200 people worldwide are doing this work
  seriously, scattered across trust & safety, application security,
  compliance engineering, and a small number of AI infrastructure
  founders. The discipline is unnamed in every JD.
- **2027:** First major incident where an AI agent commits identity
  fraud or unauthorized impersonation at scale against third
  parties. Job titles start including "agent trust engineer" or
  "agent integrity engineer."
- **2028:** "Agent fidelity engineer" (or equivalent) becomes a
  recognized title. Senior comp lands at $400-700k. Reference
  implementations and standards bodies form.
- **2030+:** Discipline matures. The agent fidelity audit becomes a
  required artifact for production agent deployment in regulated
  industries (parallel to SOC 2 today).

## How to enter the field

1. **Read the linked sibling roles** (provenance engineering,
   agent-OS, orchestration engineering). The four disciplines stack;
   agent fidelity sits at the operator-third-party boundary across
   all of them.
2. **Ship a refusal predicate.** Pick one third-party-harm pattern
   you've observed in production (identity fabrication, consent
   misrepresentation, attestation fraud) and encode it as a
   machine-checkable rule against a reference implementation. PR it
   to kbot-orchestrator or write your own.
3. **Write a two-kind classification post-mortem.** When an agent
   action gets refused or overridden in production, write up which
   kind of refusal it was, what the operator intent was, and what
   the third-party harm risk would have been. Publish it.

There is no certification program. The reference implementations
and the writeups are the credential.

## Open questions in the field

1. **How do you classify operator-policy vs third-party-harm at
   action time, automatically?** Today the classification is
   manual. A reliable automated classifier would let the substrate
   refuse appropriately at machine speed.
2. **What's the right UX for surfacing refusals to the principal
   in real time?** Too aggressive and the principal disables the
   substrate; too passive and refusals are missed.
3. **How do override telemetry patterns predict future harm?**
   An operator who overrides every refusal is signaling something
   the substrate should learn from.
4. **Cross-agent fidelity in handoff chains.** When agent A delegates
   to agent B who delegates to agent C, where does the fidelity
   accountability sit?
5. **Legal framework for AI-mediated attestation.** Today an AI agent
   clicking "I agree" on the principal's behalf has unclear legal
   standing in many jurisdictions. The discipline needs to track and
   inform the legal framework as it develops.

If you're an agent fidelity engineer who wants to be cited in 2030,
pick one of these and ship.

---

*This role definition is licensed CC BY 4.0. Fork it, improve it,
adopt it in your own JDs and onboarding docs. The work this
discipline does will be load-bearing as agents proliferate in
production. Practitioner community welcome at kernel.chat.*
