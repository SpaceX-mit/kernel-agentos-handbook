/* ──────────────────────────────────────────────────────────────
   ISSUE 404 — JUL 2026
   THE LOCKSMITH'S ROUNDS
   錠前屋の巡回 — 五つの錠を採点する

   The security audit from this press week, staged in the review
   form — the tool built for "we tested N things, here is how
   they stack up," pointed for the first time at the magazine's
   own locks. The week the agent moved into a client-facing chat
   workspace, the desk walked the property: every surface a
   secret touches, graded like gear. Five subjects — the vault,
   the record, the wire, the keyring, the diary — three criteria,
   one verdict, and one loose window found on the rounds and
   latched the same hour.

   Why review: the material is genuinely comparative. Five
   surfaces, same rubric, honest grades — an essay would flatten
   the ranking and a dispatch would lose the rubric. The review
   type's own doc notes its first intended use was grading
   security; 404 delivers that use on the house itself.

   Identity decisions:
     • coverStock = 'ledger'  — the audit register (372, 396).
       An issue that is literally an audit belongs on the
       graph-ruled paper.
     • coverLayout = 'ledger-rule' — the cover IS the audit;
       the layout built for exactly this (372).
     • coverSeal = AUDITED · HELD — the verdict as a stamp.
     • accent = 'olive' — field work, labor, the walked
       perimeter. The locksmith is on foot.
     • spread.type = 'review', spread.stock = 'ledger'.

   Provenance: the desk's own audit of July 3–4 — file
   permissions, git history searched by value, token scopes,
   transport topology, log contents. Grades are the desk's own
   and argued in place. The lowest grade is the one the desk
   earned itself.
   ────────────────────────────────────────────────────────────── */

import type { IssueRecord } from './index'

