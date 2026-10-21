"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutPage = void 0;
const test_1 = require("@playwright/test");
class CheckoutPage {
    page;
    constructor(page) {
        this.page = page;
    }
    async enterCustomerDetails(firstName, lastName, postalCode) {
        await this.page.getByPlaceholder('First Name').fill(firstName);
        await this.page.getByPlaceholder('Last Name').fill(lastName);
        await this.page.getByPlaceholder('Zip/Postal Code').fill(postalCode);
    }
    async continue() {
        await this.page.getByRole('button', { name: 'Continue' }).click();
    }
    async expectRequiredFieldError(message) {
        await (0, test_1.expect)(this.page.locator('[data-test="error"]')).toContainText(message);
    }
    async finish() {
        await this.page.getByRole('button', { name: 'Finish' }).click();
    }
    async expectOrderComplete() {
        await (0, test_1.expect)(this.page.getByText('Thank you for your order!', { exact: true })).toBeVisible();
    }
}
exports.CheckoutPage = CheckoutPage;
//# sourceMappingURL=CheckoutPage.js.map