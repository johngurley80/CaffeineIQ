import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
    },
  },
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text"],
      include: ["lib/caffeine.ts", "lib/sleep.ts", "lib/hydration.ts", "lib/time.ts", "lib/insights.ts"],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 80,
        statements: 100,
      },
    },
  },
});
