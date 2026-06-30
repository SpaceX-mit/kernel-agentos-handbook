import { defineConfig } from "vitest/config";

// Self-contained config so this Node-only extension does NOT inherit the
// root web app's Vitest setup (jsdom environment + React setupTests.ts).
// The generators are pure functions — a plain node environment is all they need.
export default defineConfig({
  test: {
    root: __dirname,
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
