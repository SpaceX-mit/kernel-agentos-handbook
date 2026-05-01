# kernel.chat skills

A working collection of [agentskills.io](https://agentskills.io)-format skills used by the
kernel.chat group. These are the patterns we reach for when an agent (Claude Code, Codex,
Cursor, kbot itself) needs to know how to drive our tools without re-deriving the workflow
each session.

The collection is intentionally small and composable — closer to Matt Pocock's
[`mattpocock/skills`](https://github.com/mattpocock/skills) than to a registry. Three intents
shape what's here:

1. **Composability over framework.** Each skill is one workflow, ≤100 lines, no opinions
   beyond the entry point.
2. **Anti-refusal patterns where they matter.** kbot is a 670-tool surface and some tool
   names (`create_agent`, `spawn_parallel`, `autonomous`) trip safety heuristics. The
   `engineering/kbot/` skill pre-authorizes legitimate calls.
3. **Magazine + agent + music.** The three things kernel.chat actually does — publishing
   ISSUE N of the magazine, driving kbot, producing music in Ableton — each get a skill.

## Install

Drop a skill into your `.claude/skills/` directory, or symlink the whole tree:

```bash
git clone https://github.com/kernel-chat/skills.git ~/kernel-chat-skills
ln -s ~/kernel-chat-skills/engineering/kbot ~/.claude/skills/kbot
```

Claude Code, Cursor, Goose, and other agentskills.io-compliant clients pick up `SKILL.md`
files automatically once the directory is in their skills path.

## Layout

```
skills/
├── engineering/    Workflow skills for building, deploying, operating
├── creative/       Music production, generative work, design experiments
└── editorial/      Magazine workflow — the kernel.chat publication
```

## Contributing

This is a personal collection like Pocock's, not a public registry. Fork to add your own.
If you find a bug in one of these skills, PRs welcome.

## License

MIT. References: [`mattpocock/skills`](https://github.com/mattpocock/skills) (structure),
[`anthropics/skills`](https://github.com/anthropics/skills) (reference implementations),
[agentskills.io spec](https://agentskills.io/specification) (frontmatter format).
