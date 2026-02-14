import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["src/test/**/*.{test,spec}.{ts,tsx}"],
    globals: true,
    setupFiles: ["src/test/setup.ts"]
  }
});
