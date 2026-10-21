"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestWorld = void 0;
const cucumber_1 = require("@cucumber/cucumber");
const promises_1 = require("node:fs/promises");
const node_path_1 = __importDefault(require("node:path"));
const LoginPage_1 = require("../pages/LoginPage");
const InventoryPage_1 = require("../pages/InventoryPage");
const CartPage_1 = require("../pages/CartPage");
const CheckoutPage_1 = require("../pages/CheckoutPage");
class TestWorld extends cucumber_1.World {
    browser;
    context;
    page;
    loginPage;
    inventoryPage;
    cartPage;
    checkoutPage;
    diagnosticsTracingStarted = false;
    diagnosticsTracePath;
    constructor(options) {
        super(options);
    }
    initializePages(page) {
        this.page = page;
        this.loginPage = new LoginPage_1.LoginPage(page);
        this.inventoryPage = new InventoryPage_1.InventoryPage(page);
        this.cartPage = new CartPage_1.CartPage(page);
        this.checkoutPage = new CheckoutPage_1.CheckoutPage(page);
    }
    async startDiagnosticsTracing() {
        if (!this.context || this.diagnosticsTracingStarted)
            return;
        await this.context.tracing.start({ screenshots: false, snapshots: false, sources: false });
        this.diagnosticsTracingStarted = true;
    }
    async stopDiagnosticsTracingBeforeSensitiveInput() {
        if (!this.context || !this.diagnosticsTracingStarted)
            return;
        const traceDirectory = node_path_1.default.resolve('test-results/traces');
        await (0, promises_1.mkdir)(traceDirectory, { recursive: true });
        this.diagnosticsTracePath = node_path_1.default.join(traceDirectory, `scenario-${Date.now()}.zip`);
        await this.context.tracing.stop({ path: this.diagnosticsTracePath });
        this.diagnosticsTracingStarted = false;
    }
}
exports.TestWorld = TestWorld;
(0, cucumber_1.setWorldConstructor)(TestWorld);
//# sourceMappingURL=world.js.map