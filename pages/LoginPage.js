"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPage = void 0;
const test_1 = require("@playwright/test");
class LoginPage {
    page;
    errorMessage;
    constructor(page) {
        this.page = page;
        this.errorMessage = page.locator('[data-test="error"]');
    }
    async open() {
        await this.page.goto('/');
    }
    async login(username, password) {
        await this.page.getByPlaceholder('Username').fill(username);
        await this.page.getByPlaceholder('Password').fill(password);
        await this.page.getByRole('button', { name: 'Login' }).click();
    }
    async expectLoginError(message) {
        await this.expectMessage(message);
    }
    async expectMessage(expectedMessage) {
        await (0, test_1.expect)(this.errorMessage).toBeVisible();
        await (0, test_1.expect)(this.errorMessage).toContainText(expectedMessage);
    }
    async expectSuccessfulLogin() {
        await (0, test_1.expect)(this.page).toHaveURL(/inventory\.html/);
        await (0, test_1.expect)(this.page.getByText('Products', { exact: true })).toBeVisible();
    }
}
exports.LoginPage = LoginPage;
//# sourceMappingURL=LoginPage.js.map