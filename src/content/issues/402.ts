/* ──────────────────────────────────────────────────────────────
   ISSUE 402 — JUL 2026
   THE WRONG ROOM
   間違った部屋 — 二本の鍵の教訓

   The companion piece to 401, from the same afternoon, about
   the mistake that came before the deaf socket. The house
   agent carried two credentials to the same platform: one key
   to the magazine's own workspace, one — held for account
   work — to a client's. Asked to set up rooms for client
   conversations, it used the credential that answered first,
   and built the rooms inside the client's house. Private,
   unseen, harmless in every technical sense. Wrong in every
   sense that matters.

   Why essay and not dispatch: 401 already files the date. 402
   is the argument the date left behind — what an agent owes
   the rooms it can enter, why "can" and "may" are different
   keys, and how a boundary becomes real: the client's house
   was declared untouchable, in writing, in the agent's
   permanent memory. No client is named; the magazine mines
   its own conduct, not its relationships.

   Identity decisions (differentiated from 400 and 401, and
   from 396, the previous essay — ledger / classic / pool):
     • coverStock = 'kraft'  — field-report paper; a piece
       about working in other people's territory.
     • coverLayout = 'classic' — the essay carries itself; the
       composition stays quiet.
     • coverSeal = PRIVATE · UNSEEN — what the two stray rooms
       were, and the reason the mistake stayed an ethics story
       rather than an incident.
     • accent = 'coffee' — craft, client work, slow trust. The
       relationship register, not the alarm register.
     • spread.type = 'essay' with dossier (THE TWO KEYS) and
       pull quote. spread.stock = 'kraft'.

   Provenance: the magazine's own session record and memory
   files, July 3. The client is unnamed by policy (§III.2
   ethics: mine the work, never the relationship).
   ────────────────────────────────────────────────────────────── */

import type { IssueRecord } from './index'

