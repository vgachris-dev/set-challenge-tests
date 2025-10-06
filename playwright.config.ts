import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  retries: 1,
  reporter: [["html", { open: "never" }], ["list"]],

  projects: [
    // ---------------------------
    // UI Tests Project
    // ---------------------------
    {
      name: "UI",
      testDir: "./tests/ui",
      use: {
        baseURL: "http://localhost:3000", // React frontend
        trace: "on-first-retry",
        video: "on-first-retry",
        screenshot: "only-on-failure",
        headless: true,
        ...devices["Desktop Chrome"],
      },
    },

    // ---------------------------
    // API Tests Project
    // ---------------------------
    {
      name: "API",
      testDir: "./tests/api",
      use: {
        baseURL: "http://localhost:3001", // Express backend
      },
    },

    // ---------------------------
    // Contract Tests Project
    // ---------------------------
    {
      name: "CONTRACT",
      testDir: "./tests/contract",
      use: {
        baseURL: "http://localhost:3001", // Express backend schema validation
      },
    },
  ],
});
