"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const test_1 = require("@playwright/test");
const promises_1 = require("node:fs/promises");
const node_path_1 = __importDefault(require("node:path"));
const test_config_1 = require("../config/test-config");
(0, cucumber_1.setDefaultTimeout)(test_config_1.testConfig.timeout);
(0, cucumber_1.Before)(async function () {
    this.browser = await test_1.chromium.launch({ headless: test_config_1.testConfig.headless });
    this.context = await this.browser.newContext({ baseURL: test_config_1.testConfig.baseURL });
    this.context.setDefaultTimeout(test_config_1.testConfig.timeout);
    this.page = await this.context.newPage();
    this.initializePages(this.page);
});
(0, cucumber_1.After)(async function ({ pickle, result }) {
    const failed = result?.status === cucumber_1.Status.FAILED;
    const fileStem = `${safeFileName(pickle.name)}-${Date.now()}`;
    try {
        if (failed && this.page) {
            try {
                const screenshot = await this.page.screenshot({
                    fullPage: true,
                    mask: [this.page.locator('input, textarea')],
                });
                await this.attach(screenshot, 'image/png');
            }
            catch (error) {
                await this.attach(`Screenshot capture failed: ${errorMessage(error)}`, 'text/plain');
            }
        }
        if (this.context && this.diagnosticsTracingStarted) {
            if (failed) {
                try {
                    const traceDirectory = node_path_1.default.resolve('test-results/traces');
                    await (0, promises_1.mkdir)(traceDirectory, { recursive: true });
                    this.diagnosticsTracePath = node_path_1.default.join(traceDirectory, `${fileStem}.zip`);
                    await this.context.tracing.stop({ path: this.diagnosticsTracePath });
                    this.diagnosticsTracingStarted = false;
                }
                catch (error) {
                    await this.attach(`Trace capture failed: ${errorMessage(error)}`, 'text/plain');
                }
            }
            else {
                await this.context.tracing.stop();
                this.diagnosticsTracingStarted = false;
            }
        }
        if (failed && this.diagnosticsTracePath) {
            try {
                await this.attach(await (0, promises_1.readFile)(this.diagnosticsTracePath), 'application/zip');
            }
            catch (error) {
                await this.attach(`Trace attachment failed: ${errorMessage(error)}`, 'text/plain');
            }
        }
        else if (this.diagnosticsTracePath) {
            await (0, promises_1.unlink)(this.diagnosticsTracePath).catch(() => undefined);
        }
    }
    finally {
        await this.context?.close();
        await this.browser?.close();
    }
});
function safeFileName(value) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'scenario';
}
function errorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
//# sourceMappingURL=hooks.js.map