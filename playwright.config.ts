import { defineConfig, devices } from '@playwright/test';
import { testConfig } from './config/test-config';

export default defineConfig({
  testDir: './tests',
  timeout: testConfig.timeout,
  fullyParallel: testConfig.parallel > 0,
  workers: testConfig.parallel > 0 ? testConfig.parallel : 1,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: testConfig.baseURL,
    browserName: 'chromium',
    headless: testConfig.headless,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
