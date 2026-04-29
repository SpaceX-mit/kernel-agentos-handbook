/**
 * Skill graph → synthetic task synthesis.
 *
 * Translates a sampled GraphPath into a Task instance compatible with the
 * harness module's `Task` interface. The acceptance criteria are derived
 * from the path's edges; the instructions describe the workflow in human-
 * readable form.
 */

import type { Task } from '../harness/types.js'
import type { GraphPath, Skill, Scenario } from './types.js'

export interface PathToTaskOptions {
  /** Optional id prefix; defaults to "synth-". */
  prefix?: string
  /** Optional context line prepended to instructions. */
  contextHeader?: string
  /** Extra metadata to merge into Task.meta. */
  meta?: Record<string, unknown>
}

export function pathToTask(path: GraphPath, opts: PathToTaskOptions = {}): Task {
  const prefix = opts.prefix ?? 'synth-'
  const id = `${prefix}${shortHash(path)}`

  const instructions = buildInstructions(path, opts.contextHeader)
  const acceptance = buildAcceptance(path)

  const meta: Record<string, unknown> = {
    source: 'skill-graph',
    pathLength: path.pathLength,
    nodeIds: path.nodes.map((n) => n.id),
    ...opts.meta,
  }

  return { id, instructions, acceptance, meta }
}

function buildInstructions(path: GraphPath, header?: string): string {
  const parts: string[] = []
  if (header) parts.push(header)
  if (path.nodes.length === 0) {
    parts.push('No nodes in path; nothing to do.')
    return parts.join('\n\n')
  }

  parts.push(`Workflow with ${path.nodes.length} step(s):`)
  path.nodes.forEach((node, i) => {
    parts.push(`  ${i + 1}. ${describeNode(node)}`)
  })

  if (path.edges.length > 0) {
    parts.push('')
    parts.push('Transitions:')
    path.edges.forEach((edge) => {
      parts.push(`  - ${edge.from} → ${edge.to} (${edge.kind})`)
    })
  }

  return parts.join('\n')
}

function buildAcceptance(path: GraphPath): string[] {
  if (path.nodes.length === 0) return ['No nodes to verify.']
  const criteria: string[] = []

  for (const node of path.nodes) {
    if (isSkillNode(node)) {
      const tool = node.toolName ? ` (${node.toolName})` : ''
      criteria.push(`Skill exercised: ${node.description}${tool}`)
    } else {
      criteria.push(`Scenario context entered: ${node.description}`)
    }
  }

  for (const edge of path.edges) {
    if (edge.kind === 'requires') {
      criteria.push(`Prerequisite satisfied: ${edge.from} before ${edge.to}`)
    }
  }

  return criteria
}

function describeNode(node: Skill | Scenario): string {
  if (isSkillNode(node)) {
    return node.toolName
      ? `${node.description} (tool: ${node.toolName})`
      : node.description
  }
  return `${node.description}${node.tags?.length ? ` [${node.tags.join(', ')}]` : ''}`
}

function isSkillNode(node: Skill | Scenario): node is Skill {
  return !('tags' in node)
}

function shortHash(path: GraphPath): string {
  // Simple deterministic hash over node ids; not crypto.
  const key = path.nodes.map((n) => n.id).join('|')
  let h = 0
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) >>> 0
  }
  return h.toString(36).slice(0, 8)
}
