import { defineConfig, devices } from '@playwright/test';

// Matrix: docs/browser-matrix.md (next-review 2026-12-04)
// P0 runs on every PR; P1/P2 nightly/weekly. Engines are not brands —
// `webkit` is not Safari unless a BrowserStack real-Safari row runs.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  timeout: 30_000,
  expect: { timeout: 7_000 },
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  // Local dev server — Vite serves the static portfolio; no API server needed for
  // cross-browser layout/functional checks. Override with PLAYWRIGHT_BASE_URL for cloud.
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },

  projects: [
    // ── P0: must pass on every PR (engine coverage) ──
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 15'] } },

    // ── P1: smoke + critical paths (nightly / pre-release) ──
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // One Edge project only — installed Edge via channel. This IS a Chromium engine
    // but exercises real Edge UA/policy/fonts vs bundled Chromium.
    { name: 'edge', use: { channel: 'msedge' } },

    // ── P2: weekly / pre-release ──
    // Tablet form-factor — same WebKit engine, different viewport/touch.
    { name: 'ipad', use: { ...devices['iPad Pro 11'] } },

    // Optional: real-Chrome channel — closer to shipped Chrome (codecs, extensions)
    // than headless-shell. Keep as separate project only if you need chrome-specific
    // behavior; otherwise `chromium` above is sufficient.
    // { name: 'chrome', use: { channel: 'chrome' } },
  ],
});

// ── Cloud example (uncomment when BrowserStack creds exist) ──
// Install: npm i -D browserstack-node-sdk
// Run: npx browserstack-node-sdk playwright test --project=webkit
// BrowserStack config excerpt (pin versions to `npx playwright --version` = 1.62.1):
// use: {
//   connectOptions: {
//     wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify({
//       browser: 'safari', browser_version: 'latest', os: 'OS X', os_version: 'Sonoma',
//       'browserstack.username': process.env.BROWSERSTACK_USERNAME,
//       'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY,
//       'browserstack.playwrightVersion': '1.62.1',
//       'client.playwrightVersion': '1.62.1',
//       build: `cross-browser-${process.env.GITHUB_RUN_NUMBER}`,
//       name: 'voidprotocol-labs'
//     }))}`
//   }
// }

// Usage:
//   npx playwright test --project=chromium --project=webkit --project=mobile-chrome --project=mobile-safari  # P0
//   npx playwright test --project=firefox --project=edge   # P1 nightly
//   npx playwright test                                      # all (P0+P1+P2)
//   npx playwright test --project=webkit                     # single engine
//   npx playwright test --ui | npx playwright test --debug  # re-run/inspect failures
