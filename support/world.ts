import { World, setWorldConstructor, type IWorldOptions } from '@cucumber/cucumber';
import type { Browser, BrowserContext, Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

export class TestWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  loginPage?: LoginPage;
  inventoryPage?: InventoryPage;
  cartPage?: CartPage;
  checkoutPage?: CheckoutPage;
  diagnosticsTracingStarted = false;
  diagnosticsTracePath?: string;

  constructor(options: IWorldOptions) {
    super(options);
  }

  initializePages(page: Page): void {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.inventoryPage = new InventoryPage(page);
    this.cartPage = new CartPage(page);
    this.checkoutPage = new CheckoutPage(page);
  }

  async startDiagnosticsTracing(): Promise<void> {
    if (!this.context || this.diagnosticsTracingStarted) return;
    await this.context.tracing.start({ screenshots: false, snapshots: false, sources: false });
    this.diagnosticsTracingStarted = true;
  }

  async stopDiagnosticsTracingBeforeSensitiveInput(): Promise<void> {
    if (!this.context || !this.diagnosticsTracingStarted) return;
    const traceDirectory = path.resolve('test-results/traces');
    await mkdir(traceDirectory, { recursive: true });
    this.diagnosticsTracePath = path.join(traceDirectory, `scenario-${Date.now()}.zip`);
    await this.context.tracing.stop({ path: this.diagnosticsTracePath });
    this.diagnosticsTracingStarted = false;
  }
}

setWorldConstructor(TestWorld);
