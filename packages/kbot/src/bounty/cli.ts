// kbot Bounty Hunter CLI.
//
//   kbot-bounty poll              discover + rank live bounties; mark seen
//   kbot-bounty poll --all        show every bounty, not just fresh ones
//   kbot-bounty attempt           solve the top attemptable bounty (prepares a
//                                 branch + PR body; does NOT push)
//   kbot-bounty attempt --submit  ...and actually open the PR (outward-facing)
//   kbot-bounty watch [seconds]   loop poll on an interval (default 300s)
//
// Run live:  npx tsx src/bounty/cli.ts poll
// Or after build:  node dist/bounty/cli.js poll

import { pollOnce, DEFAULT_CONFIG, type RankedBounty, type BountyHunterConfig } from './hunter.js'

function fmtAmount(n: number | null): string {
  return n == null ? '   $?' : `$${n}`.padStart(5)
}

function printBounty(b: RankedBounty, i: number): void {
  const flag = b.worthAttempting ? '✓' : '·'
  const contention =
    b.contention === 0 ? 'UNCONTESTED' : `${b.contention} competing PR${b.contention === 1 ? '' : 's'}`
  console.log(
    `  ${flag} ${String(i + 1).padStart(2)}. ${fmtAmount(b.amountUsd)}  ` +
      `[${contention}]  ${b.repo}#${b.issueNumber}`,
  )
  console.log(`        ${b.title}`)
  console.log(`        ${b.url}`)
}

function cmdPoll(showAll: boolean, config: BountyHunterConfig): void {
  console.log(`\n  Polling ${config.orgs.join(', ')} for bounties (max contention ${config.maxContention})...\n`)
  const { all, fresh, attemptable } = pollOnce(config)
  const list = showAll ? all : fresh

  if (all.length === 0) {
    console.log('  No live bounties found across the configured orgs.')
    return
  }

  console.log(`  ${all.length} live bounties · ${fresh.length} new since last poll · ${attemptable.length} worth attempting\n`)
  if (list.length === 0) {
    console.log('  No new bounties since last poll. (Use --all to see everything.)')
  } else {
    console.log(showAll ? '  ALL LIVE BOUNTIES (ranked by expected value):' : '  NEW BOUNTIES (ranked by expected value):')
    list.forEach(printBounty)
  }

  if (attemptable.length > 0) {
    console.log(`\n  → ${attemptable.length} attemptable now. Run: kbot-bounty attempt`)
  } else {
    console.log(`\n  → Nothing uncontested enough to attempt. Holding compute. ✓`)
  }
  console.log()
}

async function cmdAttempt(submit: boolean, targetRef: string | undefined, config: BountyHunterConfig): Promise<void> {
  // Pick the best worth-attempting bounty across ALL live bounties — not just
  // freshly-discovered ones (freshness gates the poll notification, not which
  // bounty is most winnable right now).
  const { all } = pollOnce(config)
  const attemptable = all.filter((b) => b.worthAttempting)
  if (attemptable.length === 0) {
    console.log('\n  No attemptable bounty right now (all too contested or below minimum).\n')
    return
  }
  // Optional explicit target: --issue owner/repo#N picks that bounty instead of
  // the top-EV one. Lets us aim at the cleanest issue, not just the priciest.
  let target = attemptable[0]
  if (targetRef) {
    const m = targetRef.match(/^([\w.-]+\/[\w.-]+)#(\d+)$/)
    const found = m && all.find((b) => b.repo === m[1] && b.issueNumber === Number(m[2]))
    if (!found) {
      console.log(`\n  --issue ${targetRef} not found among live bounties. Available worth-attempting:`)
      attemptable.slice(0, 10).forEach((b) => console.log(`    ${b.repo}#${b.issueNumber}  ${fmtAmount(b.amountUsd)}`))
      console.log()
      return
    }
    target = found
  }
  console.log(`\n  Top target: ${target.repo}#${target.issueNumber} (${fmtAmount(target.amountUsd)}, ${target.contention} competing)`)
  console.log(`  ${target.title}\n  ${target.url}\n`)

  // Issue-TARGETED solve: read the specific issue + acceptance criteria, drive
  // kbot's agent against it, stage a branch. PR push stays behind --submit
  // (outward-facing, posts under the user's GitHub identity). Lazy import keeps
  // `poll` fast and free of the agent's heavy deps.
  const { solveBounty } = await import('./solver.js')
  console.log(`  Solving issue #${target.issueNumber} with kbot's agent...\n`)
  const result = await solveBounty(target, { submit })

  if (result.noChanges) {
    console.log('\n  ⚠ Agent produced no changes. Issue may be too ambiguous or out of kbot\'s depth.')
    console.log(`  Inspect the clone: ${result.repoDir}\n`)
    return
  }

  console.log(`\n  Changed ${result.changedFiles.length} file(s) on branch ${result.branch}:`)
  console.log('  ' + result.diffStat.split('\n').join('\n  '))
  if (result.submitted) {
    console.log(`\n  ✓ PR opened: ${result.prUrl}`)
  } else {
    console.log(`\n  Prepared on branch ${result.branch} in ${result.repoDir} — NOT submitted.`)
    console.log('  Re-run with --submit to fork, push, and open the PR.')
    console.log('\n  ── Prepared PR body ──')
    console.log('  ' + result.prBody.split('\n').join('\n  '))
  }
  console.log()
}

async function main(): Promise<void> {
  const [cmd, ...rest] = process.argv.slice(2)
  const config = DEFAULT_CONFIG
  switch (cmd) {
    case 'poll':
      cmdPoll(rest.includes('--all'), config)
      break
    case 'attempt': {
      const issueIdx = rest.indexOf('--issue')
      const targetRef = issueIdx >= 0 ? rest[issueIdx + 1] : undefined
      await cmdAttempt(rest.includes('--submit'), targetRef, config)
      break
    }
    case 'watch': {
      const secs = Number(rest.find((r) => /^\d+$/.test(r))) || 300
      console.log(`  Watching every ${secs}s. Ctrl-C to stop.`)
      // eslint-disable-next-line no-constant-condition
      while (true) {
        cmdPoll(false, config)
        await new Promise((r) => setTimeout(r, secs * 1000))
      }
    }
    default:
      console.log('Usage: kbot-bounty <poll|attempt|watch> [--all] [--issue owner/repo#N] [--submit] [seconds]')
      process.exitCode = cmd ? 1 : 0
  }
}

main().catch((err) => {
  console.error('bounty-hunter error:', err?.message || err)
  process.exitCode = 1
})
