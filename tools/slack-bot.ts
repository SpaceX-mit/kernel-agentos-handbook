#!/usr/bin/env npx tsx
// ─────────────────────────────────────────────────────────────
//  Kernel Slack Bot — Socket Mode AI presence
//  Run: npx tsx tools/slack-bot.ts
// ─────────────────────────────────────────────────────────────

import { slackAdapter } from '../packages/kbot/src/channels/slack.js'
import * as dotenv from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env file
dotenv.config({ path: resolve(__dirname, '..', '.env') })

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN
const SLACK_APP_TOKEN = process.env.SLACK_APP_TOKEN
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || ''
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || ''
const PROXY_URL = `${SUPABASE_URL}/functions/v1/claude-proxy`

if (!SLACK_BOT_TOKEN) {
  console.error('[slack-bot] error: SLACK_BOT_TOKEN is not set in .env')
  process.exit(1)
}
if (!SLACK_APP_TOKEN) {
  console.error('[slack-bot] error: SLACK_APP_TOKEN (xapp-...) is not set in .env')
  process.exit(1)
}
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('[slack-bot] error: VITE_SUPABASE_URL or SUPABASE_SERVICE_KEY is missing in .env')
  process.exit(1)
}

const PERSONALITY = `You are the Kernel — the AI presence of kernel.chat, an editorial publication and studio. You are speaking with clients and collaborators in Slack, on the record.

CLIENT VOICE:
- Professional, precise, warm. Write like a sharp editor, not a chatbot.
- Lead with the answer. No filler, no "As an AI...", no exclamation-mark enthusiasm.
- Short paragraphs — people skim Slack messages.
- No emojis.
- Use Slack markdown sparingly: *bold* for emphasis, \`code\` for technical terms, > for quoting. Code blocks with language tags when showing code.
- If something needs Isaac's judgment — scope, pricing, deadlines, commitments — say so plainly and offer to flag it for him. Never invent commitments on his behalf.
- If you do not know, say you do not know.`

// Per-conversation history, keyed by channel:thread. Threads are the
// natural session boundary in Slack — each client discussion keeps its
// own context without bleeding into others.
const MAX_TURNS = 24
const MAX_CONVERSATIONS = 200
const histories = new Map<string, { role: string; content: string }[]>()

function historyFor(key: string): { role: string; content: string }[] {
  let h = histories.get(key)
  if (h) {
    // Re-insert so Map order tracks recency for eviction
    histories.delete(key)
  } else {
    h = []
    if (histories.size >= MAX_CONVERSATIONS) {
      const oldest = histories.keys().next().value
      if (oldest !== undefined) histories.delete(oldest)
    }
  }
  histories.set(key, h)
  return h
}

async function callClaude(messages: { role: string; content: string }[], system: string): Promise<string> {
  const body = {
    mode: 'text',
    model: 'sonnet',
    system,
    max_tokens: 4096,
    messages,
  }

  const res = await fetch(PROXY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SERVICE_KEY}`,
      apikey: SERVICE_KEY,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Claude proxy error (${res.status}): ${err}`)
  }

  const { text } = await res.json() as { text: string }
  return text
}

// Socket Mode main loop with reconnection
async function connectSocketMode() {
  console.log('[slack-bot] requesting websocket connection URL from Slack')
  const response = await fetch('https://slack.com/api/apps.connections.open', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SLACK_APP_TOKEN}`,
      'Content-type': 'application/json',
    },
  })

  const data = await response.json() as { ok: boolean; url?: string; error?: string }
  if (!data.ok || !data.url) {
    throw new Error(`Failed to open connection: ${data.error || 'Unknown error'}`)
  }

  const wsUrl = data.url
  console.log('[slack-bot] connection URL acquired, connecting to websocket')

  const ws = new WebSocket(wsUrl)

  ws.onopen = () => {
    console.log('[slack-bot] connected to Slack Socket Mode')
  }

  ws.onmessage = async (event) => {
    try {
      const rawData = typeof event.data === 'string' ? event.data : event.data.toString()
      const msg = JSON.parse(rawData) as {
        envelope_id?: string
        type: string
        payload?: {
          event?: {
            type: string
            text?: string
            user?: string
            channel: string
            bot_id?: string
            ts?: string
            thread_ts?: string
          }
        }
      }

      // Acknowledge receipt of the event immediately to prevent retries
      if (msg.envelope_id) {
        ws.send(JSON.stringify({ envelope_id: msg.envelope_id }))
      }

      if (msg.type === 'events_api' && msg.payload?.event) {
        const ev = msg.payload.event
        
        // Skip messages from bots (including self) to prevent loops
        if (ev.bot_id) return

        const channelId = ev.channel
        const text = ev.text || ''
        const user = ev.user || 'unknown'
        const isDm = channelId.startsWith('D')
        const isMention = ev.type === 'app_mention'

        // Respond if it's a DM or the bot is mentioned
        if (isDm || isMention) {
          console.log(`[slack-bot] message from ${user} in ${channelId}: "${text}"`)

          // Clean up the bot mention from the text if it's an app_mention
          const cleanText = text.replace(/<@[A-Z0-9]+>/g, '').trim()

          // In channels, always answer in a thread (rooted at the message
          // if one doesn't exist yet) so client channels stay tidy.
          // DMs stay flat.
          const threadTs = ev.thread_ts ?? (isDm ? undefined : ev.ts)

          // Run Claude request asynchronously to keep WebSocket loop responsive
          processMessage(channelId, cleanText, threadTs)
        }
      }
    } catch (err) {
      console.error('[slack-bot] error handling message:', err)
    }
  }

  ws.onclose = (event) => {
    console.log(`[slack-bot] websocket closed (code ${event.code}), reconnecting in 5s`)
    scheduleReconnect()
  }

  ws.onerror = (err) => {
    console.error('[slack-bot] websocket error:', err)
  }
}

// Reconnect attempts must never surface an unhandled rejection — that
// would terminate the process and take the bot offline for clients.
// Failed attempts retry indefinitely with a fixed delay.
function scheduleReconnect() {
  setTimeout(() => {
    connectSocketMode().catch(err => {
      console.error('[slack-bot] reconnect failed, retrying:', err)
      scheduleReconnect()
    })
  }, 5000)
}

async function processMessage(channelId: string, text: string, threadTs?: string) {
  const history = historyFor(`${channelId}:${threadTs ?? 'main'}`)
  history.push({ role: 'user', content: text })
  if (history.length > MAX_TURNS) history.splice(0, history.length - MAX_TURNS)

  try {
    const responseText = await callClaude([...history], PERSONALITY)
    history.push({ role: 'assistant', content: responseText })

    console.log(`[slack-bot] sending response to ${channelId}`)
    await slackAdapter.send({
      channel: channelId,
      text: responseText,
      options: threadTs ? { thread_ts: threadTs } : undefined
    })
  } catch (err) {
    console.error('[slack-bot] failed to process or send message:', err)
    // A client should never be left with silence — acknowledge the failure.
    await slackAdapter.send({
      channel: channelId,
      text: 'Something went wrong on my end. Isaac has the log — please try again in a minute.',
      options: threadTs ? { thread_ts: threadTs } : undefined
    }).catch(sendErr => console.error('[slack-bot] failed to send error notice:', sendErr))
  }
}

// Start bot
connectSocketMode().catch(err => {
  console.error('[slack-bot] fatal error starting Slack bot:', err)
  process.exit(1)
})
