# The Access-Restriction Pattern

*Strategic research brief — kbot research, 2026-04-25*
*Author: Claude Opus 4.7 (1M context)*

---

## TL;DR

1. **Real new tier, not a blip.** Anthropic Mythos (Mar 2026) and OpenAI GPT-5.5-Cyber (Apr 30 2026) are the first two named, vetted-only frontier models from the two leading labs. The pattern is a *capability tier above the self-serve API*, gated by affiliation and use-case review.
2. **Spreading fast, but narrowly.** Both labs adopted it within ~6 weeks of each other on the same wedge (cybersecurity). Google's Sec-Gemini, xAI's Pentagon-only Grok, and AWS Bedrock's GovCloud-gated Mythos surface confirm it; Meta and DeepSeek/Qwen remain counterexamples (open weights).
3. **Open frontier counterweight is six-to-twelve months behind on the cyber wedge.** DeepSeek-R1, Qwen3-235B and GLM-4.5 lead open-weight cyber benchmarks but neither claim nor demonstrate Mythos-class autonomous vulnerability discovery. Llama 4 Scout/Maverick are open-weight; Meta has stated it will keep that posture for upcoming models.
4. **kbot's honest answer is BYOK + local-first + defensive.** kbot does not compete with Mythos/Cyber on offensive vulnerability research, nor should it. Its `security_agent` is a defensive linter. The strategic value is that BYOK insulates users from gating decisions made by any single lab, and local-first means kbot can route to whatever open-weight cyber model ships next without changing the product surface.
5. **ISSUE 377 material? Yes — but not as a kbot pitch.** The story is the *shape of the change* (a permanent tier of "the most dangerous capability sits behind vetting"), not "kernel.chat solves the gating problem." See §6 for headline candidates.

---

## 1. The Pattern, Named

**Definition.** The **access-restriction tier** is a new model class sitting above the self-serve API: a frontier model whose weights are not released, whose API is not purchasable, and whose use is conditioned on (a) named-organization eligibility, (b) use-case attestation, and (c) ongoing behavioral monitoring. Unlike enterprise tiers (which gate on price and contract), this tier gates on *who you are and what you intend to do*.

### The two anchor cases

