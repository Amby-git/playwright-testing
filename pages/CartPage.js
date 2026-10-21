"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartPage = void 0;
const test_1 = require("@playwright/test");
class CartPage {
    page;
    constructor(page) {
        this.page = page;
    }
    async expectProductVisible(productName) {
        await (0, test_1.expect)(this.cartItem(productName)).toBeVisible();
    }
    async removeProduct(productName) {
        await this.cartItem(productName).getByRole('button', { name: 'Remove' }).click();
    }
    async expectEmpty() {
        await (0, test_1.expect)(this.page.locator('.cart_item')).toHaveCount(0);
        await (0, test_1.expect)(this.page.locator('.shopping_cart_badge')).toHaveCount(0);
    }
    async proceedToCheckout() {
        await this.page.getByRole('button', { name: 'Checkout' }).click();
    }
    cartItem(productName) {
        return this.page.locator('.cart_item').filter({
            has: this.page.locator('.inventory_item_name', { hasText: productName }),
        });
    }
}
exports.CartPage = CartPage;
//# sourceMappingURL=CartPage.js.map