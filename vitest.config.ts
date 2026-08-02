import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
      // `server-only` throws by design when imported outside a React Server
      // Component. Most of lib/ai imports it, so tests need a no-op stand-in —
      // this does not weaken the guard, which is a build-time check in Next.
      "server-only": resolve(__dirname, "test/stubs/server-only.ts"),
    },
  },
  test: {
    // Node, not jsdom: everything under test here is server-side logic. Nothing
    // in this suite touches the network, the database, or the Anthropic API.
    environment: "node",
    include: ["lib/**/*.test.ts", "test/**/*.test.ts"],
  },
});
