// Peekaboo adapter — public surface.
//
// Wraps the `peekaboo` macOS CLI behind a typed interface so kbot tools and
// agents can drive the screen-capture + GUI-automation features without
// taking a runtime dependency on the binary or the @steipete/peekaboo
// distribution. All execution flows through `runPeekaboo`.
export { runPeekaboo, peekabooAvailable } from './runner.js';
export { see, click, type_, setValue, performAction, agent, } from './commands.js';
//# sourceMappingURL=index.js.map