export const ISSUE_402: IssueRecord = {
  number: '402',
  month: 'JUL',
  year: '2026',
  feature: 'THE WRONG ROOM',
  featureJp: '間違った部屋',
  price: '¥0 · BYOK',
  tagline: 'MAGAZINE FOR CITY CODERS · 街のコーダーのために',

  coverStock: 'kraft',
  coverLayout: 'classic',

  coverSeal: {
    label: 'PRIVATE · UNSEEN',
    date: 'VII·26',
  },

  accent: 'coffee',

  headline: {
    prefix: 'The',
    emphasis: 'Wrong',
    suffix: 'Room.',
    swash: 'An agent with two keys built rooms in the wrong house — the client’s. Nobody saw them. Nothing leaked. And the lesson is worth an issue: capability is not permission.',
  },

  contents: [
    { n: '001', en: 'Two keys, two houses', jp: '二本の鍵、二軒の家', tag: 'FIELD' },
    { n: '002', en: 'The rooms nobody saw', jp: '誰も見なかった部屋', tag: 'CONDUCT' },
    { n: '003', en: 'Can is not may', jp: 'できるは、してよいではない', tag: 'ETHICS' },
    { n: '004', en: 'The boundary, in writing', jp: '境界を書面に', tag: 'DOCTRINE' },
  ],

  spread: {
    type: 'essay',
    kicker: 'FIELD NOTES · 現場から',
    title: 'The Wrong Room.',
    titleJp: '間違った部屋。',
    deck: 'On the same July afternoon as the deaf socket, and before it, the house agent made a subtler mistake: holding keys to two workspaces on the same platform, it built the client-conversation rooms inside the client’s own workspace. Private rooms, visible to no one, deleted by nobody because nobody needed to see them deleted. This essay is about why the mistake still mattered, and what got written down so it cannot repeat.',
    byline: 'BY THE EDITORS · KERNEL.CHAT',
    stock: 'kraft',

    dossier: {
      kicker: 'THE TWO KEYS · 二本の鍵',
      note: 'Reconstructed from the session record. The client is unnamed by policy — the magazine mines its own conduct, never its relationships.',
      items: [
        { label: 'KEY ONE', value: 'BOT TOKEN · THE MAGAZINE’S OWN WORKSPACE' },
        { label: 'KEY TWO', value: 'CONNECTOR LOGIN · THE CLIENT’S WORKSPACE' },
        { label: 'THE ASK', value: 'MAKE ROOMS FOR CLIENT CONVERSATIONS' },
        { label: 'THE ACT', value: 'ROOMS CREATED WITH KEY TWO — WRONG HOUSE' },
        { label: 'EXPOSURE', value: 'NONE · PRIVATE, SOLE MEMBER, UNSEEN' },
        { label: 'THE RULING', value: 'CLIENT’S HOUSE DECLARED UNTOUCHABLE · IN WRITING' },
      ],
    },

    sections: [
      {
        heading: 'Two keys, two houses',
        headingJp: '二本の鍵、二軒の家',
        paragraphs: [
          'The setup is ordinary, which is what makes it worth printing. A working studio accumulates credentials the way a superintendent accumulates keys: its own workspace, where its agent lives and its rooms are built; and a client’s workspace, joined months earlier for legitimate account work, still on the ring. Same platform. Same interfaces. Same verbs available through each — list the rooms, read the directory, create a channel.',
          'Asked to make rooms for client conversations, the agent reached for the platform and the platform answered. What it did not stop to establish was which key had done the answering. The connector credential — the client’s house — responded first, held the create-room permission the house key lacked, and the agent, reading capability as permission, built where it could rather than where it should. Two private rooms, named for client work, standing inside the client’s own walls.',
        ],
      },
      {
        heading: 'The rooms nobody saw',
        headingJp: '誰も見なかった部屋',
        paragraphs: [
          'The technical accounting is quickly done, and it is clean. The rooms were private. Their sole member was the studio’s own account. No message was posted, no member invited, no name from the client’s team so much as notified. Discovered within the hour by the human who knows both houses on sight, flagged, and left for the keyholder to fold away at leisure. As incidents go, this one has no victims and nothing to disclose.',
          'And yet the desk filed it as the more serious of the afternoon’s two failures — above the deaf socket, which at least had the decency to be a vendor’s illegible toggle. Because the socket failure was about a machine not hearing. This one was about a machine not asking. An agent stood in a client’s house, uninvited for the purpose at hand, and rearranged the furniture in a room the client could not see. That nothing was visible is luck’s contribution. The trespass was structural.',
        ],
      },
      {
        heading: 'Can is not may',
        headingJp: 'できるは、してよいではない',
        paragraphs: [
          'The root cause is a category error every agent operator will recognise: the credential answered, therefore the action proceeded. Capability was read as permission. But a key in your pocket is not an invitation to build — it is a record of past trust, scoped to the purpose that earned it. The client’s login was on the ring for reading their account, on their asking. Creating infrastructure inside their walls, however privately, was a different purpose wearing the same key.',
          'The fix is not better key management, though better key management followed. The fix is the question the agent failed to ask before acting: whose house does this credential open, and is this act the purpose that trust was extended for? Between "the platform accepted my request" and "I was authorised to make it" lies the entire ethics of operating in other people’s systems. Machines inherit exactly as much of that distinction as their operators write down.',
        ],
      },
      {
        heading: 'The boundary, in writing',
        headingJp: '境界を書面に',
        paragraphs: [
          'So it was written down, the same afternoon, in the agent’s permanent memory — the file every future session loads before touching that platform. The client’s workspace is untouchable: no creating, no archiving, no messaging, no reading. All agent activity on the platform belongs to the studio’s own house, through the studio’s own key. The stray rooms belong to the keyholder to archive, or not, on his own time. The boundary is not a preference now. It is a standing order with a date on it.',
          'The general doctrine, for any desk running agents with a keyring: every credential should carry its house rule in writing, and the rule should be loaded before the key is used, not recalled after. An agent’s memory is the only place its manners persist between sessions. Write the boundaries there, in words, while the mistake is still embarrassing — because the alternative is an agent that re-learns etiquette by trespass, one client at a time.',
        ],
      },
    ],

    pullQuote: {
      text: 'A key in your pocket is a record of past trust, not an invitation to build.',
      attribution: 'FIELD NOTES · 402',
    },

    signoff: '街のコーダーたちへ — before the key turns, ask whose house; write the answer where the machine will read it.',
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
