import { After, AfterStep, Before, BeforeStep, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium } from '@playwright/test';
import { mkdir, readFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import { testConfig } from '../config/test-config';
import { formatStepName, logStepFinished, logStepStarted } from './logger';
import { TestWorld } from './world';

setDefaultTimeout(testConfig.timeout);

BeforeStep(function ({ gherkinDocument, pickleStep }) {
  logStepStarted(formatStepName(gherkinDocument, pickleStep));
});

AfterStep(function ({ gherkinDocument, pickleStep, result }) {
  logStepFinished(formatStepName(gherkinDocument, pickleStep), result);
});

Before(async function (this: TestWorld) {
  this.browser = await chromium.launch({ headless: testConfig.headless });
  this.context = await this.browser.newContext({ baseURL: testConfig.baseURL });
  this.context.setDefaultTimeout(testConfig.timeout);
  this.page = await this.context.newPage();
  this.initializePages(this.page);
});

Before({ tags: '@logged-in' }, async function (this: TestWorld) {
  if (!this.loginPage) throw new Error('LoginPage is not initialized. Ensure the browser setup hook has run.');
  await this.loginPage.open();
  await this.loginPage.login(testConfig.username, testConfig.password);
  await this.startDiagnosticsTracing();
  await this.loginPage.expectSuccessfulLogin();
});

After(async function (this: TestWorld, { pickle, result }) {
  const failed = result?.status === Status.FAILED;
  const fileStem = `${safeFileName(pickle.name)}-${Date.now()}`;

  try {
    if (failed && this.page) {
      try {
        const screenshot = await this.page.screenshot({
          fullPage: true,
          mask: [this.page.locator('input, textarea')],
        });
        await this.attach(screenshot, 'image/png');
      } catch (error) {
        await this.attach(`Screenshot capture failed: ${errorMessage(error)}`, 'text/plain');
      }
    }

    if (this.context && this.diagnosticsTracingStarted) {
      if (failed) {
        try {
          const traceDirectory = path.resolve('test-results/traces');
          await mkdir(traceDirectory, { recursive: true });
          this.diagnosticsTracePath = path.join(traceDirectory, `${fileStem}.zip`);
          await this.context.tracing.stop({ path: this.diagnosticsTracePath });
          this.diagnosticsTracingStarted = false;
        } catch (error) {
          await this.attach(`Trace capture failed: ${errorMessage(error)}`, 'text/plain');
        }
      } else {
        await this.context.tracing.stop();
        this.diagnosticsTracingStarted = false;
      }
    }

    if (failed && this.diagnosticsTracePath) {
      try {
        await this.attach(await readFile(this.diagnosticsTracePath), 'application/zip');
      } catch (error) {
        await this.attach(`Trace attachment failed: ${errorMessage(error)}`, 'text/plain');
      }
    } else if (this.diagnosticsTracePath) {
      await unlink(this.diagnosticsTracePath).catch(() => undefined);
    }
  } finally {
    await this.context?.close();
    await this.browser?.close();
  }
});

function safeFileName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'scenario';
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
