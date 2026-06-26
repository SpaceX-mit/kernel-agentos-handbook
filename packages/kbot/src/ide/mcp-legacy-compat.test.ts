import { EventEmitter } from 'node:events'
import { describe, it, expect } from 'vitest'
import { SSEServerTransport } from '@modelcontextprotocol/server-legacy/sse'

// MCP v2 migration — step 1 regression pin.
//
// kbot's MCP surface is stdio today (src/ide/mcp-server.ts,
// src/channels/kbot-channel.ts both use StdioServerTransport). The frozen
// `@modelcontextprotocol/server-legacy` shim exists so that IF/WHEN kbot
// exposes an HTTP endpoint, the v1 SSE handshake a legacy client depends on
// keeps working unchanged while we migrate transports to the v2 stateless
// core (StreamableHTTP) on our own schedule.
//
// This test pins that v1 contract: the SSE headers and the `event: endpoint`
// frame carrying the session id are exactly what a v1 SSE client negotiates
// against. If a shim bump breaks them, this fails before it reaches a user.

// Minimal http.ServerResponse stand-in: capture writeHead + every write.
class MockResponse extends EventEmitter {
  statusCode = 0
  headers: Record<string, string> = {}
  chunks: string[] = []
  writeHead(status: number, headers?: Record<string, string>) {
    this.statusCode = status
    if (headers) this.headers = headers
    return this
  }
  write(chunk: string) {
    this.chunks.push(chunk)
    return true
  }
  end() {
    this.emit('close')
    return this
  }
  get body() {
    return this.chunks.join('')
  }
}

describe('MCP legacy SSE shim — v1 transport contract', () => {
  it('opens an SSE stream with the v1 headers', async () => {
    const res = new MockResponse()
    const transport = new SSEServerTransport('/messages', res as never)

    await transport.start()

    expect(res.statusCode).toBe(200)
    expect(res.headers['Content-Type']).toBe('text/event-stream')
    expect(res.headers['Cache-Control']).toContain('no-cache')
    expect(res.headers['Connection']).toBe('keep-alive')
  })

  it('emits an endpoint frame carrying the session id (the v1 handshake)', async () => {
    const res = new MockResponse()
    const transport = new SSEServerTransport('/messages', res as never)

    await transport.start()

    // A v1 client reads this frame to learn where to POST and which session it owns.
    expect(res.body).toContain('event: endpoint')
    expect(res.body).toContain(`sessionId=${transport.sessionId}`)
    expect(res.body).toContain('/messages')
    expect(transport.sessionId).toMatch(/^[0-9a-f-]{36}$/) // randomUUID
  })

  it('frames outbound messages as v1 SSE `message` events', async () => {
    const res = new MockResponse()
    const transport = new SSEServerTransport('/messages', res as never)
    await transport.start()

    const msg = { jsonrpc: '2.0' as const, id: 1, result: { ok: true } }
    await transport.send(msg)

    expect(res.body).toContain('event: message')
    expect(res.body).toContain(JSON.stringify(msg))
  })

  it('refuses a double start (one session per stream)', async () => {
    const res = new MockResponse()
    const transport = new SSEServerTransport('/messages', res as never)
    await transport.start()

    await expect(transport.start()).rejects.toThrow(/already started/i)
  })
})
