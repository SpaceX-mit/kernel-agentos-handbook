/**
 * Skill graph — runtime ops.
 *
 * Pure functions over the SkillGraph data structure. Mutators return new
 * instances rather than mutating in place; the underlying Maps and arrays
 * are copied. Random walks use a seeded LCG for deterministic tests.
 */

import type { Edge, GraphPath, Scenario, Skill, SkillGraph } from './types.js'

// ─────────────────────────────────────────────────────────────────────────────
// Seeded RNG (linear congruential generator — small, deterministic)
// ─────────────────────────────────────────────────────────────────────────────

interface Rng {
  next(): number // [0, 1)
}

function lcg(seed: number): Rng {
  let state = seed >>> 0
  return {
    next() {
      state = (state * 1664525 + 1013904223) >>> 0
      return state / 0xffffffff
    },
  }
}

function defaultRng(): Rng {
  return { next: () => Math.random() }
}

// ─────────────────────────────────────────────────────────────────────────────
// Construction
// ─────────────────────────────────────────────────────────────────────────────

export function buildGraph(): SkillGraph {
  return {
    skills: new Map(),
    scenarios: new Map(),
    edges: [],
  }
}

export function addSkill(g: SkillGraph, skill: Skill): SkillGraph {
  const next = new Map(g.skills)
  next.set(skill.id, skill)
  return { ...g, skills: next }
}

export function addScenario(g: SkillGraph, scenario: Scenario): SkillGraph {
  const next = new Map(g.scenarios)
  next.set(scenario.id, scenario)
  return { ...g, scenarios: next }
}

export function addEdge(g: SkillGraph, edge: Edge): SkillGraph {
  return { ...g, edges: [...g.edges, edge] }
}

// ─────────────────────────────────────────────────────────────────────────────
// Lookup helpers
// ─────────────────────────────────────────────────────────────────────────────

function getNode(g: SkillGraph, id: string): Skill | Scenario | undefined {
  return g.skills.get(id) ?? g.scenarios.get(id)
}

function outgoing(g: SkillGraph, fromId: string): Edge[] {
  return g.edges.filter((e) => e.from === fromId)
}

// ─────────────────────────────────────────────────────────────────────────────
// Path sampling — weighted random walk
// ─────────────────────────────────────────────────────────────────────────────

export interface SampleOptions {
  start?: string
  maxLength?: number
  seed?: number
}

export function samplePath(g: SkillGraph, opts: SampleOptions = {}): GraphPath {
  const rng = opts.seed !== undefined ? lcg(opts.seed) : defaultRng()
  const maxLength = opts.maxLength ?? 6

  const startId = opts.start ?? pickStartNode(g, rng)
  if (!startId) return { nodes: [], edges: [], pathLength: 0 }

  const startNode = getNode(g, startId)
  if (!startNode) return { nodes: [], edges: [], pathLength: 0 }

  const nodes: Array<Skill | Scenario> = [startNode]
  const edges: Edge[] = []
  const visited = new Set<string>([startId])

  let currentId = startId
  while (nodes.length < maxLength) {
    const candidates = outgoing(g, currentId).filter((e) => !visited.has(e.to))
    if (candidates.length === 0) break

    const edge = weightedPick(candidates, rng)
    const nextNode = getNode(g, edge.to)
    if (!nextNode) break

    edges.push(edge)
    nodes.push(nextNode)
    visited.add(edge.to)
    currentId = edge.to
  }

  return { nodes, edges, pathLength: nodes.length }
}

function pickStartNode(g: SkillGraph, rng: Rng): string | undefined {
  const all = [...g.skills.keys(), ...g.scenarios.keys()]
  if (all.length === 0) return undefined
  return all[Math.floor(rng.next() * all.length)]
}

function weightedPick(edges: Edge[], rng: Rng): Edge {
  const total = edges.reduce((s, e) => s + (e.weight ?? 1), 0)
  let pick = rng.next() * total
  for (const edge of edges) {
    pick -= edge.weight ?? 1
    if (pick <= 0) return edge
  }
  return edges[edges.length - 1]
}

// ─────────────────────────────────────────────────────────────────────────────
// Path finding — DFS with depth limit
// ─────────────────────────────────────────────────────────────────────────────

export function findPaths(
  g: SkillGraph,
  fromId: string,
  toId: string,
  maxDepth = 5,
): GraphPath[] {
  const startNode = getNode(g, fromId)
  if (!startNode) return []

  const results: GraphPath[] = []
  const stack: Array<{ id: string; nodes: Array<Skill | Scenario>; edges: Edge[] }> = [
    { id: fromId, nodes: [startNode], edges: [] },
  ]

  while (stack.length > 0) {
    const { id, nodes, edges } = stack.pop()!
    if (id === toId && nodes.length > 1) {
      results.push({ nodes, edges, pathLength: nodes.length })
      continue
    }
    if (nodes.length >= maxDepth) continue

    const visited = new Set(nodes.map((n) => n.id))
    for (const edge of outgoing(g, id)) {
      if (visited.has(edge.to)) continue
      const next = getNode(g, edge.to)
      if (!next) continue
      stack.push({
        id: edge.to,
        nodes: [...nodes, next],
        edges: [...edges, edge],
      })
    }
  }

  return results
}

// ─────────────────────────────────────────────────────────────────────────────
// Distribution stats — Monte Carlo over samplePath
// ─────────────────────────────────────────────────────────────────────────────

export interface PathLengthStats {
  min: number
  max: number
  avg: number
  p50: number
  p95: number
  samples: number
}

export function pathLengthDistribution(
  g: SkillGraph,
  samples = 100,
  opts: { seed?: number } = {},
): PathLengthStats {
  if (samples <= 0) {
    return { min: 0, max: 0, avg: 0, p50: 0, p95: 0, samples: 0 }
  }
  const baseSeed = opts.seed ?? Date.now()
  const lengths: number[] = []
  for (let i = 0; i < samples; i++) {
    const path = samplePath(g, { seed: baseSeed + i })
    lengths.push(path.pathLength)
  }
  lengths.sort((a, b) => a - b)
  const min = lengths[0] ?? 0
  const max = lengths[lengths.length - 1] ?? 0
  const sum = lengths.reduce((s, n) => s + n, 0)
  const avg = sum / lengths.length
  const p50 = lengths[Math.floor(lengths.length * 0.5)] ?? 0
  const p95Idx = Math.min(lengths.length - 1, Math.floor(lengths.length * 0.95))
  const p95 = lengths[p95Idx] ?? 0
  return { min, max, avg, p50, p95, samples }
}
