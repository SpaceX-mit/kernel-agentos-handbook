/**
 * Harness Meta-Evolution — outer loop (Algorithm 2 from Sylph).
 *
 * The inner loop optimizes one harness against one task. The outer loop
 * runs the inner loop across a portfolio of tasks, aggregating per-task
 * results and selecting the best protocol overall. Currently the
 * "selection" step is averaging — when a real MetaEvolutionAgent ships,
 * it'll consume the perTask EvolutionResult[] and propose protocol
 * mutations.
 *
 * Pure orchestration. Tasks are run sequentially to keep the trace
 * ordering deterministic; parallelism is a future concern.
 */

import type {
  EvolutionProtocol,
  EvolutionResult,
  MetaResult,
  Task,
} from './types.js'
import { runEvolutionLoop, type RunOptions } from './evolution-loop.js'

export interface MetaOptions extends RunOptions {
  /** Called after each task's inner loop completes. */
  onTaskComplete?: (result: EvolutionResult) => void | Promise<void>
  /**
   * When `true`, abort the outer loop on the first task whose best score
   * is below `failBelow`. Default false — always run the full portfolio.
   */
  abortOnFailure?: boolean
  failBelow?: number
}

/**
 * Run the inner Evolution Loop across a portfolio of tasks, returning
 * the best protocol (currently always the input protocol — there is no
 * MetaEvolutionAgent yet) plus per-task results and the aggregate score.
 */
export async function runMetaEvolution(
  protocol: EvolutionProtocol,
  tasks: Task[],
  options: MetaOptions = {},
): Promise<MetaResult> {
  if (tasks.length === 0) {
    return {
      bestProtocol: protocol,
      bestMetaScore: 0,
      perTask: [],
    }
  }

  const perTask: EvolutionResult[] = []
  let scoreSum = 0

  for (const task of tasks) {
    const result = await runEvolutionLoop(protocol, task, options)
    perTask.push(result)
    scoreSum += result.bestScore

    if (options.onTaskComplete) {
      await options.onTaskComplete(result)
    }

    if (
      options.abortOnFailure &&
      options.failBelow !== undefined &&
      result.bestScore < options.failBelow
    ) {
      break
    }
  }

  // Aggregate score: mean of per-task best scores. Cheap, defensible, and
  // matches the "average across tasks" framing in the Sylph outer loop.
  const meanScore = perTask.length > 0 ? scoreSum / perTask.length : 0

  return {
    bestProtocol: protocol,
    bestMetaScore: meanScore,
    perTask,
  }
}
