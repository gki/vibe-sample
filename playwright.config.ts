import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  /* データベースの競合を避けるため、順次実行を実現する設定 */
  /* fullyParallel: false と workers: 1 の両方を設定することで、テストを完全に順次実行 */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  /* E2Eテスト用の環境変数を設定 */
  /* Playwrightのテスト実行時にDATABASE_URLを設定するため、globalSetupを使用 */

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: [
    {
      command: 'pnpm --filter api dev',
      url: 'http://localhost:3001/health',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
      /* E2Eテストはテスト専用データベースを使用 */
      env: {
        DATABASE_URL: process.env.DATABASE_URL || 'file:./prisma/test.db',
      },
    },
    {
      command: 'pnpm --filter web dev',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
  ],
});