| Model | Lab | Public date | Surface | Eligibility |
|---|---|---|---|---|
| **Claude Mythos Preview** | Anthropic | March 2026 (announced) | Project Glasswing; Amazon Bedrock gated preview (US East N. Virginia) | Invitation-only. Named launch partners: AWS, Apple, Broadcom, Cisco, CrowdStrike, Google, JPMorganChase, Linux Foundation, Microsoft, NVIDIA, Palo Alto Networks. ~40 critical-infrastructure orgs total. ([Anthropic](https://www.anthropic.com/glasswing), [AWS](https://aws.amazon.com/about-aws/whats-new/2026/04/amazon-bedrock-claude-mythos/), [Bloomberg](https://www.bloomberg.com/news/articles/2026-04-21/anthropic-s-mythos-model-is-being-accessed-by-unauthorized-users)) |
| **GPT-5.5-Cyber** | OpenAI | April 30, 2026 | Trusted Access for Cyber (TAC) program; chatgpt.com/cyber for individuals; enterprise via OpenAI rep | Application-based with credential and use-case verification. Tiers for individual defenders, security teams, government entities, critical infrastructure operators, security vendors, cloud platforms, financial institutions. ([OpenAI](https://openai.com/index/scaling-trusted-access-for-cyber-defense/), [TechCrunch](https://techcrunch.com/2026/04/30/after-dissing-anthropic-for-limiting-mythos-openai-restricts-access-to-cyber-too/)) |

**Eligibility — Mythos (Project Glasswing).** "Invitation-only and there is no self-serve sign-up" ([Anthropic](https://www.anthropic.com/glasswing)). Partners are screened for "legitimate security use cases and their ability to conduct responsible testing." The selection criterion in Anthropic's materials is consistent: "organizations responsible for building or maintaining critical software infrastructure." All current named partners are US-headquartered.

**Eligibility — Trusted Access for Cyber.** Verification at `chatgpt.com/cyber` for individuals; enterprises submit a [pilot request form](https://openai.com/form/enterprise-trusted-access-for-cyber/). Approved uses: "security education, defensive programming, and responsible vulnerability research." Forbidden: "data exfiltration, malware creation or deployment, destructive or unauthorized testing." OpenAI is scaling to "thousands of verified individual defenders and hundreds of teams" ([OpenAI](https://openai.com/index/scaling-trusted-access-for-cyber-defense/)).

### Is this new?

**Mostly new.** Restricted-access *predecessors* exist — GPT-4 had a six-month staged rollout, Anthropic's Constitutional AI paper described tiered deployment, and CBRN-focused evaluations have gated specific capabilities since at least 2024. But **the named, productized "this is a separate model that you cannot buy" tier** is a 2026 phenomenon. The first instance was OpenAI's GPT-5.4-Cyber on April 14, 2026, followed by Mythos and GPT-5.5-Cyber within two weeks ([Axios](https://www.axios.com/2026/04/14/openai-model-cyber-program-release)).

Earlier 2026 precedent: xAI's Pentagon deal (Feb 2026) gave Grok access to Secret/Top Secret classified networks under "xAI for Government" — but this is government-as-customer, not lab-as-gatekeeper. Closer to the new pattern is Google's Sec-Gemini v1 (April 2025), which Google made available "to selected institutions, researchers, NGOs, and security professionals" via request form ([Google Security Blog](https://security.googleblog.com/2025/04/google-launches-sec-gemini-v1-new.html)). Sec-Gemini was the prototype; Mythos/Cyber are the production version.

**INFERENCE:** Mythos is the first model where the lab itself characterized the model as too dangerous to sell. The framing — "we built a thing capable of finding 271 Firefox vulnerabilities in one pass, and we don't trust the open market with it" — is qualitatively new. Altman's "fear-based marketing" critique is partially right (Anthropic does benefit commercially from the framing) and partially a tell — OpenAI replicated the structure within 9 days.

---

## 2. Who Else Is Doing It / About To

| Lab | Status | Evidence |
|---|---|---|
| **Anthropic** | Yes — Mythos via Glasswing. Opus 4.7 still self-serve via Bedrock, Vertex, Foundry, Claude API. | [Anthropic Opus 4.7 release](https://www.anthropic.com/news/claude-opus-4-7); [Glasswing](https://www.anthropic.com/glasswing) |
| **OpenAI** | Yes — GPT-5.5-Cyber via TAC. GPT-5.5 base remains self-serve. | [OpenAI TAC announcement](https://openai.com/index/trusted-access-for-cyber/) |
| **Google DeepMind** | Partial — Sec-Gemini v1 via request form (April 2025). Notably, Google has stated a preference for *general-purpose* Gemini over cyber-specific variants ([Infosecurity Magazine](https://www.infosecurity-magazine.com/news/google-gemini-over-cyber-specific/)). Gemini Deep Research / 3 Pro etc. all self-serve. | [Sec-Gemini](https://secgemini.google/) |
| **xAI** | Different pattern — government-only tier (Pentagon Impact Level 5, Top Secret). Grok consumer tier remains self-serve. xAI agreed to "all lawful use" — explicitly the position Anthropic refused. | [Axios](https://www.axios.com/2026/02/23/ai-defense-department-deal-musk-xai-grok) |
| **Meta** | **Counterexample.** Llama 4 Scout/Maverick released open-weight (April 2025). Meta reported in April 2026 to be developing open-source versions of upcoming models ([SiliconAngle, Apr 6 2026](https://siliconangle.com/2026/04/06/report-meta-developing-open-source-versions-upcoming-ai-models/)). PurpleLlama, Llama Guard 4, AutoPatchBench shipped as defensive cyber tools, all open. | [Meta AI](https://ai.meta.com/blog/llama-4-multimodal-intelligence/) |
| **DeepSeek, Qwen, GLM, Mistral** | **Counterexamples.** All shipping open-weight. DeepSeek-R1, Qwen3-235B-A22B, GLM-4.5 lead open-weight cyber benchmarks per [SiliconFlow's 2026 ranking](https://www.siliconflow.com/articles/en/best-open-source-LLM-for-Cybersecurity-Threat-Analysis). | |
| **AWS Bedrock** | Hosting Mythos in gated research preview (US East N. Virginia only, allowlist). FedRAMP High and DoD Impact Level 4/5 authorized for general Claude models. | [AWS announcement](https://aws.amazon.com/about-aws/whats-new/2026/04/amazon-bedrock-claude-mythos/) |

**FACT:** Anthropic's Opus 4.7 released April 16, 2026 to general availability across Claude Platform, Bedrock, Vertex AI, Microsoft Foundry. The two-tier structure is now explicit: general capability (self-serve) and dangerous capability (vetted).

**INFERENCE:** Google's stated preference for general-purpose Gemini over cyber-specific variants suggests one path *not* taken — keep the capability inside the general model, lean on RLHF and use-policy violations to block misuse. This is a viable third position. Whether Google maintains it depends on whether Mythos-class capability emerges naturally inside Gemini 3 / 4 tier and forces the same gating decision.

---

## 3. What's Gated, What Isn't, Where the Line Falls

The clear wedge is **autonomous vulnerability discovery and exploitation**. The other dual-use domain — **CBRN** — has been gated *inside* models for longer (refusals + capability evaluations under Anthropic's RSP and OpenAI's Preparedness Framework) but has not yet produced a separate productized tier the way cyber has.

| Domain | Gated as separate tier? | Mechanism |
|---|---|---|
| Cybersecurity (offensive vulnerability discovery) | **Yes** (Mythos, GPT-5.5-Cyber, Sec-Gemini) | Affiliation + use-case |
| CBRN (bio/chem/rad/nuc) | **No, but threshold-gated within general models.** | Refusals + Responsible Scaling Policy thresholds |
| Persuasion / influence ops | **No** | Use policy + monitoring |
| Autonomous agentic action (long-horizon) | **No, but capability-flagged.** | Anthropic ASL levels; OpenAI High/Critical |
| Government / defense | Different mechanism (xAI Grok at Top Secret, Anthropic's "ClaudeGov", GovCloud Bedrock) | Customer-classification, not capability-gating |

**FACT:** Anthropic in April 2026 expanded Claude's usage policy to explicitly prohibit CBRN weapon development and added cybersecurity-specific rules against malware creation and exploitation ([Tech Buzz AI summary](https://www.techbuzz.ai/articles/anthropic-bans-cbrn-weapons-development-as-ai-risks-escalate)).

**INFERENCE:** The pattern is **"the most dangerous capability of an otherwise-general model is split into a tier above self-serve."** Cybersecurity is the wedge because (a) measurable benchmarks exist (CVE counts, Firefox audit), (b) the dual-use story is concrete and recent (zero-days are a known commodity), and (c) the buyer set — critical infrastructure firms — already exists as a procurement channel. Bioweapons gating will likely arrive next when an equivalently concrete benchmark and buyer set materialize (e.g., a model that can substantially uplift wet-lab synthesis at the level Anthropic's CBRN-3/4 thresholds describe).

---

## 4. Parallel Open Path

**Where the open frontier sits, May 2026.**

| Capability | Frontier-gated | Best open-weight |
|---|---|---|
| Autonomous vulnerability discovery in major OS / browser | Mythos (271 Firefox CVEs in one pass; 27-yr OpenBSD bug; 16-yr FreeBSD RCE) | DeepSeek-R1, Qwen3-235B, GLM-4.5 — strong on cyber reasoning benchmarks (SecBench, SEvenLLM-Bench) but no public report of comparable autonomous CVE-finding scale. |
| Defensive cyber assistant | GPT-5.5-Cyber, Sec-Gemini v1 | Meta's PurpleLlama, Llama Guard 4, AutoPatchBench, GOAT — all open. |
| CBRN-uplift-class | (no public productized tier yet, but inside Opus 4.7 / GPT-5.5 with refusals) | Llama 4 Maverick / DeepSeek-R1 base capability, gated only by base-model refusals. |

**FACT:** Mozilla shipped 271 Firefox 150 CVE fixes in a single Mythos evaluation pass — "more than twelve times the number identified by Anthropic's previous most capable model" ([Technology.org](https://www.technology.org/2026/04/30/anthropics-mythos-ai-uncovers-271-security-flaws-in-firefox-150/)).

**INFERENCE:** **The open frontier on offensive cyber is roughly 6–12 months behind**, but the gap on *defensive* tooling is much narrower — possibly negative (Meta's open defensive stack is fully usable today). The lag matters most when the buyer is a critical infrastructure operator who needs the *strongest* offensive capability for self-audit. For everyone else — including most kbot users — the open-weight stack is functional.

The structural risk: gated-tier models get fewer iterations because the user base is small, the feedback loop is slow, and the legal/PR cost of misuse is high. Over a 12–24 month horizon this could cause the gated frontier to *slow down*, narrowing the gap. **No data yet — this is a hypothesis to track.**

---

## 5. Implications for kbot

### What kbot's security tooling actually does today

kbot ships defensive security tools, not Mythos-class offensive capability:

- `security_agent` (4.0) — 17 static rules: secret detection, basic SQLi/XSS pattern detection, dependency audit, OWASP header checks. ([packages/kbot/src/tools/security.ts])
- `pentest_*` tools — recon, vuln scan wrappers around `nmap`, `nikto`, `subdomain_enum`, etc. Standard scanner orchestration.
- `redteam_scan`, `payload_generate` — wrappers; not autonomous CVE discovery.
- `cve_lookup`, `exploit_search`, `attack_lookup` — query tools against public databases.

**INFERENCE:** kbot's security surface is *roughly the same surface as a senior security engineer's CLI toolkit*. It is not, and was never, in the Mythos/Cyber capability class. Pitching it that way would be inaccurate. The honest framing: kbot is a defensive engineering assistant whose security agent is a guardrail against shipping the kinds of bugs Mythos finds.

### Where the access-restriction pattern actually strengthens kbot's pitch

1. **BYOK insulates users from any single lab's gating decision.** When the cloud frontier becomes gated, the kbot user with their own Opus 4.7 / GPT-5.5 / Gemini 3 keys keeps working. They lose access to *the tier above* — but so does everyone outside the named-partner list. This is a stable equilibrium for the next 12+ months.

2. **Local-first means kbot can host any open-weight cyber model that ships.** If a DeepSeek-R1-Cyber or Llama-4-Cyber drops as open weights, kbot's Ollama bridge serves it without product surface changes. This is the *option-value* argument: kbot doesn't need to pre-commit to a cyber model strategy.

3. **The "100 specialty skills" framing fits the world that's emerging.** If frontier labs shard into "general model + N gated specialty tiers," then a BYOK orchestrator that routes per-task to the user's own keys (or local models) is well-positioned. The shard structure favors orchestrators over single-vendor wrappers.

### The honest gap

The kbot user who today says "I need to scan a real production system for vulnerabilities at the Mythos level" — kbot cannot do that. Their best paths:

1. **Apply to TAC** at chatgpt.com/cyber if they're a verified defender.
2. **Apply to Glasswing** if they're an org that builds/maintains critical software (no public form; outreach via Anthropic relationships).
3. **Run open-weight DeepSeek-R1 / Qwen3** locally via kbot's `kbot_local_*` tools, accept the capability gap, and use kbot's existing scanner orchestration (`pentest_recon`, `redteam_scan`) as the harness.

Path 3 is kbot's actual product position. **It is materially weaker than path 1/2 today on offensive vuln discovery — and that's fine, because that's not kbot's market.**

### What kbot should *not* do

- Don't claim Mythos/Cyber-class capability. The benchmarks aren't there.
- Don't pitch BYOK as "the answer to gating." It's a hedge, not a substitute.
- Don't build an offensive cyber model. It's outside the open-source maintainer's defensible scope and would invite the exact gating decision being made above.

---

## 6. Editorial Angle for kernel.chat ISSUE 377

**Headline candidates** (sober craft, methodologically grounded):

1. **"The Tier Above the API"** — clean, descriptive, makes the structural point.
2. **"Behind the Glass: What Vetting Means at the Frontier"** — leans on the Glasswing reference without being cute.
3. **"Two Doors"** — the self-serve door and the application door; minimalist, magazine-voice.
4. **"What Doesn't Get Sold"** — frames the question by inversion; what is the lab choosing not to sell, and to whom?

**Recommendation:** "The Tier Above the API."

### 200-word framing

> In March, Anthropic introduced a model called Mythos. It was unusual not for what it could do — find vulnerabilities in major operating systems and browsers at a scale beyond any prior model — but for who could use it. There was no API key to buy. There was no waitlist to join. Access went, by invitation, to a list of named partners: AWS, Apple, Cisco, the Linux Foundation, JPMorganChase, around forty organizations responsible for the infrastructure most of the internet runs on.
>
> Six weeks later OpenAI released the same shape of thing — GPT-5.5-Cyber, behind an application form, available to verified defenders. The CEO of OpenAI had, the week before, called Anthropic's approach "fear-based marketing." He used it anyway.
>
> A new tier has formed above the self-serve API: a class of capability that is built, named, demonstrated, and then not sold. The eligibility test is no longer money. It is affiliation, intent, and the lab's read on what you might do with the keys.
>
> This is the shape of frontier AI for the rest of the decade. The question this issue is asking is what that shape changes — about access, about iteration, about what counts as a public technology.

### Magazine-voice notes

- **Do not** cast Anthropic as conservative-good or OpenAI as hypocritical-bad. Both arrived at the same structure within nine days of each other. The convergence is the story.
- **Do not** pitch kbot. The magazine voice is observational; the AI engine is subordinate to the editorial frame.
- **Do** mention the open-weight counterpoint (Meta, DeepSeek, Qwen) as a parallel path, not a partisan one.
- **Do** note the unauthorized-access incident on Mythos's launch day — it complicates the "vetting works" story without invalidating it. ([Bloomberg](https://www.bloomberg.com/news/articles/2026-04-21/anthropic-s-mythos-model-is-being-accessed-by-unauthorized-users))
- **Avoid** the word "gatekeeping" — Altman's word, charged. Prefer "vetted access," "tiered access," or "above the API."

### Possible pull-quotes from the field

- Altman's "fear-based marketing" line and the "bomb shelter for $100 million" metaphor — useful as a foil, not as the editorial position.
- Anthropic's "organizations responsible for building or maintaining critical software infrastructure" — clean self-description.
- The Mozilla number: 271 Firefox vulnerabilities in a single evaluation pass.

### When to ship

ISSUE 377 timing works. The two anchor events (Mythos launch, GPT-5.5-Cyber launch) are both within the last 8 weeks. The pattern is novel enough to be news and stable enough to write about with some perspective. Earlier than this and the pattern wasn't visible; much later and it stops being a *change* and starts being *the world*.

---

## Sources

### Primary lab announcements
- [Anthropic — Project Glasswing](https://www.anthropic.com/glasswing)
- [Anthropic — Claude Opus 4.7](https://www.anthropic.com/news/claude-opus-4-7)
- [OpenAI — Trusted Access for Cyber](https://openai.com/index/trusted-access-for-cyber/)
- [OpenAI — Scaling Trusted Access for Cyber Defense](https://openai.com/index/scaling-trusted-access-for-cyber-defense/)
- [OpenAI — Pilot request form](https://openai.com/form/enterprise-trusted-access-for-cyber/)
- [Google Online Security Blog — Sec-Gemini v1](https://security.googleblog.com/2025/04/google-launches-sec-gemini-v1-new.html)
- [AWS — Claude Mythos Preview on Bedrock](https://aws.amazon.com/about-aws/whats-new/2026/04/amazon-bedrock-claude-mythos/)
- [Anthropic Responsible Scaling Policy](https://www.anthropic.com/responsible-scaling-policy)

### News and reporting
- [TechCrunch — After dissing Anthropic, OpenAI restricts Cyber too (Apr 30 2026)](https://techcrunch.com/2026/04/30/after-dissing-anthropic-for-limiting-mythos-openai-restricts-access-to-cyber-too/)
- [TechCrunch — Sam Altman "fear-based marketing"](https://techcrunch.com/2026/04/21/sam-altman-throws-shade-at-anthropics-cyber-model-mythos-fear-based-marketing/)
- [TechCrunch — Unauthorized group accessed Mythos](https://techcrunch.com/2026/04/21/unauthorized-group-has-gained-access-to-anthropics-exclusive-cyber-tool-mythos-report-claims/)
- [Bloomberg — Mythos accessed by unauthorized users](https://www.bloomberg.com/news/articles/2026-04-21/anthropic-s-mythos-model-is-being-accessed-by-unauthorized-users)
- [Bloomberg — White House moves to give US agencies Mythos access](https://www.bloomberg.com/news/articles/2026-04-16/white-house-moves-to-give-us-agencies-anthropic-mythos-access)
- [Axios — xAI / Pentagon classified deal (Feb 2026)](https://www.axios.com/2026/02/23/ai-defense-department-deal-musk-xai-grok)
- [Axios — OpenAI tiered cyber access (Apr 14 2026)](https://www.axios.com/2026/04/14/openai-model-cyber-program-release)
- [Government Executive — White House drafts federal Anthropic guidance](https://www.govexec.com/technology/2026/04/white-house-drafting-plans-permit-federal-anthropic-use/413204/)
- [The National — What is Mythos?](https://www.thenationalnews.com/news/us/2026/04/29/what-is-mythos-cybersecurity-vulnerabilities/)
- [WEF — Anthropic's Mythos moment](https://www.weforum.org/stories/2026/04/anthropic-mythos-ai-cybersecurity/)
- [SecurityWeek — OpenAI widens cyber model access after Mythos](https://www.securityweek.com/openai-widens-access-to-cybersecurity-model-after-anthropics-mythos-reveal/)
- [CNN — OpenAI cybersecurity government push](https://edition.cnn.com/2026/04/29/tech/openai-cybersecurity)
- [Technology.org — Mythos finds 271 Firefox flaws](https://www.technology.org/2026/04/30/anthropics-mythos-ai-uncovers-271-security-flaws-in-firefox-150/)
- [SiliconAngle — Meta open-source upcoming models](https://siliconangle.com/2026/04/06/report-meta-developing-open-source-versions-upcoming-ai-models/)
- [Infosecurity Magazine — Google favors general-purpose Gemini](https://www.infosecurity-magazine.com/news/google-gemini-over-cyber-specific/)

### Open-weight landscape
- [SiliconFlow — Best open-source LLM for cybersecurity 2026](https://www.siliconflow.com/articles/en/best-open-source-LLM-for-Cybersecurity-Threat-Analysis)
- [Vellum — Open LLM Leaderboard 2026](https://www.vellum.ai/open-llm-leaderboard)
- [Meta PurpleLlama on GitHub](https://github.com/meta-llama/PurpleLlama)
- [Meta — Llama 4 herd announcement](https://ai.meta.com/blog/llama-4-multimodal-intelligence/)
- [ProtectAI — Llama 4 vulnerability assessment](https://protectai.com/blog/vulnerability-assessment-llama-4)

### Analysis
- [Zvi Mowshowitz — Claude Mythos #2: Cybersecurity and Glasswing](https://thezvi.substack.com/p/claude-mythos-2-cybersecurity-and)
- [MindStudio — What is Project Glasswing](https://www.mindstudio.ai/blog/what-is-project-glasswing-anthropic-claude-mythos)
- [Tech Buzz AI — Anthropic CBRN policy update](https://www.techbuzz.ai/articles/anthropic-bans-cbrn-weapons-development-as-ai-risks-escalate)