export const ISSUE_404: IssueRecord = {
  number: '404',
  month: 'JUL',
  year: '2026',
  feature: 'THE LOCKSMITH’S ROUNDS',
  featureJp: '錠前屋の巡回',
  price: '¥0 · BYOK',
  tagline: 'MAGAZINE OF AGENTIC ENGINEERING · エージェント工学の雑誌',

  coverStock: 'ledger',
  coverLayout: 'ledger-rule',

  coverSeal: {
    label: 'AUDITED · HELD',
    date: 'VII·26',
  },

  accent: 'olive',

  headline: {
    prefix: 'The',
    emphasis: 'Locksmith’s',
    suffix: 'Rounds.',
    swash: 'The week the agent moved into client rooms, we graded every surface a secret touches — five locks, three criteria, one loose window, latched on the spot.',
  },

  contents: [
    { n: '001', en: 'The rubric — exposure, blast, provenance', jp: '基準 — 露出・被害・来歴', tag: 'METHOD' },
    { n: '002', en: 'The vault and the record', jp: '金庫と記録', tag: 'SECRETS' },
    { n: '003', en: 'The wire that cannot be knocked on', jp: 'ノックできない電線', tag: 'TRANSPORT' },
    { n: '004', en: 'The keyring, counted', jp: '鍵束を数える', tag: 'SCOPE' },
    { n: '005', en: 'The diary was the loose window', jp: '日記こそ緩んだ窓', tag: 'VERDICT' },
  ],

  spread: {
    type: 'review',
    kicker: 'THE ROUNDS · 巡回',
    title: 'The Locksmith’s Rounds.',
    titleJp: '錠前屋の巡回。',
    deck: 'An agent that talks to clients is an agent whose house gets studied. Before the first client message arrived, the desk walked the property with a clipboard: every surface the new credentials touch, graded against the same three criteria, in public, because an audit filed in a drawer is a rumour. The verdict is at the top because the review form keeps its promises. One grade below is bad, and it is ours.',
    byline: 'BY THE EDITORS · KERNEL.CHAT',
    stock: 'ledger',

    slug: 'TESTED · GRADED · LATCHED · 錠前検査',

    verdict: 'The house holds — the doors were never the risk. The weak point was the diary, because it always is.',

    intro: 'The occasion was ordinary growth: the house agent gained a chat workspace, a set of tokens, and two private rooms where client conversations will live. The method is the magazine’s usual one, applied to itself — name the surfaces, fix the criteria before looking, grade what is actually there, and print the embarrassing row at its true rank. Five surfaces made the list: where the secrets rest, where history might remember them, the wire they travel, the powers the keys confer, and the diary the agent keeps of everything said to it.',

    criteria: [
      { n: '01', label: 'Exposure', labelJp: '露出', weight: '40%', description: 'Who can read this surface today — accounts, processes, or anyone with a browser?' },
      { n: '02', label: 'Blast radius', labelJp: '被害範囲', weight: '35%', description: 'If this surface leaks, what does the thief actually hold, and how far does it reach?' },
      { n: '03', label: 'Provenance', labelJp: '来歴', weight: '25%', description: 'Can we prove where the secret has and has not been — history searched by value, not by pattern?' },
    ],

    standout: {
      label: 'BEST IN CLASS',
      subjectName: 'THE WIRE',
      reason: 'A door that does not exist cannot be forced — the outbound-only socket gives a scanner nothing to find, which beats any lock on any listening port.',
    },

    subjects: [
      {
        rank: 1,
        name: 'THE WIRE',
        nameJp: '電線',
        read: 'Transport topology — an outbound-only socket, no inbound endpoint, no public URL.',
        score: 'A',
        pros: [
          'Zero listening surface: the agent dials out; nothing on the internet can dial in',
          'No webhook URL to secure, spoof, or flood — the signing secret sits unused in the drawer',
          'Platform-side kill switch: revoke the token and the line is dead everywhere at once',
        ],
        cons: [
          'Outbound trust means platform trust — the vendor’s console owns half the truth (see 401)',
        ],
        verdict: 'The best lock is the absent door.',
      },
      {
        rank: 2,
        name: 'THE VAULT',
        nameJp: '金庫',
        read: 'Secrets at rest — five credentials, one file, owner-only permissions, ignored by version control.',
        score: 'A',
        pros: [
          'Single custody point: every token lives in exactly one file, nowhere else on disk',
          'Owner-only file mode — no other account on the machine can read it',
          'Example file ships empty placeholders; the real file is untracked by rule',
        ],
        cons: [
          'One file is one target — the vault pattern concentrates as it protects',
          'No rotation schedule yet; the keys age until an audit remembers them',
        ],
        verdict: 'Concentrated, locked, and honest about it.',
      },
      {
        rank: 3,
        name: 'THE RECORD',
        nameJp: '記録',
        read: 'Version-control history — searched by actual token value, not pattern, across every branch.',
        score: 'A−',
        pros: [
          'Zero hits for real secret values anywhere in history — provable, not assumed',
          'The pattern hits that did exist were the security tooling’s own grep strings — the alarm, not the burglar',
          'The vault file has never been committed on any branch',
        ],
        cons: [
          'Provenance must be re-proven after every incident, forever — history only stays clean while someone keeps checking',
        ],
        verdict: 'Clean, and checked the only way that counts: by value.',
      },
      {
        rank: 4,
        name: 'THE KEYRING',
        nameJp: '鍵束',
        read: 'What the credentials may do — scopes, memberships, and the events the agent is allowed to hear.',
        score: 'B+',
        pros: [
          'The agent hears only its own name and its own mail — no ambient room audio is even subscribed',
          'Membership is the boundary: two private rooms it built, and nothing else',
          'The scope upgrade was itemised, argued line by line, and reinstalled with a paper trail',
        ],
        cons: [
          'The upgrade added building powers the daily work rarely needs — the ring is now heavier than the median day',
          'A second key to a client’s house shares the ring; policy, not mechanism, keeps it holstered (402)',
        ],
        verdict: 'Least privilege, slightly rounded up — watch the ring, not the locks.',
      },
      {
        rank: 5,
        name: 'THE DIARY',
        nameJp: '日記',
        read: 'The agent’s own log — every client sentence it hears, written to a file the rounds found world-readable.',
        score: 'C+',
        pros: [
          'No secrets in the entries themselves — tokens never appear, only conversation and plumbing',
          'Latched the same hour it was found: owner-only mode now, verified',
        ],
        cons: [
          'Shipped world-readable by default — the loose window on an otherwise locked house',
          'No rotation and no redaction yet: the diary only grows, and client talk is its whole diet',
          'Nobody decided to expose it — it inherited the platform default, which is how diaries always leak',
        ],
        verdict: 'The grade the house earned, printed at its true rank. Fixed, watched, not yet forgiven.',
      },
    ],

    outro: 'The pattern in the grades is the oldest one in the trade: the surfaces everyone worries about — the vault, the wire, the record — were built with worry and graded like it. The surface that nearly failed was the one nothing warns you about, because a log file is furniture until the day its contents are a client’s trust. The window is latched, the rounds are now standing procedure before any new credential moves in, and the next review of this house will grade the rotation schedule this one only promised. The locksmith’s rule, for any desk running an agent with keys: walk the property before the guests arrive, and grade your own diary first.',

    signoff: '街のコーダーたちへ — the loose window is never the door; check the diary.',
  },

  credits: {
    editorInChief: 'Isaac Hernandez',
    creativeDirection: 'kernel.chat group',
    artDirection: 'in-house',
    copy: 'kernel.chat editorial',
    japanese: 'kernel.chat editorial',
    production: 'kernel.chat group',
  },
}
